"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";

export default function SignInSuccessBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);

    if (url.searchParams.get("signin") !== "success") return;

    setVisible(true);
    url.searchParams.delete("signin");
    window.history.replaceState({}, "", url.toString());

    const timeout = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-5 top-24 z-[60] flex w-[min(22rem,calc(100vw-2.5rem))] items-start gap-3 border border-[#b9d9ce] bg-white p-4 text-[#102033] shadow-[0_16px_40px_rgba(16,32,51,0.16)]" role="status" aria-live="polite">
      <span className="rounded-full bg-[#dbe9e7] p-2 text-[#2c7a7b]"><FiCheck size={16} /></span>
      <div className="flex-1">
        <p className="text-sm font-black">Signed in successfully</p>
        <p className="mt-1 text-xs text-[#5c6b7a]">Welcome to your Career-Ignite workspace.</p>
      </div>
      <button type="button" onClick={() => setVisible(false)} className="text-[#5c6b7a] transition hover:text-[#102033]" aria-label="Dismiss sign-in success message"><FiX size={16} /></button>
    </div>
  );
}
