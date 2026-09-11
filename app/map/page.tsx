"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { FiArrowLeft, FiArrowUpRight, FiGlobe, FiMapPin, FiSearch } from "react-icons/fi";

export default function MapPage() {
  const [destination, setDestination] = useState("");

  const openMap = (provider: "google" | "openstreetmap") => {
    const query = destination.trim() || "world map";
    const encodedQuery = encodeURIComponent(query);
    const url = provider === "google"
      ? `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`
      : `https://www.openstreetmap.org/search?query=${encodedQuery}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openMap("google");
  };

  return (
    <main data-theme="overview" className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--borders)] bg-[var(--navbar)] px-6 py-14 text-[var(--navbar-foreground)] md:px-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Link href="/overview" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-accent)] transition hover:opacity-75"><FiArrowLeft size={16} /> Back to workspace</Link>
          <div className="mt-14 flex items-end justify-between gap-8">
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-accent)]">Explore anywhere</p><h1 className="mt-3 max-w-3xl text-5xl font-black leading-none tracking-tight md:text-8xl">Choose your map.</h1><p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--secondary-text)]">Search for any city, country, neighborhood, or address, then open it in the map service you prefer.</p></div>
            <FiGlobe className="hidden text-[var(--primary-accent)] md:block" size={72} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 md:px-12 md:py-20">
        <form onSubmit={handleSubmit} className="border border-[var(--borders)] bg-[var(--cards)] p-5 md:p-8">
          <label className="block text-xs font-black uppercase tracking-[0.16em] text-[var(--secondary-text)]">Where do you want to explore?<span className="mt-3 flex items-center gap-3 border border-[var(--borders)] bg-[var(--background)] px-4"><FiSearch className="text-[var(--primary-accent)]" size={18} /><input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Try Tokyo, Nairobi, Toronto, or your address" className="min-w-0 flex-1 bg-transparent py-4 text-base font-normal normal-case tracking-normal text-[var(--foreground)] outline-none placeholder:text-[var(--secondary-text)]" /></span></label>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="submit" style={{ color: "#ffffff" }} className="inline-flex items-center justify-center gap-2 bg-[#0b1f33] px-5 py-4 text-sm font-black transition hover:bg-[#173b58]">Open in Google Maps <FiArrowUpRight size={16} /></button><button type="button" onClick={() => openMap("openstreetmap")} className="inline-flex items-center justify-center gap-2 border border-[var(--borders)] px-5 py-4 text-sm font-black transition hover:border-[var(--primary-accent)]">Open world map <FiMapPin size={16} /></button></div>
          <p className="mt-5 text-xs leading-5 text-[var(--secondary-text)]">Your search opens in a new tab. Leave the location blank to start with a world map.</p>
        </form>
      </section>
    </main>
  );
}
