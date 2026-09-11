"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  FiArrowLeft, FiCamera, FiCheck, FiEdit3, FiGlobe, 
  FiMapPin, FiSave, FiUser, FiBriefcase, FiAward, FiShield, FiGrid, FiSmartphone, FiSmile, FiAtSign, FiRefreshCw, FiTrash2
} from "react-icons/fi";
import { initializeFirestoreProfile, readFirestoreProfile, saveFirestoreProfile } from "../lib/firestore";
import ProfilePosts from "./components/ProfilePosts";
import { applyThemeColor, getInitials, readAuthSession, saveAuthSession, type AuthSession } from "../lib/auth";

export default function Profile() {
  const router = useRouter();
  const { data: oauthSession, status: oauthStatus } = useSession();
  const [session, setSession] = useState<AuthSession | null>(null);
  
  // Profile editable fields
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [careerTitle, setCareerTitle] = useState("Healthcare & Professional Services"); 
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [themeColor, setThemeColor] = useState("#0d9488"); 
  const [activeTab, setActiveTab] = useState("About");
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Security feature states
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [patternEnabled, setPatternEnabled] = useState(false);
  const [facialRecEnabled, setFacialRecEnabled] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const liveLocation = `Live: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      setLocation((currentLocation) => currentLocation || liveLocation);
    });
  }, []);

  useEffect(() => {
    const currentSession = readAuthSession();
    const oauthUser = oauthSession?.user;
    const oauthProfile: AuthSession | null = oauthUser && oauthStatus === "authenticated" ? {
      username: oauthUser.name || oauthUser.email || "Member",
      avatar: oauthUser.image || getInitials(oauthUser.name || oauthUser.email || "Member"),
      displayName: oauthUser.name || "Member",
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      provider: "google-or-github",
    } : null;
    const activeSession = currentSession || oauthProfile;

    if (!activeSession && oauthStatus !== "loading") {
      router.replace("/signin");
      return;
    }

    if (activeSession) {
      setSession(activeSession);
      setUsername(activeSession.username || "");
      setDisplayName(activeSession.displayName || activeSession.username);
      setBio(activeSession.bio || "");
      setLocation(activeSession.location || "");
      setAvatar(activeSession.avatar || getInitials(activeSession.username));
      setCoverPhoto(activeSession.coverPhoto || "");
      setThemeColor(activeSession.themeColor || "#0d9488");
      applyThemeColor(activeSession.themeColor || "#0d9488");

      readFirestoreProfile(activeSession.username)
        .then((profile) => {
          const initialProfile = {
            displayName: activeSession.displayName || activeSession.username,
            bio: activeSession.bio || "",
            location: activeSession.location || "",
            avatar: activeSession.avatar || getInitials(activeSession.username),
            coverPhoto: activeSession.coverPhoto || "",
            themeColor: activeSession.themeColor || "#0d9488",
          };

          if (!profile) {
            return initializeFirestoreProfile(activeSession.username, initialProfile);
          }

          setDisplayName(profile.displayName || activeSession.displayName || activeSession.username);
          setBio(profile.bio || "");
          setLocation(profile.location || "");
          setAvatar(profile.avatar || activeSession.avatar || getInitials(activeSession.username));
          setCoverPhoto(profile.coverPhoto || activeSession.coverPhoto || "");
          const profileThemeColor = profile.themeColor || activeSession.themeColor || "#0d9488";
          setThemeColor(profileThemeColor);
          applyThemeColor(profileThemeColor);
        })
        .catch(() => {});
    }
  }, [oauthSession, oauthStatus, router]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      setCoverPhoto(result);
    };
    reader.readAsDataURL(file);
  };

  const handleResetForm = () => {
    if (!session) return;
    setDisplayName(session.displayName || session.username);
    setBio(session.bio || "");
    setLocation(session.location || "");
    setAvatar(session.avatar || getInitials(session.username));
    setCoverPhoto(session.coverPhoto || "");
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;

    const cleanUsername = username.trim().replace(/^@/, "") || session.username;

    const updatedSession = saveAuthSession({
      ...session,
      username: cleanUsername,
      displayName: displayName.trim() || cleanUsername,
      bio: bio.trim(),
      location: location.trim(),
      avatar: avatar || getInitials(displayName || cleanUsername),
      coverPhoto,
      themeColor,
    });

    try {
      await saveFirestoreProfile(cleanUsername, {
        displayName: updatedSession.displayName || updatedSession.username,
        bio: updatedSession.bio || "",
        location: updatedSession.location || "",
        avatar: updatedSession.avatar,
        coverPhoto: updatedSession.coverPhoto || "",
        themeColor: updatedSession.themeColor || "#0d9488",
      });
    } catch {
      // Fallback if payload is too large or network error
    }

    setSession(updatedSession);
    setUsername(cleanUsername);
    setThemeColor(updatedSession.themeColor || "#0d9488");
    applyThemeColor(updatedSession.themeColor || "#0d9488");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  // Delete Profile execution handler
  const handleDeleteProfile = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/signin");
  };

  if (!session) return null;

  const avatarIsImage = avatar.startsWith("data:") || avatar.startsWith("http");
  const coverIsImage = coverPhoto.startsWith("data:") || coverPhoto.startsWith("http");
  const profileName = displayName || session.username;

  return (
    <main data-theme="career-ignite-profile" className="min-h-screen bg-slate-900 text-slate-100 pb-24 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10 bg-slate-900">
        
        {/* Top Navigation & Slogan Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 transition-all hover:gap-3 hover:text-emerald-300"
          >
            <FiArrowLeft size={16} /> Back to Feed
          </button>
          
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800 text-[11px] font-bold text-emerald-300 shadow-sm tracking-wide backdrop-blur-md">
              🔥 Career Ignite: Manifest your professional journey.
            </span>
          </div>
        </div>

        {/* Profile Hero Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl backdrop-blur-xl">
          
          {/* Cover Photo Area */}
          <div
            className="relative h-48 overflow-hidden bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 md:h-64"
            style={
              coverIsImage
                ? { backgroundImage: `url(${coverPhoto})`, backgroundPosition: "center", backgroundSize: "cover" }
                : undefined
            }
          >
            {!coverIsImage && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

            <label
              htmlFor="cover-picture"
              className="absolute right-4 top-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 backdrop-blur-md border border-slate-700 transition-all hover:bg-slate-700 hover:scale-105 shadow-lg"
            >
              <FiCamera size={14} className="text-emerald-400" /> Update Cover Photo
            </label>
            <input
              id="cover-picture"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="sr-only"
            />
          </div>

          {/* Profile Header Details */}
          <div className="relative px-5 pb-8 md:px-8 bg-slate-900">
            <div className="-mt-16 flex flex-wrap items-end justify-between gap-5 md:-mt-20">
              
              {/* Avatar and Info */}
              <div className="flex items-end gap-5">
                <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-slate-900 bg-gradient-to-br from-emerald-600 to-teal-800 text-3xl font-black text-white md:h-40 md:w-40 shadow-2xl">
                  {avatarIsImage ? (
                    <img src={avatar} alt="Profile preview" className="h-full w-full object-cover" />
                  ) : (
                    avatar || getInitials(profileName)
                  )}
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-1.5 right-1.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl border-2 border-slate-900 transition-transform hover:scale-110"
                  >
                    <FiCamera size={16} />
                  </label>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                </div>

                <div className="pb-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black md:text-3xl text-white">
                      {profileName}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-wider uppercase">Verified Pro</span>
                  </div>
                  <p className="text-xs font-medium text-emerald-400">@{session.username.replace(/^@/, "")}</p>
                  <div className="flex items-center gap-1.5 pt-1 text-xs font-semibold text-slate-300">
                    <FiBriefcase className="text-emerald-400" size={13} /> 
                    <span>{careerTitle}</span>
                  </div>
                </div>
              </div>

              {/* Edit Shortcut Button */}
              <button
                type="button"
                onClick={() => setActiveTab("About")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-emerald-300 transition-all hover:bg-slate-700 shadow-sm"
              >
                <FiEdit3 size={15} /> Edit Career Profile
              </button>
            </div>

            {/* Quick Details Chips */}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 shadow-sm backdrop-blur-sm">
                <FiUser size={14} className="text-emerald-400" />
                {bio || "Looking to connect with local businesses & job openings"}
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 shadow-sm backdrop-blur-sm">
                <FiMapPin size={14} className="text-emerald-400" />
                {location || "Set your location"}
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 shadow-sm backdrop-blur-sm">
                <FiGlobe size={14} className="text-emerald-400" />
                Ignited since {new Date(session.loginTime).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </span>
            </div>

            {/* Career Ignite Stats Row */}
            <div className="mt-7 grid max-w-xl grid-cols-3 gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-5 text-center shadow-sm">
              <div className="space-y-1">
                <strong className="block text-2xl font-black text-white">0</strong>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Listings / Posts</span>
              </div>
              <div className="space-y-1">
                <strong className="block text-2xl font-black text-white">0</strong>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Following</span>
              </div>
              <div className="space-y-1">
                <strong className="block text-2xl font-black text-white">0</strong>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Followers</span>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="mt-6 flex gap-6 border-b border-slate-700 text-xs font-bold text-slate-400">
              {["Posts", "About", "Network", "Opportunities", "Settings"].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-1 pb-3 transition-all duration-300 group ${
                    activeTab === tab ? "text-emerald-400 font-black" : "hover:text-slate-200"
                  }`}
                >
                  {tab}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 transition-all duration-300 ${
                      activeTab === tab ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Posts Section */}
        {session && activeTab === "Posts" && (
          <div className="mt-8 max-w-7xl mx-auto px-4 md:px-8">
            <ProfilePosts username={session.username} />
          </div>
        )}

        {/* Edit & Settings Form Grid */}
        <div className="mt-8 max-w-7xl mx-auto px-4 md:px-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          
          <form
            onSubmit={handleSave}
            className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 md:p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Career Builder Settings</p>
                <h2 className="mt-1 text-xl font-black text-white">
                  {activeTab === "Posts" ? "Professional Dashboard" : "Update Professional Identity"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  title="Reset form fields to last saved state"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
                >
                  <FiRefreshCw size={13} /> Reset
                </button>
                {saved && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 animate-pulse">
                    <FiCheck size={14} /> Saved!
                  </span>
                )}
              </div>
            </div>

            {activeTab === "Posts" ? (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-emerald-400">
                  <FiAward size={24} />
                </div>
                <h3 className="text-base font-bold text-white">Manifest your career path today</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Update your profile info and maintain your professional identity here.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("About")}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white transition-all hover:bg-emerald-500 shadow-md shadow-emerald-900/20"
                >
                  <FiEdit3 size={14} /> Edit Career Details
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-5">
                
                {/* Username Change Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Username / Handle (@)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-emerald-400"><FiAtSign size={14} /></span>
                    <input
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      maxLength={30}
                      placeholder="yourhandle"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Full Name / Business Name
                  </label>
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    maxLength={60}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Career Specialty / Line of Business
                  </label>
                  <input
                    value={careerTitle}
                    onChange={(event) => setCareerTitle(event.target.value)}
                    maxLength={80}
                    placeholder="e.g. Registered Nurse / Wholesale Supplier"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Location (City / Region)
                  </label>
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="e.g. Lagos, Nigeria"
                    maxLength={80}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Professional Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="What kind of career or business opportunity are you looking for?"
                    maxLength={160}
                    className="min-h-24 w-full resize-y rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Ignite Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(event) => setThemeColor(event.target.value)}
                      className="h-10 w-14 cursor-pointer rounded-xl border border-slate-700 bg-transparent"
                    />
                    <span className="text-xs font-mono text-emerald-400">{themeColor}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-black text-white shadow-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  <FiSave size={15} /> Save Career Profile
                </button>
              </div>
            )}
          </form>

          {/* Account Sidebar Info */}
          <aside className="space-y-5">
            <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <FiUser className="text-emerald-400" size={16} /> Career Ignite Account
              </h3>
              <div className="space-y-3 text-xs border-t border-slate-800 pt-3">
                <div>
                  <span className="block text-slate-400 uppercase tracking-widest text-[9px] mb-0.5">Username Handle</span>
                  <span className="text-emerald-400 font-bold">@{session.username.replace(/^@/, "")}</span>
                </div>
                <div>
                  <span className="block text-slate-400 uppercase tracking-widest text-[9px] mb-0.5">Authentication Provider</span>
                  <span className="text-slate-200 font-bold capitalize">{session.provider || "Career Ignite Local Node"}</span>
                </div>
                <div>
                  <span className="block text-slate-400 uppercase tracking-widest text-[9px] mb-0.5">Primary Location</span>
                  <span className="text-slate-200 font-medium">{location || "Not specified"}</span>
                </div>
              </div>
            </div>

            {/* Universal Security & Safety Section */}
            <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <FiShield className="text-emerald-400" size={16} /> Universal Security & Safety
              </h3>
              <p className="text-[11px] text-slate-400">
                Supports mobile fingerprint/face unlock and laptop webcam facial recognition.
              </p>
              <div className="space-y-3 pt-1 text-xs">
                
                <button type="button" className="w-full flex items-center justify-between rounded-xl bg-slate-800 p-3 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500 transition">
                  <span>Update Password</span>
                  <span className="text-emerald-400 font-bold">Modify</span>
                </button>

                {/* Facial Recognition Toggle */}
                <div className="w-full flex items-center justify-between rounded-xl bg-slate-800 p-3 border border-slate-700 text-slate-300">
                  <span className="flex items-center gap-2">
                    <FiSmile size={14} className="text-emerald-400" /> Facial Recognition
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setFacialRecEnabled(!facialRecEnabled)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${facialRecEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 border border-slate-600'}`}
                  >
                    {facialRecEnabled ? "Active (Cam)" : "Turn On"}
                  </button>
                </div>

                {/* Biometrics Toggle */}
                <div className="w-full flex items-center justify-between rounded-xl bg-slate-800 p-3 border border-slate-700 text-slate-300">
                  <span className="flex items-center gap-2">
                    <FiSmartphone size={14} className="text-emerald-400" /> Biometric Login
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${biometricsEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 border border-slate-600'}`}
                  >
                    {biometricsEnabled ? "Enabled" : "Turn On"}
                  </button>
                </div>

                {/* Pattern Lock Toggle */}
                <div className="w-full flex items-center justify-between rounded-xl bg-slate-800 p-3 border border-slate-700 text-slate-300">
                  <span className="flex items-center gap-2">
                    <FiGrid size={14} className="text-emerald-400" /> Pattern Lock
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setPatternEnabled(!patternEnabled)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${patternEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 border border-slate-600'}`}
                  >
                    {patternEnabled ? "Configured" : "Set Up"}
                  </button>
                </div>

                <button type="button" className="w-full flex items-center justify-between rounded-xl bg-slate-800 p-3 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500 transition">
                  <span>Employer Verification Badge</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </button>

              </div>
            </div>

            {/* Delete Profile Action Section */}
            <div className="overflow-hidden rounded-3xl border border-red-900/40 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-red-400">
                <FiTrash2 size={16} /> Danger Zone
              </h3>
              <p className="text-[11px] text-slate-400">
                Permanently remove your career profile data and clear session access from this device.
              </p>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600/20 border border-red-500/40 px-4 py-2.5 text-xs font-black text-red-300 hover:bg-red-600 hover:text-white transition cursor-pointer"
                >
                  <FiTrash2 size={14} /> Delete Profile
                </button>
              ) : (
                <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-900 space-y-2">
                  <p className="text-[11px] font-bold text-red-300 text-center">Are you absolute sure you want to delete profile?</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteProfile}
                      className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-black hover:bg-red-500 transition cursor-pointer"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}