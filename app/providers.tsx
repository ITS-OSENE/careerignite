"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { applyThemeColor, readAuthSession } from "./lib/auth";

function ThemeSync() {
  useEffect(() => {
    const session = readAuthSession();
    applyThemeColor(session?.themeColor || "#2c7a7b");
  }, []);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeSync />
      {children}
    </SessionProvider>
  );
}
