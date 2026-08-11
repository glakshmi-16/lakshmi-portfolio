import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  FiGithub, FiLinkedin, FiMail, FiDownload,
  FiArrowUp, FiExternalLink, FiCode, FiSend, FiMenu, FiX, FiAward,
  FiBookOpen, FiBriefcase, FiCpu, FiDatabase, FiLayers, FiTool, FiGitBranch,
} from "react-icons/fi";
import { SiLeetcode, SiSpringboot, SiHibernate, SiMysql, SiMongodb, SiJavascript, SiHtml5, SiCss, SiTypescript, SiFlask, SiSupabase } from "react-icons/si";
import { FaJava } from "react-icons/fa";

import heroBg from "@/assets/hero-bg.jpg";
import resumeAsset from "@/assets/resume.pdf.asset.json";


export const Route = createFileRoute("/")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

/* ---------------- data (from resume only) ---------------- */

const PROFILE = {
  name: "G Lakshmi",
  title: "Java Full Stack Developer",
  tagline: "Building reliable, scalable full-stack experiences with Java, Spring Boot and modern web tech.",
  intro:
    "Computer Science and Engineering graduate and Java Full Stack Trainee focused on writing clean backend services and pairing them with intuitive interfaces. Actively building projects across Spring Boot, REST APIs, SQL and modern frontends.",
  email: "glakshmi1016@gmail.com",
  phone: "+91 6361220515",
  location: "Shivamogga, Karnataka",
  github: "https://github.com/glakshmi-16/",
  linkedin: "https://www.linkedin.com/in/g-lakshmi16/",
  leetcode: "https://leetcode.com/u/beginnerGL16/",
};


const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

const ROLES = ["Java Full Stack Applications.", "Spring Boot Backends.", "REST APIs."];

const SKILLS: { title: string; icon: ReactNode; items: { name: string; icon?: ReactNode }[] }[] = [
  { title: "Programming Languages", icon: <FiCode />, items: [
    { name: "Java", icon: <FaJava /> },
    { name: "SQL", icon: <SiMysql /> },
    { name: "JavaScript", icon: <SiJavascript /> },
    { name: "HTML", icon: <SiHtml5 /> },
    { name: "CSS", icon: <SiCss /> },
    { name: "DSA", icon: <FiCpu /> },
  ]},
  { title: "Frameworks & Libraries", icon: <FiLayers />, items: [
    { name: "Spring Boot", icon: <SiSpringboot /> },
    { name: "Hibernate", icon: <SiHibernate /> },
    { name: "Servlets" },
    { name: "JDBC" },
    { name: "REST APIs" },
  ]},
  { title: "Databases", icon: <FiDatabase />, items: [
    { name: "MySQL", icon: <SiMysql /> },
    { name: "MongoDB Atlas", icon: <SiMongodb /> },
  ]},
  { title: "Tools & Platforms", icon: <FiTool />, items: [
    { name: "Eclipse" },
    { name: "VS Code" },
  ]},
  { title: "Version Control", icon: <FiGitBranch />, items: [
    { name: "Git" },
    { name: "GitHub", icon: <FiGithub /> },
  ]},
];

const PROJECTS = [
  {
    name: "Soft Tissue Tumor Detection Using GM-UNet",
    description:
      "Deep learning based medical image analysis system that detects and segments soft tissue tumors from scan images using a GM-UNet architecture.",
    features: [
      "GM-UNet architecture for tumor segmentation",
      "Flask web interface for scan uploads",
      "Real-time predictions and tumor region visualization",
    ],
    tech: ["Python", "GM-UNet", "Flask", "Deep Learning"],
    icons: [<SiFlask key="f" />],
  },
  {
    name: "Hospital Management System",
    description:
      "Web-based Hospital Management System to manage patients, doctors and appointments using Java Full Stack technologies with efficient CRUD operations.",
    features: [
      "Patient, doctor and appointment management",
      "JDBC + MySQL database connectivity",
      "Full CRUD operations for hospital records",
    ],
    tech: ["Java", "JDBC", "MySQL", "Servlets"],
    icons: [<FaJava key="j" />, <SiMysql key="m" />],
  },
  {
    name: "Open Source Job Portal",
    description:
      "Full-stack job portal enabling role-based authentication, job posting, application tracking and seamless database integration.",
    features: [
      "Role-based authentication",
      "Job posting & application tracking",
      "Supabase database integration",
    ],
    tech: ["HTML", "CSS", "TypeScript", "Supabase"],
    icons: [<SiTypescript key="t" />, <SiSupabase key="s" />],
  },
];

const EDUCATION = [
  { school: "PES Institute of Technology & Management", place: "Shivamogga", degree: "B.E. — Computer Science and Engineering", period: "2022 – 2026", score: "CGPA: 8.9" },
  { school: "PACE Ultra Modern PU College", place: "Shivamogga", degree: "PCMB (Pre-University)", period: "2020 – 2022", score: "Percentage: 92%" },
  { school: "KRCS Residential Central School", place: "Shikaripura", degree: "SSLC", period: "2019 – 2020", score: "Percentage: 85%" },
];

const CERTIFICATIONS = [
  { name: "Full Stack Web Development", issuer: "Intrnforte" },
];

const ACHIEVEMENTS = [
  { title: "50 Days Badge — LeetCode", desc: "Earned for consistent problem solving and coding practice in Data Structures & Algorithms." },
];

const CODING_PROFILES = [
  { name: "GitHub", url: PROFILE.github, icon: <FiGithub />, hint: "Code & Repositories" },
  { name: "LinkedIn", url: PROFILE.linkedin, icon: <FiLinkedin />, hint: "Professional Network" },
  { name: "LeetCode", url: PROFILE.leetcode, icon: <SiLeetcode />, hint: "DSA Practice" },
];

/* ---------------- helpers ---------------- */

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

function useTypingRoles(roles: string[]) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const current = roles[i % roles.length];
    const t = setTimeout(() => {
      if (!del) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDel(true), 1400);
      } else {
        const next = current.slice(0, Math.max(0, text.length - 1));
        setText(next);
        if (next === "") { setDel(false); setI((v) => v + 1); }
      }
    }, del ? 40 : 80);
    return () => clearTimeout(t);
  }, [text, del, i, roles]);
  return text;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
} as const;

const SECTION_INDEX: Record<string, string> = {
  about: "01", skills: "02", experience: "03", projects: "04",
  education: "05", certifications: "06", achievements: "07",
  coding: "08", resume: "09", contact: "10",
};

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-16 flex flex-col gap-4"
        >
          <div className="flex items-center gap-4">
            <span className="section-index">{SECTION_INDEX[id] ?? "00"}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-cyan-accent/40 via-foreground/10 to-transparent" />
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</span>
          </div>
          <h2 className="max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl">
            {title.split(" ").map((w, i, arr) =>
              i === arr.length - 1
                ? <span key={i} className="text-gradient">{w}</span>
                : <span key={i}>{w} </span>
            )}
          </h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

/* ---------------- page ---------------- */

function PortfolioPage() {
  const ids = useMemo(() => NAV.map((n) => n.id), []);
  const active = useActiveSection(ids);
  const typed = useTypingRoles(ROLES);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  const [showTop, setShowTop] = useState(false);
  const [menu, setMenu] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(() => setLoaded(true), 650);
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(t); };
  }, []);

  return (
    <div className="relative min-h-screen text-foreground">
      {/* Scroll progress */}
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand via-cyan-accent to-brand" />

      {/* Loading screen */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-14 w-14">
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand border-r-cyan-accent" />
                <div className="absolute inset-2 rounded-full bg-gradient-brand shadow-glow" />
              </div>
              <p className="text-sm tracking-widest text-muted-foreground">LOADING PORTFOLIO</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Nav active={active} menu={menu} setMenu={setMenu} />

      <main>
        <Hero typed={typed} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Certifications />
        <Achievements />
        <CodingProfiles />
        <ResumeBlock />
        <Contact />
      </main>

      <Footer />

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-glow"
            aria-label="Back to top"
          >
            <FiArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- sections ---------------- */

function Nav({ active, menu, setMenu }: { active: string; menu: boolean; setMenu: (v: boolean) => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-3 flex w-full max-w-6xl items-center justify-between px-4">
        <div className="glass-card flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#home" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-sm font-bold text-primary-foreground shadow-glow">G</span>
            <span className="font-semibold tracking-tight">Lakshmi<span className="text-gradient">.</span></span>
          </a>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`relative rounded-full px-3 py-1.5 text-sm transition ${
                  active === n.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active === n.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-foreground/8 ring-1 ring-foreground/10" />
                )}
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {/* <a href="#contact" className="hidden btn-primary lg:inline-flex" style={{ padding: "0.55rem 1.1rem", fontSize: "0.875rem" }}>
              Hire Me
            </a> */}
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-foreground/10 bg-foreground/5 lg:hidden"
              onClick={() => setMenu(!menu)}
              aria-label="Toggle menu"
            >
              {menu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 w-full max-w-6xl px-4 lg:hidden"
          >
            <div className="glass-card grid grid-cols-2 gap-1 p-3">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setMenu(false)}
                  className={`rounded-lg px-3 py-2 text-sm ${active === n.id ? "bg-foreground/10 text-foreground" : "text-muted-foreground"}`}
                >
                  {n.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ typed }: { typed: string }) {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-28">
      <div className="absolute inset-0 -z-10">
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-25" width={1536} height={1024} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-brand/40 blur-3xl float-orb" />
        <div className="absolute -right-24 bottom-10 h-[28rem] w-[28rem] rounded-full bg-cyan-accent/30 blur-3xl float-orb" />
        <div className="absolute left-1/3 top-1/2 h-72 w-72 rounded-full bg-lime-accent/10 blur-3xl float-orb" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        {/* Left: headline block */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="lg:col-span-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cyan-accent backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            Available for Full-time Roles
          </span>

          <h1 className="mt-6 text-[2.8rem] font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]">
            <span className="block text-foreground/95">Hi, I'm</span>
            <span className="block animated-gradient-text">{PROFILE.name}.</span>
            <span className="mt-3 block text-2xl font-medium text-muted-foreground sm:text-3xl lg:text-4xl">
              I build <span className="text-foreground">{typed || "\u00A0"}</span><span className="caret" />
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {PROFILE.intro}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary"><FiCode /> View Projects</a>
            <a href="/resume.pdf" download="G_Lakshmi_Resume.pdf" className="btn-ghost"><FiDownload /> Download Resume</a>
            <a href="#contact" className="btn-ghost"><FiSend /> Get in Touch</a>
          </div>

          <div className="mt-9 flex items-center gap-3">
            <SocialIcon href={`mailto:${PROFILE.email}`} label="Email"><FiMail /></SocialIcon>
            <SocialIcon href={PROFILE.github} label="GitHub"><FiGithub /></SocialIcon>
            <SocialIcon href={PROFILE.linkedin} label="LinkedIn"><FiLinkedin /></SocialIcon>
            <SocialIcon href={PROFILE.leetcode} label="LeetCode"><SiLeetcode /></SocialIcon>
            <span className="ml-2 hidden font-mono text-xs text-muted-foreground sm:inline">
              // scroll to explore
            </span>
          </div>
        </motion.div>

        {/* Right: floating stat cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative hidden lg:col-span-4 lg:block"
        >
          <div className="relative h-full min-h-[420px]">
            <FloatingCard className="absolute right-0 top-4 w-64" delay={0.2}>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-lg text-primary-foreground shadow-glow"><FaJava /></span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Core Stack</div>
                  <div className="font-semibold">Java · Spring Boot</div>
                </div>
              </div>
              <div className="mt-4 font-mono text-[0.7rem] text-cyan-accent">
                <span className="text-muted-foreground">$ </span>mvn spring-boot:run
              </div>
            </FloatingCard>

            <FloatingCard className="absolute left-0 top-48 w-60" delay={0.35}>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">CGPA</div>
              <div className="mt-1 text-4xl font-bold text-gradient">8.9</div>
              <div className="mt-1 text-xs text-muted-foreground">B.E. Computer Science</div>
            </FloatingCard>

            <FloatingCard className="absolute bottom-2 right-4 w-64" delay={0.5}>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow"><SiLeetcode /></span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">LeetCode</div>
                  <div className="font-semibold">50+ Day Streak</div>
                </div>
              </div>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={`h-6 flex-1 rounded-sm ${i < 8 ? "bg-gradient-brand" : "bg-foreground/10"}`} />
                ))}
              </div>
            </FloatingCard>
          </div>
        </motion.div>
      </div>

      {/* Tech marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-y border-foreground/5 bg-background/40 py-4 backdrop-blur-sm">
        <div className="flex overflow-hidden">
          <div className="marquee-track flex shrink-0 items-center gap-12 whitespace-nowrap px-6 font-mono text-sm uppercase tracking-[0.25em] text-muted-foreground">
            {[...Array(2)].map((_, r) => (
              <div key={r} className="flex items-center gap-12">
                {["Java", "Spring Boot", "Hibernate", "REST APIs", "MySQL", "MongoDB", "JavaScript", "TypeScript", "Supabase", "Git", "DSA", "Problem Solving"].map((t) => (
                  <span key={`${r}-${t}`} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-accent/60" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`glass-card p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group grid h-11 w-11 place-items-center rounded-full border border-foreground/20 bg-foreground/10 text-foreground transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-primary-foreground"
    >
      <span className="text-lg">{children}</span>
    </a>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About Me" title="A little about my journey">
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}
        className="glass-card p-8 sm:p-10"
      >
        <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
          I'm <span className="font-semibold text-foreground">G Lakshmi</span>, a Computer Science
          and Engineering graduate from PES Institute of Technology & Management, Shivamogga, and a passionate
          Java Full Stack Developer. I love turning ideas into production-ready software — designing clean
          backend services with <span className="text-gradient font-semibold">Java, Spring Boot, Hibernate</span> and REST APIs,
          and pairing them with responsive frontends. As a Java Full Stack Trainee at
          <span className="font-semibold text-foreground"> Dhee Coding Lab</span>, I'm actively applying these
          concepts to real-world style projects. My work spans a deep-learning based medical imaging system,
          a full CRUD Hospital Management System and a role-based Job Portal. Consistent DSA practice on
          LeetCode has sharpened my problem-solving mindset, and I'm now looking to contribute to impactful
          engineering teams as a Software Engineer, Java Developer or Full Stack Developer.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: "8.9", v: "B.E. CGPA" },
            { k: "3+", v: "Full-Stack Projects" },
            { k: "50+", v: "LeetCode Streak" },
            { k: "2026", v: "Graduate" },
          ].map((s) => (
            <div key={s.v} className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4 text-center">
              <div className="text-2xl font-bold text-gradient">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="Technical Skills" title="Tools I build with">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((cat, idx) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.07 }}
            className="glass-card group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:border-brand/40"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/20 opacity-0 blur-3xl transition group-hover:opacity-100" />
            <div className="mb-4 inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">{cat.icon}</span>
              <h3 className="text-lg font-semibold">{cat.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((it) => (
                <span key={it.name} className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-sm text-foreground/90 transition hover:border-cyan-accent/50 hover:bg-cyan-accent/10">
                  {it.icon && <span className="text-cyan-accent">{it.icon}</span>}
                  {it.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" eyebrow="Internship Experience" title="Where I'm training">
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-brand/50 via-foreground/10 to-transparent sm:left-1/2" />
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
          className="relative pl-12 sm:pl-0"
        >
          <div className="absolute left-3 top-6 h-3 w-3 rounded-full bg-gradient-brand shadow-glow sm:left-1/2 sm:-translate-x-1/2" />
          <div className="glass-card p-6 sm:ml-[calc(50%+2rem)] sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-cyan-accent">
              <FiBriefcase /> Internship / Trainee
            </div>
            <h3 className="mt-2 text-xl font-bold">Java Full Stack Trainee</h3>
            <p className="text-muted-foreground">Dhee Coding Lab — Bengaluru</p>
            <p className="mt-1 text-sm text-muted-foreground">2026 – Present</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/85">
              <li>• Undergoing intensive, project-based training in Java, Spring Boot, REST APIs and SQL.</li>
              <li>• Applying concepts through real-world style projects to build production-ready full-stack development practices.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Java", "Spring Boot", "REST APIs", "SQL"].map((t) => (
                <span key={t} className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs">{t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects" eyebrow="Featured Work" title="Projects I'm proud of">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <motion.article
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className={`glass-card group overflow-hidden p-0 ${i === 0 ? "lg:col-span-2" : ""}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative overflow-hidden bg-gradient-to-br from-foreground/[0.08] via-foreground/[0.03] to-transparent md:min-h-[320px]">
                <div className="absolute inset-0 grid-bg opacity-60" />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08), transparent 50%)",
                  }}
                />
                <div className="absolute left-4 top-4 flex gap-2">
                  {p.icons?.map((ic, idx) => (
                    <span key={idx} className="grid h-9 w-9 place-items-center rounded-full bg-foreground/10 text-foreground ring-1 ring-foreground/20 backdrop-blur">
                      {ic}
                    </span>
                  ))}
                </div>
                <div className="relative flex h-full min-h-[220px] items-center justify-center p-8">
                  <span className="font-display text-[5rem] font-bold leading-none text-foreground/10 sm:text-[7rem]">
                    0{i + 1}
                  </span>
                </div>
              </div>
              <div className="flex flex-col p-6 sm:p-8">
                <h3 className="text-xl font-bold sm:text-2xl">{p.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-foreground/85">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{f}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-1 text-xs">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Academic background">
      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-brand/50 via-foreground/10 to-transparent md:left-1/2" />
        <div className="space-y-8">
          {EDUCATION.map((e, i) => (
            <motion.div
              key={e.school}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative pl-12 md:grid md:grid-cols-2 md:gap-10 md:pl-0 ${i % 2 ? "md:[&>div]:col-start-2" : ""}`}
            >
              <div className="absolute left-3 top-6 h-3 w-3 rounded-full bg-gradient-brand shadow-glow md:left-1/2 md:-translate-x-1/2" />
              <div className="glass-card p-6">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-accent">
                  <FiBookOpen /> {e.period}
                </div>
                <h3 className="text-lg font-bold">{e.degree}</h3>
                <p className="text-sm text-foreground/85">{e.school}</p>
                <p className="text-xs text-muted-foreground">{e.place}</p>
                <div className="mt-3 inline-block rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-cyan-accent">{e.score}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Certifications() {
  return (
    <Section id="certifications" eyebrow="Certifications" title="Continued learning">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATIONS.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-card p-6 transition hover:-translate-y-1 hover:border-cyan-accent/40"
          >
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow">
              <FiAward className="text-lg" />
            </div>
            <h3 className="text-lg font-semibold">{c.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Issued by <span className="text-foreground">{c.issuer}</span></p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Achievements() {
  return (
    <Section id="achievements" eyebrow="Achievements" title="Milestones so far">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-card flex gap-4 p-6"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow">
              <SiLeetcode className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function CodingProfiles() {
  return (
    <Section id="coding" eyebrow="Coding Profiles" title="Find me around the web">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CODING_PROFILES.map((p, i) => (
          <motion.a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass-card group flex items-center justify-between p-6 transition hover:-translate-y-1 hover:border-brand/40"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-lg text-primary-foreground shadow-glow">{p.icon}</span>
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.hint}</div>
              </div>
            </div>
            <FiExternalLink className="text-muted-foreground transition group-hover:translate-x-1 group-hover:text-cyan-accent" />
          </motion.a>
        ))}
      </div>
    </Section>
  );
}

function ResumeBlock() {
  return (
    <Section id="resume" eyebrow="Resume" title="Grab a copy">
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}
        className="glass-card flex flex-col items-center justify-between gap-6 p-8 sm:flex-row sm:p-10"
      >
        <div className="flex items-center gap-5">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-glow">
            <FiDownload className="text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold">G Lakshmi — Resume</h3>
            <p className="text-sm text-muted-foreground">Java Full Stack Developer • Updated 2026</p>
          </div>
        </div>
        <div className="flex gap-3">
          {/* <a href={resumeAsset.url} download="G_Lakshmi.pdf" className="btn-primary"><FiDownload /> Download PDF</a> */}
          <a href="/resume.pdf" download="G_Lakshmi.pdf" className="btn-primary"><FiDownload /> Download PDF</a>
          {/* <a href={resumeAsset.url} target="_blank" rel="noopener noreferrer" className="btn-ghost"><FiExternalLink /> Preview</a> */}
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost"><FiExternalLink /> Preview</a>
        </div>
      </motion.div>
    </Section>
  );
}

function Contact() {
  const links = [
    {
      label: "Email",
      value: PROFILE.email,
      href: `mailto:${PROFILE.email}`,
      icon: <FiMail />,
      cta: "Send an email",
      external: false,
    },
    {
      label: "LinkedIn",
      value: "/in/glakshmi-16",
      href: PROFILE.linkedin,
      icon: <FiLinkedin />,
      cta: "Connect on LinkedIn",
      external: true,
    },
    {
      label: "GitHub",
      value: "@glakshmi-16",
      href: PROFILE.github,
      icon: <FiGithub />,
      cta: "View my code",
      external: true,
    },
  ];

  return (
    <Section id="contact" eyebrow="Contact" title="Let's Connect">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}
          className="glass-card p-6 sm:p-8"
        >
          <h3 className="text-2xl font-bold sm:text-3xl">Let's build together</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            I'm currently seeking opportunities as a{" "}
            <span className="text-foreground">Java Full Stack Developer</span>. If you'd like to
            discuss an opportunity, collaborate on a project, or simply connect, feel free
            to reach out through any of the platforms on the right.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/5 px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-brand" />
            Open to opportunities
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {links.map((l, i) => (
            <motion.a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
              {...("download" in l && l.download ? { download: l.download } : {})}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-card group relative flex flex-col gap-4 p-6 transition hover:border-foreground/40"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow">
                  {l.icon}
                </span>
                <FiExternalLink className="text-foreground/40 transition group-hover:translate-x-1 group-hover:text-foreground" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {l.label}
                </div>
                <div className="mt-1 truncate text-sm font-medium text-foreground sm:text-base">
                  {l.value}
                </div>
              </div>
              <div className="mt-auto text-xs font-medium uppercase tracking-widest text-foreground/60 transition group-hover:text-foreground">
                {l.cta} →
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </Section>
  );
}


function Footer() {
  return (
    <footer className="border-t border-foreground/10 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 px-5 sm:flex-row sm:px-8">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} <span className="text-foreground">G Lakshmi</span>. Crafted with care.
        </div>
        <div className="flex items-center gap-3">
          <SocialIcon href={`mailto:${PROFILE.email}`} label="Email"><FiMail /></SocialIcon>
          <SocialIcon href={PROFILE.github} label="GitHub"><FiGithub /></SocialIcon>
          <SocialIcon href={PROFILE.linkedin} label="LinkedIn"><FiLinkedin /></SocialIcon>
          <SocialIcon href={PROFILE.leetcode} label="LeetCode"><SiLeetcode /></SocialIcon>
        </div>
      </div>
    </footer>
  );
}
