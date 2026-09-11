import Link from "next/link";
import { FiArrowLeft, FiInstagram, FiMail, FiMessageCircle, FiPhoneCall } from "react-icons/fi";

const contactChannels = [
  { 
    icon: FiPhoneCall, 
    title: "Direct Call", 
    copy: "Reach our support line directly for immediate inquiries and local assistance.", 
    actionLabel: "08025022816", 
    href: "tel:08025022816" 
  },
  { 
    icon: FiMessageCircle, 
    title: "WhatsApp", 
    copy: "Chat with our support team instantly on WhatsApp for quick guidance.", 
    actionLabel: "+234 903 798 1942", 
    href: "https://wa.me/2349037981942" 
  },
  { 
    icon: FiMail, 
    title: "Email Support", 
    copy: "Send us a detailed message regarding partnerships, accounts, or workspace feedback.", 
    actionLabel: "aburimeansatasia.009@gmail.com", 
    href: "mailto:aburimeansatasia.009@gmail.com" 
  },
  { 
    icon: FiInstagram, 
    title: "Instagram", 
    copy: "Follow our handle for community highlights, updates, and visual guides.", 
    actionLabel: "@Carree_rignite", 
    href: "https://instagram.com/Carree_rignite" 
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="bg-[var(--navbar)] px-6 py-16 text-[var(--navbar-foreground)] md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--secondary-text)]">
            <FiArrowLeft size={15} /> Back home
          </Link>
          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.5fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-accent)]">Contact / Support Desk</p>
              <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight md:text-8xl">Get in touch with our team.</h1>
            </div>
            <p className="border-l border-[var(--borders)] pl-6 text-base leading-relaxed text-[var(--secondary-text)]">
              Reach out through phone, WhatsApp, email, or social media for assistance with your Career Ignite workspace.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {contactChannels.map(({ icon: Icon, title, copy, actionLabel, href }) => (
            <article key={title} className="border border-[var(--borders)] bg-[var(--cards)] p-6 rounded-3xl flex flex-col justify-between shadow-sm">
              <div>
                <Icon className="text-[var(--primary-accent)]" size={24} />
                <h2 className="mt-8 text-xl font-black">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--secondary-text)]">{copy}</p>
              </div>
              <a 
                href={href} 
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-6 inline-block text-xs font-black text-[var(--primary-accent)] hover:underline truncate"
              >
                {actionLabel}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-10 border border-[var(--borders)] bg-[var(--light-accent)] p-6 md:p-8 rounded-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--primary-accent)]">Quick tip</p>
          <p className="mt-3 max-w-2xl text-lg font-bold leading-relaxed">
            When contacting us via WhatsApp, email, or phone, please mention your username and the specific page or feature you need help with.
          </p>
        </div>
      </section>
    </main>
  );
}