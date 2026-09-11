"use client";



import { useRouter } from "next/navigation";

import { useState, type FormEvent } from "react";

import { FiArrowRight, FiCheck, FiLock, FiMail, FiMessageCircle, FiPhone, FiShield, FiUser } from "react-icons/fi";

import { SiGithub, SiGoogle } from "react-icons/si";

import { saveAuthSession } from "../lib/auth";



const hasGoogleAuth = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim());

const hasGitHubAuth = Boolean(process.env.NEXT_PUBLIC_GITHUB_ID?.trim());



export default function SignInPage() {

  const router = useRouter();

  const [authMode, setAuthMode] = useState("select");

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [socialPlatform, setSocialPlatform] = useState("Instagram");

  const [socialUsername, setSocialUsername] = useState("");

  const [error, setError] = useState("");

  const [isSigningIn, setIsSigningIn] = useState(false);



  const completeSignIn = (sessionData: Parameters<typeof saveAuthSession>[0]) => {

    setIsSigningIn(true);

    try {

      saveAuthSession(sessionData);

      router.push("/overview?signin=success");

    } catch (signInError) {

      setIsSigningIn(false);

      setError(signInError instanceof Error ? signInError.message : "This account could not be added.");

    }

  };



  const generateSixDigitPin = () => {

    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();

    setPassword(randomPin);

  };



  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();



    const trimmedUsername = username.trim();

    const trimmedSocialUsername = socialUsername.trim().replace(/^@/, "");



    if (authMode === "whatsapp") {

      if (!/^\+?[0-9\s().-]{7,}$/.test(phoneNumber.trim())) {

        setError("Please enter a valid WhatsApp number, including your country code.");

        return;

      }



      completeSignIn({

        username: phoneNumber.trim(),

        avatar: "WA",

        isAuthenticated: true,

        loginTime: new Date().toISOString(),

        provider: "whatsapp",

      });

      return;

    }



    if (authMode === "social") {

      if (!trimmedSocialUsername) {

        setError(`Please enter your ${socialPlatform} username.`);

        return;

      }



      completeSignIn({

        username: `@${trimmedSocialUsername}`,

        avatar: socialPlatform.slice(0, 2).toUpperCase(),

        isAuthenticated: true,

        loginTime: new Date().toISOString(),

        provider: socialPlatform.toLowerCase(),

      });

      return;

    }



    if (!trimmedUsername) {

      setError("Please create or enter a valid username.");

      return;

    }



    if (!/^\d{6}$/.test(password)) {

      setError("Generated password must be strictly 6 digits.");

      return;

    }



    const sessionData = {

      username: trimmedUsername,

      avatar: trimmedUsername.slice(0, 2).toUpperCase(),

      isAuthenticated: true,

      loginTime: new Date().toISOString(),

      provider: authMode === "phone" ? "phone" : "local",

    };



    completeSignIn(sessionData);

  };



  const handleOAuthSignIn = (provider: "google" | "github") => {

    const isConfigured = provider === "google" ? hasGoogleAuth : hasGitHubAuth;



    if (!isConfigured) {

      setError(`${provider === "google" ? "Google" : "GitHub"} sign-in is not configured yet.`);

      return;

    }



    setIsSigningIn(true);

    window.location.href = `/api/auth/signin/${provider}?callbackUrl=%2Foverview%3Fsignin%3Dsuccess`;

  };



  return (

    <main className="relative overflow-hidden bg-[#eef5f3] text-[#102033]">

      <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#c9e4df] opacity-70 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-stretch gap-8 px-5 py-8 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-14">

        <section className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#0b1f33] p-8 text-white shadow-xl md:p-12">

          <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full border-[40px] border-[#2c7a7b]/30" />

          <div>

            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[#9ed1c7]"><span className="h-2 w-2 rounded-full bg-[#f3c969]" /> Member access</div>

            <h1 className="mt-16 max-w-md text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">Make your next move count.</h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#b9c8d1]">Your workspace brings local opportunities, practical guidance, and a community of people moving forward.</p>

          </div>

          <div className="relative mt-16 border-t border-white/15 pt-6">

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9ed1c7]">Inside your workspace</p>

            <ul className="mt-4 space-y-3 text-sm text-[#d9e5e8]">

              {['Personalized opportunity routes', 'Local job and career insights', 'A community built for momentum'].map((item) => <li key={item} className="flex items-center gap-3"><FiCheck className="text-[#f3c969]" size={16} />{item}</li>)}

            </ul>

          </div>

        </section>



        <section className="relative flex items-center justify-center py-4 lg:py-10">

          <div className="w-full max-w-lg rounded-[2rem] border border-[#cbd5df] bg-white p-6 shadow-[0_24px_70px_rgba(16,32,51,0.12)] md:p-10">

            <div className="mb-8 flex items-start justify-between gap-5">

              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#2c7a7b]">Welcome back</p><h2 className="mt-2 text-3xl font-black tracking-tight">Enter your workspace.</h2><p className="mt-2 text-sm leading-6 text-[#5c6b7a]">Choose a secure way to continue.</p></div>

              <div className="rounded-2xl bg-[#dbe9e7] p-3 text-[#2c7a7b]"><FiShield size={22} /></div>

            </div>



            {error && <div role="alert" className="mb-5 border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">{error}</div>}



            {authMode === "select" && <div className="space-y-3 animate-fade-in">

              <div className="grid gap-3 sm:grid-cols-2">

                <button onClick={() => handleOAuthSignIn("google")} className="flex items-center justify-center gap-2 border border-[#cbd5df] bg-white px-4 py-3.5 text-sm font-bold text-[#102033] transition hover:border-[#2c7a7b]">

                  <SiGoogle size={16} /> Google

                </button>

                <button onClick={() => handleOAuthSignIn("github")} className="flex items-center justify-center gap-2 border border-[#102033] bg-[#102033] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#18344e]">

                  <SiGithub size={17} /> GitHub

                </button>

              </div>

              {(!hasGoogleAuth || !hasGitHubAuth) && <p className="border-b border-[#cbd5df] pb-3 text-xs text-[#5c6b7a]">OAuth buttons become active after their credentials are added to `.env.local`.</p>}

              <p className="pt-3 text-xs font-black uppercase tracking-[0.14em] text-[#5c6b7a]">Other ways to continue</p>

              <div className="grid gap-3 sm:grid-cols-2">

                <button onClick={() => setAuthMode("whatsapp")} className="flex items-center gap-3 border border-[#cbd5df] bg-[#f7faf9] px-4 py-3.5 text-left text-sm font-bold text-[#102033] transition hover:border-[#2c7a7b]"><FiMessageCircle className="text-[#2c7a7b]" size={18} /> WhatsApp number</button>

                <button onClick={() => setAuthMode("social")} className="flex items-center gap-3 border border-[#cbd5df] bg-[#f7faf9] px-4 py-3.5 text-left text-sm font-bold text-[#102033] transition hover:border-[#2c7a7b]"><FiUser className="text-[#2c7a7b]" size={18} /> Social username</button>

              </div>

              <p className="text-xs leading-5 text-[#5c6b7a]">You can keep up to four accounts on this device. WhatsApp and social usernames create local sessions until their official APIs are connected.</p>

              <button onClick={() => setAuthMode("phone")} className="flex w-full items-center gap-4 border border-[#cbd5df] bg-[#f7faf9] px-4 py-4 text-left transition hover:border-[#2c7a7b]"><span className="rounded-lg bg-[#dbe9e7] p-2 text-[#2c7a7b]"><FiPhone size={17} /></span><span><strong className="block text-sm">Use your phone</strong><small className="text-xs text-[#5c6b7a]">Create a local member session</small></span><FiArrowRight className="ml-auto text-[#2c7a7b]" size={16} /></button>

              <button onClick={() => setAuthMode("username")} className="flex w-full items-center gap-4 border border-[#cbd5df] bg-[#f7faf9] px-4 py-4 text-left transition hover:border-[#2c7a7b]"><span className="rounded-lg bg-[#dbe9e7] p-2 text-[#2c7a7b]"><FiMail size={17} /></span><span><strong className="block text-sm">Use a username</strong><small className="text-xs text-[#5c6b7a]">Continue with a six-digit PIN</small></span><FiArrowRight className="ml-auto text-[#2c7a7b]" size={16} /></button>

            </div>}



            {(authMode === "username" || authMode === "phone" || authMode === "whatsapp" || authMode === "social") && <form onSubmit={handleSignIn} className="space-y-5 animate-fade-in">

              {authMode === "whatsapp" && <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#5c6b7a]">WhatsApp number<input type="tel" placeholder="+1 (555) 000-0000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-2 w-full border border-[#cbd5df] bg-[#f7faf9] px-4 py-3.5 text-sm text-[#102033] outline-none transition focus:border-[#2c7a7b] focus:ring-2 focus:ring-[#dbe9e7]" required /></label>}

              {authMode === "social" && <>

                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#5c6b7a]">Platform<select value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)} className="mt-2 w-full border border-[#cbd5df] bg-[#f7faf9] px-4 py-3.5 text-sm font-normal normal-case tracking-normal text-[#102033] outline-none transition focus:border-[#2c7a7b] focus:ring-2 focus:ring-[#dbe9e7]"><option>TikTok</option><option>Instagram</option><option>X</option></select></label>

                <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#5c6b7a]">{socialPlatform} username<input type="text" placeholder="@yourusername" value={socialUsername} onChange={(e) => setSocialUsername(e.target.value)} className="mt-2 w-full border border-[#cbd5df] bg-[#f7faf9] px-4 py-3.5 text-sm text-[#102033] outline-none transition focus:border-[#2c7a7b] focus:ring-2 focus:ring-[#dbe9e7]" required /></label>

              </>}

              {authMode === "phone" && <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#5c6b7a]">Phone number<input type="tel" placeholder="+1 (555) 000-0000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-2 w-full border border-[#cbd5df] bg-[#f7faf9] px-4 py-3.5 text-sm text-[#102033] outline-none transition focus:border-[#2c7a7b] focus:ring-2 focus:ring-[#dbe9e7]" required /></label>}

              {(authMode === "username" || authMode === "phone") && <><label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#5c6b7a]">Create username<input type="text" placeholder="e.g. career_builder99" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 w-full border border-[#cbd5df] bg-[#f7faf9] px-4 py-3.5 text-sm text-[#102033] outline-none transition focus:border-[#2c7a7b] focus:ring-2 focus:ring-[#dbe9e7]" required /></label>

              <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#5c6b7a]"><span className="flex items-center justify-between">Six-digit PIN<button type="button" onClick={generateSixDigitPin} className="normal-case tracking-normal text-[#2c7a7b] hover:underline">Generate PIN</button></span><input type="text" inputMode="numeric" maxLength={6} placeholder="------" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full border border-[#cbd5df] bg-[#f7faf9] px-4 py-3.5 text-center font-mono text-lg tracking-[0.5em] text-[#102033] outline-none transition focus:border-[#2c7a7b] focus:ring-2 focus:ring-[#dbe9e7]" required /></label></>}

              <div className="flex items-start gap-3 bg-[#eef5f3] p-4 text-xs leading-5 text-[#5c6b7a]"><FiLock className="mt-0.5 shrink-0 text-[#2c7a7b]" size={15} />Your session is stored locally on this device and protected with a timed access token.</div>

              <div className="flex gap-3 pt-1"><button type="button" onClick={() => setAuthMode("select")} className="border border-[#cbd5df] px-5 py-3 text-sm font-bold text-[#5c6b7a] transition hover:border-[#2c7a7b]">Back</button><button type="submit" disabled={isSigningIn} className="flex flex-1 items-center justify-center gap-2 bg-[#f3c969] px-5 py-3 text-sm font-bold text-[#102033] transition hover:bg-[#e5b94f] disabled:cursor-wait disabled:opacity-70">{isSigningIn ? <span className="animate-pulse">Signing in...</span> : <>Continue <FiArrowRight size={16} /></>}</button></div>

            </form>}

          </div>

        </section>

      </div>

    </main>

  );

}

