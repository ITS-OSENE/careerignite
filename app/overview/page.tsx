import Link from "next/link";
import { FiArrowUpRight, FiCheckCircle, FiCompass, FiExternalLink, FiMessageCircle, FiSearch, FiTarget } from "react-icons/fi";
import SignInSuccessBanner from "../components/SignInSuccessBanner";

const milestones = [
  { label: "Choose your area", detail: "Start with the city, neighborhood, and commute that work for your life.", done: true },
  { label: "Scan nearby openings", detail: "Compare local employers, roles, skills, and salary signals.", done: true },
  { label: "Meet local people", detail: "Trade context with people who know the employers in your area.", done: false },
  { label: "Make the introduction", detail: "Turn local knowledge into a focused application or referral.", done: false },
];

export default function OverviewPage() {
  return (
    <main data-theme="overview" className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SignInSuccessBanner />
      <section className="border-b border-[var(--borders)] bg-[var(--navbar)] px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-accent)]"><span>Workspace / Overview</span><span className="inline-flex items-center gap-2 text-[var(--secondary-text)]"><span className="h-2 w-2 rounded-full bg-[var(--primary-accent)]" /> Personal route map</span></div>
          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_0.7fr] lg:items-end"><div><h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-8xl">Find work where you <span className="text-[var(--primary-accent)]">live.</span></h1><p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--secondary-text)]">A calm place to discover nearby employers, compare local openings, and take the next step without leaving your community behind.</p></div><div className="border-l border-[var(--borders)] pl-6"><p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--secondary-text)]">Local search</p><p className="mt-3 text-2xl font-black">You are 2 of 4 moves in.</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--cards)]"><div className="h-full w-1/2 bg-[var(--primary-accent)]" /></div><p className="mt-3 text-xs text-[var(--secondary-text)]">The next unlock is a local introduction.</p></div></div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:px-12 md:py-16 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="border border-[var(--borders)] bg-[var(--cards)] p-6 md:p-8"><div className="flex items-center justify-between gap-4 border-b border-[var(--borders)] pb-5"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary-accent)]">Route map</p><h2 className="mt-2 text-2xl font-black">A practical sequence</h2></div><FiCompass className="text-[var(--primary-accent)]" size={24} /></div><div className="mt-8 space-y-6">{milestones.map((milestone, index) => <div key={milestone.label} className="flex gap-4"><div className="flex flex-col items-center"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${milestone.done ? "bg-[var(--primary-accent)] text-[var(--navbar)]" : "border border-[var(--borders)] text-[var(--secondary-text)]"}`}>{milestone.done ? <FiCheckCircle size={16} /> : index + 1}</span>{index < milestones.length - 1 && <span className="mt-2 h-full w-px bg-[var(--borders)]" />}</div><div className="pb-5"><h3 className="font-bold">{milestone.label}</h3><p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--secondary-text)]">{milestone.detail}</p></div></div>)}</div><Link href="/map" className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-accent)]">Open a world map <FiExternalLink size={15} /></Link></div>
        <aside className="space-y-6"><div className="border border-[var(--borders)] bg-[var(--light-accent)] p-6"><FiTarget className="text-[var(--primary-accent)]" size={24} /><h2 className="mt-6 text-2xl font-black">Choose one action.</h2><p className="mt-3 text-sm leading-relaxed text-[var(--secondary-text)]">Momentum gets easier when the task is small enough to finish today.</p><div className="mt-6 space-y-2"><Link href="/job-research" className="flex items-center justify-between border border-[var(--borders)] bg-[var(--cards)] px-4 py-3 text-sm font-bold transition hover:border-[var(--primary-accent)]">Scan roles <FiSearch size={16} /></Link><Link href="/community-hub" className="flex items-center justify-between border border-[var(--borders)] bg-[var(--cards)] px-4 py-3 text-sm font-bold transition hover:border-[var(--primary-accent)]">Ask the room <FiMessageCircle size={16} /></Link></div></div><div className="border border-[var(--borders)] bg-[var(--cards)] p-6"><p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--secondary-text)]">This week</p><p className="mt-3 text-4xl font-black">3</p><p className="mt-1 text-sm text-[var(--secondary-text)]">focused actions logged</p><Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-accent)]">Back to home <FiArrowUpRight size={15} /></Link></div></aside>
      </section>
    </main>
  );
}
