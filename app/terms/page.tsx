import Link from "next/link";
import { FiArrowLeft, FiFileText } from "react-icons/fi";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="bg-[var(--navbar)] px-6 py-16 text-[var(--navbar-foreground)] md:px-12 md:py-24"><div className="mx-auto max-w-4xl"><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--secondary-text)]"><FiArrowLeft size={15} /> Back home</Link><div className="mt-16 flex items-start gap-5"><FiFileText className="mt-1 text-[var(--primary-accent)]" size={28} /><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-accent)]">Guidelines / Terms</p><h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">Keep the opportunity useful.</h1><p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--secondary-text)]">The simple rules for using a local job and community service responsibly.</p></div></div></div></section>
      <section className="mx-auto max-w-4xl space-y-8 px-6 py-12 md:px-12 md:py-20"><article className="border-b border-[var(--borders)] pb-8"><h2 className="text-2xl font-black">Use accurate information</h2><p className="mt-3 leading-relaxed text-[var(--secondary-text)]">Represent yourself honestly and keep any profile or opportunity details you publish current.</p></article><article className="border-b border-[var(--borders)] pb-8"><h2 className="text-2xl font-black">Treat people locally and online with respect</h2><p className="mt-3 leading-relaxed text-[var(--secondary-text)]">No harassment, discrimination, impersonation, spam, or misleading job offers. Report anything that puts people at risk.</p></article><article><h2 className="text-2xl font-black">Verify before you act</h2><p className="mt-3 leading-relaxed text-[var(--secondary-text)]">Career-Ignite helps with discovery. Employers, pay, commute details, and application requirements should be confirmed directly before sharing sensitive information.</p></article></section>
    </main>
  );
}
