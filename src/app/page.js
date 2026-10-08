import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Mail,
  ArrowRight,
  BadgeCheck,
  Activity,
  Lock,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

const portals = [
  {
    href: "/login",
    label: "Student Portal",
    icon: GraduationCap,
    ring: "from-indigo-500 to-indigo-300",
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-700",
    iconBorder: "border-indigo-100",
    ctaText: "text-indigo-700",
    ctaHover: "group-hover:border-indigo-200",
  },
  {
    href: "/faculty/login",
    label: "Faculty Portal",
    icon: Users,
    ring: "from-slate-500 to-slate-300",
    iconBg: "bg-slate-100",
    iconText: "text-slate-700",
    iconBorder: "border-slate-200",
    ctaText: "text-slate-700",
    ctaHover: "group-hover:border-slate-300",
  },
  {
    href: "/admin/login",
    label: "Admin Portal",
    icon: ShieldCheck,
    ring: "from-slate-800 to-slate-600",
    iconBg: "bg-slate-800",
    iconText: "text-white",
    iconBorder: "border-slate-700",
    ctaText: "text-slate-900",
    ctaHover: "group-hover:border-slate-400",
  },
];

const highlights = [
  { icon: BadgeCheck, label: "Verified Achievements" },
  { icon: Activity, label: "Real-Time Tracking" },
  { icon: Lock, label: "Role-Based Access" },
];

export default function HomeLandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden flex flex-col">
      {/* --- AMBIENT GLASS BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-12%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-200/40 rounded-full blur-[130px]" />
        <div className="absolute top-[15%] right-[-12%] w-[55vw] h-[55vw] bg-slate-300/40 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-25%] left-[15%] w-[50vw] h-[50vw] bg-blue-100/50 rounded-full blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-2xl border-b border-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 bg-white rounded-xl shadow-sm ring-1 ring-slate-900/5 p-1 flex items-center justify-center">
              <Image src="/logo1.jpeg" alt="BPIT Logo" fill className="object-contain p-1.5" priority />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight leading-none text-slate-900">BPIT</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                S.A.M.S
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN --- */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col items-center justify-center pt-25 pb-18">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Student Achievement <br />
            <span className="bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              Management System
            </span>
          </h2>

          {/* Highlight pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white rounded-full px-4 py-2 shadow-sm"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-700">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Portals */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {portals.map(({ href, label, icon: Icon, ring, iconBg, iconText, iconBorder, ctaText, ctaHover }) => (
            <Link
              key={href}
              href={href}
              className="group relative bg-white/50 backdrop-blur-2xl border border-white rounded-2xl p-7 shadow-lg shadow-slate-200/50 hover:-translate-y-1.5 hover:bg-white/80 hover:shadow-xl hover:shadow-slate-300/40 transition-all duration-300 overflow-hidden flex flex-col items-center text-center"
            >
              <div
                className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${ring} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div
                className={`relative w-16 h-16 rounded-2xl ${iconBg} border ${iconBorder} ${iconText} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{label}</h3>

              <div
                className={`mt-auto flex items-center text-sm font-bold ${ctaText} bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm relative ${ctaHover} transition-colors`}
              >
                Access Portal <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 w-full bg-white/60 backdrop-blur-2xl border-t border-white py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col xl:flex-row items-center justify-between gap-6">
          <div className="text-sm font-semibold text-slate-500 text-center xl:text-left">
            &copy; {new Date().getFullYear()} Bhagwan Parshuram Institute of Technology. <br className="hidden xl:block" />
            All rights reserved.
          </div>

          <div className="flex flex-col items-center xl:items-end gap-3.5">
            {/* Developers Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Developed by:</span>

              {[
                { name: "Yash Bhardwaj", li: "bhardwajjyash", mail: "yashbhardwajj01@gmail.com" },
                { name: "Janit Berwal", li: "janit-berwal", mail: "janit.berwal@gmail.com" },
              ].map((dev, i) => (
                <div key={dev.name} className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900">{dev.name}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://linkedin.com/in/${dev.li}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                        title={`${dev.name.split(" ")[0]}'s LinkedIn`}
                      >
                        <FaLinkedin className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${dev.mail}`}
                        className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm"
                        title={`${dev.name.split(" ")[0]}'s Email`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  {i === 0 && <div className="hidden sm:block w-px h-5 bg-slate-300" />}
                </div>
              ))}
            </div>

            {/* Supervisors Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Supervised by:</span>

              {[
                { name: "Manoj Kumar Gupta" },
                { name: "Aman Dureja" },
              ].map((supervisor, i) => (
                <div key={supervisor.name} className="flex items-center gap-4 sm:gap-6">
                  <span className="text-sm font-bold text-slate-800 bg-slate-100/70 border border-slate-200/80 px-3 py-1 rounded-lg">
                    {supervisor.name}
                  </span>
                  {i === 0 && <div className="hidden sm:block w-px h-5 bg-slate-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}