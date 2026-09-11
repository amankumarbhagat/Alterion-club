import { prisma } from './config/prisma.js';
import { hashPassword } from './utils/password.js';
import { AdminRole, EventStatus, ProjectStatus, AnnouncementCategory, GalleryCategory } from '@prisma/client';

async function main() {
  console.log('🌱 Starting Alterino database seed...');

  // 1. SuperAdmin User
  const defaultAdminPassword = 'AdminPassword123!';
  const passwordHash = await hashPassword(defaultAdminPassword);

  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {
      email: 'admin@alterino.club',
      passwordHash,
      name: 'Super Administrator',
      role: AdminRole.SUPERADMIN,
      isActive: true,
    },
    create: {
      username: 'admin',
      email: 'admin@alterino.club',
      passwordHash,
      name: 'Super Administrator',
      role: AdminRole.SUPERADMIN,
      isActive: true,
    },
  });
  console.log(`✅ Admin user seeded: ${admin.username} (${admin.email})`);

  // 2. Divisions
  const appDevDiv = await prisma.division.upsert({
    where: { slug: 'app-dev' },
    update: {
      name: 'App Development',
      description: 'Architecting modern web interfaces, native mobile apps, and robust server frameworks. We focus on putting software solutions in the hands of users.',
      responsibilities: [
        'Building internal tools and platforms for BMSIT&M campus operations.',
        'Developing native and hybrid mobile applications for social impact and clubs.',
        'Creating modern web frameworks, design system boilerplates, and client APIs.'
      ],
      skills: ['Frontend Web (React/Next.js)', 'Mobile Development (Flutter/React Native)', 'Backend Frameworks (Node.js/Go)', 'Cloud Platforms (Vercel/AWS)', 'Database Modeling (Supabase/PostgreSQL)'],
      tools: ['Vite', 'VS Code', 'Tailwind CSS', 'GitHub Action Pipelines', 'Figma'],
      ongoingWork: 'Finalizing the automated event registration suite and the BMSIT campus navigation app.',
      iconName: 'Code',
      displayOrder: 1,
    },
    create: {
      name: 'App Development',
      slug: 'app-dev',
      description: 'Architecting modern web interfaces, native mobile apps, and robust server frameworks. We focus on putting software solutions in the hands of users.',
      responsibilities: [
        'Building internal tools and platforms for BMSIT&M campus operations.',
        'Developing native and hybrid mobile applications for social impact and clubs.',
        'Creating modern web frameworks, design system boilerplates, and client APIs.'
      ],
      skills: ['Frontend Web (React/Next.js)', 'Mobile Development (Flutter/React Native)', 'Backend Frameworks (Node.js/Go)', 'Cloud Platforms (Vercel/AWS)', 'Database Modeling (Supabase/PostgreSQL)'],
      tools: ['Vite', 'VS Code', 'Tailwind CSS', 'GitHub Action Pipelines', 'Figma'],
      ongoingWork: 'Finalizing the automated event registration suite and the BMSIT campus navigation app.',
      iconName: 'Code',
      displayOrder: 1,
    },
  });

  const rdDiv = await prisma.division.upsert({
    where: { slug: 'rd' },
    update: {
      name: 'Research & Development',
      description: 'Exploring the intersections of hardware, machine learning, and physical computing. We analyze raw data, design circuitry, and develop edge intelligence devices.',
      responsibilities: [
        'Conducting active research in Edge AI and custom microcontrollers.',
        'Building IoT automated sensors for lab management and agricultural nodes.',
        'Publishing engineering papers and filing patents for innovative prototypes.'
      ],
      skills: ['Embedded Hardware Programming', 'Machine Learning models (PyTorch/TensorFlow)', 'Firmware Engineering (C/C++)', 'Computer Vision pipelines', 'Data Analytics'],
      tools: ['Raspberry Pi', 'Arduino Studio', 'Jupyter Lab', 'KiCad (PCB Design)', 'MQTT Brokers'],
      ongoingWork: 'Developing a decentralized IoT grid mapping room occupancies and lab temperatures in real-time.',
      iconName: 'Cpu',
      displayOrder: 2,
    },
    create: {
      name: 'Research & Development',
      slug: 'rd',
      description: 'Exploring the intersections of hardware, machine learning, and physical computing. We analyze raw data, design circuitry, and develop edge intelligence devices.',
      responsibilities: [
        'Conducting active research in Edge AI and custom microcontrollers.',
        'Building IoT automated sensors for lab management and agricultural nodes.',
        'Publishing engineering papers and filing patents for innovative prototypes.'
      ],
      skills: ['Embedded Hardware Programming', 'Machine Learning models (PyTorch/TensorFlow)', 'Firmware Engineering (C/C++)', 'Computer Vision pipelines', 'Data Analytics'],
      tools: ['Raspberry Pi', 'Arduino Studio', 'Jupyter Lab', 'KiCad (PCB Design)', 'MQTT Brokers'],
      ongoingWork: 'Developing a decentralized IoT grid mapping room occupancies and lab temperatures in real-time.',
      iconName: 'Cpu',
      displayOrder: 2,
    },
  });
  console.log('✅ Divisions seeded');

  // Helper for Member upsert
  async function upsertMember(email: string, data: {
    name: string;
    role: string;
    divisionId: string;
    email: string;
    github: string;
    linkedin: string;
    imageUrl: string;
    bio: string;
    skills: string[];
    isLeadership: boolean;
    displayOrder: number;
  }) {
    const existing = await prisma.member.findFirst({ where: { email } });
    if (existing) {
      return prisma.member.update({
        where: { id: existing.id },
        data,
      });
    }
    return prisma.member.create({ data });
  }

  // 3. Members
  const m1 = await upsertMember('siddharth.v@alterino.org', {
    name: 'Siddharth Verma',
    role: 'Club President & Founder',
    divisionId: appDevDiv.id,
    email: 'siddharth.v@alterino.org',
    github: 'https://github.com/sidverma',
    linkedin: 'https://linkedin.com/in/sidverma',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    bio: 'Full Stack Engineer & Hardware Hobbyist. Directs overall club strategy, industry alignment, and lab expansion.',
    skills: ['React', 'TypeScript', 'Node.js', 'System Design', 'Rust'],
    isLeadership: true,
    displayOrder: 1,
  });

  const m2 = await upsertMember('ananya.r@alterino.org', {
    name: 'Ananya Rao',
    role: 'App Development Lead',
    divisionId: appDevDiv.id,
    email: 'ananya.r@alterino.org',
    github: 'https://github.com/ananyarao',
    linkedin: 'https://linkedin.com/in/ananyarao',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    bio: 'Mobile architect. Passionate about building highly responsive, intuitive cross-platform applications.',
    skills: ['React Native', 'Flutter', 'Tailwind CSS', 'Firebase', 'UX Design'],
    isLeadership: true,
    displayOrder: 2,
  });

  const m3 = await upsertMember('varun.n@alterino.org', {
    name: 'Varun Nair',
    role: 'Research & Development Lead',
    divisionId: rdDiv.id,
    email: 'varun.n@alterino.org',
    github: 'https://github.com/varunnair',
    linkedin: 'https://linkedin.com/in/varunnair',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'AI Researcher and IoT developer. Focused on integrating embedded hardware with cloud-native intelligence models.',
    skills: ['Python', 'TensorFlow', 'IoT / Raspberry Pi', 'C++', 'Edge AI'],
    isLeadership: true,
    displayOrder: 3,
  });

  const m4 = await upsertMember('meera.j@alterino.org', {
    name: 'Meera Joshi',
    role: 'Senior UI/UX Specialist',
    divisionId: appDevDiv.id,
    email: 'meera.j@alterino.org',
    github: 'https://github.com/meerajoshi',
    linkedin: 'https://linkedin.com/in/meerajoshi',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
    bio: 'Visual storyteller. Focuses on animations, design systems, and rendering flawless frontend client layouts.',
    skills: ['Framer Motion', 'Figma', 'CSS Modules', 'Tailwind CSS', 'JavaScript'],
    isLeadership: false,
    displayOrder: 4,
  });

  const m5 = await upsertMember('rohan.d@alterino.org', {
    name: 'Rohan Das',
    role: 'Embedded Systems Engineer',
    divisionId: rdDiv.id,
    email: 'rohan.d@alterino.org',
    github: 'https://github.com/rohandas',
    linkedin: 'https://linkedin.com/in/rohandas',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'Bridges the gap between firmware and app UI. Enjoys soldering, low-latency communication protocols, and RTOS.',
    skills: ['Arduino', 'ESP32', 'BLE', 'Python', 'MQTT'],
    isLeadership: false,
    displayOrder: 5,
  });

  // Assign leads to divisions
  await prisma.division.update({ where: { id: appDevDiv.id }, data: { leadId: m2.id } });
  await prisma.division.update({ where: { id: rdDiv.id }, data: { leadId: m3.id } });
  console.log('✅ Members and Division Leads seeded');

  // 4. Faculty Coordinator
  let faculty = await prisma.facultyCoordinator.findFirst();
  if (faculty) {
    faculty = await prisma.facultyCoordinator.update({
      where: { id: faculty.id },
      data: {
        name: 'Dr. Rajeshwari M.',
        designation: 'Associate Professor & Head of Research',
        department: 'Computer Science & Engineering',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        bio: 'Guiding the next generation of engineers in translating academic theory into real-world applications. Specializes in Artificial Intelligence and distributed architectures.',
        email: 'faculty.coordinator@bmsit.in',
        phone: '+91 80 2847 8221 (Ext. 402)',
        office: 'Innovation Cell, CSE Block, 3rd Floor',
        displayOrder: 1,
      },
    });
  } else {
    faculty = await prisma.facultyCoordinator.create({
      data: {
        name: 'Dr. Rajeshwari M.',
        designation: 'Associate Professor & Head of Research',
        department: 'Computer Science & Engineering',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        bio: 'Guiding the next generation of engineers in translating academic theory into real-world applications. Specializes in Artificial Intelligence and distributed architectures.',
        email: 'faculty.coordinator@bmsit.in',
        phone: '+91 80 2847 8221 (Ext. 402)',
        office: 'Innovation Cell, CSE Block, 3rd Floor',
        displayOrder: 1,
      },
    });
  }
  console.log('✅ Faculty seeded');

  // 5. Projects
  await prisma.project.upsert({
    where: { slug: 'nav-bmsit' },
    update: {
      title: 'NavBMSIT: Smart Campus Navigation',
      problem: 'New students, visitors, and faculty struggle to navigate the expanding multi-block BMSIT&M campus and locate specific labs, faculty chambers, or event venues.',
      solution: 'A mobile-first progressive web application with interactive 2D maps, pathfinding navigation, search functions for faculty schedules, and real-time event updates.',
      description: 'The application features sub-meter positioning references, dynamic path computation using Dijkstra\'s algorithm, offline caching, and responsive map visualizations. Built by the App Dev team in collaboration with campus admins.',
      imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Mapbox GL', 'PWA'],
      mentorFacultyId: faculty.id,
      progress: 85,
      githubUrl: 'https://github.com/alterino-club/nav-bmsit',
      demoUrl: 'https://nav.bmsit.edu.mock',
      status: ProjectStatus.ACTIVE,
      featured: true,
      displayOrder: 1,
    },
    create: {
      title: 'NavBMSIT: Smart Campus Navigation',
      slug: 'nav-bmsit',
      problem: 'New students, visitors, and faculty struggle to navigate the expanding multi-block BMSIT&M campus and locate specific labs, faculty chambers, or event venues.',
      solution: 'A mobile-first progressive web application with interactive 2D maps, pathfinding navigation, search functions for faculty schedules, and real-time event updates.',
      description: 'The application features sub-meter positioning references, dynamic path computation using Dijkstra\'s algorithm, offline caching, and responsive map visualizations. Built by the App Dev team in collaboration with campus admins.',
      imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Mapbox GL', 'PWA'],
      mentorFacultyId: faculty.id,
      progress: 85,
      githubUrl: 'https://github.com/alterino-club/nav-bmsit',
      demoUrl: 'https://nav.bmsit.edu.mock',
      status: ProjectStatus.ACTIVE,
      featured: true,
      displayOrder: 1,
      teamMembers: {
        create: [
          { memberId: m2.id, roleInProject: 'Lead Architect' },
          { memberId: m4.id, roleInProject: 'UI/UX Specialist' },
        ],
      },
    },
  });

  await prisma.project.upsert({
    where: { slug: 'aurasense-smart-lab-monitor' },
    update: {
      title: 'AuraSense: Smart Lab Monitor',
      problem: 'Unattended computer labs consume unnecessary electricity and lack metrics on temperature fluctuations, which can degrade sensitive server hardware over time.',
      solution: 'A decentralized mesh network of ESP32 sensors reporting lab temperature, humidity, and power draw metrics to a centralized dashboard.',
      description: 'The devices communicate via ESP-NOW to a gateway, which forwards data using MQTT to a secure backend. The frontend displays graphical trends, predicts anomalies, and triggers automatic Discord/Slack alerts for power anomalies.',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
      tags: ['C++', 'ESP32', 'MQTT', 'Python', 'React', 'Node.js'],
      mentorFacultyId: faculty.id,
      progress: 100,
      githubUrl: 'https://github.com/alterino-club/aurasense-iot',
      demoUrl: 'https://aurasense.alterino.org.mock',
      status: ProjectStatus.COMPLETED,
      featured: true,
      displayOrder: 2,
    },
    create: {
      title: 'AuraSense: Smart Lab Monitor',
      slug: 'aurasense-smart-lab-monitor',
      problem: 'Unattended computer labs consume unnecessary electricity and lack metrics on temperature fluctuations, which can degrade sensitive server hardware over time.',
      solution: 'A decentralized mesh network of ESP32 sensors reporting lab temperature, humidity, and power draw metrics to a centralized dashboard.',
      description: 'The devices communicate via ESP-NOW to a gateway, which forwards data using MQTT to a secure backend. The frontend displays graphical trends, predicts anomalies, and triggers automatic Discord/Slack alerts for power anomalies.',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
      tags: ['C++', 'ESP32', 'MQTT', 'Python', 'React', 'Node.js'],
      mentorFacultyId: faculty.id,
      progress: 100,
      githubUrl: 'https://github.com/alterino-club/aurasense-iot',
      demoUrl: 'https://aurasense.alterino.org.mock',
      status: ProjectStatus.COMPLETED,
      featured: true,
      displayOrder: 2,
      teamMembers: {
        create: [
          { memberId: m3.id, roleInProject: 'IoT Lead' },
          { memberId: m5.id, roleInProject: 'Firmware Engineer' },
        ],
      },
    },
  });
  console.log('✅ Projects seeded');

  // 6. Events
  await prisma.event.upsert({
    where: { slug: 'devsprint-2026' },
    update: {
      title: 'DevSprint 2026: 24hr Hackathon',
      description: 'The flagship hackathon of ALTERINO. Teams assemble to design, prototype, and pitch hardware or software solutions addressing campus sustainability and automation. Includes mentors from tech startups and cash prizes.',
      eventDate: new Date('2026-09-12T09:00:00.000Z'),
      eventTime: '09:00 AM onwards',
      venue: 'Main Seminar Hall, BMSIT&M Campus',
      coordinator: { connect: { id: m2.id } },
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
      status: EventStatus.UPCOMING,
      registrationLink: 'https://forms.gle/devsprint2026mock',
      registrationEnabled: true,
    },
    create: {
      title: 'DevSprint 2026: 24hr Hackathon',
      slug: 'devsprint-2026',
      description: 'The flagship hackathon of ALTERINO. Teams assemble to design, prototype, and pitch hardware or software solutions addressing campus sustainability and automation. Includes mentors from tech startups and cash prizes.',
      eventDate: new Date('2026-09-12T09:00:00.000Z'),
      eventTime: '09:00 AM onwards',
      venue: 'Main Seminar Hall, BMSIT&M Campus',
      coordinator: { connect: { id: m2.id } },
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
      status: EventStatus.UPCOMING,
      registrationLink: 'https://forms.gle/devsprint2026mock',
      registrationEnabled: true,
    },
  });

  await prisma.event.upsert({
    where: { slug: 'edge-ai-iot-seminar' },
    update: {
      title: 'Edge AI & IoT Integration Seminar',
      description: 'A hands-on workshop guiding students on running deep learning models on resource-constrained microcontrollers (ESP32 and Raspberry Pi Pico). Learn about model quantization and real-time inference.',
      eventDate: new Date('2026-08-28T14:00:00.000Z'),
      eventTime: '02:00 PM - 05:00 PM',
      venue: 'Lab 5, CSE Department',
      coordinator: { connect: { id: m3.id } },
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
      status: EventStatus.UPCOMING,
      registrationLink: 'https://forms.gle/edgeaiworkshopmock',
      registrationEnabled: true,
    },
    create: {
      title: 'Edge AI & IoT Integration Seminar',
      slug: 'edge-ai-iot-seminar',
      description: 'A hands-on workshop guiding students on running deep learning models on resource-constrained microcontrollers (ESP32 and Raspberry Pi Pico). Learn about model quantization and real-time inference.',
      eventDate: new Date('2026-08-28T14:00:00.000Z'),
      eventTime: '02:00 PM - 05:00 PM',
      venue: 'Lab 5, CSE Department',
      coordinator: { connect: { id: m3.id } },
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
      status: EventStatus.UPCOMING,
      registrationLink: 'https://forms.gle/edgeaiworkshopmock',
      registrationEnabled: true,
    },
  });

  await prisma.event.upsert({
    where: { slug: 'web3-decoded-bootcamp' },
    update: {
      title: 'Web3 Decoded Bootcamp',
      description: 'An intensive 3-day boot camp focusing on Smart Contract deployment, decentralized identity systems, and frontend integration using ethers.js. Seeded with mock hackathons at the end.',
      eventDate: new Date('2026-06-15T10:00:00.000Z'),
      eventTime: '10:00 AM - 04:00 PM',
      venue: 'Online MS Teams',
      coordinator: { connect: { id: m1.id } },
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
      status: EventStatus.PAST,
      registrationLink: '#',
      winners: ['Team Codex (1st)', 'Team Ethers (2nd)'],
      galleryUrls: [
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500',
      ],
    },
    create: {
      title: 'Web3 Decoded Bootcamp',
      slug: 'web3-decoded-bootcamp',
      description: 'An intensive 3-day boot camp focusing on Smart Contract deployment, decentralized identity systems, and frontend integration using ethers.js. Seeded with mock hackathons at the end.',
      eventDate: new Date('2026-06-15T10:00:00.000Z'),
      eventTime: '10:00 AM - 04:00 PM',
      venue: 'Online MS Teams',
      coordinator: { connect: { id: m1.id } },
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
      status: EventStatus.PAST,
      registrationLink: '#',
      winners: ['Team Codex (1st)', 'Team Ethers (2nd)'],
      galleryUrls: [
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500',
      ],
    },
  });
  console.log('✅ Events seeded');

  // 7. Achievements
  await prisma.achievement.deleteMany();
  await prisma.achievement.createMany({
    data: [
      {
        title: '1st Place - National Smart Campus Hackathon',
        dateAchieved: '2026-05',
        description: 'Our core engineering prototype for AuraSense IoT Lab Monitor secured the grand prize of ₹1,00,000 for energy-saving architecture.',
        imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=600',
        badge: 'National Winner',
        featured: true,
        displayOrder: 1,
      },
      {
        title: 'Research Paper Accepted - IEEE Conect 2026',
        dateAchieved: '2026-07',
        description: "Research led by Varun Nair on 'Quantized Edge Inference for IoT Sensor Nodes' was accepted for presentation and publication in IEEE Explore.",
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600',
        badge: 'IEEE Publication',
        featured: true,
        displayOrder: 2,
      },
    ],
  });
  console.log('✅ Achievements seeded');

  // 8. Announcements
  await prisma.announcement.deleteMany();
  await prisma.announcement.createMany({
    data: [
      {
        title: 'ALTERINO Core Recruitment 2026 Open!',
        datePosted: new Date('2026-08-18'),
        content: 'We are officially recruiting builders, coders, researchers, and UI experts for the 2026 session. Applications close soon. Head over to our Join Us page!',
        category: AnnouncementCategory.RECRUITMENT,
        isActive: true,
      },
      {
        title: "Flagship Hackathon 'DevSprint' Dates Announced",
        datePosted: new Date('2026-08-10'),
        content: 'Get your teams ready! DevSprint 2026 will be hosted live on September 12. Registrations open on August 25.',
        category: AnnouncementCategory.EVENT,
        isActive: true,
      },
    ],
  });
  console.log('✅ Announcements seeded');

  // 9. Partners
  await prisma.partner.deleteMany();
  await prisma.partner.createMany({
    data: [
      {
        name: 'GitHub Education',
        logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=200',
        partnerType: 'Technology Sponsor',
        description: 'Providing students with access to developer packs, server credits, and version control training resources.',
        website: 'https://education.github.com',
        displayOrder: 1,
      },
      {
        name: 'BMSIT Alumni Association',
        logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200',
        partnerType: 'Funding Partner',
        description: 'Supporting physical laboratory components and hardware prototype procurement for student innovation projects.',
        website: 'https://bmsit.ac.in',
        displayOrder: 2,
      },
    ],
  });
  console.log('✅ Partners seeded');

  // 10. Gallery Items
  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800',
        caption: 'Students collaborating during the 2025 Brainstorming Workshop.',
        category: GalleryCategory.WORKSHOPS,
        displayOrder: 1,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
        caption: 'App Development division finalizing the wireframes for campus navigation.',
        category: GalleryCategory.PROJECTS,
        displayOrder: 2,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
        caption: 'IoT Seminar live demonstration using quantized CNN models on ESP32 controllers.',
        category: GalleryCategory.EVENTS,
        displayOrder: 3,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
        caption: 'Late night hackathon coding sprints during DevSprint 2025.',
        category: GalleryCategory.HACKATHONS,
        displayOrder: 4,
      },
    ],
  });
  console.log('✅ Gallery items seeded');

  // 11. Site Metrics
  const existingMetrics = await prisma.siteMetricsConfig.findFirst();
  if (existingMetrics) {
    await prisma.siteMetricsConfig.update({
      where: { id: existingMetrics.id },
      data: {
        overrideComputedStats: true,
        manualProjectsCount: 14,
        manualEventsCount: 18,
        manualMembersCount: 32,
        manualDivisionsCount: 2,
        manualPartnersCount: 6,
      },
    });
  } else {
    await prisma.siteMetricsConfig.create({
      data: {
        overrideComputedStats: true,
        manualProjectsCount: 14,
        manualEventsCount: 18,
        manualMembersCount: 32,
        manualDivisionsCount: 2,
        manualPartnersCount: 6,
      },
    });
  }
  console.log('✅ Site metrics seeded');

  console.log('\n🎉 Alterino database seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('SuperAdmin Credentials:');
  console.log('Username: admin');
  console.log('Email:    admin@alterino.club');
  console.log('Password: AdminPassword123!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
