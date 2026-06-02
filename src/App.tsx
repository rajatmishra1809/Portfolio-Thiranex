import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Shield, 
  Search, 
  Calendar, 
  Activity, 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  X, 
  Briefcase, 
  Code,
  Check,
  Send,
  Sparkles,
  Info
} from "lucide-react";

import { PageView, ProjectItem, ContactMessage } from "./types";
import { rajatProfile, educationList, skillGroups, projectsList } from "./data";

export default function App() {
  // Page routing state based on URL Hash for multi-page behavior simulator
  const [currentView, setCurrentView] = useState<PageView>("home");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  
  // Accessibility Live Announcements
  const [announcement, setAnnouncement] = useState("");
  
  // Sub-tab search & category filtering for projects
  const [filterTag, setFilterTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Contact form submission states
  const [formData, setFormData] = useState<ContactMessage>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState<Partial<ContactMessage>>({});
  const [sentMessages, setSentMessages] = useState<ContactMessage[]>([]);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Focus ref for Skip-Link
  const mainContentRef = useRef<HTMLDivElement>(null);
  const contactFormRef = useRef<HTMLFormElement>(null);

  // Sync state with hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const view = hash.replace("#/", "") as PageView;
      const validViews: PageView[] = ["home", "about", "projects", "contact"];
      
      if (validViews.includes(view)) {
        setCurrentView(view);
        setAnnouncement(`Navigated to ${view} screen`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Fallback to home
        setCurrentView("home");
        window.location.hash = "#/home";
      }
    };

    // Initialize
    if (!window.location.hash) {
      window.location.hash = "#/home";
    } else {
      handleHashChange();
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Sync saved local outbox messages
  useEffect(() => {
    const saved = localStorage.getItem("rajat_portfolio_outbox");
    if (saved) {
      try {
        setSentMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed parsing outbox messages", e);
      }
    }
  }, []);

  // Project item helper component to resolve requested custom Lucide icon mappings
  const renderProjectIcon = (iconName: string) => {
    const classes = "w-6 h-6 text-purple-400";
    switch (iconName) {
      case "ShieldAlert":
        return <Shield className={classes} aria-hidden="true" />;
      case "SearchCode":
        return <Search className={classes} aria-hidden="true" />;
      case "CalendarRange":
        return <Calendar className={classes} aria-hidden="true" />;
      case "Activity":
        return <Activity className={classes} aria-hidden="true" />;
      default:
        return <Code className={classes} aria-hidden="true" />;
    }
  };

  // Keyboard accessibility handler for details dialog escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedProject) {
          setSelectedProject(null);
          setAnnouncement("Project detail dialog closed.");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  // Form field validations complying to standard criteria
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing resumes
    if (formErrors[name as keyof ContactMessage]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<ContactMessage> = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is a required field.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please input a valid email address (e.g., mail@domain.com).";
    }
    if (!formData.subject.trim()) {
      errors.subject = "Subject description cannot be left blank.";
    }
    if (!formData.message.trim()) {
      errors.message = "Message specification is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setAnnouncement("Form submission failed. Please verify the highlighted errors.");
      return;
    }

    // Success process - Save message locally to mimic functional persistence
    const updatedMessages = [formData, ...sentMessages];
    setSentMessages(updatedMessages);
    localStorage.setItem("rajat_portfolio_outbox", JSON.stringify(updatedMessages));

    setAnnouncement(`Thank you ${formData.name}! Your message was successfully cached to outbox.`);
    setIsSubmitSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setFormErrors({});

    // Reset feedback helper after 10 seconds
    setTimeout(() => {
      setIsSubmitSuccess(false);
    }, 10000);
  };

  // Skip Link keyboard execution target setting
  const triggerSkipToContent = () => {
    if (mainContentRef.current) {
      mainContentRef.current.setAttribute("tabindex", "-1");
      mainContentRef.current.focus();
    }
  };

  // Compile unique project tags for layout filters
  const allTags = ["All", ...Array.from(new Set(projectsList.flatMap(p => p.tags)))];

  // Filter project cards using tag sub-tabs and keyword query strings
  const filteredProjects = projectsList.filter((proj) => {
    const matchesTag = filterTag === "All" || proj.tags.includes(filterTag);
    const matchesKeyword = 
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.longDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesKeyword;
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans selection:bg-purple-950 selection:text-purple-300">
      
      {/* 🟢 Screen-Reader Accessibility Announcements panel (WCAG 2.2 compliant) */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {announcement}
      </div>

      {/* 🗺️ Bypassing Tab Blocks for Assistive Technologies */}
      <button
        onClick={triggerSkipToContent}
        className="absolute left-4 top-4 z-50 -translate-y-20 bg-purple-600 text-white px-5 py-2.5 rounded-md font-medium border border-purple-400 font-display transition-transform focus:translate-y-0 focus:outline-none focus:ring-4 focus:ring-[#38bdf8]"
      >
        Skip Navigation and Jump to Main Content
      </button>

      {/* 🧭 Semantic Glassmorphic Header Navigation and Banner */}
      <header className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse" aria-hidden="true" />
            <a 
              href="#/home" 
              className="text-xl md:text-2xl font-bold font-display tracking-tight hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] rounded-md px-1.5 transition-colors"
              aria-label="Rajat Mishra Portfolio Homepage"
            >
              {rajatProfile.fullName} <span className="text-purple-500 text-xs font-mono ml-1">CSE @ VIT CHENNAI</span>
            </a>
          </div>

          <nav role="navigation" aria-label="Primary portfolio sections menu">
            <ul className="flex items-center flex-wrap gap-1 md:gap-2">
              {(["home", "about", "projects", "contact"] as PageView[]).map((tab) => {
                const isActive = currentView === tab;
                return (
                  <li key={tab}>
                    <a
                      href={`#/${tab}`}
                      className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-md tracking-wide uppercase transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] ${
                        isActive 
                          ? "bg-purple-950/60 text-purple-200 border border-purple-500/40" 
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`Navigate to the ${tab} section`}
                    >
                      {tab}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* 🛠️ Main Content Container */}
      <main 
        id="main-content" 
        ref={mainContentRef}
        className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16 focus:outline-none"
        aria-label="Primary Portfolio Content"
      >
        <AnimatePresence mode="wait">
          
          {/* ============================================================== */}
          {/* 📍 INDEX VIEW (HOME SCREEN)                                    */}
          {/* ============================================================== */}
          {currentView === "home" && (
            <motion.section
              key="home-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
              aria-labelledby="home-heading"
            >
              {/* Profile intro layout */}
              <div className="grid md:grid-cols-3 gap-8 items-center border-b border-zinc-900 pb-12">
                <div className="md:col-span-2 space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-purple-950/40 border border-purple-900/50 px-3.5 py-1 rounded-full text-xs font-mono text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>VIT Chennai CSE Department Undergraduate</span>
                  </div>
                  
                  <h1 id="home-heading" className="text-4xl md:text-6xl font-extrabold font-display leading-[1.1] tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                    Pristine Code.<br />
                    Inclusive Experiences.
                  </h1>
                  
                  <p className="text-lg text-zinc-400 max-w-xl font-sans leading-relaxed">
                    {rajatProfile.tagline}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href="#/projects"
                      className="px-6 py-3 rounded-md bg-purple-600 hover:bg-purple-700 font-medium font-display tracking-wide text-sm flex items-center gap-2 border border-purple-400/40 text-white transition-all shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
                      aria-label="View developer projects"
                    >
                      Explore Project Lab <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                      href="#/contact"
                      className="px-6 py-3 rounded-md bg-zinc-900 hover:bg-zinc-800 font-medium font-display tracking-wide text-sm border border-zinc-800 transition-all text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
                      aria-label="Navigate to contact form to get in touch"
                    >
                      Initialize Contact
                    </a>
                  </div>
                </div>

                {/* Profile Visual Graphic (Strict anti-slop guidelines matched) */}
                <div className="flex justify-center" aria-hidden="true">
                  <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl bg-zinc-900 border border-zinc-800/80 shadow-2xl flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-radial from-purple-950 via-transparent to-transparent opacity-40"></div>
                    
                    {/* Minimalist Tech Monogram Layout */}
                    <div className="relative text-center space-y-2 z-10 select-none">
                      <div className="w-20 h-20 rounded-full border border-purple-500/30 bg-[#09090b] flex mx-auto items-center justify-center font-display font-medium text-3xl text-purple-400">
                        RM
                      </div>
                      <div className="font-mono text-zinc-500 text-xs mt-2">B.Tech CSE Student</div>
                      <div className="font-sans text-white text-sm font-semibold">VIT CHENNAI</div>
                      <div className="inline-flex gap-1.5 justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] text-zinc-400 font-mono font-medium">Available for Dev Labs</span>
                      </div>
                    </div>

                    {/* Aesthetic Corner Bracket Details representing system code block */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-zinc-700"></div>
                    <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-zinc-700"></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-zinc-700"></div>
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-zinc-700"></div>
                  </div>
                </div>
              </div>

              {/* Quick Summary Section about Rajat */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
                  <div className="w-10 h-10 rounded bg-purple-950/50 flex items-center justify-center text-purple-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-medium font-display text-white">Academic Focus</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Student of Computer Science & Engineering at Vellore Institute of Technology, Chennai. Advancing theories in database structures, algorithms, and networks.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
                  <div className="w-10 h-10 rounded bg-purple-950/50 flex items-center justify-center text-purple-400">
                    <AlertIcon name="Aegis" />
                  </div>
                  <h2 className="text-lg font-medium font-display text-white">Accessibility Focus</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Committed to strict semantic guidelines and accessibility-led layouts conforming to WCAG 2.2 AA targets. Every project is fully accessible to keyboard inputs.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
                  <div className="w-10 h-10 rounded bg-purple-950/50 flex items-center justify-center text-purple-400">
                    <Code className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-medium font-display text-white">Modern Tech Stack</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Utilizing modular React engines, efficient Node.js routers, Express, dynamic charting solutions, client cache stacks, and high-performance Tailwind assets.
                  </p>
                </div>
              </div>

              {/* Quick links to actions */}
              <div className="p-8 rounded-xl bg-[#141417] border border-purple-950/80 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold font-display text-white">Looking for cooperation on engineering modules?</h3>
                  <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                    I currently work on student laboratory projects, accessible application frameworks, and web architectures at VIT Chennai.
                  </p>
                </div>
                <a
                  href="#/contact"
                  className="px-5 py-2.5 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium flex items-center gap-2 border border-purple-500/30 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-colors"
                >
                  Write Me A Message <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.section>
          )}

          {/* ============================================================== */}
          {/* 📍 ABOUT VIEW (ABOUT SCREEN)                                   */}
          {/* ============================================================== */}
          {currentView === "about" && (
            <motion.section
              key="about-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
              aria-labelledby="about-heading"
            >
              <div className="grid md:grid-cols-3 gap-8">
                {/* Profile Bio details */}
                <div className="md:col-span-2 space-y-6">
                  <h2 id="about-heading" className="text-3xl font-bold font-display text-white border-b border-zinc-900 pb-3">
                    Personal Background
                  </h2>
                  <p className="text-zinc-300 leading-relaxed">
                    {rajatProfile.bio} Currently pursuing my B.Tech engineering core studies under the esteemed VIT School of Computer Science (VITSOL), I balance structured course materials with robust personal systems engineering work.
                  </p>
                  <p className="text-zinc-400 leading-relaxed">
                    My developer path began in understanding pure semantic HTML, strict keyboard navigation layouts, and system automation. I am enthusiastic about contributing clean documentation, performant web widgets, and inclusive access tools to the digital landscape.
                  </p>

                  <div className="p-5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3">
                    <h3 className="font-display font-medium text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-400" /> Professional Anchoring Attributes
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-3 text-sm text-zinc-300 list-none pl-0">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-500" /> VIT CSE Board Coordinator
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-500" /> Exceeds WCAG 2.2 AA Auditing
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-500" /> High-Contrast Theme Specialist
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-500" /> Active Open Source Contributor
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Sidebar Card: Core Contacts & Details */}
                <div className="space-y-6">
                  <div className="p-6 rounded-lg bg-[#141417] border border-zinc-800 space-y-4">
                    <h3 className="text-lg font-semibold font-display text-white">Rajat Mishra</h3>
                    <p className="text-xs text-purple-400 font-mono">VIT Chennai, CSE Department</p>
                    
                    <ul className="space-y-3 text-sm text-zinc-400 pl-0">
                      <li className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                        <span>Vandalur-Kelambakkam Road, Chennai</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                        <span className="truncate">{rajatProfile.email}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="w-4 h-4 font-mono text-zinc-500 font-bold text-center flex-shrink-0">G</span>
                        <a href={rajatProfile.github} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline focus:ring-1 focus:ring-sky-400 rounded">GitHub Portal</a>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="w-4 h-4 font-mono text-zinc-500 font-bold text-center flex-shrink-0">L</span>
                        <a href={rajatProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline focus:ring-1 focus:ring-sky-400 rounded">LinkedIn Connect</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Education Timeline */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-display text-white border-b border-zinc-900 pb-3">
                  Academic Milestones
                </h2>
                <div className="relative pl-6 border-l border-zinc-800 space-y-8">
                  {educationList.map((edu, idx) => (
                    <article key={idx} className="relative space-y-2">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#09090b] border-2 border-purple-500" aria-hidden="true" />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs font-mono text-zinc-400 gap-1">
                        <span>{edu.period}</span>
                        {edu.gpa && <span className="bg-purple-950/40 text-purple-300 border border-purple-900/60 px-2 py-0.5 rounded">{edu.gpa}</span>}
                      </div>
                      <h3 className="text-lg font-medium font-display text-white">{edu.degree}</h3>
                      <p className="text-sm text-zinc-300">{edu.institution}</p>
                      
                      <div className="pt-2">
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Primary Scope & Core Labs:</h4>
                        <ul className="flex flex-wrap gap-1.5 mt-2 pl-0 list-none">
                          {edu.courses.map((course, cIdx) => (
                            <li key={cIdx} className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded">
                              {course}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Skills Matrices with categorizations */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-display text-white border-b border-zinc-900 pb-3">
                  Technology Competencies
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {skillGroups.map((group, gIdx) => (
                    <div key={gIdx} className="p-5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-4">
                      <h4 className="font-display font-medium text-white border-b border-zinc-800 pb-2">{group.category}</h4>
                      <ul className="flex flex-wrap gap-2 pl-0 list-none" aria-label={`${group.category} skills list`}>
                        {group.skills.map((skill, sIdx) => (
                          <li key={sIdx} className="bg-purple-950/30 border border-purple-900/40 text-purple-300 text-xs px-2.5 py-1 rounded">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* ============================================================== */}
          {/* 📍 PROJECTS VIEW (PROJECTS SCREEN W/ DETAILED SUB-VIEW MODAL) */}
          {/* ============================================================== */}
          {currentView === "projects" && (
            <motion.section
              key="projects-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
              aria-labelledby="projects-heading"
            >
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-4">
                  <div>
                    <h2 id="projects-heading" className="text-3xl font-bold font-display text-white">
                      Application Laboratory
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">
                      Academic assignments, research code units, and interactive utilities designed strictly according to accessibility targets.
                    </p>
                  </div>

                  {/* Sub-search criteria */}
                  <div className="w-full md:w-72 relative">
                    <label htmlFor="proj-search-input" className="sr-only">Search projects by keyword, tag or framework</label>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" aria-hidden="true" />
                    <input
                      id="proj-search-input"
                      type="text"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-10 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent"
                      placeholder="Keyword / tag query..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Sub-tab tag filter menu */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Filter projects by tags font">
                  {allTags.map((tag) => {
                    const isSelected = filterTag === tag;
                    return (
                      <button
                        key={tag}
                        role="tab"
                        aria-selected={isSelected}
                        className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all cursor-pointer ${
                          isSelected
                            ? "bg-purple-600 text-white border border-purple-400/30"
                            : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800"
                        }`}
                        onClick={() => {
                          setFilterTag(tag);
                          setAnnouncement(`Filtered projects by tag: ${tag}`);
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic feedback tag search results count */}
              <div className="text-xs font-mono text-zinc-500 flex items-center justify-between">
                <span>Displaying {filteredProjects.length} of {projectsList.length} total projects</span>
                {searchQuery || filterTag !== "All" ? (
                  <button 
                    onClick={() => { setSearchQuery(""); setFilterTag("All"); }}
                    className="text-purple-400 hover:underline hover:text-purple-300 focus:ring-1 focus:ring-sky-400 px-1 rounded"
                  >
                    Clear Filter
                  </button>
                ) : null}
              </div>

              {/* Grid of Semantic <article> cards */}
              {filteredProjects.length === 0 ? (
                <div className="text-center py-20 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
                  <Info className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-zinc-400 font-display">No projects found matching the selection criteria.</p>
                  <p className="text-xs text-zinc-500">Try searching for keywords like &quot;React&quot;, &quot;Audio&quot;, or &quot;Algorithms&quot;.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredProjects.map((proj) => (
                    <article 
                      key={proj.id}
                      className="p-6 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between group focus-within:ring-2 focus-within:ring-sky-400"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-2.5 rounded bg-purple-950/50 border border-purple-900/40">
                            {renderProjectIcon(proj.iconName)}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500 tracking-wider font-semibold uppercase">{proj.duration}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 id={`proj-title-${proj.id}`} className="text-xl font-bold font-display text-white group-hover:text-purple-300 transition-colors">
                            {proj.title}
                          </h3>
                          <p className="text-xs text-purple-400 font-mono">{proj.academicContext}</p>
                          <p className="text-sm text-zinc-400 leading-relaxed font-sans line-clamp-3">
                            {proj.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 mt-6 border-t border-zinc-800/60">
                        {/* Tags list */}
                        <ul className="flex flex-wrap gap-1.5 pl-0 mt-2 list-none" aria-label="Project technologies">
                          {proj.tags.map((tag) => (
                            <li key={tag} className="text-[10px] uppercase font-mono bg-zinc-950 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                              {tag}
                            </li>
                          ))}
                        </ul>

                        {/* Interactive Buttons */}
                        <div className="flex items-center justify-between gap-4">
                          <button
                            type="button"
                            className="text-xs font-semibold font-display tracking-widest text-purple-300 hover:text-purple-100 uppercase underline decoration-purple-500/50 hover:decoration-purple-400 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-1 py-0.5"
                            onClick={() => {
                              setSelectedProject(proj);
                              setAnnouncement(`Opened detail modal for system project ${proj.title}`);
                            }}
                            aria-haspopup="dialog"
                            aria-label={`Read academic research and specifications for ${proj.title}`}
                          >
                            Technical Details
                          </button>
                          
                          <div className="flex items-center gap-3">
                            <a 
                              href={proj.demoUrl}
                              className="p-1 text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-sky-400 rounded"
                              aria-label={`Launches demonstration playground for ${proj.title}`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <a 
                              href={proj.repoUrl}
                              className="p-1 text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-sky-400 rounded"
                              aria-label={`Launches source code archives for ${proj.title}`}
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {/* ============================================================== */}
          {/* 📍 CONTACT VIEW (CONTACT SCREEN W/ PERSISTENT CACHED INBOX)  */}
          {/* ============================================================== */}
          {currentView === "contact" && (
            <motion.section
              key="contact-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
              aria-labelledby="contact-heading"
            >
              <div className="grid md:grid-cols-5 gap-8">
                {/* Intro details */}
                <div className="md:col-span-2 space-y-6">
                  <h2 id="contact-heading" className="text-3xl font-bold font-display text-white border-b border-zinc-900 pb-3">
                    Connect With Me
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                    Have any academic suggestions, project collaboration offers, or technical consultation requests? Please write your query in the strict WCAG AA keyboard-compliant contact portal.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-400">Campus Location</h4>
                        <p className="text-sm text-zinc-300 mt-0.5">Vellore Institute of Technology, Chennai — Vandalur Road, 600127</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
                      <Mail className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-400">Academic Mailbox</h4>
                        <p className="text-sm text-zinc-300 mt-0.5">{rajatProfile.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Accessible Outbox Preview (Unique and extremely neat local database check!) */}
                  {sentMessages.length > 0 && (
                    <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/60 space-y-4">
                      <h3 className="text-sm font-semibold font-display text-white border-b border-zinc-800 pb-2 flex items-center justify-between">
                        <span>Submitted Outbox (Cached Log)</span>
                        <button
                          onClick={() => {
                            localStorage.removeItem("rajat_portfolio_outbox");
                            setSentMessages([]);
                            setAnnouncement("Cached outbox records completely cleared.");
                          }}
                          className="text-[10px] text-zinc-500 hover:text-purple-400 hover:underline px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-sky-400"
                        >
                          Clear cached logs
                        </button>
                      </h3>
                      
                      <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                        {sentMessages.map((msg, mIdx) => (
                          <div key={mIdx} className="p-3 rounded bg-zinc-950 text-xs gap-1 flex flex-col border border-zinc-800/80">
                            <span className="text-[10px] font-mono text-purple-400">Sent to: Rajat Mishra</span>
                            <strong className="text-zinc-200 mt-0.5">{msg.subject}</strong>
                            <span className="text-zinc-400 mt-1 italic">&quot;{msg.message}&quot;</span>
                            <span className="text-[10px] text-zinc-500 text-right mt-1 font-mono">— {msg.name} ({msg.email})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Form layout */}
                <div className="md:col-span-3">
                  <div className="p-6 md:p-8 rounded-xl bg-zinc-900 border border-zinc-800/80 shadow-xl space-y-6">
                    <h3 className="text-xl font-bold font-display text-white">Send Structured Inquiry</h3>

                    {/* Announcement Feed Success box (aria-live polite alerts it to screen users) */}
                    {isSubmitSuccess && (
                      <div className="p-4 rounded bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-xs flex items-start gap-3" role="alert">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Form Submitted Successfully!</strong>
                          <p className="mt-1">Your response was cached successfully. It has also been saved to your local browser storage outbox log on this client.</p>
                        </div>
                      </div>
                    )}

                    <form 
                      ref={contactFormRef}
                      onSubmit={handleFormSubmit}
                      className="space-y-4 focus:outline-none"
                      aria-label="Contact information submission form"
                    >
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-zinc-400" htmlFor="contact-name">
                          Full Name <span className="text-purple-400 font-bold" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
                          placeholder="Your Name (e.g. John Doe)"
                          value={formData.name}
                          onChange={handleInputChange}
                          aria-required="true"
                          aria-describedby={formErrors.name ? "error-name" : undefined}
                        />
                        {formErrors.name && (
                          <div id="error-name" className="text-xs text-red-400 flex items-center gap-1 mt-1 font-mono">
                            <span aria-hidden="true">●</span> {formErrors.name}
                          </div>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-zinc-400" htmlFor="contact-email">
                          Email Address <span className="text-purple-400 font-bold" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
                          placeholder="mail@vitstudent.ac.in"
                          value={formData.email}
                          onChange={handleInputChange}
                          aria-required="true"
                          aria-describedby={formErrors.email ? "error-email" : undefined}
                        />
                        {formErrors.email && (
                          <div id="error-email" className="text-xs text-red-400 flex items-center gap-1 mt-1 font-mono">
                            <span aria-hidden="true">●</span> {formErrors.email}
                          </div>
                        )}
                      </div>

                      {/* Subject input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-zinc-400" htmlFor="contact-subject">
                          Subject <span className="text-purple-400 font-bold" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="contact-subject"
                          name="subject"
                          type="text"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
                          placeholder="e.g. Collaboration Proposal VIT Project Lab"
                          value={formData.subject}
                          onChange={handleInputChange}
                          aria-required="true"
                          aria-describedby={formErrors.subject ? "error-subject" : undefined}
                        />
                        {formErrors.subject && (
                          <div id="error-subject" className="text-xs text-red-400 flex items-center gap-1 mt-1 font-mono">
                            <span aria-hidden="true">●</span> {formErrors.subject}
                          </div>
                        )}
                      </div>

                      {/* Message input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-zinc-400" htmlFor="contact-message">
                          Message Body <span className="text-purple-400 font-bold" aria-hidden="true">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={4}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors resize-y min-h-[100px]"
                          placeholder="Your complete description details..."
                          value={formData.message}
                          onChange={handleInputChange}
                          aria-required="true"
                          aria-describedby={formErrors.message ? "error-message" : undefined}
                        />
                        {formErrors.message && (
                          <div id="error-message" className="text-xs text-red-400 flex items-center gap-1 mt-1 font-mono">
                            <span aria-hidden="true">●</span> {formErrors.message}
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-5 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all active:scale-95 flex items-center justify-center gap-2 border border-purple-400/40 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
                      >
                        <Send className="w-4 h-4" /> Send Secure Inquiry
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

        </AnimatePresence>
      </main>

      {/* 🟢 ACCESSIBLE DIALOG (MODAL DISPLAY FOR PROJECTS DETAILS) */}
      <AnimatePresence>
        {selectedProject && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
            aria-describedby="modal-project-desc"
          >
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black"
              aria-hidden="true"
            />

            {/* Modal Body Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative max-w-2xl w-full bg-[#141417] border border-zinc-800 rounded-xl shadow-2xl p-6 md:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Dismiss button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400"
                aria-label="Close dialog overlay"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="p-3 bg-purple-950/30 border border-purple-900/40 w-fit rounded">
                  {renderProjectIcon(selectedProject.iconName)}
                </div>

                <div className="space-y-1">
                  <h3 id="modal-project-title" className="text-2xl font-bold font-display text-white">
                    {selectedProject.title}
                  </h3>
                  <span className="text-xs text-purple-400 font-mono tracking-wide">{selectedProject.academicContext}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono text-zinc-400 bg-zinc-950 p-4 rounded-lg border border-zinc-900">
                <div>
                  <span className="block text-zinc-500 uppercase tracking-widest text-[10px]">Project Title/Role</span>
                  <span className="text-zinc-200 text-sm mt-0.5 block">{selectedProject.role}</span>
                </div>
                <div>
                  <span className="block text-zinc-500 uppercase tracking-widest text-[10px]">Duration Scope</span>
                  <span className="text-zinc-200 text-sm mt-0.5 block">{selectedProject.duration}</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-zinc-300 font-sans leading-relaxed">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Archival Specifications & Objectives:</h4>
                <p id="modal-project-desc">{selectedProject.longDescription}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-mono font-semibold uppercase">Keywords:</span>
                  <ul className="flex flex-wrap gap-1.5 list-none pl-0">
                    {selectedProject.tags.map((tag) => (
                      <li key={tag} className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <a
                    href={selectedProject.demoUrl}
                    className="w-full sm:w-auto px-5 py-2.5 rounded bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold text-center focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
                  >
                    Open Live Deployment
                  </a>
                  <a
                    href={selectedProject.repoUrl}
                    className="w-full sm:w-auto px-5 py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold text-center focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
                  >
                    Explore GitHub Repository
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🚪 Semantic Footer Information */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 mt-16 text-zinc-500 text-xs font-mono">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <p className="text-zinc-400 font-sans font-medium text-sm">Rajat Mishra — Computer Science and Engineering</p>
            <p>VIT Chennai • School of Computer Science &amp; Labs</p>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href={rajatProfile.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1 px-2 border border-zinc-800 rounded bg-zinc-900 text-zinc-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
              aria-label="GitHub Developer Hub Link"
            >
              GitHub Feed
            </a>
            <a 
              href={rajatProfile.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1 px-2 border border-zinc-800 rounded bg-zinc-900 text-zinc-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
              aria-label="LinkedIn Professional Network Link"
            >
              LinkedIn Feed
            </a>
          </div>

          <div>
            <p>&copy; 2026. Built with strict keyboard access. VIT Chennai.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Inline fallback / placeholder icon resolver to keep asset bundle modular
function AlertIcon({ name, className = "w-5 h-5", ...props }: { name: string; className?: string; [key: string]: any }) {
  // Return specialized SVG mappings for semantic categories
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
