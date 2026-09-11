import Link from "next/link";
import { FiArrowLeft, FiShield } from "react-icons/fi";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="bg-[var(--navbar)] px-6 py-16 text-[var(--navbar-foreground)] md:px-12 md:py-24">
        <div className="mx-auto max-w-4xl"><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--secondary-text)]"><FiArrowLeft size={15} /> Back home</Link><div className="mt-16 flex items-start gap-5"><FiShield className="mt-1 text-[var(--primary-accent)]" size={28} /><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-accent)]">Trust / Privacy</p><h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">Your search stays yours.</h1><p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--secondary-text)]">A plain-language overview of how Career-Ignite handles information while you look for local work.</p></div></div></div>
      </section>
      <section className="mx-auto max-w-4xl space-y-8 px-6 py-12 md:px-12 md:py-20"><article className="border-b border-[var(--borders)] pb-8"><h2 className="text-2xl font-black">What we use</h2><p className="mt-3 leading-relaxed text-[var(--secondary-text)]">We use information you provide, such as your username, chosen area, saved searches, and conversations, to help surface nearby opportunities and relevant community activity.</p></article><article className="border-b border-[var(--borders)] pb-8"><h2 className="text-2xl font-black">What we do not do</h2><p className="mt-3 leading-relaxed text-[var(--secondary-text)]">We do not sell your personal information. We do not promise that a listing is still available, and we encourage you to verify every employer and opportunity before applying.</p></article><article><h2 className="text-2xl font-black">Your control</h2><p className="mt-3 leading-relaxed text-[var(--secondary-text)]">You can stop using the service at any time and ask questions about the information associated with your account.</p></article></section>
    </main>
  );
}
