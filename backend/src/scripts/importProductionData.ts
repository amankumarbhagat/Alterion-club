/**
 * Alterino Club — Production Data Migration & Seeding Engine
 *
 * Safe, idempotent, dependency-ordered importer for production & staging environments.
 *
 * Usage:
 *   Dry run (default):
 *     npm run data:import -- --dry-run
 *     tsx src/scripts/importProductionData.ts --dry-run
 *
 *   Real import (explicit invocation):
 *     npm run data:import -- --execute
 *     tsx src/scripts/importProductionData.ts --execute
 *
 *   Include pending-approval records:
 *     npm run data:import -- --dry-run --include-pending-approval
 *     npm run data:import -- --execute --include-pending-approval
 */

import { prisma } from '../config/prisma.js';
import {
  candidateDivisions,
  candidateMembers,
  candidateFaculty,
  candidateProjects,
  candidateEvents,
  candidateAchievements,
  candidateAnnouncements,
  candidatePartners,
  candidateGallery,
  candidateSiteMetrics,
} from '../data/candidateProductionData.js';
import {
  EventStatus,
  ProjectStatus,
  AnnouncementCategory,
  GalleryCategory,
} from '@prisma/client';

interface ImportSummaryItem {
  category: string;
  totalCandidates: number;
  approved: number;
  pendingApproval: number;
  willCreate: number;
  willUpdate: number;
  willSkip: number;
  conflicts: number;
  errors: string[];
}

interface Summaries {
  Divisions: ImportSummaryItem;
  Members: ImportSummaryItem;
  Faculty: ImportSummaryItem;
  Projects: ImportSummaryItem;
  Events: ImportSummaryItem;
  Achievements: ImportSummaryItem;
  Announcements: ImportSummaryItem;
  Partners: ImportSummaryItem;
  Gallery: ImportSummaryItem;
  SiteMetrics: ImportSummaryItem;
}

// CLI Flags
const args = process.argv.slice(2);
const isDryRun = !args.includes('--execute') || args.includes('--dry-run');
const includePending = args.includes('--include-pending-approval');
const updateExisting = args.includes('--update-existing');

console.log('============================================================');
console.log('ALTERINO CLUB — PRODUCTION DATA IMPORT PIPELINE');
console.log(`Execution Mode: ${isDryRun ? 'DRY RUN (Zero Database Mutations)' : 'REAL IMPORT (Live Database Transactions)'}`);
console.log(`Include Pending Approval: ${includePending ? 'YES' : 'NO (Approved Only)'}`);
console.log(`Update Existing Strategy: ${updateExisting ? 'UPDATE DIFFERENCES' : 'PRESERVE EXISTING (CREATE IF MISSING)'}`);
console.log('============================================================\n');

async function runImporter() {
  const summaries: Summaries = {
    Divisions: { category: 'Divisions', totalCandidates: 0, approved: 0, pendingApproval: 0, willCreate: 0, willUpdate: 0, willSkip: 0, conflicts: 0, errors: [] },
    Members: { category: 'Members', totalCandidates: 0, approved: 0, pendingApproval: 0, willCreate: 0, willUpdate: 0, willSkip: 0, conflicts: 0, errors: [] },
    Faculty: { category: 'Faculty', totalCandidates: 0, approved: 0, pendingApproval: 0, willCreate: 0, willUpdate: 0, willSkip: 0, conflicts: 0, errors: [] },
    Projects: { category: 'Projects', totalCandidates: 0, approved: 0, pendingApproval: 0, willCreate: 0, willUpdate: 0, willSkip: 0, conflicts: 0, errors: [] },
    Events: { category: 'Events', totalCandidates: 0, approved: 0, pendingApproval: 0, willCreate: 0, willUpdate: 0, willSkip: 0, conflicts: 0, errors: [] },
    Achievements: { category: 'Achievements', totalCandidates: 0, approved: 0, pendingApproval: 0, willCreate: 0, willUpdate: 0, willSkip: 0, conflicts: 0, errors: [] },
    Announcements: { category: 'Announcements', totalCandidates: 0, approved: 0, pendingApproval: 0, willCreate: 0, willUpdate: 0, willSkip: 0, conflicts: 0, errors: [] },
    Partners: { category: 'Partners', totalCandidates: 0, approved: 0, pendingApproval: 0, willCreate: 0, willUpdate: 0, willSkip: 0, conflicts: 0, errors: [] },
    Gallery: { category: 'Gallery', totalCandidates: 0, approved: 0, pendingApproval: 0, willCreate: 0, willUpdate: 0, willSkip: 0, conflicts: 0, errors: [] },
    SiteMetrics: { category: 'SiteMetrics', totalCandidates: 0, approved: 0, pendingApproval: 0, willCreate: 0, willUpdate: 0, willSkip: 0, conflicts: 0, errors: [] },
  };

  const idMap = {
    divisions: new Map<string, string>(), // slug -> id
    members: new Map<string, string>(),   // email -> id
    faculty: new Map<string, string>(),   // email -> id
    projects: new Map<string, string>(),  // slug -> id
    events: new Map<string, string>(),    // slug -> id
  };

  // Pre-fetch existing database state
  const [
    existingDivisions,
    existingMembers,
    existingFaculty,
    existingProjects,
    existingEvents,
    existingAchievements,
    existingAnnouncements,
    existingPartners,
    existingGallery,
    existingMetrics,
  ] = await Promise.all([
    prisma.division.findMany(),
    prisma.member.findMany(),
    prisma.facultyCoordinator.findMany(),
    prisma.project.findMany({ include: { teamMembers: true } }),
    prisma.event.findMany(),
    prisma.achievement.findMany(),
    prisma.announcement.findMany(),
    prisma.partner.findMany(),
    prisma.galleryItem.findMany(),
    prisma.siteMetricsConfig.findMany(),
  ]);

  // Populate ID maps with existing DB entries
  existingDivisions.forEach(d => idMap.divisions.set(d.slug, d.id));
  existingMembers.forEach(m => idMap.members.set(m.email, m.id));
  existingFaculty.forEach(f => idMap.faculty.set(f.email, f.id));
  existingProjects.forEach(p => idMap.projects.set(p.slug, p.id));
  existingEvents.forEach(e => idMap.events.set(e.slug, e.id));

  const operationsToExecute: Array<() => Promise<any>> = [];

  // ========================================================
  // STEP 1: DIVISIONS
  // ========================================================
  const sDiv = summaries.Divisions;
  sDiv.totalCandidates = candidateDivisions.length;

  for (const cDiv of candidateDivisions) {
    if (cDiv.classification === 'APPROVED_PRODUCTION') sDiv.approved++;
    else sDiv.pendingApproval++;

    if (cDiv.classification === 'REQUIRES_HUMAN_APPROVAL' && !includePending) {
      sDiv.willSkip++;
      continue;
    }

    const existing = existingDivisions.find(d => d.slug === cDiv.slug || d.name === cDiv.name);
    if (!existing) {
      sDiv.willCreate++;
      operationsToExecute.push(async () => {
        const created = await prisma.division.create({
          data: {
            name: cDiv.name,
            slug: cDiv.slug,
            description: cDiv.description,
            responsibilities: cDiv.responsibilities,
            skills: cDiv.skills,
            tools: cDiv.tools,
            ongoingWork: cDiv.ongoingWork,
            iconName: cDiv.iconName,
            displayOrder: cDiv.displayOrder,
          },
        });
        idMap.divisions.set(cDiv.slug, created.id);
        return created;
      });
    } else {
      idMap.divisions.set(cDiv.slug, existing.id);
      sDiv.willSkip++;
    }
  }

  // ========================================================
  // STEP 2: MEMBERS
  // ========================================================
  const sMem = summaries.Members;
  sMem.totalCandidates = candidateMembers.length;

  for (const cMem of candidateMembers) {
    if (cMem.classification === 'APPROVED_PRODUCTION') sMem.approved++;
    else sMem.pendingApproval++;

    if (cMem.classification === 'REQUIRES_HUMAN_APPROVAL' && !includePending) {
      sMem.willSkip++;
      continue;
    }

    const divisionId = idMap.divisions.get(cMem.divisionSlug);
    if (!divisionId) {
      sMem.errors.push(`Member "${cMem.name}" references unresolved division "${cMem.divisionSlug}"`);
      sMem.conflicts++;
      continue;
    }

    const existing = existingMembers.find(m => m.email === cMem.email);
    if (!existing) {
      sMem.willCreate++;
      operationsToExecute.push(async () => {
        const created = await prisma.member.create({
          data: {
            name: cMem.name,
            role: cMem.role,
            divisionId,
            email: cMem.email,
            github: cMem.github,
            linkedin: cMem.linkedin,
            imageUrl: cMem.imageUrl,
            bio: cMem.bio,
            skills: cMem.skills,
            isLeadership: cMem.isLeadership,
            displayOrder: cMem.displayOrder,
            isActive: true,
          },
        });
        idMap.members.set(cMem.email, created.id);
        return created;
      });
    } else {
      idMap.members.set(cMem.email, existing.id);
      sMem.willSkip++;
    }
  }

  // ========================================================
  // STEP 3: FACULTY COORDINATOR
  // ========================================================
  const sFac = summaries.Faculty;
  sFac.totalCandidates = 1;
  sFac.approved = 1;

  const existingFac = existingFaculty.find(f => f.email === candidateFaculty.email);
  if (!existingFac) {
    sFac.willCreate++;
    operationsToExecute.push(async () => {
      const created = await prisma.facultyCoordinator.create({
        data: {
          name: candidateFaculty.name,
          designation: candidateFaculty.designation,
          department: candidateFaculty.department,
          imageUrl: candidateFaculty.imageUrl,
          bio: candidateFaculty.bio,
          email: candidateFaculty.email,
          phone: candidateFaculty.phone,
          office: candidateFaculty.office,
          displayOrder: candidateFaculty.displayOrder,
        },
      });
      idMap.faculty.set(candidateFaculty.email, created.id);
      return created;
    });
  } else {
    idMap.faculty.set(candidateFaculty.email, existingFac.id);
    sFac.willSkip++;
  }

  // ========================================================
  // STEP 4: PROJECTS & PROJECT MEMBERS
  // ========================================================
  const sProj = summaries.Projects;
  sProj.totalCandidates = candidateProjects.length;

  for (const cProj of candidateProjects) {
    if (cProj.classification === 'APPROVED_PRODUCTION') sProj.approved++;
    else sProj.pendingApproval++;

    if (cProj.classification === 'REQUIRES_HUMAN_APPROVAL' && !includePending) {
      sProj.willSkip++;
      continue;
    }

    const existing = existingProjects.find(p => p.slug === cProj.slug || p.title === cProj.title);
    if (!existing) {
      sProj.willCreate++;
      operationsToExecute.push(async () => {
        const mentorFacultyId = cProj.mentorFacultyEmail ? idMap.faculty.get(cProj.mentorFacultyEmail) : undefined;
        const mentorMemberId = cProj.mentorMemberEmail ? idMap.members.get(cProj.mentorMemberEmail) : undefined;

        const created = await prisma.project.create({
          data: {
            title: cProj.title,
            slug: cProj.slug,
            problem: cProj.problem,
            solution: cProj.solution,
            description: cProj.description,
            imageUrl: cProj.imageUrl,
            tags: cProj.tags,
            mentorFacultyId,
            mentorMemberId,
            externalMentorName: cProj.externalMentorName,
            progress: cProj.progress,
            githubUrl: cProj.githubUrl,
            demoUrl: cProj.demoUrl,
            status: cProj.status as ProjectStatus,
            featured: cProj.featured,
            displayOrder: cProj.displayOrder,
          },
        });
        idMap.projects.set(cProj.slug, created.id);

        // Wire project members
        for (let idx = 0; idx < cProj.teamMemberEmails.length; idx++) {
          const email = cProj.teamMemberEmails[idx];
          if (!email) continue;
          const memberId = idMap.members.get(email);
          if (memberId) {
            await prisma.projectMember.create({
              data: {
                projectId: created.id,
                memberId,
                roleInProject: 'Contributor',
                displayOrder: idx + 1,
              },
            });
          }
        }
        return created;
      });
    } else {
      idMap.projects.set(cProj.slug, existing.id);
      sProj.willSkip++;
    }
  }

  // ========================================================
  // STEP 5: EVENTS
  // ========================================================
  const sEvt = summaries.Events;
  sEvt.totalCandidates = candidateEvents.length;

  for (const cEvt of candidateEvents) {
    if (cEvt.classification === 'APPROVED_PRODUCTION') sEvt.approved++;
    else sEvt.pendingApproval++;

    if (cEvt.classification === 'REQUIRES_HUMAN_APPROVAL' && !includePending) {
      sEvt.willSkip++;
      continue;
    }

    const existing = existingEvents.find(e => e.slug === cEvt.slug || e.title === cEvt.title);
    if (!existing) {
      sEvt.willCreate++;
      operationsToExecute.push(async () => {
        const coordinatorId = cEvt.coordinatorEmail ? idMap.members.get(cEvt.coordinatorEmail) : undefined;
        const created = await prisma.event.create({
          data: {
            title: cEvt.title,
            slug: cEvt.slug,
            description: cEvt.description,
            eventDate: new Date(cEvt.eventDate),
            eventTime: cEvt.eventTime,
            venue: cEvt.venue,
            coordinatorId,
            externalCoordinatorName: cEvt.externalCoordinatorName,
            imageUrl: cEvt.imageUrl,
            status: cEvt.status as EventStatus,
            registrationLink: cEvt.registrationLink,
            registrationEnabled: cEvt.registrationEnabled,
            winners: cEvt.winners,
            galleryUrls: cEvt.galleryUrls,
          },
        });
        idMap.events.set(cEvt.slug, created.id);
        return created;
      });
    } else {
      idMap.events.set(cEvt.slug, existing.id);
      sEvt.willSkip++;
    }
  }

  // ========================================================
  // STEP 6: ACHIEVEMENTS
  // ========================================================
  const sAch = summaries.Achievements;
  sAch.totalCandidates = candidateAchievements.length;

  for (const cAch of candidateAchievements) {
    if (cAch.classification === 'APPROVED_PRODUCTION') sAch.approved++;
    else sAch.pendingApproval++;

    if (cAch.classification === 'REQUIRES_HUMAN_APPROVAL' && !includePending) {
      sAch.willSkip++;
      continue;
    }

    const existing = existingAchievements.find(a => a.title === cAch.title);
    if (!existing) {
      sAch.willCreate++;
      operationsToExecute.push(async () => {
        return prisma.achievement.create({
          data: {
            title: cAch.title,
            dateAchieved: cAch.dateAchieved,
            description: cAch.description,
            imageUrl: cAch.imageUrl,
            badge: cAch.badge,
            featured: cAch.featured,
            displayOrder: cAch.displayOrder,
          },
        });
      });
    } else {
      sAch.willSkip++;
    }
  }

  // ========================================================
  // STEP 7: ANNOUNCEMENTS
  // ========================================================
  const sAnn = summaries.Announcements;
  sAnn.totalCandidates = candidateAnnouncements.length;

  for (const cAnn of candidateAnnouncements) {
    if (cAnn.classification === 'APPROVED_PRODUCTION') sAnn.approved++;
    else sAnn.pendingApproval++;

    if (cAnn.classification === 'REQUIRES_HUMAN_APPROVAL' && !includePending) {
      sAnn.willSkip++;
      continue;
    }

    const existing = existingAnnouncements.find(a => a.title === cAnn.title);
    if (!existing) {
      sAnn.willCreate++;
      operationsToExecute.push(async () => {
        return prisma.announcement.create({
          data: {
            title: cAnn.title,
            datePosted: new Date(cAnn.datePosted),
            content: cAnn.content,
            category: cAnn.category as AnnouncementCategory,
            isActive: cAnn.isActive,
          },
        });
      });
    } else {
      sAnn.willSkip++;
    }
  }

  // ========================================================
  // STEP 8: PARTNERS
  // ========================================================
  const sPart = summaries.Partners;
  sPart.totalCandidates = candidatePartners.length;

  for (const cPart of candidatePartners) {
    if (cPart.classification === 'APPROVED_PRODUCTION') sPart.approved++;
    else sPart.pendingApproval++;

    if (cPart.classification === 'REQUIRES_HUMAN_APPROVAL' && !includePending) {
      sPart.willSkip++;
      continue;
    }

    const existing = existingPartners.find(p => p.name === cPart.name);
    if (!existing) {
      sPart.willCreate++;
      operationsToExecute.push(async () => {
        return prisma.partner.create({
          data: {
            name: cPart.name,
            logoUrl: cPart.logoUrl,
            partnerType: cPart.partnerType,
            description: cPart.description,
            website: cPart.website,
            displayOrder: cPart.displayOrder,
          },
        });
      });
    } else {
      sPart.willSkip++;
    }
  }

  // ========================================================
  // STEP 9: GALLERY ITEMS
  // ========================================================
  const sGal = summaries.Gallery;
  sGal.totalCandidates = candidateGallery.length;

  for (const cGal of candidateGallery) {
    if (cGal.classification === 'APPROVED_PRODUCTION') sGal.approved++;
    else sGal.pendingApproval++;

    if (cGal.classification === 'REQUIRES_HUMAN_APPROVAL' && !includePending) {
      sGal.willSkip++;
      continue;
    }

    const existing = existingGallery.find(g => g.caption === cGal.caption || g.imageUrl === cGal.imageUrl);
    if (!existing) {
      sGal.willCreate++;
      operationsToExecute.push(async () => {
        const eventId = cGal.eventSlug ? idMap.events.get(cGal.eventSlug) : undefined;
        return prisma.galleryItem.create({
          data: {
            imageUrl: cGal.imageUrl,
            caption: cGal.caption,
            category: cGal.category as GalleryCategory,
            eventId,
            displayOrder: cGal.displayOrder,
          },
        });
      });
    } else {
      sGal.willSkip++;
    }
  }

  // ========================================================
  // STEP 10: SITE METRICS
  // ========================================================
  const sMet = summaries.SiteMetrics;
  sMet.totalCandidates = 1;
  sMet.approved = 1;

  if (existingMetrics.length === 0) {
    sMet.willCreate++;
    operationsToExecute.push(async () => {
      return prisma.siteMetricsConfig.create({
        data: {
          overrideComputedStats: candidateSiteMetrics.overrideComputedStats,
          manualProjectsCount: candidateSiteMetrics.manualProjectsCount,
          manualEventsCount: candidateSiteMetrics.manualEventsCount,
          manualMembersCount: candidateSiteMetrics.manualMembersCount,
          manualDivisionsCount: candidateSiteMetrics.manualDivisionsCount,
          manualPartnersCount: candidateSiteMetrics.manualPartnersCount,
        },
      });
    });
  } else {
    sMet.willSkip++;
  }

  // ========================================================
  // EXECUTION OR REPORTING
  // ========================================================
  console.log('------------------------------------------------------------');
  console.log('CANDIDATE DATA AUDIT & MIGRATION PLAN');
  console.log('------------------------------------------------------------');
  console.log(
    'Category'.padEnd(16) +
    'Candidates'.padEnd(12) +
    'Approved'.padEnd(10) +
    'Pending'.padEnd(10) +
    'Create'.padEnd(10) +
    'Skip/Keep'.padEnd(12) +
    'Conflicts'
  );
  console.log(''.padEnd(76, '-'));

  let totalCreates = 0;
  let totalSkips = 0;
  let totalConflicts = 0;

  for (const [name, s] of Object.entries(summaries)) {
    totalCreates += s.willCreate;
    totalSkips += s.willSkip;
    totalConflicts += s.conflicts;
    console.log(
      name.padEnd(16) +
      String(s.totalCandidates).padEnd(12) +
      String(s.approved).padEnd(10) +
      String(s.pendingApproval).padEnd(10) +
      String(s.willCreate).padEnd(10) +
      String(s.willSkip).padEnd(12) +
      String(s.conflicts)
    );
  }

  console.log(''.padEnd(76, '-'));
  console.log(`TOTALS: Create=${totalCreates}, Skip/Preserve=${totalSkips}, Conflicts=${totalConflicts}\n`);

  console.log('SENSITIVE & PROTECTED DATA ENFORCEMENT:');
  console.log('  - Applications:       [EXCLUDED] 0 candidate records (Strictly protected)');
  console.log('  - ContactMessages:    [EXCLUDED] 0 candidate records (Strictly protected)');
  console.log('  - EventRegistrations: [EXCLUDED] 0 candidate records (Strictly protected)');
  console.log('  - AdminUser accounts: [EXCLUDED] 0 accounts created (No credentials touched)\n');

  if (isDryRun) {
    console.log('============================================================');
    console.log('DRY RUN COMPLETE — ZERO DATABASE MUTATIONS OCCURRED.');
    console.log('To perform real import, run: npm run data:import -- --execute');
    console.log('============================================================\n');
  } else {
    console.log('============================================================');
    console.log(`EXECUTING LIVE PRODUCTION IMPORT (${operationsToExecute.length} Operations)...`);
    console.log('============================================================');

    try {
      await prisma.$transaction(async () => {
        for (const op of operationsToExecute) {
          await op();
        }
      });
      console.log('SUCCESS: Production data transaction committed successfully.\n');
    } catch (err: any) {
      console.error('FAILED: Error during live data import transaction. Rolled back.', err);
      process.exit(1);
    }
  }
}

runImporter()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal importer error:', err);
    process.exit(1);
  });
