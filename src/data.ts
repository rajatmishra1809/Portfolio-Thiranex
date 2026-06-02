import { ProjectItem, SkillGroup, EducationItem } from "./types";

export const rajatProfile = {
  fullName: "Rajat Mishra",
  shortRole: "Computer Science & Engineering Student",
  location: "VIT Chennai, India",
  email: "mishrarajat156@gmail.com",
  github: "https://github.com", // Placeholder representing user account
  linkedin: "https://linkedin.com",
  tagline: "Building high-performance, responsive micro-systems with modern semantic alignment and pristine WCAG compliance.",
  bio: "I am a Computer Science and Engineering student at Vellore Institute of Technology (VIT), Chennai. My core focus lies in web architectures, software system optimization, and building inclusive user interfaces that score perfectly on performance, accessibility (WCAG 2.2), and digital accessibility benchmarks.",
};

export const educationList: EducationItem[] = [
  {
    institution: "Vellore Institute of Technology (VIT), Chennai",
    degree: "B.Tech in Computer Science and Engineering (CSE)",
    period: "2024 — Present",
    gpa: "CGPA: 9.12 / 10",
    courses: [
      "Data Structures and Algorithms",
      "Operating Systems & Lab",
      "Database Management Systems & SQL",
      "Computer Architecture",
      "Web Development Technologies",
      "Discrete Mathematics"
    ]
  },
  {
    institution: "Senior Secondary Education",
    degree: "Central Board of Secondary Education (CBSE)",
    period: "2022 — 2024",
    gpa: "Result: 95.8%",
    courses: [
      "Computer Science with Python",
      "Physics",
      "Chemistry",
      "Mathematics"
    ]
  }
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages & Core CS",
    skills: ["TypeScript", "JavaScript", "C++", "Java", "Python", "SQL", "HTML5 & CSS3"]
  },
  {
    category: "Frameworks & Libraries",
    skills: ["React.js", "Vite", "Node.js", "Express.js", "Tailwind CSS", "Motion (Framer)", "Recharts", "D3.js"]
  },
  {
    category: "Tools & Methodologies",
    skills: ["Git & GitHub", "REST APIs", "WCAG 2.2 Compliance", "Semantic HTML5 Auditing", "Database Optimization", "Linux"]
  }
];

export const projectsList: ProjectItem[] = [
  {
    id: "aegis-gate",
    title: "Aegis Gate — Accessible Network Gateway Monitor",
    description: "A centralized cloud network traffic and access monitoring terminal, designed with custom keyboard-navigable interactive controls.",
    longDescription: "Aegis Gate is an advanced dashboard that consolidates security gateway traffic metrics in real time. It features a completely screen-reader-compliant interface including custom ARIA grids, focus trap capabilities for modal filters, and real-time announcement triggers (using aria-live) for incoming security logs. Ideal for high-pressure operations environments.",
    tags: ["React", "Tailwind CSS", "Lucide Icons", "ARIA Live", "JSON Feed"],
    role: "Lead Full-Stack Designer",
    duration: "4 weeks (Academic Project)",
    academicContext: "VIT Chennai — Web Technology Project Lab",
    demoUrl: "#",
    repoUrl: "#",
    iconName: "ShieldAlert"
  },
  {
    id: "synthlex-search",
    title: "SynthLex — Semantic Engine & DocuFinder",
    description: "Accessible search indexer serving contextually indexed educational documents for students with visual and cognitive impairments.",
    longDescription: "SynthLex addresses the gap in educational material indexing by parsing, tagging, and presenting lecture notes inside an high-contrast interface. Designed for WCAG 2.2 AA standards, the system generates deep ARIA hierarchies, supports system-level magnification without breaking element boundaries, and translates complex tabular data into easy-to-read screen reader patterns.",
    tags: ["TypeScript", "ElasticSearch API", "Tailwind Theme", "Screen Reader Friendly"],
    role: "Independent Researcher",
    duration: "2 months",
    academicContext: "CSE Innovation Lab initiative",
    demoUrl: "#",
    repoUrl: "#",
    iconName: "SearchCode"
  },
  {
    id: "vit-scheduler",
    title: "VIT-Schedule Helper & Slot Optimizer",
    description: "A client-side calendar slot conflict resolution scheduler optimized with keyboard hotkeys.",
    longDescription: "Designed to help fellow VIT Chennai students configure and preview optimal timetable registrations, this offline slot helper leverages interval conflict algorithms. It outputs beautifully structured HTML calendars that are 100% accessible to tactile inputs and feature detailed screen description keys.",
    tags: ["React.js", "Algorithms", "LocalStorage", "Focus Management", "Space Grotesk"],
    role: "Core Developer",
    duration: "3 weeks",
    academicContext: "Student Utility Tool",
    demoUrl: "#",
    repoUrl: "#",
    iconName: "CalendarRange"
  },
  {
    id: "verbasense-synth",
    title: "VerbaSense — Data Structure Synthesizer",
    description: "Multi-sensory educational simulator converting binary search tree traversals into distinct frequency sounds.",
    longDescription: "A creative learning web application that represents standard algorithm traversals (Inorder, Preorder, Postorder) through auditory soundwaves and clear high-contrast SVGs. Provides an immersive secondary sensory learning channel for visually and cognitively diverse students.",
    tags: ["HTML5 Web Audio API", "D3.js", "Semantic Dialogs", "Keyboard Control"],
    role: "Solo Project",
    duration: "1 month",
    academicContext: "Advanced Data Structures lab",
    demoUrl: "#",
    repoUrl: "#",
    iconName: "Activity"
  }
];
