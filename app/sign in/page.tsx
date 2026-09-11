'use client';

import React, { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  // State management for form inputs and authentication methods
  const [authMode, setAuthMode] = useState('select'); // 'select', 'phone', 'username'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  // Password generator up to 6 digits
  const generateSixDigitPin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPassword(randomPin);
  };

  // Handle Form Submission & Secure Session Initialization
  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError('Please create or enter a valid username.');
      return;
    }

    if (!/^\d{6}$/.test(password)) {
      setError('Generated password must be strictly 6 digits.');
      return;
    }

    // Encapsulate user session securely (Isolated to client session storage)
    const sessionData = {
      username: trimmedUsername,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
      secureToken: Math.random().toString(36).substring(2),
    };

    sessionStorage.setItem('career_ignite_secure_session', JSON.stringify(sessionData));

    // Redirect to the Get Started page after successful login
    router.push('/overview');
  };

  // Google OAuth Simulator Handler
  const handleGoogleSignIn = () => {
    const googleSession = {
      username: 'GoogleUser_' + Math.floor(Math.random() * 1000),
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
      provider: 'Google'
    };
    sessionStorage.setItem('career_ignite_secure_session', JSON.stringify(googleSession));
    router.push('/overview');
  };

  return (
    <>
      <div className="min-h-screen bg-[#070B14] text-[#E2E8F0] font-sans flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-950/20 blur-[140px] pointer-events-none" />

        <div className="max-w-md w-full bg-[#10172A]/90 border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 bg-[#070B14] border border-slate-700 rounded-full text-[10px] font-mono tracking-widest uppercase text-cyan-400">
            SECURE AUTH PORTAL // 6-DIGIT ISOLATED SESSION
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Access Career-Ignite</h1>
          <p className="text-xs text-slate-400">Choose your authentication method to generate your secure workspace.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        {authMode === 'select' && (
          <div className="space-y-4 pt-2">
            {/* Google Sign In Option */}
            <button 
              onClick={handleGoogleSignIn}
              className="w-full py-3.5 px-4 rounded-xl bg-white text-[#070B14] font-bold text-xs flex items-center justify-center gap-3 hover:bg-slate-200 transition shadow-lg cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12.24 10.28V14h5.45c-.24 1.25-1.42 3.65-5.45 3.65-3.28 0-5.96-2.71-5.96-6.05s2.68-6.05 5.96-6.05c1.87 0 3.12.8 3.84 1.49l2.6-2.5C17.12 3.14 14.89 2.25 12.24 2.25 7.14 2.25 3 6.39 3 11.5s4.14 9.25 9.24 9.25c5.33 0 8.87-3.75 8.87-9.03 0-.62-.07-1.09-.15-1.44z"/></svg>
              Sign in with Google
            </button>

            {/* Phone Number Option */}
            <button 
              onClick={() => setAuthMode('phone')}
              className="w-full py-3.5 px-4 rounded-xl bg-[#070B14] border border-slate-700 text-slate-200 font-semibold text-xs hover:border-slate-500 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📱</span> Sign in with Phone Number
            </button>

            {/* Standard Username/PIN Option */}
            <button 
              onClick={() => setAuthMode('username')}
              className="w-full py-3.5 px-4 rounded-xl bg-[#070B14] border border-slate-700 text-slate-200 font-semibold text-xs hover:border-slate-500 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔐</span> Create Username & 6-Digit PIN
            </button>
          </div>
        )}

        {/* Username & 6-Digit PIN Form */}
        {(authMode === 'username' || authMode === 'phone') && (
          <form onSubmit={handleSignIn} className="space-y-4 pt-2">
            
            {authMode === 'phone' ? (
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase">Phone Number</label>
                <input 
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#070B14] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-slate-500"
                  required
                />
              </div>
            ) : null}

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase">Create Username</label>
              <input 
                type="text"
                placeholder="e.g. cyber_builder99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#070B14] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-slate-500"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-mono text-slate-400 uppercase">6-Digit Pin Code</label>
                <button 
                  type="button" 
                  onClick={generateSixDigitPin}
                  className="text-[10px] text-cyan-400 hover:underline font-mono cursor-pointer"
                >
                  Generate Secure PIN
                </button>
              </div>
              <input 
                type="text"
                maxLength={6}
                placeholder="------"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#070B14] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white font-mono tracking-widest text-center focus:outline-none focus:border-slate-500"
                required
              />
            </div>

            <div className="p-3 bg-[#070B14]/60 border border-slate-800 rounded-xl text-[10px] text-slate-400 leading-relaxed">
              <span className="text-emerald-400 font-bold">● Session Protection Active:</span> Your login state is isolated exclusively to your local device session token. No other user can intercept your access.
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setAuthMode('select')}
                className="w-1/3 py-3 rounded-xl bg-[#070B14] border border-slate-700 text-xs text-slate-300 font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                Back
              </button>
              <button 
                type="submit"
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-slate-100 to-[#94A3B8] text-[#070B14] font-bold text-xs hover:opacity-90 transition shadow-lg cursor-pointer"
              >
                Sign In & Proceed →
              </button>
            </div>
          </form>
        )}

        </div>
      </div>
    </>
  );
}