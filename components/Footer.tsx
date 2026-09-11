"use client";

import Link from "next/link";
import { FormEvent } from "react";

export default function ProfessionalFooter() {
  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <footer className="relative overflow-hidden border-t border-[var(--borders)] bg-[var(--navbar)] px-6 pb-12 pt-16 font-sans text-[var(--navbar-foreground)] lg:px-12">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[800px] -translate-x-1/2 rounded-full bg-[var(--primary-accent)]/10 blur-[140px]" />
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 border-b border-[var(--borders)] pb-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-accent)] font-black text-[var(--navbar)] shadow-md">CI</div><span className="text-lg font-extrabold tracking-wider">Career-Ignite</span></div>
          <p className="max-w-sm text-xs leading-relaxed text-[var(--secondary-text)]">Helping people find local work, understand nearby employers, and build the relationships that make opportunity easier to reach.</p>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--borders)] bg-[var(--cards)] px-3 py-1 text-[10px] font-mono text-[var(--primary-accent)]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--primary-accent)]" /> Local opportunity desk online</div>
        </div>

        <div className="space-y-4"><h4 className="text-xs font-bold uppercase tracking-widest text-[var(--navbar-foreground)]">// Explore</h4><ul className="space-y-2.5 text-xs text-[var(--secondary-text)]"><li><Link href="/" className="transition hover:text-[var(--navbar-foreground)]">Home</Link></li><li><Link href="/job-research" className="transition hover:text-[var(--navbar-foreground)]">Local job search</Link></li><li><Link href="/community-hub" className="transition hover:text-[var(--navbar-foreground)]">Community hub</Link></li><li><Link href="/the-team" className="transition hover:text-[var(--navbar-foreground)]">Local employers</Link></li><li><Link href="/get-started" className="transition hover:text-[var(--navbar-foreground)]">Get started</Link></li></ul></div>

        <div className="space-y-4"><h4 className="text-xs font-bold uppercase tracking-widest text-[var(--navbar-foreground)]">// Trust</h4><ul className="space-y-2.5 text-xs text-[var(--secondary-text)]"><li><Link href="/privacy" className="transition hover:text-[var(--navbar-foreground)]">Privacy policy</Link></li><li><Link href="/terms" className="transition hover:text-[var(--navbar-foreground)]">Terms of service</Link></li><li><Link href="/contact" className="transition hover:text-[var(--navbar-foreground)]">Contact support</Link></li></ul></div>

        <div className="space-y-4"><h4 className="text-xs font-bold uppercase tracking-widest text-[var(--navbar-foreground)]">// Stay nearby</h4><p className="text-xs leading-relaxed text-[var(--secondary-text)]">Receive local hiring signals and practical job-search notes.</p><form onSubmit={handleSubscribe} className="space-y-2"><label htmlFor="footer-email" className="sr-only">Professional email</label><input id="footer-email" type="email" required placeholder="Your professional email" className="w-full rounded-xl border border-[var(--borders)] bg-[var(--cards)] px-3 py-2.5 text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--primary-accent)]" /><button type="submit" className="w-full rounded-xl bg-[var(--primary-accent)] py-2.5 text-xs font-bold text-[var(--navbar)] transition hover:brightness-110">Subscribe</button></form></div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 pt-8 text-xs text-[var(--secondary-text)] sm:flex-row"><p>© {new Date().getFullYear()} Career-Ignite. All rights reserved.</p><div className="flex items-center gap-5"><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="transition hover:text-[var(--navbar-foreground)]">LinkedIn</a><a href="https://github.com" target="_blank" rel="noreferrer" className="transition hover:text-[var(--navbar-foreground)]">GitHub</a><Link href="/contact" className="transition hover:text-[var(--navbar-foreground)]">Contact</Link></div></div>
    </footer>
  );
}
