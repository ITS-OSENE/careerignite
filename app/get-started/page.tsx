import Link from "next/link";
import { FiArrowRight, FiMapPin, FiMessageCircle, FiSearch, FiUserPlus } from "react-icons/fi";

const steps = [
  { number: "01", icon: FiMapPin, title: "Choose your area", copy: "Start with the city or neighborhood where you want your next opportunity to happen." },
  { number: "02", icon: FiSearch, title: "Find nearby work", copy: "Compare local openings by employer, commute, work style, and the skills you already have." },
  { number: "03", icon: FiMessageCircle, title: "Meet the people", copy: "Ask for context, find referrals, and make a stronger introduction through the local community." },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative overflow-hidden bg-[var(--navbar)] px-6 py-16 text-[var(--navbar-foreground)] md:px-12 md:py-24">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[52px] border-[var(--primary-accent)]/30" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-5 text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-accent)]"><span>Career-Ignite / Start here</span><Link href="/" className="text-[var(--secondary-text)] hover:text-[var(--navbar-foreground)]">Back home</Link></div>
          <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div><p className="text-sm font-bold text-[var(--secondary-text)]">A local-first career search</p><h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.92] tracking-tight md:text-8xl">Start closer to <span className="text-[var(--primary-accent)]">home.</span></h1><p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--secondary-text)]">Career-Ignite helps you find good work nearby, understand the employers around you, and build the local relationships that make opportunity easier to reach.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/job-research" className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-accent)] px-6 py-3 text-sm font-black text-[var(--navbar)] transition hover:brightness-110">Find local jobs <FiArrowRight size={16} /></Link><Link href="/signin" className="inline-flex items-center gap-2 rounded-full border border-[var(--borders)] px-6 py-3 text-sm font-bold text-[var(--navbar-foreground)] transition hover:border-[var(--primary-accent)]"><FiUserPlus size={16} /> Create a workspace</Link></div></div>
            <div className="border-l border-[var(--borders)] pl-6"><FiMapPin className="text-[var(--primary-accent)]" size={27} /><p className="mt-6 text-2xl font-black">Four cities. One clear starting point.</p><p className="mt-3 text-sm leading-relaxed text-[var(--secondary-text)]">Search Seattle, Austin, New York, and Chicago today, then use the community to widen your local reach.</p></div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20"><div className="mb-10"><p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-accent)]">Your first three moves</p><h2 className="mt-3 text-3xl font-black md:text-5xl">Useful from the first click.</h2></div><div className="grid gap-5 md:grid-cols-3">{steps.map(({ number, icon: Icon, title, copy }) => <article key={number} className="border border-[var(--borders)] bg-[var(--cards)] p-6 md:p-8"><div className="flex items-center justify-between"><span className="text-xs font-black tracking-[0.18em] text-[var(--primary-accent)]">{number}</span><Icon className="text-[var(--primary-accent)]" size={23} /></div><h3 className="mt-16 text-2xl font-black">{title}</h3><p className="mt-3 text-sm leading-relaxed text-[var(--secondary-text)]">{copy}</p></article>)}</div></section>
      <section className="border-t border-[var(--borders)] bg-[var(--light-accent)] px-6 py-12 md:px-12"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary-accent)]">Not sure where to begin?</p><h2 className="mt-2 text-3xl font-black">See the route map first.</h2></div><Link href="/overview" className="inline-flex items-center gap-2 text-sm font-black text-[var(--primary-accent)]">Open overview <FiArrowRight size={16} /></Link></div></section>
    </main>
  );
}
