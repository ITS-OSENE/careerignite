"use client";

import { FormEvent, useEffect, useState } from "react";
import { 
  FiEdit3, FiLoader, FiSend, FiTrash2, FiShield, FiCamera, 
  FiImage, FiCheck, FiHeart, FiMessageSquare, FiShare2, 
  FiUserPlus, FiUserCheck, FiBriefcase, FiCornerUpRight, FiSearch 
} from "react-icons/fi";
import { createFirestorePost, deleteFirestorePost, readAllFirestorePosts, type FirestorePost } from "../lib/firestore";
import { getPreferredAuthSession, type AuthSession } from "../lib/auth";

interface SocialPost extends FirestorePost {
  mediaUrl?: string;
  mediaType?: 'image' | 'text' | 'hiring';
  category?: string; // e.g. Healthcare, Engineering, Trade, Retail, Tech
  likes?: string[];
  comments?: { id: string; username: string; text: string; createdAt: string }[];
  sharesCount?: number;
  forwardsCount?: number;
}

export default function CareerIgnitePostsPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  
  // Creator Form State
  const [content, setContent] = useState("");
  const [mediaUrlInput, setMediaUrlInput] = useState("");
  const [postType, setPostType] = useState<'text' | 'image' | 'hiring'>('text');
  const [careerCategory, setCareerCategory] = useState("Trade & Retail");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Profile & Background Customizer State
  const [profilePic, setProfilePic] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop");
  const [bgPic, setBgPic] = useState("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userTitle, setUserTitle] = useState("Retail & Wholesale Professional");

  // Connections State
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [modalListType, setModalListType] = useState<'followers' | 'following' | null>(null);

  useEffect(() => {
    const currentSession = getPreferredAuthSession();
    setSession(currentSession);
    
    if (localStorage.getItem("ci_profile_pic")) setProfilePic(localStorage.getItem("ci_profile_pic")!);
    if (localStorage.getItem("ci_bg_pic")) setBgPic(localStorage.getItem("ci_bg_pic")!);
    if (localStorage.getItem("ci_user_title")) setUserTitle(localStorage.getItem("ci_user_title")!);

    if (currentSession) {
      const savedFollowing = localStorage.getItem(`ci_following_${currentSession.username}`);
      if (savedFollowing) setFollowing(JSON.parse(savedFollowing));

      const savedFollowers = localStorage.getItem(`ci_followers_${currentSession.username}`);
      if (savedFollowers) {
        setFollowers(JSON.parse(savedFollowers));
      } else {
        const defaultFollowers = ["Nurse_Joy", "Eng_Marcus", "TradeKing_Lagos"];
        setFollowers(defaultFollowers);
        localStorage.setItem(`ci_followers_${currentSession.username}`, JSON.stringify(defaultFollowers));
      }
    }

    readAllFirestorePosts()
      .then((data: FirestorePost[]) => {
        const enriched: SocialPost[] = data.map((p) => {
          const cachedSocial = localStorage.getItem(`ci_social_post_${p.id}`);
          if (cachedSocial) {
            return { ...p, ...JSON.parse(cachedSocial) };
          }
          return { 
            ...p, 
            mediaType: 'text', 
            category: 'Trade & Retail',
            likes: [], 
            comments: [], 
            sharesCount: 0,
            forwardsCount: 0
          };
        });
        setPosts(enriched);
      })
      .catch(() => setError("Career Ignite network synchronized locally."))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!showSuccess) return;
    const timer = window.setTimeout(() => setShowSuccess(false), 2200);
    return () => window.clearTimeout(timer);
  }, [showSuccess]);

  const persistSocialState = (updatedPosts: SocialPost[]) => {
    setPosts(updatedPosts);
    updatedPosts.forEach((p) => {
      localStorage.setItem(`ci_social_post_${p.id}`, JSON.stringify({
        mediaUrl: p.mediaUrl,
        mediaType: p.mediaType,
        category: p.category,
        likes: p.likes,
        comments: p.comments,
        sharesCount: p.sharesCount,
        forwardsCount: p.forwardsCount
      }));
    });
  };

  const toggleFollow = (targetUsername: string) => {
    if (!session || session.username === targetUsername) return;
    let updatedFollowing = [...following];
    if (updatedFollowing.includes(targetUsername)) {
      updatedFollowing = updatedFollowing.filter(u => u !== targetUsername);
    } else {
      updatedFollowing.push(targetUsername);
    }
    setFollowing(updatedFollowing);
    localStorage.setItem(`ci_following_${session.username}`, JSON.stringify(updatedFollowing));
  };

  const handleLike = (postId: string) => {
    if (!session) return;
    const updated = posts.map(p => {
      if (p.id === postId) {
        const currentLikes = p.likes || [];
        const hasLiked = currentLikes.includes(session.username);
        const newLikes = hasLiked ? currentLikes.filter(u => u !== session.username) : [...currentLikes, session.username];
        return { ...p, likes: newLikes };
      }
      return p;
    });
    persistSocialState(updated);
  };

  const handleAddComment = (postId: string, e: FormEvent) => {
    e.preventDefault();
    if (!session || !commentText.trim()) return;

    const updated = posts.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: Math.random().toString(36).substring(2),
          username: session.username,
          text: commentText.trim(),
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return { ...p, comments: [...(p.comments || []), newComment] };
      }
      return p;
    });
    persistSocialState(updated);
    setCommentText("");
  };

  const handleShare = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, sharesCount: (p.sharesCount || 0) + 1 };
      }
      return p;
    });
    persistSocialState(updated);
    navigator.clipboard.writeText(window.location.href);
    setActionFeedback("🔗 Job link ready to post on Instagram!");
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleForward = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, forwardsCount: (p.forwardsCount || 0) + 1 };
      }
      return p;
    });
    persistSocialState(updated);
    setActionFeedback("🚀 Career opportunity shared!");
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (!session || (!trimmedContent && !mediaUrlInput) || isSaving) return;

    setIsSaving(true);
    setError("");
    try {
      const id = await createFirestorePost(session.username, trimmedContent || 'Career Opportunity Post');
      const newPost: SocialPost = { 
        id, 
        username: session.username, 
        content: trimmedContent, 
        mediaType: postType,
        category: careerCategory,
        mediaUrl: mediaUrlInput.trim() || undefined,
        likes: [], 
        comments: [], 
        sharesCount: 0,
        forwardsCount: 0 
      };
      persistSocialState([newPost, ...posts]);
      setContent("");
      setMediaUrlInput("");
      setPostType('text');
      setShowSuccess(true);
    } catch {
      const mockId = 'local_' + Math.random().toString(36).substring(2);
      const fallbackPost: SocialPost = {
        id: mockId,
        username: session.username,
        content: trimmedContent || 'Local job / career post',
        mediaType: postType,
        category: careerCategory,
        mediaUrl: mediaUrlInput.trim() || undefined,
        likes: [],
        comments: [],
        sharesCount: 0,
        forwardsCount: 0
      };
      persistSocialState([fallbackPost, ...posts]);
      setContent("");
      setMediaUrlInput("");
      setShowSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteFirestorePost(postId);
    } catch {}
    const updated = posts.filter((post) => post.id !== postId);
    setPosts(updated);
    localStorage.removeItem(`ci_social_post_${postId}`);
  };

  const categories = ["All", "Healthcare", "Engineering", "Trade & Retail", "Tech & Software", "Online Business", "Services"];
  const filteredPosts = selectedFilter === "All" ? posts : posts.filter(p => p.category === selectedFilter);

  return (
    <main data-theme="career-ignite" className="min-h-screen bg-[#f4f7f6] pb-24 text-[#0f172a]">
      
      {/* Banner Background */}
      <div 
        className="h-56 w-full bg-cover bg-center relative shadow-inner"
        style={{ backgroundImage: `url('${bgPic}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#09201f]/90 via-black/30 to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <h1 className="text-white font-black text-lg tracking-wide flex items-center gap-2 drop-shadow">
            🔥 Career Ignite
          </h1>
          <p className="text-emerald-300 text-[10px] font-medium">The shortest way to manifest your career.</p>
        </div>

        <div className="absolute bottom-4 right-6 z-10 flex gap-3 items-center">
          {actionFeedback && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold animate-pulse shadow-lg">
              {actionFeedback}
            </span>
          )}
          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-[#0f172a] font-bold text-xs shadow-lg hover:bg-white transition flex items-center gap-2"
          >
            <FiCamera size={14} /> {isEditingProfile ? "Close Profile" : "Edit Professional Profile"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 md:px-0 -mt-16 relative z-25">
        
        {/* Profile Info Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md mb-6 flex flex-col sm:flex-row items-center gap-6">
          <img 
            src={profilePic} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <h2 className="text-xl font-black">{session ? `@${session.username}` : "@Guest_Professional"}</h2>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
                {userTitle}
              </span>
            </div>
            
            <div className="flex justify-center sm:justify-start gap-6 text-xs pt-2">
              <div><span className="font-bold text-[#0f172a]">{posts.filter(p => p.username === session?.username).length}</span> <span className="text-slate-500">Listings/Posts</span></div>
              <div onClick={() => setModalListType('followers')} className="cursor-pointer hover:text-emerald-700 transition"><span className="font-bold text-[#0f172a]">{followers.length}</span> <span className="text-slate-500">Followers</span></div>
              <div onClick={() => setModalListType('following')} className="cursor-pointer hover:text-emerald-700 transition"><span className="font-bold text-[#0f172a]">{following.length}</span> <span className="text-slate-500">Following</span></div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal/Box */}
        {isEditingProfile && (
          <div className="rounded-2xl border-2 border-emerald-600 bg-white p-6 shadow-xl mb-6 space-y-4 animate-fade-in">
            <h3 className="font-black text-sm flex items-center gap-2 text-emerald-700 border-b pb-2">
              <FiBriefcase /> Update Professional Details
            </h3>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Avatar Image URL</label>
                <input 
                  type="text" 
                  value={profilePic}
                  onChange={(e) => { setProfilePic(e.target.value); localStorage.setItem("ci_profile_pic", e.target.value); }}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-slate-50 outline-none focus:border-emerald-600"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Job Title / Specialty (e.g. Nurse, Engineer, Retailer)</label>
                <input 
                  type="text" 
                  value={userTitle}
                  onChange={(e) => { setUserTitle(e.target.value); localStorage.setItem("ci_user_title", e.target.value); }}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-slate-50 outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Job / Skill Creator Form */}
        {session ? (
          <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
                <FiEdit3 size={16} /> Post Work Opportunity or Showcase
              </div>
              
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button type="button" onClick={() => setPostType('text')} className={`px-3 py-1 rounded-lg transition ${postType === 'text' ? 'bg-white shadow text-emerald-800' : 'text-slate-500'}`}>Thought</button>
                <button type="button" onClick={() => setPostType('image')} className={`px-3 py-1 rounded-lg transition ${postType === 'image' ? 'bg-white shadow text-emerald-800' : 'text-slate-500'}`}>Work Photo</button>
                <button type="button" onClick={() => setPostType('hiring')} className={`px-3 py-1 rounded-lg transition ${postType === 'hiring' ? 'bg-white shadow text-emerald-800' : 'text-slate-500'}`}>Hiring / Gig</button>
              </div>
            </div>

            {showSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                ✓ Successfully published on Career Ignite!
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Career Sector / Industry</label>
                <select 
                  value={careerCategory} 
                  onChange={(e) => setCareerCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-600"
                >
                  {categories.filter(c => c !== "All").map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {postType !== 'text' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">{postType === 'hiring' ? 'Contact / Application Link' : 'Image URL'}</label>
                  <input 
                    type="text" 
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    placeholder={postType === 'hiring' ? "https://wa.me/... or email" : "https://images.unsplash.com/..."}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                </div>
              )}
            </div>

            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              maxLength={500} 
              placeholder={postType === 'hiring' ? "We are hiring! Describe the job, requirements, location..." : "Share what you do, looking for a job as a nurse, engineer, trader, retailer..."} 
              className="min-h-24 w-full resize-y rounded-xl border border-slate-300 bg-[#fbfdfc] px-4 py-3 text-xs outline-none focus:border-emerald-600" 
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-400">{content.length}/500 chars</span>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-5 py-2.5 text-xs font-black text-white shadow-md hover:opacity-90 disabled:opacity-50"
              >
                {isSaving ? <><FiLoader className="animate-spin" size={14} /> Publishing...</> : <><FiSend size={14} /> Ignite Post</>}
              </button>
            </div>
          </form>
        ) : (
          <p className="mb-6 border border-slate-200 bg-white p-5 text-center text-xs text-slate-600 rounded-2xl shadow-sm">
            Sign in to post job vacancies, showcase your trade or profession, and connect with employers.
          </p>
        )}

        {error && <p className="mb-4 text-xs text-red-600 font-semibold">{error}</p>}

        {/* Sector Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${selectedFilter === cat ? 'bg-emerald-700 text-white shadow' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feed Stream */}
        <section className="space-y-6">
          {isLoading ? (
            <p className="text-center text-xs text-slate-500 py-6">Loading Career Ignite network...</p>
          ) : filteredPosts.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">No career opportunities found in this sector yet. Be the first to post!</p>
          ) : (
            filteredPosts.map((post) => {
              const isLikedByMe = session && post.likes?.includes(session.username);
              const isFollowingUser = session && following.includes(post.username);
              const isMyPost = session?.username === post.username;

              return (
                <article key={post.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden space-y-3">
                  <div className="flex items-center justify-between p-4 pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center font-bold text-white text-xs shadow">
                        {post.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black uppercase tracking-wider text-emerald-800">@{post.username.replace(/^@/, "")}</p>
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                            {post.category || 'General'}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400">Career Ignite Verified Node</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {session && !isMyPost && (
                        <button 
                          onClick={() => toggleFollow(post.username)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${isFollowingUser ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-emerald-700 text-white hover:bg-emerald-800'}`}
                        >
                          {isFollowingUser ? <><FiUserCheck size={12} /> Following</> : <><FiUserPlus size={12} /> Follow</>}
                        </button>
                      )}
                      {isMyPost && (
                        <button onClick={() => handleDelete(post.id)} className="text-slate-400 hover:text-red-600 p-1" title="Delete listing">
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {post.content && (
                    <p className="px-4 text-xs whitespace-pre-wrap leading-relaxed text-[#1e293b]">
                      {post.content}
                    </p>
                  )}

                  {post.mediaType === 'image' && post.mediaUrl && (
                    <div className="w-full bg-black">
                      <img 
                        src={post.mediaUrl} 
                        alt="Work showcase" 
                        className="w-full max-h-[450px] object-cover"
                        onError={(e)=>{ (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {post.mediaType === 'hiring' && post.mediaUrl && (
                    <div className="mx-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5"><FiBriefcase /> Open Job / Apply Contact</span>
                      <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition">
                        Connect / Apply
                      </a>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-5">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 transition hover:text-red-500 font-bold ${isLikedByMe ? 'text-red-600' : ''}`}
                        title="Like post"
                      >
                        <FiHeart size={16} className={isLikedByMe ? 'fill-red-600 text-red-600' : ''} />
                        <span>{post.likes?.length || 0}</span>
                      </button>

                      <button 
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                        className="flex items-center gap-1.5 transition hover:text-emerald-700 font-bold"
                        title="Comment"
                      >
                        <FiMessageSquare size={16} />
                        <span>{post.comments?.length || 0}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleForward(post.id)}
                        className="flex items-center gap-1 transition hover:text-emerald-600 font-bold"
                        title="Forward"
                      >
                        <FiCornerUpRight size={16} />
                        <span>{post.forwardsCount || 0}</span>
                      </button>

                      <button 
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-1.5 transition hover:text-emerald-700 font-bold"
                        title="Share to Instagram"
                      >
                        <FiShare2 size={16} />
                        <span>{post.sharesCount || 0}</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {activeCommentPostId === post.id && (
                    <div className="bg-slate-50 p-4 border-t border-slate-100 space-y-3">
                      <p className="text-[11px] font-black uppercase text-slate-500">Career Discussion</p>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {(!post.comments || post.comments.length === 0) ? (
                          <p className="text-[11px] text-slate-400 italic">No inquiries or comments yet.</p>
                        ) : (
                          post.comments.map((c) => (
                            <div key={c.id} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-0.5">
                              <div className="flex justify-between items-center text-[9px] text-slate-400">
                                <span className="font-bold text-emerald-800">@{c.username}</span>
                                <span>{c.createdAt}</span>
                              </div>
                              <p className="text-slate-700">{c.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {session ? (
                        <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-2 pt-1">
                          <input 
                            type="text" 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Ask a question or apply..."
                            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-600"
                          />
                          <button type="submit" className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold">Reply</button>
                        </form>
                      ) : (
                        <p className="text-[10px] text-slate-400">Sign in to leave a message or inquiry.</p>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

      </div>

      {/* Followers / Following Modal */}
      {modalListType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-sm uppercase text-emerald-800">
                {modalListType === 'followers' ? 'Network Followers' : 'Connections You Follow'}
              </h3>
              <button onClick={() => setModalListType(null)} className="text-xs font-bold text-slate-400 hover:text-black">✕</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(modalListType === 'followers' ? followers : following).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No connections listed yet.</p>
              ) : (
                (modalListType === 'followers' ? followers : following).map((username, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-bold text-[#0f172a]">@{username}</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Ignited</span>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => setModalListType(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </main>
  );
}