import Link from "next/link";
import { FiArrowUpRight, FiCompass, FiMessageCircle, FiSearch, FiUsers } from "react-icons/fi";

const panels = [
  { href: "/job-research", label: "01 / Local jobs", title: "Find work close to home.", copy: "Search nearby openings by city, commute, company, and skill, then follow every opportunity to its source.", icon: FiSearch, accent: "#b8d8d5" },
  { href: "/community-hub", label: "02 / Local network", title: "Meet people in your area.", copy: "Ask sharper questions, find local referrals, and connect with people building careers near you.", icon: FiMessageCircle, accent: "#9fc4d8" },
  { href: "/the-team", label: "03 / Local employers", title: "Know who is hiring nearby.", copy: "Learn about the people and employers shaping opportunity in your city and surrounding communities.", icon: FiUsers, accent: "#d9c49a" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f6f8] text-[#102033] selection:bg-[#b8d8d5] selection:text-[#102033]">
      <section className="relative border-b border-[#102033]/15 px-6 pb-16 pt-14 md:px-12 md:pb-24 md:pt-20">
        <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full border-[70px] border-[#b8d8d5]/50" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-px w-1/2 bg-[#102033]/20" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-start justify-between gap-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#416477]">Career-Ignite / 2026</p>
            <Link href="/signin" className="hidden items-center gap-2 text-xs font-black uppercase tracking-[0.16em] md:flex">Enter workspace <FiArrowUpRight size={15} /></Link>
          </div>

          <div className="mt-20 grid items-end gap-12 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <p className="mb-6 max-w-xl text-sm font-semibold leading-relaxed text-[#416477]">Local jobs, local employers, and the people who can help you get your foot in the door.</p>
              <h1 className="max-w-5xl text-6xl font-black leading-[0.9] tracking-[-0.06em] sm:text-8xl lg:text-[9.5rem]">Find good work <span className="text-[#2c7a7b]">nearby.</span></h1>
            </div>
            <div className="max-w-sm border-l-2 border-[#102033] pl-6 pb-2">
              <p className="text-lg font-semibold leading-relaxed">Discover openings around you, understand the employers behind them, and turn local knowledge into your next opportunity.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/map" className="inline-flex items-center gap-2 rounded-full bg-[#0b1f33] px-5 py-3 text-sm font-bold text-[#f4f6f8] transition hover:bg-[#173b58]">Open your map <FiCompass size={16} /></Link>
                <Link href="/job-research" className="inline-flex items-center gap-2 rounded-full border border-[#102033]/30 px-5 py-3 text-sm font-bold transition hover:border-[#102033]">Browse roles <FiArrowUpRight size={16} /></Link>
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-3 border-t border-[#102033]/20 pt-3 sm:grid-cols-3">
            {[["4", "Local job routes"], ["12 min", "Average reply time"], ["2.4K", "People in your network"]].map(([value, label]) => (
              <div key={label} className="flex items-baseline justify-between border-b border-[#102033]/15 py-4 sm:block sm:border-0">
                <p className="text-3xl font-black tracking-tight">{value}</p><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#607487]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#607487]">Your working surface</p><h2 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Choose a useful door.</h2></div><p className="max-w-xs text-sm font-semibold leading-relaxed text-[#607487]">No endless feed. No vague inspiration. Just the next place to look.</p></div>
        <div className="grid gap-4 lg:grid-cols-3">
          {panels.map(({ href, label, title, copy, icon: Icon, accent }) => (
            <Link key={href} href={href} className="group flex min-h-[320px] flex-col justify-between border border-[#102033]/20 bg-white p-6 transition hover:-translate-y-1 hover:border-[#2c7a7b]/70 md:p-8">
              <div><div className="flex items-center justify-between"><span className="text-xs font-black uppercase tracking-[0.16em] text-[#607487]">{label}</span><span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: accent }}><Icon size={18} /></span></div><h3 className="mt-16 max-w-xs text-3xl font-black leading-tight tracking-tight">{title}</h3><p className="mt-4 max-w-sm text-sm leading-relaxed text-[#607487]">{copy}</p></div>
              <span className="mt-8 flex items-center gap-2 text-sm font-black">Open space <FiArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#0b1f33] px-6 py-16 text-[#f4f6f8] md:px-12 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#b8d8d5]">A better local search</p><div><h2 className="max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">The right opportunity may be closer than you think.</h2><div className="mt-8 flex flex-wrap gap-3"><Link href="/job-research" className="rounded-full bg-[#b8d8d5] px-6 py-3 text-sm font-black text-[#0b1f33] transition hover:bg-[#d7ecea]">Find local jobs</Link><Link href="/community-hub" className="rounded-full border border-[#f4f6f8]/30 px-6 py-3 text-sm font-bold transition hover:border-[#f4f6f8]">Meet local people</Link></div></div></div>
      </section>

    </main>
  );
}