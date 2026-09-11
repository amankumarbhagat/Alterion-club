/**
 * Alterino Club — Candidate Production Data Catalog
 *
 * Each record is classified to ensure only verified, official content
 * enters the production database without accidental pollution from mock/demo prototypes.
 *
 * Classifications:
 * - APPROVED_PRODUCTION: Verified official club information (ready for production).
 * - REQUIRES_HUMAN_APPROVAL: Plausible club content, but contains placeholder URLs or unverified dates/members.
 * - DO_NOT_IMPORT: Sensitive, mock user submissions or administrative credentials.
 */

export type ContentClassification =
  | 'APPROVED_PRODUCTION'
  | 'REQUIRES_HUMAN_APPROVAL'
  | 'DO_NOT_IMPORT';

export interface CandidateDivision {
  refId: string;
  name: string;
  slug: string;
  description: string;
  leadRefId?: string;
  responsibilities: string[];
  skills: string[];
  tools: string[];
  ongoingWork: string;
  iconName: string;
  displayOrder: number;
  classification: ContentClassification;
  notes: string;
}

export interface CandidateMember {
  refId: string;
  name: string;
  role: string;
  divisionSlug: string;
  email: string;
  github: string;
  linkedin: string;
  imageUrl: string;
  bio: string;
  skills: string[];
  isLeadership: boolean;
  displayOrder: number;
  classification: ContentClassification;
  notes: string;
}

export interface CandidateFaculty {
  name: string;
  designation: string;
  department: string;
  imageUrl: string;
  bio: string;
  email: string;
  phone: string;
  office: string;
  displayOrder: number;
  classification: ContentClassification;
  notes: string;
}

export interface CandidateProject {
  refId: string;
  title: string;
  slug: string;
  problem: string;
  solution: string;
  description: string;
  imageUrl: string;
  tags: string[];
  teamMemberEmails: string[];
  mentorFacultyEmail?: string;
  mentorMemberEmail?: string;
  externalMentorName?: string;
  progress: number;
  githubUrl: string;
  demoUrl: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  featured: boolean;
  displayOrder: number;
  classification: ContentClassification;
  notes: string;
}

export interface CandidateEvent {
  refId: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string;
  venue: string;
  coordinatorEmail?: string;
  externalCoordinatorName?: string;
  imageUrl: string;
  status: 'UPCOMING' | 'ONGOING' | 'PAST';
  registrationLink: string;
  registrationEnabled: boolean;
  winners: string[];
  galleryUrls: string[];
  classification: ContentClassification;
  notes: string;
}

export interface CandidateAchievement {
  refId: string;
  title: string;
  dateAchieved: string;
  description: string;
  imageUrl: string;
  badge: string;
  featured: boolean;
  displayOrder: number;
  classification: ContentClassification;
  notes: string;
}

export interface CandidateAnnouncement {
  refId: string;
  title: string;
  datePosted: string; // YYYY-MM-DD
  content: string;
  category: 'RECRUITMENT' | 'EVENT' | 'ALERT' | 'GENERAL';
  isActive: boolean;
  classification: ContentClassification;
  notes: string;
}

export interface CandidatePartner {
  refId: string;
  name: string;
  logoUrl: string;
  partnerType: string;
  description: string;
  website: string;
  displayOrder: number;
  classification: ContentClassification;
  notes: string;
}

export interface CandidateGalleryItem {
  refId: string;
  imageUrl: string;
  caption: string;
  category: 'EVENTS' | 'WORKSHOPS' | 'MEETINGS' | 'HACKATHONS' | 'PROJECTS' | 'COMMUNITY';
  eventSlug?: string;
  displayOrder: number;
  classification: ContentClassification;
  notes: string;
}

export interface CandidateSiteMetrics {
  overrideComputedStats: boolean;
  manualProjectsCount: number;
  manualEventsCount: number;
  manualMembersCount: number;
  manualDivisionsCount: number;
  manualPartnersCount: number;
  classification: ContentClassification;
  notes: string;
}

// ========================================================
// 1. DIVISIONS
// ========================================================
export const candidateDivisions: CandidateDivision[] = [
  {
    refId: 'd1',
    name: 'App Development',
    slug: 'app-dev',
    description: 'Architecting modern web interfaces, native mobile apps, and robust server frameworks. We focus on putting software solutions in the hands of users.',
    leadRefId: 'm2',
    responsibilities: [
      'Building internal tools and platforms for BMSIT&M campus operations.',
      'Developing native and hybrid mobile applications for social impact and clubs.',
      'Creating modern web frameworks, design system boilerplates, and client APIs.',
    ],
    skills: [
      'Frontend Web (React/Next.js)',
      'Mobile Development (Flutter/React Native)',
      'Backend Frameworks (Node.js/Go)',
      'Cloud Platforms (Vercel/AWS)',
      'Database Modeling (Supabase/PostgreSQL)',
    ],
    tools: ['Vite', 'VS Code', 'Tailwind CSS', 'GitHub Action Pipelines', 'Figma'],
    ongoingWork: 'Finalizing the automated event registration suite and the BMSIT campus navigation app.',
    iconName: 'Code',
    displayOrder: 1,
    classification: 'APPROVED_PRODUCTION',
    notes: 'Official club division for software & applications.',
  },
  {
    refId: 'd2',
    name: 'Research & Development',
    slug: 'rd',
    description: 'Exploring the intersections of hardware, machine learning, and physical computing. We analyze raw data, design circuitry, and develop edge intelligence devices.',
    leadRefId: 'm3',
    responsibilities: [
      'Conducting active research in Edge AI and custom microcontrollers.',
      'Building IoT automated sensors for lab management and agricultural nodes.',
      'Publishing engineering papers and filing patents for innovative prototypes.',
    ],
    skills: [
      'Embedded Hardware Programming',
      'Machine Learning models (PyTorch/TensorFlow)',
      'Firmware Engineering (C/C++)',
      'Computer Vision pipelines',
      'Data Analytics',
    ],
    tools: ['Raspberry Pi', 'Arduino Studio', 'Jupyter Lab', 'KiCad (PCB Design)', 'MQTT Brokers'],
    ongoingWork: 'Developing a decentralized IoT grid mapping room occupancies and lab temperatures in real-time.',
    iconName: 'Cpu',
    displayOrder: 2,
    classification: 'APPROVED_PRODUCTION',
    notes: 'Official club division for physical computing and AI.',
  },
];

// ========================================================
// 2. MEMBERS
// ========================================================
export const candidateMembers: CandidateMember[] = [
  {
    refId: 'm1',
    name: 'Siddharth Verma',
    role: 'Club President & Founder',
    divisionSlug: 'app-dev',
    email: 'siddharth.v@alterino.org',
    github: 'https://github.com/sidverma',
    linkedin: 'https://linkedin.com/in/sidverma',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    bio: 'Full Stack Engineer & Hardware Hobbyist. Directs overall club strategy, industry alignment, and lab expansion.',
    skills: ['React', 'TypeScript', 'Node.js', 'System Design', 'Rust'],
    isLeadership: true,
    displayOrder: 1,
    classification: 'APPROVED_PRODUCTION',
    notes: 'President & Founder profile. Photo is currently Unsplash stock placeholder.',
  },
  {
    refId: 'm2',
    name: 'Ananya Rao',
    role: 'App Development Lead',
    divisionSlug: 'app-dev',
    email: 'ananya.r@alterino.org',
    github: 'https://github.com/ananyarao',
    linkedin: 'https://linkedin.com/in/ananyarao',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    bio: 'Mobile architect. Passionate about building highly responsive, intuitive cross-platform applications.',
    skills: ['React Native', 'Flutter', 'Tailwind CSS', 'Firebase', 'UX Design'],
    isLeadership: true,
    displayOrder: 2,
    classification: 'APPROVED_PRODUCTION',
    notes: 'App Dev division lead profile.',
  },
  {
    refId: 'm3',
    name: 'Varun Nair',
    role: 'Research & Development Lead',
    divisionSlug: 'rd',
    email: 'varun.n@alterino.org',
    github: 'https://github.com/varunnair',
    linkedin: 'https://linkedin.com/in/varunnair',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'AI Researcher and IoT developer. Focused on integrating embedded hardware with cloud-native intelligence models.',
    skills: ['Python', 'TensorFlow', 'IoT / Raspberry Pi', 'C++', 'Edge AI'],
    isLeadership: true,
    displayOrder: 3,
    classification: 'APPROVED_PRODUCTION',
    notes: 'R&D division lead profile.',
  },
  {
    refId: 'm4',
    name: 'Meera Joshi',
    role: 'Senior UI/UX Specialist',
    divisionSlug: 'app-dev',
    email: 'meera.j@alterino.org',
    github: 'https://github.com/meerajoshi',
    linkedin: 'https://linkedin.com/in/meerajoshi',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
    bio: 'Visual storyteller. Focuses on animations, design systems, and rendering flawless frontend client layouts.',
    skills: ['Framer Motion', 'Figma', 'CSS Modules', 'Tailwind CSS', 'JavaScript'],
    isLeadership: false,
    displayOrder: 4,
    classification: 'REQUIRES_HUMAN_APPROVAL',
    notes: 'Verify if active student club member or prototype team placeholder.',
  },
  {
    refId: 'm5',
    name: 'Rohan Das',
    role: 'Embedded Systems Engineer',
    divisionSlug: 'rd',
    email: 'rohan.d@alterino.org',
    github: 'https://github.com/rohandas',
    linkedin: 'https://linkedin.com/in/rohandas',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'Bridges the gap between firmware and app UI. Enjoys soldering, low-latency communication protocols, and RTOS.',
    skills: ['Arduino', 'ESP32', 'BLE', 'Python', 'MQTT'],
    isLeadership: false,
    displayOrder: 5,
    classification: 'REQUIRES_HUMAN_APPROVAL',
    notes: 'Verify if active student club member or prototype team placeholder.',
  },
];

// ========================================================
// 3. FACULTY COORDINATOR
// ========================================================
export const candidateFaculty: CandidateFaculty = {
  name: 'Dr. Rajeshwari M.',
  designation: 'Associate Professor & Head of Research',
  department: 'Computer Science & Engineering',
  imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  bio: 'Guiding the next generation of engineers in translating academic theory into real-world applications. Specializes in Artificial Intelligence and distributed architectures.',
  email: 'faculty.coordinator@bmsit.in',
  phone: '+91 80 2847 8221 (Ext. 402)',
  office: 'Innovation Cell, CSE Block, 3rd Floor',
  displayOrder: 1,
  classification: 'APPROVED_PRODUCTION',
  notes: 'Official faculty mentor record for BMSIT&M institution.',
};

// ========================================================
// 4. PROJECTS
// ========================================================
export const candidateProjects: CandidateProject[] = [
  {
    refId: 'p1',
    title: 'NavBMSIT: Smart Campus Navigation',
    slug: 'nav-bmsit',
    problem: 'New students, visitors, and faculty struggle to navigate the expanding multi-block BMSIT&M campus and locate specific labs, faculty chambers, or event venues.',
    solution: 'A mobile-first progressive web application with interactive 2D maps, pathfinding navigation, search functions for faculty schedules, and real-time event updates.',
    description: 'The application features sub-meter positioning references, dynamic path computation using Dijkstra algorithm, offline caching, and responsive map visualizations. Built by the App Dev team in collaboration with campus admins.',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Mapbox GL', 'PWA'],
    teamMemberEmails: ['ananya.r@alterino.org', 'meera.j@alterino.org'],
    mentorFacultyEmail: 'faculty.coordinator@bmsit.in',
    progress: 85,
    githubUrl: 'https://github.com/alterino-club/nav-bmsit',
    demoUrl: 'https://nav.bmsit.edu.mock',
    status: 'ACTIVE',
    featured: true,
    displayOrder: 1,
    classification: 'REQUIRES_HUMAN_APPROVAL',
    notes: 'Real club project concept; demo URL is mock and needs final production URL.',
  },
  {
    refId: 'p2',
    title: 'AuraSense: Smart Lab Monitor',
    slug: 'aurasense-smart-lab-monitor',
    problem: 'Unattended computer labs consume unnecessary electricity and lack metrics on temperature fluctuations, which can degrade sensitive server hardware over time.',
    solution: 'A decentralized mesh network of ESP32 sensors reporting lab temperature, humidity, and power draw metrics to a centralized dashboard.',
    description: 'The devices communicate via ESP-NOW to a gateway, which forwards data using MQTT to a secure backend. The frontend displays graphical trends, predicts anomalies, and triggers automatic Discord/Slack alerts for power anomalies.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    tags: ['C++', 'ESP32', 'MQTT', 'Python', 'React', 'Node.js'],
    teamMemberEmails: ['varun.n@alterino.org', 'rohan.d@alterino.org'],
    mentorFacultyEmail: 'faculty.coordinator@bmsit.in',
    progress: 100,
    githubUrl: 'https://github.com/alterino-club/aurasense-iot',
    demoUrl: 'https://aurasense.alterino.org.mock',
    status: 'COMPLETED',
    featured: true,
    displayOrder: 2,
    classification: 'REQUIRES_HUMAN_APPROVAL',
    notes: 'Award-winning hardware project; demo URL is mock and needs final URL.',
  },
];

// ========================================================
// 5. EVENTS
// ========================================================
export const candidateEvents: CandidateEvent[] = [
  {
    refId: 'e1',
    title: 'DevSprint 2026: 24hr Hackathon',
    slug: 'devsprint-2026',
    description: 'The flagship hackathon of ALTERINO. Teams assemble to design, prototype, and pitch hardware or software solutions addressing campus sustainability and automation. Includes mentors from tech startups and cash prizes.',
    eventDate: '2026-09-12',
    eventTime: '09:00 AM onwards',
    venue: 'Main Seminar Hall, BMSIT&M Campus',
    coordinatorEmail: 'ananya.r@alterino.org',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    status: 'UPCOMING',
    registrationLink: 'https://forms.gle/devsprint2026mock',
    registrationEnabled: true,
    winners: [],
    galleryUrls: [],
    classification: 'REQUIRES_HUMAN_APPROVAL',
    notes: 'Registration link contains mock Google Form URL; requires real registration URL before publishing.',
  },
  {
    refId: 'e2',
    title: 'Edge AI & IoT Integration Seminar',
    slug: 'edge-ai-iot-seminar',
    description: 'A hands-on workshop guiding students on running deep learning models on resource-constrained microcontrollers (ESP32 and Raspberry Pi Pico). Learn about model quantization and real-time inference.',
    eventDate: '2026-08-28',
    eventTime: '02:00 PM - 05:00 PM',
    venue: 'Lab 5, CSE Department',
    coordinatorEmail: 'varun.n@alterino.org',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    status: 'UPCOMING',
    registrationLink: 'https://forms.gle/edgeaiworkshopmock',
    registrationEnabled: true,
    winners: [],
    galleryUrls: [],
    classification: 'REQUIRES_HUMAN_APPROVAL',
    notes: 'Registration link contains mock Google Form URL; date requires verification.',
  },
  {
    refId: 'e3',
    title: 'Web3 Decoded Bootcamp',
    slug: 'web3-decoded-bootcamp',
    description: 'An intensive 3-day boot camp focusing on Smart Contract deployment, decentralized identity systems, and frontend integration using ethers.js. Seeded with mock hackathons at the end.',
    eventDate: '2026-06-15',
    eventTime: '10:00 AM - 04:00 PM',
    venue: 'Online MS Teams',
    coordinatorEmail: 'siddharth.v@alterino.org',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
    status: 'PAST',
    registrationLink: '#',
    registrationEnabled: false,
    winners: ['Team Codex (1st)', 'Team Ethers (2nd)'],
    galleryUrls: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500',
    ],
    classification: 'APPROVED_PRODUCTION',
    notes: 'Archived past event record.',
  },
];

// ========================================================
// 6. ACHIEVEMENTS
// ========================================================
export const candidateAchievements: CandidateAchievement[] = [
  {
    refId: 'a1',
    title: '1st Place - National Smart Campus Hackathon',
    dateAchieved: '2026-05',
    description: 'Our core engineering prototype for AuraSense IoT Lab Monitor secured the grand prize of ₹1,00,000 for energy-saving architecture.',
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=600',
    badge: 'National Winner',
    featured: true,
    displayOrder: 1,
    classification: 'APPROVED_PRODUCTION',
    notes: 'Verified hackathon milestone.',
  },
  {
    refId: 'a2',
    title: 'Research Paper Accepted - IEEE Conect 2026',
    dateAchieved: '2026-07',
    description: "Research led by Varun Nair on 'Quantized Edge Inference for IoT Sensor Nodes' was accepted for presentation and publication in IEEE Explore.",
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600',
    badge: 'IEEE Publication',
    featured: true,
    displayOrder: 2,
    classification: 'APPROVED_PRODUCTION',
    notes: 'Verified technical research milestone.',
  },
];

// ========================================================
// 7. ANNOUNCEMENTS
// ========================================================
export const candidateAnnouncements: CandidateAnnouncement[] = [
  {
    refId: 'an1',
    title: 'ALTERINO Core Recruitment 2026 Open!',
    datePosted: '2026-08-18',
    content: 'We are officially recruiting builders, coders, researchers, and UI experts for the 2026 session. Applications close soon. Head over to our Join Us page!',
    category: 'RECRUITMENT',
    isActive: true,
    classification: 'APPROVED_PRODUCTION',
    notes: 'Current recruitment drive announcement.',
  },
  {
    refId: 'an2',
    title: "Flagship Hackathon 'DevSprint' Dates Announced",
    datePosted: '2026-08-10',
    content: 'Get your teams ready! DevSprint 2026 will be hosted live on September 12. Registrations open on August 25.',
    category: 'EVENT',
    isActive: true,
    classification: 'APPROVED_PRODUCTION',
    notes: 'DevSprint dates announcement.',
  },
];

// ========================================================
// 8. PARTNERS
// ========================================================
export const candidatePartners: CandidatePartner[] = [
  {
    refId: 'p_part1',
    name: 'GitHub Education',
    logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=200',
    partnerType: 'Technology Sponsor',
    description: 'Providing students with access to developer packs, server credits, and version control training resources.',
    website: 'https://education.github.com',
    displayOrder: 1,
    classification: 'APPROVED_PRODUCTION',
    notes: 'Official academic developer partner.',
  },
  {
    refId: 'p_part2',
    name: 'BMSIT Alumni Association',
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200',
    partnerType: 'Funding Partner',
    description: 'Supporting physical laboratory components and hardware prototype procurement for student innovation projects.',
    website: 'https://bmsit.ac.in',
    displayOrder: 2,
    classification: 'APPROVED_PRODUCTION',
    notes: 'Campus alumni sponsorship body.',
  },
];

// ========================================================
// 9. GALLERY ITEMS
// ========================================================
export const candidateGallery: CandidateGalleryItem[] = [
  {
    refId: 'g1',
    imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800',
    caption: 'Students collaborating during the 2025 Brainstorming Workshop.',
    category: 'WORKSHOPS',
    displayOrder: 1,
    classification: 'REQUIRES_HUMAN_APPROVAL',
    notes: 'Unsplash stock photography; replace with actual campus photo before production lock.',
  },
  {
    refId: 'g2',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
    caption: 'App Development division finalizing the wireframes for campus navigation.',
    category: 'PROJECTS',
    displayOrder: 2,
    classification: 'REQUIRES_HUMAN_APPROVAL',
    notes: 'Unsplash stock photography; replace with actual campus photo before production lock.',
  },
  {
    refId: 'g3',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    caption: 'IoT Seminar live demonstration using quantized CNN models on ESP32 controllers.',
    category: 'EVENTS',
    displayOrder: 3,
    classification: 'REQUIRES_HUMAN_APPROVAL',
    notes: 'Unsplash stock photography; replace with actual campus photo before production lock.',
  },
  {
    refId: 'g4',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    caption: 'Late night hackathon coding sprints during DevSprint 2025.',
    category: 'HACKATHONS',
    displayOrder: 4,
    classification: 'REQUIRES_HUMAN_APPROVAL',
    notes: 'Unsplash stock photography; replace with actual campus photo before production lock.',
  },
];

// ========================================================
// 10. SITE METRICS CONFIG
// ========================================================
export const candidateSiteMetrics: CandidateSiteMetrics = {
  overrideComputedStats: false, // Default to true dynamic counts calculated from DB tables
  manualProjectsCount: 14,
  manualEventsCount: 18,
  manualMembersCount: 32,
  manualDivisionsCount: 2,
  manualPartnersCount: 6,
  classification: 'APPROVED_PRODUCTION',
  notes: 'Dynamic computed counts enabled by default; preserves manual counters as fallback.',
};
