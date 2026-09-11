"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  FiArrowRight, FiBell, FiBookmark, FiCheck, FiChevronLeft, FiChevronRight,
  FiCommand, FiCompass, FiEdit3, FiHome, FiLayers, FiLogOut, FiMenu, 
  FiMoon, FiSearch, FiSettings, FiSun, FiUsers, FiX, FiZap 
} from "react-icons/fi";
import { clearAuthSession, getInitials, readAuthAccounts, readAuthSession } from "../lib/auth";

const navItems = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/overview", label: "Overview", icon: FiCompass },
  { href: "/job-research", label: "Local Jobs", icon: FiSearch },
  { href: "/posts", label: "Posts", icon: FiEdit3 },
  { href: "/community-hub", label: "Community Hub", icon: FiUsers },
  { href: "/the-team", label: "The Team", icon: FiZap },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [quickNavQuery, setQuickNavQuery] = useState("");
  const [session, setSession] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { data: oauthSession } = useSession();

  const [notifications, setNotifications] = useState([
    { id: 1, title: "New comment on your post", time: "5m ago", unread: true, link: "/posts" },
    { id: 2, title: "Application status updated", time: "1h ago", unread: true, link: "/job-research" },
    { id: 3, title: "Welcome to Career Ignite!", time: "2h ago", unread: false, link: "/" },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  useEffect(() => {
    setSession(readAuthSession());
    setIsMobileOpen(false);
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
        setIsAccountOpen(false);
        setIsMobileOpen(false);
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

  const isActive = (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href));
  const oauthUser = oauthSession?.user;
  const displayedSession =
    session ||
    (oauthUser
      ? {
          username: oauthUser.name || oauthUser.email || "Member",
          avatar: oauthUser.image || getInitials(oauthUser.name || oauthUser.email || "Member"),
        }
      : null);

  const filteredNavItems = navItems.filter(({ label }) =>
    label.toLowerCase().includes(quickNavQuery.toLowerCase())
  );

  const closeQuickNav = () => {
    setIsQuickNavOpen(false);
    setQuickNavQuery("");
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 text-white shadow-md shadow-indigo-500/20">
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
          <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            Career Ignite
          </span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-700 dark:text-slate-300"
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl transition-all duration-300 flex flex-col ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        {/* Brand Header & Collapse Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 text-white shadow-md shadow-indigo-500/20 transition-transform duration-300 hover:scale-105">
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                    Career Ignite
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </div>
                <span className="block text-[9px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  Workspace
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label="Collapse sidebar"
          >
            {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
          </button>
        </div>

        {/* Quick Search Button */}
        <div className="p-3 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0">
          <button
            type="button"
            onClick={() => setIsQuickNavOpen(true)}
            className={`w-full flex items-center gap-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 px-3 py-2 text-xs text-slate-500 dark:text-slate-400 transition-all hover:border-slate-300 dark:hover:border-slate-700 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <FiSearch size={15} className="text-slate-400 shrink-0" />
              {!isCollapsed && <span className="font-medium">Search...</span>}
            </div>
            {!isCollapsed && (
              <kbd className="flex items-center gap-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 shrink-0">
                <FiCommand size={9} /> K
              </kbd>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon size={16} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Action Controls Toolbar (Notifications, Bookmark, Theme, Workspace Hub) */}
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 shrink-0">
          <div className={`flex items-center gap-1 ${isCollapsed ? "flex-col" : "justify-between"}`}>
            
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsHubOpen(false);
                  setIsAccountOpen(false);
                }}
                className="relative rounded-xl p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
              >
                <FiBell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute left-full bottom-0 ml-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xl z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-500">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <FiCheck size={12} /> Mark read
                      </button>
                    )}
                  </div>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link}
                        onClick={() => setIsNotificationsOpen(false)}
                        className={`block p-2.5 rounded-xl text-xs transition-colors ${
                          n.unread
                            ? "bg-indigo-50/80 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-100 font-medium"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="truncate">{n.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bookmark Toggle */}
            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`rounded-xl p-2 transition-colors ${
                isBookmarked
                  ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              aria-label="Bookmark page"
            >
              <FiBookmark size={17} fill={isBookmarked ? "currentColor" : "none"} />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FiSun size={17} className="text-amber-400" /> : <FiMoon size={17} className="text-indigo-600" />}
            </button>

            {/* Workspace Hub Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsHubOpen(!isHubOpen);
                  setIsNotificationsOpen(false);
                  setIsAccountOpen(false);
                }}
                className="rounded-xl p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Workspace Hub"
              >
                <FiLayers size={17} />
              </button>

              {isHubOpen && (
                <div className="absolute left-full bottom-0 ml-2 w-60 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xl z-50">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                    Quick Workspaces
                  </span>
                  <div className="space-y-1 text-xs font-medium">
                    <Link
                      href="/overview"
                      onClick={() => setIsHubOpen(false)}
                      className="block p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Performance Analytics
                    </Link>
                    <Link
                      href="/community-hub"
                      onClick={() => setIsHubOpen(false)}
                      className="block p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Community Activity
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* User Account Footer Card */}
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 shrink-0 relative">
          {displayedSession ? (
            <div>
              <button
                type="button"
                onClick={() => {
                  setIsAccountOpen(!isAccountOpen);
                  setIsNotificationsOpen(false);
                  setIsHubOpen(false);
                }}
                className={`w-full flex items-center gap-3 rounded-xl p-1.5 transition-all hover:bg-slate-100 dark:hover:bg-slate-900 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 bg-cover bg-center text-xs font-bold text-white shadow-sm"
                  style={
                    displayedSession.avatar.startsWith("http")
                      ? { backgroundImage: `url(${displayedSession.avatar})` }
                      : undefined
                  }
                >
                  {!displayedSession.avatar.startsWith("http") && displayedSession.avatar}
                </span>

                {!isCollapsed && (
                  <div className="text-left truncate flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate leading-tight">
                      {displayedSession.username}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">View Account</span>
                  </div>
                )}
              </button>

              {isAccountOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-full min-w-[200px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {displayedSession.username}
                    </p>
                  </div>
                  <div className="pt-1 space-y-0.5">
                    <Link
                      href="/profile"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <FiSettings size={14} /> Profile Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <FiLogOut size={14} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`space-y-2 ${isCollapsed ? "text-center" : ""}`}>
              <Link
                href="/signin"
                className="block text-center text-xs font-semibold px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                {isCollapsed ? "Sign In" : "Sign In"}
              </Link>
              {!isCollapsed && (
                <Link
                  href="/get-started"
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                >
                  Get Started <FiArrowRight size={12} />
                </Link>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Spotlight / Quick Search Modal */}
      {isQuickNavOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 backdrop-blur-sm p-4 pt-[15vh]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeQuickNav();
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
              <FiSearch size={16} className="text-indigo-500" />
              <input
                autoFocus
                value={quickNavQuery}
                onChange={(e) => setQuickNavQuery(e.target.value)}
                placeholder="Type to search pages..."
                className="w-full bg-transparent text-xs outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
              <button onClick={closeQuickNav} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <FiX size={16} />
              </button>
            </div>
            <div className="p-2 space-y-0.5 max-h-60 overflow-y-auto">
              {filteredNavItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeQuickNav}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}