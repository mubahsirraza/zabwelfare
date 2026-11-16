
import { useEffect, useRef, useState } from "react";
import AdminApp from "./components/admin/AdminApp.jsx";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
  useParams,
} from "react-router-dom";


import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Heart,
  HeartHandshake,
  Gift,
  Lightbulb,
  ChevronDown,
  Menu,
  X,
  Users,
  HandHeart,
  GraduationCap,
  BookOpen,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Handshake,
  Target,
  Sparkles,
  Quote,
  Camera,
  CheckCircle2,
  ExternalLink,
  Eye,
  Send,
  BriefcaseBusiness,
} from "lucide-react";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Environment,
  ContactShadows,
} from "@react-three/drei";

import { motion, AnimatePresence } from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function FacebookIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.1H7v3.2h2.8V21h3.7Z" />
    </svg>
  );
}

function InstagramIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

gsap.registerPlugin(ScrollTrigger);

// ======================================================
// 1. WEBSITE CONFIGURATION
// ======================================================

const SITE_NAME = "ZABWelfare";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function formatDrive(drive) {
  const categoryIcons = {
    Education: GraduationCap,
    Food: Gift,
    Healthcare: Heart,
    Fundraising: HeartHandshake,
    Environment: Lightbulb,
    fullDescription: drive.description,
    "Community Support": HandHeart,
  };

  return {
    ...drive,
    id: drive._id,
    image: drive.coverImage?.url || IMAGES.community,
    description: drive.shortDescription || drive.description,
    date: drive.driveDate
      ? new Date(drive.driveDate).toLocaleDateString("en-PK", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Community initiative",
    icon: categoryIcons[drive.category] || HeartHandshake,
  };
}

const INSTAGRAM_URL =
  "https://www.instagram.com/zabwelfare_official/";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=2000&q=90",
  community:
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=85",
  education:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85",
  food: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=85",
  volunteers:
    "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=85",
  children:
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85",
  meeting:
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=85",
  charity:
    "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1200&q=85",
  hands:
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=85",
  nature:
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85",
};

const navigation = [
  { label: "Home", path: "/" },
  {
    label: "About",
    path: "/about",
    children: [
      { label: "Who We Are", path: "/about" },
      { label: "President's Vision", path: "/president" },
      { label: "Our Team", path: "/team" },
    ],
  },
  {
    label: "Our Work",
    path: "/drives",
    children: [
      { label: "All Drives", path: "/drives" },
      { label: "Causes", path: "/causes" },
      { label: "Gallery", path: "/gallery" },
    ],
  },
  { label: "News", path: "/news" },
  { label: "Contact", path: "/contact" },
];

// ======================================================
// 2. SAMPLE WEBSITE CONTENT
// ======================================================

const drives = [
  {
    id: 1,
    slug: "education-for-every-child",
    title: "Education for Every Child",
    category: "Education",
    description:
      "Helping children access learning opportunities and building a brighter future through community support.",
    image: IMAGES.education,
    icon: GraduationCap,
    date: "Community initiative",
  },
  {
    id: 2,
    slug: "food-and-community-support",
    title: "Food & Community Support",
    category: "Food Support",
    description:
      "Supporting families and communities through thoughtful food distribution and collective action.",
    image: IMAGES.food,
    icon: HandHeart,
    date: "Community initiative",
  },
  {
    id: 3,
    slug: "community-care",
    title: "Community Care",
    category: "Community",
    description:
      "Bringing volunteers together to support people and create meaningful change.",
    image: IMAGES.community,
    icon: HeartHandshake,
    date: "Community initiative",
  },
  {
    id: 4,
    slug: "volunteer-outreach",
    title: "Volunteer Outreach",
    category: "Volunteering",
    description:
      "Encouraging students to participate in service, awareness and community engagement.",
    image: IMAGES.volunteers,
    icon: Users,
    date: "Community initiative",
  },
];

const causes = [
  {
    title: "Education",
    description:
      "Creating better learning opportunities for children and young people.",
    icon: GraduationCap,
    color: "blue",
  },
  {
    title: "Food & Essentials",
    description:
      "Helping individuals and families access essential resources.",
    icon: Gift,
    color: "red",
  },
  {
    title: "Community Welfare",
    description:
      "Supporting local communities through service and collaboration.",
    icon: HandHeart,
    color: "blue",
  },
  {
    title: "Awareness",
    description:
      "Encouraging positive social responsibility and collective action.",
    icon: Lightbulb,
    color: "red",
  },
];




// ======================================================
// 3. COMMON ANIMATION HOOK
// ======================================================

function usePageAnimations(dependencies = []) {
  useEffect(() => {
    const context = gsap.context(() => {
      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          {
            y: 45,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray(".reveal-left").forEach((element) => {
        gsap.fromTo(
          element,
          {
            x: -45,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray(".reveal-right").forEach((element) => {
        gsap.fromTo(
          element,
          {
            x: 45,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    });

    return () => context.revert();
  }, dependencies);
}

// ======================================================
// 4. THREE.JS HERO OBJECT
// ======================================================

function FloatingShape() {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.12;
      meshRef.current.rotation.y += delta * 0.18;

      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.7) * 0.12;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={1.65}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#38A9E8"
          roughness={0.2}
          metalness={0.25}
          distort={0.35}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function RingShape() {
  const ringRef = useRef(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.12;
      ringRef.current.rotation.z += delta * 0.16;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[1.2, 0.2, 0.5]}>
      <torusGeometry args={[2.05, 0.025, 16, 120]} />
      <meshStandardMaterial
        color="#E63946"
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
  );
}

function HeroScene() {
  return (
    <div className="h-[380px] w-full md:h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[4, 5, 5]} intensity={2} />
        <pointLight position={[-4, -3, 2]} intensity={2} color="#E63946" />

        <FloatingShape />
        <RingShape />

        <Environment preset="city" />
        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.2}
          scale={8}
          blur={3}
        />
      </Canvas>
    </div>
  );
}

// ======================================================
// 5. REUSABLE BUTTONS AND SECTION HEADINGS
// ======================================================

function PrimaryButton({ to = "/donate", children, className = "" }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center justify-center gap-3 rounded-full bg-red-500 px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-red-500/20 transition duration-300 hover:-translate-y-1 hover:bg-red-600 ${className}`}
    >
      {children}
      <ArrowRight
        size={18}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}

function SecondaryButton({ to = "/about", children, className = "" }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-extrabold text-slate-800 transition duration-300 hover:-translate-y-1 hover:border-sky-500 hover:text-sky-700 ${className}`}
    >
      {children}
      <ArrowUpRight
        size={18}
        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
      />
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  light = false,
}) {
  return (
    <div
      className={`reveal max-w-3xl ${
        centered ? "mx-auto text-center" : ""
      }`}
    >
      <div
        className={`mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.22em] ${
          centered ? "justify-center" : ""
        } ${light ? "text-sky-300" : "text-sky-700"}`}
      >
        <span className="h-[2px] w-7 bg-red-500" />
        {eyebrow}
      </div>

      <h2
        className={`text-3xl font-extrabold leading-tight tracking-tight md:text-5xl ${
          light ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-5 text-base leading-8 md:text-lg ${
            light ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

// ======================================================
// 6. NAVIGATION
// ======================================================

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-5 md:px-8 xl:px-12">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl font-black text-sky-700">
            <img src="/images/logo.png" alt="Z" />
          </div>

          <div>
            <div className="text-[21px] font-black tracking-tight text-slate-950">
              ZAB<span className="text-sky-600">Welfare</span>
            </div>

            <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Live Healthy
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navigation.map((item) => (
            <div
              key={item.path}
              className="group relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1 rounded-full px-4 py-3 text-[13px] font-bold transition ${
                    isActive
                      ? "text-sky-700"
                      : "text-slate-600 hover:text-sky-700"
                  }`
                }
              >
                {item.label}

                {item.children && (
                  <ChevronDown
                    size={14}
                    className="transition-transform group-hover:rotate-180"
                  />
                )}
              </NavLink>

              {item.children && (
                <div
                  className={`invisible absolute left-0 top-full w-60 translate-y-3 rounded-2xl border border-slate-100 bg-white p-3 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
                    activeDropdown === item.label ? "visible opacity-100" : ""
                  }`}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <Link
            to="/volunteer"
            className="text-sm font-bold text-slate-700 transition hover:text-sky-700"
          >
            Volunteer
          </Link>

          <PrimaryButton to="/donate" className="px-6 py-3">
            Donate Now
          </PrimaryButton>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-xl bg-slate-100 p-3 text-slate-800 transition hover:bg-sky-100 xl:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white px-5 py-5 xl:hidden"
          >
            {navigation.map((item) => (
              <div key={item.path}>
                <div className="flex items-center justify-between">
                  <Link
                    to={item.path}
                    className="block flex-1 rounded-xl px-3 py-3 font-bold text-slate-700 hover:bg-sky-50"
                  >
                    {item.label}
                  </Link>

                  {item.children && (
                    <button
                      type="button"
                      aria-label={`Open ${item.label} submenu`}
                      onClick={() =>
                        setActiveDropdown((value) =>
                          value === item.label ? null : item.label
                        )
                      }
                      className="rounded-lg p-3 text-slate-600"
                    >
                      <ChevronDown size={18} />
                    </button>
                  )}
                </div>

                {item.children && activeDropdown === item.label && (
                  <div className="ml-4 border-l-2 border-sky-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-500 hover:text-sky-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              to="/volunteer"
              className="block rounded-xl px-3 py-3 font-bold text-slate-700"
            >
              Volunteer
            </Link>

            <PrimaryButton to="/donate" className="mt-3 w-full">
              Donate Now
            </PrimaryButton>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

// ======================================================
// 7. TOP ANNOUNCEMENT STRIP
// ======================================================

function AnnouncementBar() {
  return (
    <div className="bg-slate-950 px-4 py-2.5 text-center text-xs font-semibold text-white">
      <span className="text-sky-300">Together we can make a difference.</span>
      <span className="mx-2 text-slate-600">|</span>
      <Link to="/volunteer" className="underline underline-offset-4">
        Join our volunteer community
      </Link>
    </div>
  );
}

// ======================================================
// 8. HOMEPAGE HERO
// ======================================================

function HomeHero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(".hero-eyebrow", {
          y: 20,
          opacity: 0,
          duration: 0.6,
        })
        .from(
          ".hero-title-line",
          {
            y: 70,
            opacity: 0,
            duration: 0.9,
            stagger: 0.16,
          },
          "-=0.2"
        )
        .from(
          ".hero-description",
          {
            y: 25,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.4"
        )
        .from(
          ".hero-actions",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.4"
        )
        .from(
          ".hero-visual",
          {
            scale: 0.9,
            opacity: 0,
            duration: 1.1,
          },
          "-=0.7"
        );
    }, heroRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden bg-[#F5FAFE]"
    >
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[600px] w-[600px] rounded-full bg-sky-200/40 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-60 -left-40 -z-10 h-[500px] w-[500px] rounded-full bg-red-100/50 blur-[100px]" />

      <div className="mx-auto grid min-h-[690px] max-w-[1440px] items-center gap-8 px-5 py-20 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-24">
        <div className="relative z-10 max-w-2xl">
          <div className="hero-eyebrow mb-7 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-sky-700 shadow-sm">
            <Sparkles size={15} className="text-red-500" />
            Compassion in action
          </div>

          <h1 className="text-5xl font-black leading-[1.08] tracking-[-0.055em] text-slate-950 md:text-6xl lg:text-[76px]">
            <span className="hero-title-line block">Small Acts.</span>
            <span className="hero-title-line block text-sky-600">
              Lasting Impact.
            </span>
            <span className="hero-title-line block">Better Tomorrow.</span>
          </h1>

          <p className="hero-description mt-7 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
            We believe that a better world begins with people who care.
            Together, we turn compassion into meaningful action and work
            towards stronger, kinder communities.
          </p>

          <div className="hero-actions mt-9 flex flex-wrap gap-4">
            <PrimaryButton to="/donate">
              Support Our Mission
            </PrimaryButton>

            <SecondaryButton to="/drives">
              Explore Our Work
            </SecondaryButton>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-5 border-t border-slate-200 pt-7">
            <div className="flex -space-x-3">
              {[
                "photo-1534528741775-53994a69daeb",
                "photo-1500648767791-00dcc994a43e",
                "photo-1506794778202-cad84cf45f1d",
              ].map((photo) => (
                <img
                  key={photo}
                  src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=100&q=80`}
                  alt="Community member"
                  className="h-10 w-10 rounded-full border-[3px] border-[#F5FAFE] object-cover"
                />
              ))}
            </div>

            <div>
              <p className="text-sm font-extrabold text-slate-900">
                Powered by people who care
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Students, volunteers and communities
              </p>
            </div>
          </div>
        </div>

        <div className="hero-visual relative mx-auto w-full max-w-[600px]">
          <div className="absolute inset-8 rounded-full bg-sky-200/40 blur-3xl" />

          <div className="relative">
            <HeroScene />

            <div className="absolute left-0 top-[18%] rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur-lg md:-left-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <Heart size={22} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">
                    Give with purpose
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Every act matters
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[12%] right-0 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur-lg md:-right-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Users size={22} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">
                    Stand together
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Build stronger communities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 lg:flex">
        <ArrowDown size={14} />
        Scroll to explore
      </div>
    </section>
  );
}

// ======================================================
// 9. HOMEPAGE INTRODUCTION
// ======================================================

function HomeIntroduction() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 md:px-8 lg:grid-cols-2 lg:px-12">
        <div className="reveal-left relative">
          <div className="relative overflow-hidden rounded-[30px]">
            <img
              src={IMAGES.community}
              alt="People coming together for community service"
              className="h-[480px] w-full object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
          </div>

          <div className="absolute -bottom-7 -right-3 max-w-[260px] rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl md:-right-8">
            <HeartHandshake className="text-red-500" size={30} />
            <p className="mt-4 text-lg font-extrabold text-slate-950">
              Service with purpose.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Turning shared values into real community action.
            </p>
          </div>

          <div className="absolute -left-4 -top-5 -z-10 h-32 w-32 rounded-full border-[18px] border-sky-100" />
        </div>

        <div className="reveal-right lg:pl-6">
          <SectionHeading
            eyebrow="Who we are"
            title="A community built on compassion."
            description="ZABWelfare is a student-led welfare society associated with SZABIST. We bring students and communities together through service, awareness and meaningful initiatives."
          />

          <p className="mt-6 leading-8 text-slate-500">
            Our work is guided by the belief that every individual can
            contribute to positive change. Whether through volunteering,
            supporting a cause or sharing an idea, every effort has the
            potential to make a difference.
          </p>

          <div className="mt-9 grid grid-cols-2 gap-5">
            <div className="rounded-2xl bg-sky-50 p-5">
              <HandHeart className="text-sky-700" size={26} />
              <h3 className="mt-4 font-extrabold text-slate-900">
                Compassion
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                Helping others with care and respect.
              </p>
            </div>

            <div className="rounded-2xl bg-red-50 p-5">
              <Handshake className="text-red-500" size={26} />
              <h3 className="mt-4 font-extrabold text-slate-900">
                Collaboration
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                Working together for shared goals.
              </p>
            </div>
          </div>

          <div className="mt-9">
            <PrimaryButton to="/about">
              Discover Our Story
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// 10. OUR VALUES
// ======================================================

function ValuesSection() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description:
        "We lead with empathy and treat every person with dignity.",
    },
    {
      icon: ShieldCheck,
      title: "Responsibility",
      description:
        "We value trust, accountability and thoughtful action.",
    },
    {
      icon: Users,
      title: "Unity",
      description:
        "We believe communities become stronger when people work together.",
    },
    {
      icon: Target,
      title: "Purpose",
      description:
        "We focus our energy on initiatives that create meaningful value.",
    },
  ];

  return (
    <section className="bg-[#F5FAFE] py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <SectionHeading
          centered
          eyebrow="What guides us"
          title="The values behind every action."
          description="The principles that shape our culture, decisions and commitment to community welfare."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.div
                key={value.title}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.25 }}
                className="reveal rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:shadow-xl hover:shadow-sky-900/5"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    index % 2 === 0
                      ? "bg-sky-100 text-sky-700"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  <Icon size={27} />
                </div>

                <h3 className="mt-7 text-xl font-extrabold text-slate-950">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ======================================================
// 11. DRIVES AND INITIATIVES
// ======================================================


 
        function DriveCard({ drive }) {
  const Icon = drive.icon || HeartHandshake;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-2xl hover:shadow-sky-900/10"
    >
      <Link to={`/drives/${drive.slug}`} className="block">
        <div className="relative h-[260px] overflow-hidden">
          <img
            src={drive.image}
            alt={drive.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-sky-700 backdrop-blur">
            <Icon size={15} />
            {drive.category}
          </div>

          <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 transition group-hover:bg-red-500 group-hover:text-white">
            <ArrowUpRight size={20} />
          </div>
        </div>

        <div className="p-7">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {drive.date}
          </p>

          <h3 className="mt-3 text-xl font-extrabold text-slate-950 transition group-hover:text-sky-700">
            {drive.title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {drive.description}
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm font-extrabold text-red-500">
            Explore initiative
            <ArrowRight size={16} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function FeaturedDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/drives`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load drives");
        return res.json();
      })
      .then((data) => {
        const published = (data.drives || []).map(formatDrive);
        setDrives(published.filter((drive) => drive.featured).slice(0, 3));
      })
      .catch((error) => console.error("Featured drives:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Our initiatives"
            title="Turning compassion into action."
            description="Explore the different areas where our community comes together to make a difference."
          />

          <SecondaryButton to="/drives">
            View All Drives
          </SecondaryButton>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-slate-500">Loading initiatives...</p>
          ) : drives.length > 0 ? (
            drives.map((drive) => (
              <DriveCard key={drive.id} drive={drive} />
            ))
          ) : (
            <p className="text-slate-500">
              New initiatives will be featured here soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
// ======================================================
// 12. CAUSES SECTION
// ======================================================

function CausesSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-sky-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Where we focus"
          title="Causes worth standing for."
          description="Our areas of focus reflect the needs of people and communities. Each initiative is an opportunity to contribute with purpose."
          light
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {causes.map((cause) => {
            const Icon = cause.icon;

            return (
              <Link
                to="/causes"
                key={cause.title}
                className="reveal group rounded-3xl border border-white/10 bg-white/[0.05] p-7 transition duration-300 hover:-translate-y-2 hover:border-sky-400/50 hover:bg-white/10"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    cause.color === "red"
                      ? "bg-red-500/15 text-red-400"
                      : "bg-sky-500/15 text-sky-300"
                  }`}
                >
                  <Icon size={27} />
                </div>

                <h3 className="mt-7 text-xl font-extrabold text-white">
                  {cause.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {cause.description}
                </p>

                <div className="mt-7 flex items-center gap-2 text-sm font-bold text-sky-300 transition group-hover:text-white">
                  Learn more
                  <ArrowUpRight size={17} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ======================================================
// 13. PRESIDENT'S MESSAGE
// ======================================================

function PresidentMessage() {
  return (
    <section className="overflow-hidden bg-[#F5FAFE] py-24">
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
        <div className="reveal-left relative mx-auto w-full max-w-[440px]">
          <div className="absolute -left-5 -top-5 h-full w-full rounded-[30px] border-2 border-sky-200" />

          <img
            src="/images/president.jpg"
            alt="President portrait placeholder"
            className="relative h-[480px] w-full rounded-[30px] object-cover object-center"
          />

          <div className="absolute -bottom-5 -right-5 rounded-2xl bg-red-500 px-6 py-5 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest">
              Leadership
            </p>
            <p className="mt-1 text-xl font-extrabold">
              ZABWelfare
            </p>
          </div>
        </div>

        <div className="reveal-right">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <Quote size={28} />
          </div>

          <SectionHeading
            eyebrow="A message from leadership"
            title="Change begins when we choose to care."
          />

          <p className="mt-7 text-lg leading-9 text-slate-600">
            "A meaningful community is built not only through what we achieve
            for ourselves, but also through what we contribute to the lives of
            others. Every act of kindness, every helping hand and every
            volunteer effort can become part of something greater."
          </p>

          <p className="mt-5 leading-8 text-slate-500">
            At ZABWelfare, we aim to encourage a culture of service,
            responsibility and collective action. Together, we can create
            opportunities, support those who need help and inspire others to
            become part of positive change.
          </p>

          <div className="mt-8 border-l-4 border-red-500 pl-5">
            <p className="font-extrabold text-slate-950">
              President, ZABWelfare
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Mubashir Raza Gabol
            </p>
          </div>

          <div className="mt-8">
            <SecondaryButton to="/president">
              Read the Full Vision
            </SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// 14. VOLUNTEER CALL TO ACTION
// ======================================================

function VolunteerCTA() {
  return (
    <section className="bg-white px-5 py-24 md:px-8 lg:px-12">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[36px] bg-sky-600 px-7 py-16 md:px-14 lg:px-20">
        <div className="absolute -right-20 -top-40 h-[450px] w-[450px] rounded-full border-[70px] border-white/10" />
        <div className="absolute -bottom-48 -left-20 h-[400px] w-[400px] rounded-full bg-red-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
              <Heart size={14} />
              Be part of something meaningful
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
              Your time can change someone's tomorrow.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-sky-100">
              Join our volunteer community and contribute your skills,
              energy and compassion to initiatives that matter.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-4">
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-sky-700 transition hover:-translate-y-1 hover:bg-sky-50"
            >
              Become a Volunteer
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// 15. GALLERY PREVIEW
// ======================================================


function GalleryPreview() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch(`${API_URL}/gallery`);

        if (!response.ok) {
          throw new Error("Failed to load gallery images");
        }

        const data = await response.json();
        setGalleryImages(data.images || []);
      } catch (error) {
        console.error("Gallery preview error:", error);
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <section className="bg-[#F5FAFE] py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Moments that matter"
            title="A glimpse of our community."
            description="A collection of moments representing service, collaboration and togetherness."
          />

          <SecondaryButton to="/gallery">
            Explore Gallery
          </SecondaryButton>
        </div>

        {loading ? (
          <div className="mt-12 py-16 text-center text-slate-500">
            Loading gallery...
          </div>
        ) : galleryImages.length > 0 ? (
          <div className="mt-12 grid auto-rows-[210px] grid-cols-2 gap-4 md:grid-cols-4">
            {galleryImages.slice(0, 6).map((item, index) => (
              <Link
                to="/gallery"
                key={item._id || index}
                className={`reveal group relative overflow-hidden rounded-2xl ${
                  index === 0 || index === 5
                    ? "col-span-2 row-span-2"
                    : ""
                }`}
              >
                <img
                  src={item.image?.url}
                  alt={item.title || "ZABWelfare gallery"}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <h3 className="text-sm font-extrabold text-white md:text-base">
                    {item.title}
                  </h3>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 transition group-hover:bg-red-500 group-hover:text-white">
                    <ArrowUpRight size={17} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-12 py-16 text-center text-slate-500">
            Gallery moments will be shared here soon.
          </div>
        )}
      </div>
    </section>
  );
}

// ======================================================
// 16. NEWS PREVIEW
// ======================================================

function NewsPreview() {
  const articles = [
    {
      title: "The Power of Students Coming Together for Good",
      category: "Community",
      image: IMAGES.meeting,
    },
    {
      title: "Why Volunteering Matters in Our Communities",
      category: "Awareness",
      image: IMAGES.volunteers,
    },
    {
      title: "Small Acts of Kindness Can Create Lasting Change",
      category: "Inspiration",
      image: IMAGES.hands,
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Stories & updates"
            title="News from our community."
            description="Discover stories, updates and ideas from the world of ZABWelfare."
          />

          <SecondaryButton to="/news">
            View All News
          </SecondaryButton>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Link
              to="/news"
              key={article.title}
              className="reveal group overflow-hidden rounded-3xl border border-slate-100 bg-white transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="h-[230px] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-7">
                <span className="rounded-full bg-sky-50 px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-sky-700">
                  {article.category}
                </span>

                <h3 className="mt-5 text-xl font-extrabold leading-8 text-slate-950 transition group-hover:text-sky-700">
                  {article.title}
                </h3>

                <div className="mt-6 flex items-center gap-2 text-sm font-extrabold text-red-500">
                  Read more
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ======================================================
// 17. DONATION BANNER
// ======================================================

function DonationBanner() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      <div className="absolute inset-0 opacity-20">
        <img
          src={IMAGES.hands}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-slate-950/80" />

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <div className="reveal">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 text-white">
            <Heart size={30} />
          </div>

          <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.25em] text-sky-300">
            Make an impact
          </p>

          <h2 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">
            Be the reason someone believes in a better tomorrow.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-300">
            Your contribution can help support meaningful initiatives.
            Together, we can turn generosity into action.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <PrimaryButton to="/donate">
              Make a Contribution
            </PrimaryButton>

           <SecondaryButton
  to="/contact"
  className="border-white/30 bg-white text-slate-950 hover:bg-slate-100 hover:text-sky-700"
>
  Talk to Our Team
</SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// 18. HOMEPAGE
// ======================================================

function HomePage() {
  usePageAnimations();

  return (
    <>
      <HomeHero />
      <HomeIntroduction />
      <ValuesSection />
      <FeaturedDrives />
      <CausesSection />
      <PresidentMessage />
      <VolunteerCTA />
      <GalleryPreview />
      <NewsPreview />
      <DonationBanner />
    </>
  );
}

// ======================================================
// 19. INNER PAGE HERO
// ======================================================

function PageHero({
  eyebrow = "ZABWelfare",
  title,
  description,
  image = IMAGES.community,
}) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 py-24 md:py-32">
      <div className="absolute inset-0 -z-20">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover opacity-35"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/50" />

      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.22em] text-sky-300">
            <span className="h-[2px] w-8 bg-red-500" />
            {eyebrow}
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            {title}
          </h1>

          {description && (
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ======================================================
// 20. ABOUT PAGE
// ======================================================

function AboutPage() {
  usePageAnimations();

  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="A purpose bigger than ourselves."
        description="Discover the people, values and vision behind ZABWelfare."
        image={IMAGES.community}
      />

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 md:px-8 lg:grid-cols-2 lg:px-12">
          <div className="reveal-left">
            <SectionHeading
              eyebrow="Who we are"
              title="Driven by compassion. United by purpose."
              description="ZABWelfare is a student-led welfare society associated with SZABIST, committed to encouraging service, community involvement and positive social impact."
            />

            <p className="mt-6 leading-8 text-slate-500">
              Our activities extend beyond the university environment. We
              believe that students can play a meaningful role in addressing
              community needs, encouraging awareness and supporting people
              through collective effort.
            </p>

            <p className="mt-4 leading-8 text-slate-500">
              Through volunteer participation, community initiatives and
              partnerships, we aim to create an environment where helping
              others becomes a shared responsibility.
            </p>
          </div>

          <div className="reveal-right overflow-hidden rounded-[30px]">
            <img
              src={IMAGES.volunteers}
              alt="Volunteers working together"
              className="h-[470px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <ValuesSection />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <SectionHeading
            centered
            eyebrow="Our mission"
            title="Making service a shared responsibility."
            description="We aim to encourage volunteerism, support community welfare initiatives, promote awareness and inspire students to contribute positively to society."
          />

          <div className="mt-10">
            <PrimaryButton to="/volunteer">
              Join Our Community
            </PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
}

// ======================================================
// 21. CAUSES PAGE
// ======================================================

function CausesPage() {
  usePageAnimations();

  return (
    <>
      <PageHero
        eyebrow="Our causes"
        title="Stand with the causes that matter."
        description="Explore the areas where we hope to make a positive contribution."
        image={IMAGES.children}
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
          <SectionHeading
            centered
            eyebrow="Our areas of focus"
            title="Every cause deserves attention."
            description="Our focus areas provide opportunities for people to contribute their time, skills and resources."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {causes.map((cause) => {
              const Icon = cause.icon;

              return (
                <div
                  key={cause.title}
                  className="reveal rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-7 text-xl font-extrabold text-slate-950">
                    {cause.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {cause.description}
                  </p>

                  <Link
                    to="/drives"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-red-500"
                  >
                    Explore initiatives
                    <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <DonationBanner />
    </>
  );
}

// ======================================================
// 22. DRIVES PAGE
// ======================================================

function DrivesPage() {
  const [filter, setFilter] = useState("All");
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageAnimations([filter]);

  useEffect(() => {
    fetch(`${API_URL}/drives`)
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load drives.");
        return res.json();
      })
      .then((data) => {
        setDrives((data.drives || []).map(formatDrive));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...new Set(drives.map((drive) => drive.category)),
  ];

  const filteredDrives =
    filter === "All"
      ? drives
      : drives.filter((drive) => drive.category === filter);

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Initiatives that bring people together."
        description="Discover our community initiatives and the causes that inspire our volunteers."
        image={IMAGES.food}
      />

      <section className="bg-[#F5FAFE] py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-7">
            <SectionHeading
              eyebrow="Explore initiatives"
              title="Our drives and activities."
              description="Browse the different areas of our community work."
            />

            {!loading && drives.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFilter(category)}
                    className={`rounded-full px-5 py-3 text-xs font-bold transition ${
                      filter === category
                        ? "bg-sky-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12">
            {loading ? (
              <p className="text-center text-slate-500">
                Loading our initiatives...
              </p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : filteredDrives.length > 0 ? (
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {filteredDrives.map((drive) => (
                  <DriveCard key={drive.id} drive={drive} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-12 text-center">
                <HeartHandshake
                  size={42}
                  className="mx-auto text-sky-600"
                />
                <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                  No initiatives available yet
                </h3>
                <p className="mt-3 text-slate-500">
                  Please check back soon for our latest activities.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
// ======================================================
// 23. DRIVE DETAIL PAGE
// ======================================================

function DriveDetailPage() {
  const { slug } = useParams();

  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageAnimations([slug]);

  useEffect(() => {
    setLoading(true);
    setDrive(null);
    setError("");

    fetch(`${API_URL}/drives/${slug}`)
      .then((res) => {
        if (res.status === 404) throw new Error("Drive not found.");
        if (!res.ok) throw new Error("Unable to load this initiative.");
        return res.json();
      })
      .then((data) => {
        if (!data.drive) throw new Error("Drive not found.");
        setDrive(formatDrive(data.drive));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Loading initiative...</p>
      </div>
    );
  }

  if (error || !drive) {
    return <NotFoundPage />;
  }

  return (
    <>
      <PageHero
        eyebrow={drive.category}
        title={drive.title}
        description={drive.description}
        image={drive.image}
      />

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 md:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="reveal-left">
            <img
              src={drive.image}
              alt={drive.title}
              className="h-[400px] w-full rounded-3xl object-cover"
            />

            <h2 className="mt-10 text-3xl font-extrabold text-slate-950">
              About this initiative
            </h2>

            <p className="mt-5 leading-8 text-slate-500 whitespace-pre-line">
              {drive.fullDescription || drive.description}
            </p>

            <div className="mt-8 rounded-2xl bg-sky-50 p-6">
              <p className="text-sm font-bold text-sky-800">
                Initiative date
              </p>
              <p className="mt-2 text-slate-600">{drive.date}</p>

              {drive.location && (
                <>
                  <p className="mt-5 text-sm font-bold text-sky-800">
                    Location
                  </p>
                  <p className="mt-2 text-slate-600">
                    {drive.location}
                  </p>
                </>
              )}
            </div>
          </div>

          <aside className="reveal-right h-fit rounded-3xl bg-sky-50 p-8">
            <h3 className="text-xl font-extrabold text-slate-950">
              Be part of the initiative
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Interested in supporting this cause or participating in
              community activities?
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <PrimaryButton to="/volunteer" className="w-full">
                Volunteer
              </PrimaryButton>

              <SecondaryButton to="/contact" className="w-full">
                Contact Us
              </SecondaryButton>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
// ======================================================
// 24. PRESIDENT'S VISION PAGE
// ======================================================

function PresidentPage() {
  usePageAnimations();

  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="A vision rooted in service and humanity."
        description="The principles and aspirations that guide our commitment to community welfare."
        image={IMAGES.meeting}
      />

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="reveal-left">
            <img
              src="/images/president.jpg"
              alt="President portrait placeholder"
              className="h-[500px] w-full rounded-[30px] object-cover"
            />
          </div>

          <div className="reveal-right">
            <Quote size={45} className="text-red-500" />

            <h2 className="mt-7 text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">
              "A better society begins with people who are willing to make a
              difference."
            </h2>

            <p className="mt-7 leading-8 text-slate-500">
              ZABWelfare stands for the idea that service is not limited to
              one person, one event or one place. It is a continuous
              commitment to understanding the needs of others and responding
              with compassion.
            </p>

            <p className="mt-5 leading-8 text-slate-500">
              Our vision is to build a community where students are
              encouraged to become responsible citizens, where volunteer
              service is valued and where collaboration creates opportunities
              for meaningful change.
            </p>

            <div className="mt-9 border-l-4 border-sky-500 pl-5">
              <p className="font-extrabold text-slate-950">
                President
              </p>
              <p className="mt-1 text-sm text-slate-500">
                ZABWelfare
              </p>
            </div>
          </div>
        </div>
      </section>

      <VolunteerCTA />
    </>
  );
}

// ======================================================
// 25. TEAM PAGE
// ======================================================



function TeamPage() {
  usePageAnimations();

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/team`);

        if (!response.ok) {
          throw new Error("Unable to load team members.");
        }

        const data = await response.json();
        setTeamMembers(data.members || []);
      } catch (err) {
        setError(err.message || "Something went wrong while loading the team.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [refresh]);

  const leaders = teamMembers.filter(
    (member) =>
      member.position === "President" ||
      member.position === "Vice President"
  );

  const members = teamMembers.filter(
    (member) => member.position === "Member"
  );

  const TeamCard = ({ member }) => (
    <motion.article
      key={member._id}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group overflow-hidden rounded-2xl border border-[#E5EDF3] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="h-[320px] overflow-hidden bg-[#EAF7FF]">
        <img
          src={member.image?.url || IMAGES.volunteers}
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-[#18232D]">
          {member.name}
        </h3>

        <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[#176B9A]">
          {member.position}
        </p>

        {member.description && (
          <p className="mt-3 text-sm leading-6 text-[#64748B]">
            {member.description}
          </p>
        )}
      </div>
    </motion.article>
  );

  return (
    <>
      <PageHero
        eyebrow="Our people"
        title="Meet the people behind the purpose."
        description="A team united by the desire to serve, collaborate and contribute to the community."
        image={IMAGES.volunteers}
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">

          <SectionHeading
            centered
            eyebrow="Leadership"
            title="The people guiding our mission."
            description="Meet the President and Vice President leading our society."
          />

          {loading ? (
            <div className="py-16 text-center text-[#64748B]">
              Loading team members...
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => setRefresh((value) => value + 1)}
                className="mt-4 rounded-full bg-[#176B9A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#12577F]"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {leaders.length > 0 ? (
                <div className="mx-auto mt-14 grid max-w-3xl gap-8 sm:grid-cols-2">
                  {leaders.map((member) => (
                    <TeamCard key={member._id} member={member} />
                  ))}
                </div>
              ) : (
                <p className="mt-10 text-center text-[#64748B]">
                  Leadership profiles will be added soon.
                </p>
              )}

              <div className="mt-24">
                <SectionHeading
                  centered
                  eyebrow="Our Members"
                  title="People who make things happen."
                  description="Meet the members who contribute their time, energy and dedication to our welfare activities."
                />

                {members.length > 0 ? (
                  <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                    {members.map((member) => (
                      <TeamCard key={member._id} member={member} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-10 text-center text-[#64748B]">
                    Our team members will be introduced here soon.
                  </p>
                )}
              </div>
            </>
          )}

          <div className="mt-24 rounded-3xl bg-[#EAF7FF] px-6 py-14 text-center md:px-12">
            <h2 className="text-3xl font-semibold text-[#18232D]">
              Want to join our team?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#64748B]">
              Become part of a community that believes in helping others and
              creating meaningful change.
            </p>
            <Link
              to="/volunteer"
              className="mt-8 inline-flex rounded-full bg-[#176B9A] px-8 py-4 font-semibold text-white transition hover:bg-[#12577F]"
            >
              Become a Volunteer
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}



function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  usePageAnimations();

  useEffect(() => {
    const controller = new AbortController();

    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError("");

        const API_URL =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        const response = await fetch(`${API_URL}/gallery`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load gallery images.");
        }

        const data = await response.json();

        const images = (data.images || [])
          .filter((item) => item.image?.url)
          .map((item) => ({
            id: item._id,
            image: item.image.url,
            title: item.title,
            description: item.description || "",
            category: item.category || "General",
          }));

        setGalleryImages(images);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Gallery fetch error:", err);
          setError("Unable to load gallery images. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchGallery();

    return () => controller.abort();
  }, [retry]);

  return (
    <>
      <PageHero
        eyebrow="Our memories"
        title="Moments of kindness and togetherness."
        description="Explore the moments that represent our spirit of service and community."
        image={IMAGES.community}
      />

      <section className="bg-[#F5FAFE] py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
          <SectionHeading
            centered
            eyebrow="Photo gallery"
            title="A picture tells a story."
            description="A visual collection of community moments and activities."
          />

          {loading ? (
            <div className="mt-14 flex min-h-[250px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-[#176B9A]" />
                <p className="mt-4 text-sm text-slate-500">
                  Loading gallery images...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="mt-14 rounded-3xl border border-red-100 bg-white p-10 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => setRetry((value) => value + 1)}
                className="mt-5 rounded-xl bg-[#176B9A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12577E]"
              >
                Try Again
              </button>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="mt-14 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
              <Camera size={38} className="mx-auto text-slate-300" />

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No gallery images yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Our community moments will appear here soon.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="reveal group relative h-[300px] overflow-hidden rounded-3xl text-left"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block truncate font-extrabold text-white">
                        {item.title}
                      </span>

                      {item.category && (
                        <span className="mt-1 block text-xs text-white/75">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-900">
                      <Eye size={18} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-5"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              aria-label="Close image"
              onClick={() => setSelectedImage(null)}
              className="absolute right-6 top-6 rounded-full bg-white p-3 text-slate-950"
            >
              <X size={22} />
            </button>

            <div
              className="max-w-full text-center"
              onClick={(event) => event.stopPropagation()}
            >
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-h-[78vh] max-w-full rounded-2xl object-contain"
              />

              <h3 className="mt-4 text-lg font-bold text-white">
                {selectedImage.title}
              </h3>

              {selectedImage.description && (
                <p className="mt-2 text-sm text-white/75">
                  {selectedImage.description}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ======================================================
// 27. NEWS PAGE
// ======================================================


function NewsPage() {
  usePageAnimations();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/news`);

      if (!response.ok) {
        throw new Error("Unable to load news articles.");
      }

      const data = await response.json();
      setNews(data.news || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="News & stories"
        title="Ideas, updates and stories that inspire."
        description="Stay connected with the latest news and community updates."
        image={IMAGES.meeting}
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
          <SectionHeading
            centered
            eyebrow="Latest stories"
            title="From our community."
            description="Articles and updates about service, volunteering and community welfare."
          />

          {loading ? (
            <div className="mt-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600" />
              <p className="mt-4 text-sm text-slate-500">
                Loading latest news...
              </p>
            </div>
          ) : error ? (
            <div className="mt-14 rounded-2xl bg-red-50 p-8 text-center">
              <p className="font-semibold text-red-700">{error}</p>
              <button
                onClick={fetchNews}
                className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : news.length === 0 ? (
            <div className="mt-14 rounded-2xl bg-sky-50 px-6 py-16 text-center">
              <Newspaper
                size={38}
                className="mx-auto text-sky-600"
              />
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No news articles yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Check back soon for the latest updates from ZABWelfare.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article) => (
                <Link
                  key={article._id || article.slug}
                  to={`/news/${article.slug}`}
                  className="reveal group overflow-hidden rounded-3xl border border-slate-100 transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="relative h-[250px] overflow-hidden bg-slate-100">
                    <img
                      src={article.coverImage?.url || IMAGES.meeting}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    {article.featured && (
                      <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-7">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
                      {article.category || "General"}
                    </span>

                    <h3 className="mt-4 text-xl font-extrabold leading-8 text-slate-950 transition group-hover:text-sky-700">
                      {article.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
                      {article.excerpt}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-extrabold text-red-500">
                      Read story
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ======================================================
// 28. NEWS DETAIL PAGE
// ======================================================


function NewsDetailPage() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageAnimations([slug]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError("");
        setArticle(null);

        const response = await fetch(
          `${API_URL}/news/${encodeURIComponent(slug)}`
        );

        if (response.status === 404) {
          setError("Article not found.");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load this article.");
        }

        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600" />
          <p className="mt-4 text-sm text-slate-500">
            Loading article...
          </p>
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-white px-5">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-extrabold text-slate-950">
            {error === "Article not found."
              ? "Article not found"
              : "Unable to load article"}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {error || "This article may no longer be available."}
          </p>

          <div className="mt-6">
            <PrimaryButton to="/news">
              Back to News
            </PrimaryButton>
          </div>
        </div>
      </section>
    );
  }

  const articleImage = article.coverImage?.url || IMAGES.meeting;

  return (
    <>
      <PageHero
        eyebrow={article.category || "News & stories"}
        title={article.title}
        description={article.excerpt}
        image={articleImage}
      />

      <section className="bg-white py-24">
        <article className="mx-auto max-w-3xl px-5">
          <img
            src={articleImage}
            alt={article.title}
            className="h-[300px] w-full rounded-3xl object-cover sm:h-[400px]"
          />

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="font-bold uppercase tracking-wider text-sky-700">
                {article.category || "General"}
              </span>

              {article.publishedAt && (
                <>
                  <span>•</span>
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString(
                      "en-PK",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </>
              )}
            </div>

            <h2 className="mt-6 text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
              {article.title}
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {article.excerpt}
            </p>

            <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-500">
              {article.content}
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-sky-50 p-8">
            <h3 className="text-xl font-extrabold text-slate-950">
              Be part of the story.
            </h3>

            <p className="mt-3 leading-7 text-slate-500">
              Join our community and contribute to initiatives that matter.
            </p>

            <div className="mt-6">
              <PrimaryButton to="/volunteer">
                Get Involved
              </PrimaryButton>
            </div>
          </div>

          <div className="mt-10">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-sm font-bold text-sky-700 transition hover:text-sky-900"
            >
              <ArrowRight className="rotate-180" size={17} />
              Back to all news
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}

// ======================================================
// 29. DONATION PAGE
// ======================================================


function DonatePage() {
  usePageAnimations();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [proof, setProof] = useState(null);

  const handleDonationSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      formData.append("paymentMethod", "NayaPay");

      if (proof) {
        formData.append("paymentProof", proof);
      }

      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${API_URL}/donations`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to submit your donation."
        );
      }

      setSuccess(true);
      setProof(null);
      form.reset();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Support our mission"
        title="Your generosity can make a difference."
        description="Support meaningful welfare initiatives and help us build a stronger community."
        image={IMAGES.hands}
      />

      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHeading
            centered
            eyebrow="Make a contribution"
            title="Choose how you would like to help."
            description="Your support helps us create meaningful change in our community."
          />

          {/* Payment methods */}
          <div className="mt-14 grid gap-6 md:grid-cols-3">

            {/* NayaPay */}
            <div className="reveal rounded-3xl border-2 border-sky-200 bg-sky-50/50 p-8 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Gift size={27} />
              </div>

              <div className="mt-7 flex items-center justify-between gap-2">
                <h3 className="text-xl font-extrabold text-slate-950">
                  NayaPay
                </h3>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Available
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Send your contribution directly using the following
                NayaPay account.
              </p>

              <div className="mt-5 space-y-3 rounded-2xl bg-white p-4">
                <div>
                  <p className="text-xs text-slate-400">Account Name</p>
                  <p className="mt-1 font-bold text-slate-900">
                    Mubashir Raza
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Account Number</p>
                  <p className="mt-1 text-lg font-extrabold tracking-wide text-sky-700">
                    03093558184
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText("03093558184")
                  }
                  className="w-full rounded-xl border border-sky-100 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
                >
                  Copy Account Number
                </button>
              </div>
            </div>

            {/* JazzCash */}
            <div className="reveal rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <Phone size={27} />
              </div>

              <div className="mt-7 flex items-center justify-between gap-2">
                <h3 className="text-xl font-extrabold text-slate-950">
                  JazzCash
                </h3>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  Coming Soon
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                JazzCash payment instructions will be published
                after account verification.
              </p>
            </div>

            {/* Bank Transfer */}
            <div className="reveal rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <BriefcaseBusiness size={27} />
              </div>

              <div className="mt-7 flex items-center justify-between gap-2">
                <h3 className="text-xl font-extrabold text-slate-950">
                  Bank Transfer
                </h3>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  Coming Soon
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Official bank account information will be added
                after verification.
              </p>
            </div>
          </div>

          {/* Donation form */}
          <div
            id="donation-form"
            className="mx-auto mt-20 max-w-3xl rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100 md:p-10"
          >
            <div className="mb-8">
              <span className="text-sm font-bold uppercase tracking-wider text-sky-700">
                Make your contribution
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
                Submit your donation
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                First transfer your contribution to our NayaPay
                account. Then complete this form with your payment
                information.
              </p>
            </div>

            {success && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
                <h3 className="font-bold text-green-800">
                  Thank you for your generosity!
                </h3>
                <p className="mt-2 text-sm leading-6 text-green-700">
                  Your donation submission has been received.
                  It will remain pending until our team verifies
                  your payment.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleDonationSubmit}
              className="space-y-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="donorName"
                    required
                    maxLength={120}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="03XXXXXXXXX"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Donation Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="1"
                    step="1"
                    placeholder="Enter amount"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    value="NayaPay"
                    readOnly
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Transaction Reference
                </label>
                <input
                  type="text"
                  name="transactionReference"
                  maxLength={150}
                  placeholder="Enter your transaction ID or reference"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payment Proof (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProof(e.target.files?.[0] || null)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:font-semibold file:text-sky-700"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Upload a screenshot or image of your payment receipt.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  rows={4}
                  maxLength={1000}
                  placeholder="Leave a message or tell us what inspired your contribution..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  value="true"
                  className="mt-1 h-4 w-4 accent-sky-600"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    Make my donation anonymous
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Your name will not be displayed publicly.
                  </span>
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-sky-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting Donation..."
                  : "Submit Donation"}
              </button>

              <p className="text-center text-xs leading-6 text-slate-400">
                Your submission is not an automatic payment
                confirmation. All contributions are manually
                reviewed and verified by our team.
              </p>
            </form>
          </div>

          {/* Safety notice */}
          <div className="mt-12 rounded-3xl border border-amber-200 bg-amber-50 p-7">
            <div className="flex items-start gap-4">
              <ShieldCheck
                className="mt-1 shrink-0 text-amber-700"
                size={25}
              />

              <div>
                <h3 className="font-extrabold text-slate-900">
                  Donation safety
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Please use only the payment instructions published
                  through verified official ZABWelfare channels.
                  Never share your PIN, password, or OTP with anyone.
                  Donations are marked verified only after payment
                  confirmation by our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VolunteerCTA />
    </>
  );
}


// ======================================================
// 30. VOLUNTEER PAGE
// ======================================================


function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  usePageAnimations();

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    const form = event.currentTarget;

    const formData = new FormData(form);

    const applicationData = {
      fullName: formData.get("fullName").trim(),
      email: formData.get("email").trim(),
      phone: formData.get("phone").trim(),
      areaOfInterest: formData.get("areaOfInterest"),
      motivation: formData.get("motivation").trim(),
    };

    try {
      const response = await fetch(`${API_URL}/volunteers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit your application."
        );
      }

      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="Your journey of giving back starts here."
        description="Join our volunteer community and become part of meaningful initiatives."
        image={IMAGES.volunteers}
      />

      <section className="bg-[#F5FAFE] py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="reveal-left">
            <SectionHeading
              eyebrow="Become a volunteer"
              title="Bring your energy. Share your skills."
              description="Volunteering is an opportunity to learn, connect and contribute to your community."
            />

            <div className="mt-10 flex flex-col gap-6">
              {[
                {
                  icon: Heart,
                  title: "Make a difference",
                  text: "Contribute to meaningful community activities.",
                },
                {
                  icon: Users,
                  title: "Meet people",
                  text: "Connect with others who share your values.",
                },
                {
                  icon: Lightbulb,
                  title: "Develop skills",
                  text: "Learn through teamwork and service.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-950">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="reveal-right rounded-3xl border border-slate-100 bg-white p-7 shadow-xl md:p-10">
            {submitted ? (
              <div className="py-12 text-center">
                <CheckCircle2
                  className="mx-auto text-emerald-500"
                  size={55}
                />

                <h2 className="mt-6 text-2xl font-extrabold text-slate-950">
                  Application submitted!
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Thank you for your interest in joining ZABWelfare.
                  Your volunteer application has been received and is
                  currently pending review by our administration team.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setError("");
                  }}
                  className="mt-7 font-bold text-sky-700"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-slate-950">
                  Volunteer registration
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Share your details to express your interest.
                </p>

                {error && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Full name
                    </label>

                    <input
                      required
                      name="fullName"
                      type="text"
                      maxLength={120}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Email address
                      </label>

                      <input
                        required
                        name="email"
                        type="email"
                        maxLength={150}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Phone number
                      </label>

                      <input
                        required
                        name="phone"
                        type="tel"
                        maxLength={30}
                        placeholder="+92"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Area of interest
                    </label>

                    <select
                      required
                      name="areaOfInterest"
                      defaultValue=""
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-500"
                    >
                      <option value="" disabled>
                        Select an area
                      </option>
                      <option value="Education">Education</option>
                      <option value="Community Welfare">
                        Community Welfare
                      </option>
                      <option value="Food Support">Food Support</option>
                      <option value="Event Management">
                        Event Management
                      </option>
                      <option value="Media and Communications">
                        Media and Communications
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Why would you like to volunteer?
                    </label>

                    <textarea
                      name="motivation"
                      rows="4"
                      maxLength={2000}
                      placeholder="Tell us a little about yourself..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-red-500 px-7 py-4 font-extrabold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Submitting Application..."
                      : "Submit Interest"}

                    {!submitting && <ArrowRight size={18} />}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Your application will be reviewed by the ZABWelfare team.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// ======================================================
// 31. CONTACT PAGE
// ======================================================


function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  usePageAnimations();

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to send your message. Please try again."
        );
      }

      form.reset();
      setSubmitted(true);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Let's start a conversation."
        description="Have a question, idea or opportunity to collaborate? We would love to hear from you."
        image={IMAGES.meeting}
      />

      <section className="bg-[#F5FAFE] py-24">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="reveal-left">
            <SectionHeading
              eyebrow="Get in touch"
              title="We are here to connect."
              description="Reach out to learn more about our activities, volunteering opportunities and community initiatives."
            />

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4 rounded-2xl bg-white p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="font-extrabold text-slate-950">
                    Our affiliation
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    SZABIST, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-white p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <Camera size={22} />
                </div>
                <div>
                  <p className="font-extrabold text-slate-950">
                    Instagram
                  </p>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-sm text-sky-700 hover:underline"
                  >
                    @zabwelfare_official
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal-right rounded-3xl bg-white p-7 shadow-xl md:p-10">
            {submitted ? (
              <div className="py-12 text-center">
                <CheckCircle2
                  size={55}
                  className="mx-auto text-emerald-500"
                />
                <h2 className="mt-6 text-2xl font-extrabold text-slate-950">
                  Message sent successfully!
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Thank you for contacting ZABWelfare. Your message has been
                  received. Our team will get back to you as soon as possible.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setError("");
                  }}
                  className="mt-7 rounded-full bg-sky-600 px-7 py-3 font-bold text-white transition hover:bg-sky-700"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-slate-950">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Fill in the form below and our team will be in touch.
                </p>

                {error && (
                  <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Your name
                    </label>
                    <input
                      required
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={100}
                      placeholder="Full name"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Email
                    </label>
                    <input
                      required
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={150}
                      placeholder="Email address"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Subject
                    </label>
                    <input
                      required
                      name="subject"
                      type="text"
                      maxLength={150}
                      placeholder="How can we help?"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Message
                    </label>
                    <textarea
                      required
                      name="message"
                      rows="5"
                      maxLength={5000}
                      placeholder="Write your message..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-sky-600 px-7 py-4 font-extrabold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Sending message..." : "Send Message"}
                    {!submitting && <Send size={18} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}


// ======================================================
// 32. POLICY PAGES
// ======================================================

function PolicyPage({ title, intro, sections }) {
  usePageAnimations();

  return (
    <>
      <PageHero
        eyebrow="Website information"
        title={title}
        description={intro}
        image={IMAGES.nature}
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          {sections.map((section) => (
            <div key={section.title} className="reveal mb-10">
              <h2 className="text-xl font-extrabold text-slate-950">
                {section.title}
              </h2>

              <p className="mt-4 leading-8 text-slate-500">
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="Information about how website information and submitted details are intended to be handled."
      sections={[
        {
          title: "Information we collect",
          text: "When our contact or volunteer forms are connected, we may collect information voluntarily provided by visitors, such as names, contact details and messages.",
        },
        {
          title: "How information is used",
          text: "Information may be used to respond to enquiries, coordinate volunteer activities and communicate about relevant initiatives.",
        },
        {
          title: "Information protection",
          text: "We aim to use appropriate technical and organisational safeguards to protect information handled through our website.",
        },
        {
          title: "Contact",
          text: "For privacy-related questions, please contact the ZABWelfare team through the official communication channels.",
        },
      ]}
    />
  );
}

function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro="The general terms governing the use of the ZABWelfare website."
      sections={[
        {
          title: "Website use",
          text: "Visitors should use this website responsibly and should not attempt to disrupt its operation or misuse its content.",
        },
        {
          title: "Content",
          text: "Website information is provided for general informational purposes and may be updated as activities and organisational details change.",
        },
        {
          title: "External links",
          text: "External websites may have their own terms and privacy policies. ZABWelfare is not responsible for third-party website content.",
        },
        {
          title: "Updates",
          text: "These terms may be revised as the website and organisation's activities develop.",
        },
      ]}
    />
  );
}

function DonationPolicyPage() {
  return (
    <PolicyPage
      title="Donation Policy"
      intro="Guidance about donations and the responsible handling of contributions."
      sections={[
        {
          title: "Verified payment details",
          text: "Only use donation channels and account details published through verified official ZABWelfare communication channels.",
        },
        {
          title: "Donation acknowledgement",
          text: "Donation acknowledgement and receipts should be provided through the organisation's verified process once implemented.",
        },
        {
          title: "Use of contributions",
          text: "Contributions should be directed towards the stated welfare activities and organisational purposes.",
        },
        {
          title: "Questions",
          text: "Contact the organisation for clarification about donation arrangements before transferring funds.",
        },
      ]}
    />
  );
}

// ======================================================
// 33. DONATION RESULT PAGES
// ======================================================

function DonationResultPage({ success }) {
  return (
    <section className="flex min-h-[65vh] items-center justify-center bg-[#F5FAFE] px-5 py-20">
      <div className="max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            success
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {success ? (
            <CheckCircle2 size={34} />
          ) : (
            <X size={34} />
          )}
        </div>

        <h1 className="mt-7 text-3xl font-extrabold text-slate-950">
          {success ? "Donation status" : "Donation not completed"}
        </h1>

        <p className="mt-4 leading-8 text-slate-500">
          {success
            ? "This page is a placeholder. A donation will only be confirmed after the payment provider verifies the transaction."
            : "No successful donation has been confirmed. If you believe a payment was made, please contact our team."}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PrimaryButton to="/">
            Return Home
          </PrimaryButton>

          <SecondaryButton to="/contact">
            Contact Us
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// 34. 404 PAGE
// ======================================================

function NotFoundPage() {
  return (
    <section className="flex min-h-[65vh] items-center justify-center bg-[#F5FAFE] px-5 py-20">
      <div className="max-w-xl text-center">
        <div className="text-8xl font-black tracking-tighter text-sky-200">
          404
        </div>

        <h1 className="mt-5 text-3xl font-extrabold text-slate-950">
          This page could not be found.
        </h1>

        <p className="mt-4 leading-7 text-slate-500">
          The page you are looking for may have moved or may no longer be
          available.
        </p>

        <div className="mt-8">
          <PrimaryButton to="/">
            Return to Homepage
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// 35. FOOTER
// ======================================================

function Footer() {
  return (
    <footer className="bg-[#101D2B] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:px-12">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-2xl font-black">
              Z
            </div>

            <div>
              <div className="text-xl font-black">
                ZAB<span className="text-sky-400">Welfare</span>
              </div>

              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Live Healthy
              </div>
            </div>
          </Link>

          <p className="mt-7 max-w-sm text-sm leading-8 text-slate-400">
            A student-led welfare society associated with SZABIST, bringing
            people together through service, compassion and community action.
          </p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-sky-300 transition hover:border-sky-400 hover:bg-white/5"
          >
            <Camera size={17} />
            Follow our journey
            <ExternalLink size={14} />
          </a>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
            Explore
          </h3>

          <div className="mt-7 flex flex-col gap-4 text-sm text-slate-400">
            <Link to="/about" className="transition hover:text-sky-300">
              About Us
            </Link>

            <Link to="/causes" className="transition hover:text-sky-300">
              Our Causes
            </Link>

            <Link to="/drives" className="transition hover:text-sky-300">
              Our Drives
            </Link>

            <Link to="/team" className="transition hover:text-sky-300">
              Our Team
            </Link>

            <Link to="/gallery" className="transition hover:text-sky-300">
              Gallery
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
            Get involved
          </h3>

          <div className="mt-7 flex flex-col gap-4 text-sm text-slate-400">
            <Link to="/volunteer" className="transition hover:text-sky-300">
              Become a Volunteer
            </Link>

            <Link to="/donate" className="transition hover:text-sky-300">
              Make a Donation
            </Link>

            <Link to="/news" className="transition hover:text-sky-300">
              News & Stories
            </Link>

            <Link to="/president" className="transition hover:text-sky-300">
              President's Vision
            </Link>

            <Link to="/contact" className="transition hover:text-sky-300">
              Contact Us
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
            Contact
          </h3>

          <div className="mt-7 space-y-5 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 shrink-0 text-sky-400" size={18} />
              <span>SZABIST, Pakistan</span>
            </div>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 transition hover:text-sky-300"
            >
              <Camera className="text-sky-400" size={18} />
              @zabwelfare_official
            </a>

            <Link
              to="/contact"
              className="flex items-center gap-3 transition hover:text-sky-300"
            >
              <Mail className="text-sky-400" size={18} />
              Send an enquiry
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 px-5 py-7 text-xs text-slate-500 md:flex-row md:items-center md:px-8 lg:px-12">
          <p>
            © {new Date().getFullYear()} ZABWelfare. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>

            <Link to="/terms" className="hover:text-white">
              Terms & Conditions
            </Link>

            <Link to="/donation-policy" className="hover:text-white">
              Donation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ======================================================
// 36. SCROLL TO TOP
// ======================================================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

// ======================================================
// 37. MAIN WEBSITE LAYOUT AND ROUTING
// ======================================================

function WebsiteLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900">
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/about" element={<AboutPage />} />

          <Route path="/causes" element={<CausesPage />} />

          <Route path="/drives" element={<DrivesPage />} />

          <Route
            path="/drives/:slug"
            element={<DriveDetailPage />}
          />

          <Route path="/president" element={<PresidentPage />} />

          <Route path="/team" element={<TeamPage />} />

          <Route path="/gallery" element={<GalleryPage />} />

          <Route path="/news" element={<NewsPage />} />

          <Route
            path="/news/:slug"
            element={<NewsDetailPage />}
          />

          <Route path="/donate" element={<DonatePage />} />

          <Route path="/volunteer" element={<VolunteerPage />} />

          <Route path="/contact" element={<ContactPage />} />

          <Route
            path="/privacy-policy"
            element={<PrivacyPage />}
          />

          <Route path="/terms" element={<TermsPage />} />

          <Route
            path="/donation-policy"
            element={<DonationPolicyPage />}
          />

          <Route
            path="/donation-success"
            element={<DonationResultPage success />}
          />

          <Route
            path="/donation-failed"
            element={<DonationResultPage success={false} />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// ======================================================
// 38. APPLICATION ENTRY
// ======================================================


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<WebsiteLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
