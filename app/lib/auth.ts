export type AuthSession = {
  username: string;
  avatar: string;
  coverPhoto?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  themeColor?: string;
  isAuthenticated: boolean;
  loginTime: string;
  expiresAt: string;
  provider?: string;
};

export const AUTH_STORAGE_KEY = "career_ignite_secure_session";
export const AUTH_ACCOUNTS_STORAGE_KEY = "career_ignite_accounts";
export const MAX_ACCOUNTS = 4;
export const AUTH_SESSION_LENGTH_MS = 30 * 24 * 60 * 60 * 1000;

export function getInitials(name: string) {
  const cleanName = name.trim();

  if (!cleanName) return "U";

  const words = cleanName.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function readAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthSession;

    if (!parsed || !parsed.isAuthenticated || !parsed.expiresAt) {
      return null;
    }

    const expiry = new Date(parsed.expiresAt).getTime();

    if (Number.isNaN(expiry) || Date.now() > expiry) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function getPreferredAuthSession(): AuthSession | null {
  const currentSession = readAuthSession();
  if (currentSession) {
    return currentSession;
  }

  return readAuthAccounts()[0] ?? null;
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
  const parsed = Number.parseInt(normalized, 16);

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((channel) => Math.min(255, Math.max(0, channel)).toString(16).padStart(2, "0")).join("")}`;
}

function mixWithWhite(hex: string, ratio: number) {
  const { r, g, b } = hexToRgb(hex);
  const blend = (channel: number) => Math.round(channel + (255 - channel) * ratio);
  return rgbToHex(blend(r), blend(g), blend(b));
}

export function applyThemeColor(color?: string) {
  if (typeof window === "undefined") return;

  const resolvedColor = /^#[0-9a-fA-F]{3,6}$/.test(color || "") ? color : "#2c7a7b";
  const safeColor = resolvedColor ?? "#2c7a7b";
  document.documentElement.style.setProperty("--primary-accent", safeColor);
  document.documentElement.style.setProperty("--light-accent", mixWithWhite(safeColor, 0.84));
}

export function saveAuthSession(session: Omit<AuthSession, "expiresAt" | "avatar"> & { avatar?: string }) {
  const expiresAt = new Date(Date.now() + AUTH_SESSION_LENGTH_MS).toISOString();
  const finalSession: AuthSession = {
    ...session,
    themeColor: session.themeColor || "#2c7a7b",
    avatar: session.avatar || getInitials(session.username),
    expiresAt,
    isAuthenticated: true,
  };

  const accounts = readAuthAccounts();
  const accountIndex = accounts.findIndex((account) => account.username.toLowerCase() === finalSession.username.toLowerCase());

  if (accountIndex === -1 && accounts.length >= MAX_ACCOUNTS) {
    throw new Error(`You can create up to ${MAX_ACCOUNTS} accounts.`);
  }

  if (accountIndex === -1) {
    accounts.push(finalSession);
  } else {
    accounts[accountIndex] = finalSession;
  }

  window.localStorage.setItem(AUTH_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(finalSession));
  return finalSession;
}

export function readAuthAccounts(): AuthSession[] {
  if (typeof window === "undefined") return [];

  try {
    const storedAccounts = JSON.parse(window.localStorage.getItem(AUTH_ACCOUNTS_STORAGE_KEY) || "[]") as AuthSession[];
    const activeSession = readAuthSession();
    const accounts = storedAccounts.filter((account) => account?.isAuthenticated && account.username);

    if (activeSession && !accounts.some((account) => account.username.toLowerCase() === activeSession.username.toLowerCase())) {
      accounts.unshift(activeSession);
    }

    return accounts.slice(0, MAX_ACCOUNTS);
  } catch {
    return [];
  }
}

export function switchAuthAccount(username: string) {
  const account = readAuthAccounts().find((item) => item.username === username);
  if (!account) return null;

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account));
  return account;
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
