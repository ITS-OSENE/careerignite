"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FiArrowRight, FiBell, FiBookmark, FiCheck, FiCommand, FiCompass, FiEdit3, FiHome, FiLayers, FiLogOut, FiMenu, FiMoon, FiSearch, FiSettings, FiSun, FiUsers, FiX, FiZap } from "react-icons/fi";
import { clearAuthSession, getInitials, readAuthAccounts, readAuthSession, switchAuthAccount } from "../lib/auth";

const navItems = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/overview", label: "Overview", icon: FiCompass },
  { href: "/job-research", label: "Local Jobs", icon: FiSearch },
  { href: "/posts", label: "Posts", icon: FiEdit3 },
  { href: "/community-hub", label: "Community Hub", icon: FiUsers },
  { href: "/the-team", label: "The Team", icon: FiZap },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [quickNavQuery, setQuickNavQuery] = useState("");
  const [accounts, setAccounts] = useState<ReturnType<typeof readAuthAccounts>>([]);
  const [session, setSession] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { data: oauthSession } = useSession();

  // Mock notifications state for quick access feature
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New comment on your post", time: "5m ago", unread: true, link: "/posts" },
    { id: 2, title: "Application status updated", time: "1h ago", unread: true, link: "/job-research" },
    { id: 3, title: "Welcome to Career Ignite!", time: "2h ago", unread: false, link: "/" },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  useEffect(() => {
    const currentSession = readAuthSession();
    setSession(currentSession);
    setAccounts(readAuthAccounts());
    setIsOpen(false);
    
    if (document.documentElement.classList.contains("dark")) {
      setIsDarkMode(true);
    }
  }, [pathname]);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsQuickNavOpen(true);
      }
      if (event.key === "Escape") {
        setIsQuickNavOpen(false);
        setIsHubOpen(false);
        setIsNotificationsOpen(false);
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSignOut = () => {
    clearAuthSession();
    setSession(null);
    void signOut({ redirect: false });
  };

  const isActive = (href: string) => href === "/" ? pathname === href : pathname.startsWith(href);
  const oauthUser = oauthSession?.user;
  const displayedSession = session || (oauthUser ? {
    username: oauthUser.name || oauthUser.email || "Member",
    avatar: oauthUser.image || getInitials(oauthUser.name || oauthUser.email || "Member"),
  } : null);
  const filteredNavItems = navItems.filter(({ label }) => label.toLowerCase().includes(quickNavQuery.toLowerCase()));

  const closeQuickNav = () => {
    setIsQuickNavOpen(false);
    setQuickNavQuery("");
  };

  const openFirstResult = () => {
    if (filteredNavItems[0]) {
      closeQuickNav();
      window.location.href = filteredNavItems[0].href;
    }
  };

  return (
    <nav
      className="relative w-full border-b sticky top-0 z-50 backdrop-blur-2xl shadow-sm transition-all bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-slate-100"
      style={{
        borderColor: "var(--borders, #e2e8f0)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Left Section: Custom Designed Brand Icon & Typography */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3.5 group" aria-label="Home">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 text-white shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105 overflow-hidden" aria-hidden="true">
              <svg className="w-6 h-6 fill-current text-white drop-shadow-sm" viewBox="0 0 24 24">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                <circle cx="12" cy="12" r="3" className="fill-indigo-200/40" />
              </svg>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="block text-xs font-black tracking-wider uppercase text-indigo-600 dark:text-indigo-400">Career Ignite</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
              </div>
              <span className="block text-[10px] tracking-widest text-slate-500 dark:text-slate-400 font-mono">WORKSPACE</span>
            </div>
          </Link>
        </div>

        {/* Center Section: Pill Navigation */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full border px-2 py-1.5 shadow-sm bg-slate-100/70 dark:bg-slate-900/70" style={{ borderColor: "var(--borders, #e2e8f0)" }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  active 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                    : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                <Icon aria-hidden="true" size={14} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Section: Utilities & Profile */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsQuickNavOpen(true)}
            className="flex items-center gap-2.5 rounded-2xl border px-3.5 py-2 text-xs font-semibold transition-all hover:shadow-sm bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            style={{ borderColor: "var(--borders, #e2e8f0)" }}
            aria-label="Open quick navigation"
          >
            <FiSearch aria-hidden="true" size={14} className="opacity-70" />
            <span className="opacity-80">Search...</span>
            <kbd className="flex items-center gap-0.5 rounded-lg border px-1.5 py-0.5 text-[9px] font-mono font-bold opacity-75" style={{ borderColor: "var(--borders, #e2e8f0)" }}>
              <FiCommand aria-hidden="true" size={8} /> K
            </kbd>
          </button>

          {/* Notifications Dropdown Toggle (Added feature) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              className="relative p-2.5 rounded-2xl border transition-all hover:shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              style={{ borderColor: "var(--borders, #e2e8f0)" }}
              aria-label="Open notifications"
            >
              <FiBell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div 
                className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-80 rounded-3xl border p-4 shadow-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 animate-in fade-in slide-in-from-top-2"
                style={{ borderColor: "var(--borders, #e2e8f0)" }}
              >
                <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: "var(--borders, #e2e8f0)" }}>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Notifications</p>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <FiCheck size={12} /> Mark read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((item) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      onClick={() => setIsNotificationsOpen(false)}
                      className={`block p-3 rounded-2xl border transition-all text-xs ${
                        item.unread 
                          ? "bg-indigo-500/5 border-indigo-500/20 font-bold" 
                          : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 font-medium opacity-80"
                      }`}
                      style={item.unread ? undefined : { borderColor: "transparent" }}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="truncate">{item.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{item.time}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2.5 rounded-2xl border transition-all flex items-center justify-center bg-slate-50 dark:bg-slate-900 ${isBookmarked ? "text-amber-500 border-amber-500/30" : "text-slate-700 dark:text-slate-300"}`}
            style={{ borderColor: isBookmarked ? undefined : "var(--borders, #e2e8f0)" }}
            aria-label="Bookmark current page"
          >
            <FiBookmark size={15} fill={isBookmarked ? "currentColor" : "none"} />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl border transition-all hover:shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            style={{ borderColor: "var(--borders, #e2e8f0)" }}
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? <FiSun size={15} className="text-amber-400" /> : <FiMoon size={15} className="text-indigo-600" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsHubOpen((prev) => !prev)}
              className="p-2.5 rounded-2xl border transition-all hover:shadow-sm flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              style={{ borderColor: "var(--borders, #e2e8f0)" }}
              aria-label="Open Workspace Hub"
            >
              <FiLayers size={15} />
            </button>

            {isHubOpen && (
              <div 
                className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 rounded-3xl border p-4 shadow-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                style={{ borderColor: "var(--borders, #e2e8f0)" }}
              >
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Workspace Hub</p>
                <div className="space-y-1 text-xs font-semibold">
                  <Link href="/overview" onClick={() => setIsHubOpen(false)} className="block p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">Performance Analytics</Link>
                  <Link href="/community-hub" onClick={() => setIsHubOpen(false)} className="block p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">Community Activity</Link>
                </div>
              </div>
            )}
          </div>

          {displayedSession ? (
            <div className="group relative ml-2">
              <button
                type="button"
                onClick={() => setIsAccountOpen((open) => !open)}
                className="relative rounded-full p-0.5 transition-transform hover:scale-105 focus:outline-none"
              >
                <span
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-500 bg-gradient-to-tr from-indigo-500 to-violet-600 bg-cover bg-center text-sm font-black text-white shadow-md"
                  style={displayedSession.avatar.startsWith("http") ? { backgroundImage: `url(${displayedSession.avatar})` } : undefined}
                >
                  {!displayedSession.avatar.startsWith("http") && displayedSession.avatar}
                </span>
              </button>
              <div
                className={`absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-3xl border p-3 shadow-2xl transition-all duration-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${isAccountOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"}`}
                style={{ borderColor: "var(--borders, #e2e8f0)" }}
              >
                <div className="border-b p-3" style={{ borderColor: "var(--borders, #e2e8f0)" }}>
                  <p className="truncate text-sm font-bold">{displayedSession.username}</p>
                </div>
                <div className="py-1">
                  <Link href="/profile" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                    <FiSettings size={14} /> View Profile....
                  </Link>
                  <button type="button" onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <FiLogOut size={14} /> Log Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 ml-2">
              <Link href="/signin" className="text-xs font-bold px-4 py-2.5 rounded-2xl border shadow-2xs bg-slate-50 dark:bg-slate-900" style={{ borderColor: "var(--borders, #e2e8f0)" }}>
                Sign In
              </Link>
              <Link href="/get-started" className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                Get Started <FiArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen((open) => !open)}
          className="lg:hidden rounded-2xl border p-2.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          style={{ borderColor: "var(--borders, #e2e8f0)" }}
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden flex flex-col px-6 py-6 gap-5 border-t bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-2xl" style={{ borderColor: "var(--borders, #e2e8f0)" }}>
          <div className="grid gap-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    active ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center gap-2 rounded-2xl border py-2.5 text-xs font-semibold border-slate-200 dark:border-slate-800"
          >
            {isDarkMode ? <FiSun size={15} className="text-amber-400" /> : <FiMoon size={15} className="text-indigo-600" />}
            <span>Toggle {isDarkMode ? "Light" : "Dark"} Mode</span>
          </button>
        </div>
      )}

      {/* Quick Search Spotlight */}
      {isQuickNavOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-md" onMouseDown={(e) => { if (e.target === e.currentTarget) closeQuickNav(); }}>
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" style={{ borderColor: "var(--borders, #e2e8f0)" }}>
            <div className="flex items-center gap-3 border-b px-5 py-4" style={{ borderColor: "var(--borders, #e2e8f0)" }}>
              <FiSearch size={18} className="text-indigo-500" />
              <input
                autoFocus
                value={quickNavQuery}
                onChange={(e) => setQuickNavQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") openFirstResult(); }}
                placeholder="Where do you want to go next?"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
              <button onClick={closeQuickNav} className="rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"><FiX size={17} /></button>
            </div>
            <div className="p-2.5 space-y-1 max-h-72 overflow-y-auto">
              {filteredNavItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={closeQuickNav} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <span className="rounded-xl p-2 bg-indigo-500/10 text-indigo-500"><Icon size={15} /></span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}