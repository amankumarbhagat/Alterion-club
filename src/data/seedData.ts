export interface Member {
  id: string;
  name: string;
  role: string;
  division: 'Leadership' | 'App Dev' | 'R&D' | 'Other';
  email: string;
  github: string;
  linkedin: string;
  image: string;
  bio: string;
  skills: string[];
  isLeadership: boolean;
}

export interface Division {
  id: string;
  name: string;
  description: string;
  leadId: string;
  responsibilities: string[];
  skills: string[];
  tools: string[];
  ongoingWork: string;
  iconName: string; // lucide icon identifier
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  coordinator: string;
  image: string;
  status: 'upcoming' | 'ongoing' | 'past';
  registrationLink: string;
  winners?: string[];
  gallery?: string[];
}

export interface Project {
  id: string;
  title: string;
  problem: string;
  solution: string;
  description: string;
  image: string;
  tags: string[];
  teamIds: string[];
  mentor: string;
  progress: number; // 0 to 100
  github: string;
  demo: string;
  status: 'active' | 'completed' | 'on-hold';
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  badge: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  category: 'recruitment' | 'event' | 'alert' | 'general';
  active: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  type: string;
  description: string;
  website: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  category: 'events' | 'workshops' | 'meetings' | 'hackathons' | 'projects' | 'community';
}

export interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  division: string;
  skills: string;
  motivation: string;
  projects: string;
  github: string;
  linkedin: string;
  portfolio: string;
  resumeName: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  submittedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export interface FacultyCoordinator {
  name: string;
  designation: string;
  department: string;
  image: string;
  bio: string;
  email: string;
  phone: string;
  office: string;
}

export interface HomeStats {
  projects: number;
  events: number;
  members: number;
  divisions: number;
  partners: number;
}

export const initialFaculty: FacultyCoordinator = {
  name: "Dr. Rajeshwari M.",
  designation: "Associate Professor & Head of Research",
  department: "Computer Science & Engineering",
  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
  bio: "Guiding the next generation of engineers in translating academic theory into real-world applications. Specializes in Artificial Intelligence and distributed architectures.",
  email: "faculty.coordinator@bmsit.in",
  phone: "+91 80 2847 8221 (Ext. 402)",
  office: "Innovation Cell, CSE Block, 3rd Floor"
};

export const initialStats: HomeStats = {
  projects: 14,
  events: 18,
  members: 32,
  divisions: 2,
  partners: 6
};

export const initialMembers: Member[] = [
  {
    id: "m1",
    name: "Siddharth Verma",
    role: "Club President & Founder",
    division: "Leadership",
    email: "siddharth.v@alterino.org",
    github: "https://github.com/sidverma",
    linkedin: "https://linkedin.com/in/sidverma",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    bio: "Full Stack Engineer & Hardware Hobbyist. Directs overall club strategy, industry alignment, and lab expansion.",
    skills: ["React", "TypeScript", "Node.js", "System Design", "Rust"],
    isLeadership: true
  },
  {
    id: "m2",
    name: "Ananya Rao",
    role: "App Development Lead",
    division: "App Dev",
    email: "ananya.r@alterino.org",
    github: "https://github.com/ananyarao",
    linkedin: "https://linkedin.com/in/ananyarao",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    bio: "Mobile architect. Passionate about building highly responsive, intuitive cross-platform applications.",
    skills: ["React Native", "Flutter", "Tailwind CSS", "Firebase", "UX Design"],
    isLeadership: true
  },
  {
    id: "m3",
    name: "Varun Nair",
    role: "Research & Development Lead",
    division: "R&D",
    email: "varun.n@alterino.org",
    github: "https://github.com/varunnair",
    linkedin: "https://linkedin.com/in/varunnair",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    bio: "AI Researcher and IoT developer. Focused on integrating embedded hardware with cloud-native intelligence models.",
    skills: ["Python", "TensorFlow", "IoT / Raspberry Pi", "C++", "Edge AI"],
    isLeadership: true
  },
  {
    id: "m4",
    name: "Meera Joshi",
    role: "Senior UI/UX Specialist",
    division: "App Dev",
    email: "meera.j@alterino.org",
    github: "https://github.com/meerajoshi",
    linkedin: "https://linkedin.com/in/meerajoshi",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
    bio: "Visual storyteller. Focuses on animations, design systems, and rendering flawless frontend client layouts.",
    skills: ["Framer Motion", "Figma", "CSS Modules", "Tailwind CSS", "JavaScript"],
    isLeadership: false
  },
  {
    id: "m5",
    name: "Rohan Das",
    role: "Embedded Systems Engineer",
    division: "R&D",
    email: "rohan.d@alterino.org",
    github: "https://github.com/rohandas",
    linkedin: "https://linkedin.com/in/rohandas",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    bio: "Bridges the gap between firmware and app UI. Enjoys soldering, low-latency communication protocols, and RTOS.",
    skills: ["Arduino", "ESP32", "BLE", "Python", "MQTT"],
    isLeadership: false
  }
];

export const initialDivisions: Division[] = [
  {
    id: "d1",
    name: "App Development",
    description: "Architecting modern web interfaces, native mobile apps, and robust server frameworks. We focus on putting software solutions in the hands of users.",
    leadId: "m2",
    responsibilities: [
      "Building internal tools and platforms for BMSIT&M campus operations.",
      "Developing native and hybrid mobile applications for social impact and clubs.",
      "Creating modern web frameworks, design system boilerplates, and client APIs."
    ],
    skills: ["Frontend Web (React/Next.js)", "Mobile Development (Flutter/React Native)", "Backend Frameworks (Node.js/Go)", "Cloud Platforms (Vercel/AWS)", "Database Modeling (Supabase/PostgreSQL)"],
    tools: ["Vite", "VS Code", "Tailwind CSS", "GitHub Action Pipelines", "Figma"],
    ongoingWork: "Finalizing the automated event registration suite and the BMSIT campus navigation app.",
    iconName: "Code"
  },
  {
    id: "d2",
    name: "Research & Development",
    description: "Exploring the intersections of hardware, machine learning, and physical computing. We analyze raw data, design circuitry, and develop edge intelligence devices.",
    leadId: "m3",
    responsibilities: [
      "Conducting active research in Edge AI and custom microcontrollers.",
      "Building IoT automated sensors for lab management and agricultural nodes.",
      "Publishing engineering papers and filing patents for innovative prototypes."
    ],
    skills: ["Embedded Hardware Programming", "Machine Learning models (PyTorch/TensorFlow)", "Firmware Engineering (C/C++)", "Computer Vision pipelines", "Data Analytics"],
    tools: ["Raspberry Pi", "Arduino Studio", "Jupyter Lab", "KiCad (PCB Design)", "MQTT Brokers"],
    ongoingWork: "Developing a decentralized IoT grid mapping room occupancies and lab temperatures in real-time.",
    iconName: "Cpu"
  }
];

export const initialEvents: Event[] = [
  {
    id: "e1",
    title: "DevSprint 2026: 24hr Hackathon",
    description: "The flagship hackathon of ALTERINO. Teams assemble to design, prototype, and pitch hardware or software solutions addressing campus sustainability and automation. Includes mentors from tech startups and cash prizes.",
    date: "2026-09-12",
    time: "09:00 AM onwards",
    venue: "Main Seminar Hall, BMSIT&M Campus",
    coordinator: "Ananya Rao (App Dev Lead)",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    status: "upcoming",
    registrationLink: "https://forms.gle/devsprint2026mock"
  },
  {
    id: "e2",
    title: "Edge AI & IoT Integration Seminar",
    description: "A hands-on workshop guiding students on running deep learning models on resource-constrained microcontrollers (ESP32 and Raspberry Pi Pico). Learn about model quantization and real-time inference.",
    date: "2026-08-28",
    time: "02:00 PM - 05:00 PM",
    venue: "Lab 5, CSE Department",
    coordinator: "Varun Nair (R&D Lead)",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    status: "upcoming",
    registrationLink: "https://forms.gle/edgeaiworkshopmock"
  },
  {
    id: "e3",
    title: "Web3 Decoded Bootcamp",
    description: "An intensive 3-day boot camp focusing on Smart Contract deployment, decentralized identity systems, and frontend integration using ethers.js. Seeded with mock hackathons at the end.",
    date: "2026-06-15",
    time: "10:00 AM - 04:00 PM",
    venue: "Online MS Teams",
    coordinator: "Siddharth Verma",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    status: "past",
    registrationLink: "#",
    winners: ["Team Codex (1st)", "Team Ethers (2nd)"],
    gallery: [
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=500",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500"
    ]
  }
];

export const initialProjects: Project[] = [
  {
    id: "p1",
    title: "NavBMSIT: Smart Campus Navigation",
    problem: "New students, visitors, and faculty struggle to navigate the expanding multi-block BMSIT&M campus and locate specific labs, faculty chambers, or event venues.",
    solution: "A mobile-first progressive web application with interactive 2D maps, pathfinding navigation, search functions for faculty schedules, and real-time event updates.",
    description: "The application features sub-meter positioning references, dynamic path computation using Dijkstra's algorithm, offline caching, and responsive map visualizations. Built by the App Dev team in collaboration with campus admins.",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
    tags: ["React", "TypeScript", "Tailwind CSS", "Mapbox GL", "PWA"],
    teamIds: ["m2", "m4"],
    mentor: "Dr. Rajeshwari M.",
    progress: 85,
    github: "https://github.com/alterino-club/nav-bmsit",
    demo: "https://nav.bmsit.edu.mock",
    status: "active"
  },
  {
    id: "p2",
    title: "AuraSense: Smart Lab Monitor",
    problem: "Unattended computer labs consume unnecessary electricity and lack metrics on temperature fluctuations, which can degrade sensitive server hardware over time.",
    solution: "A decentralized mesh network of ESP32 sensors reporting lab temperature, humidity, and power draw metrics to a centralized dashboard.",
    description: "The devices communicate via ESP-NOW to a gateway, which forwards data using MQTT to a secure backend. The frontend displays graphical trends, predicts anomalies, and triggers automatic Discord/Slack alerts for power anomalies.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    tags: ["C++", "ESP32", "MQTT", "Python", "React", "Node.js"],
    teamIds: ["m3", "m5"],
    mentor: "Dr. Rajeshwari M.",
    progress: 100,
    github: "https://github.com/alterino-club/aurasense-iot",
    demo: "https://aurasense.alterino.org.mock",
    status: "completed"
  }
];

export const initialAchievements: Achievement[] = [
  {
    id: "a1",
    title: "1st Place - National Smart Campus Hackathon",
    date: "2026-05",
    description: "Our core engineering prototype for AuraSense IoT Lab Monitor secured the grand prize of ₹1,00,000 for energy-saving architecture.",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=600",
    badge: "National Winner"
  },
  {
    id: "a2",
    title: "Research Paper Accepted - IEEE Conect 2026",
    date: "2026-07",
    description: "Research led by Varun Nair on 'Quantized Edge Inference for IoT Sensor Nodes' was accepted for presentation and publication in IEEE Explore.",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600",
    badge: "IEEE Publication"
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: "an1",
    title: "ALTERINO Core Recruitment 2026 Open!",
    date: "2026-08-18",
    content: "We are officially recruiting builders, coders, researchers, and UI experts for the 2026 session. Applications close soon. Head over to our Join Us page!",
    category: "recruitment",
    active: true
  },
  {
    id: "an2",
    title: "Flagship Hackathon 'DevSprint' Dates Announced",
    date: "2026-08-10",
    content: "Get your teams ready! DevSprint 2026 will be hosted live on September 12. Registrations open on August 25.",
    category: "event",
    active: true
  }
];

export const initialPartners: Partner[] = [
  {
    id: "p_part1",
    name: "GitHub Education",
    logo: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=200",
    type: "Technology Sponsor",
    description: "Providing students with access to developer packs, server credits, and version control training resources.",
    website: "https://education.github.com"
  },
  {
    id: "p_part2",
    name: "BMSIT Alumni Association",
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200",
    type: "Funding Partner",
    description: "Supporting physical laboratory components and hardware prototype procurement for student innovation projects.",
    website: "https://bmsit.ac.in"
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: "g1",
    image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800",
    caption: "Students collaborating during the 2025 Brainstorming Workshop.",
    category: "workshops"
  },
  {
    id: "g2",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    caption: "App Development division finalizing the wireframes for campus navigation.",
    category: "projects"
  },
  {
    id: "g3",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    caption: "IoT Seminar live demonstration using quantized CNN models on ESP32 controllers.",
    category: "events"
  },
  {
    id: "g4",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    caption: "Late night hackathon coding sprints during DevSprint 2025.",
    category: "hackathons"
  }
];
