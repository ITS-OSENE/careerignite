"use client";

import { FormEvent, useEffect, useState } from "react";
import { FiLoader, FiPlus, FiSend, FiTrash2 } from "react-icons/fi";
import { createFirestorePost, deleteFirestorePost, readFirestorePosts, type FirestorePost } from "../../lib/firestore";
import { useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation";  

type ProfilePostsProps = {
  username: string;
};

export default function ProfilePosts({ username }: ProfilePostsProps) {
  const [posts, setPosts] = useState<FirestorePost[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    readFirestorePosts(username)
      .then(setPosts)
      .catch(() => setError("Posts are unavailable until Firestore rules are enabled."))
      .finally(() => setIsLoading(false));
  }, [username]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent || isSaving) return;

    setIsSaving(true);
    setError("");
    try {
      const id = await createFirestorePost(username, trimmedContent);
      setPosts((currentPosts) => [{ id, username, content: trimmedContent }, ...currentPosts]);
      setContent("");
    } catch {
      setError("This post could not be published. Check your Firestore rules.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteFirestorePost(postId);
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    } catch {
      setError("This post could not be deleted.");
    }
  };

  return (
    <section className="rounded-2xl border border-[#263c50] bg-[#111f31] p-5 md:p-7">
      <div className="flex items-center gap-3 border-b border-[#263c50] pb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2c7a7b] text-white">
          <FiPlus size={18} />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#62b6c1]">Community posts</p>
          <h2 className="text-xl font-black text-white">Share an update</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-5">
        <textarea 
          value={content} 
          onChange={(event) => setContent(event.target.value)} 
          maxLength={500} 
          placeholder="What are you working on?" 
          className="min-h-[7rem] w-full resize-y rounded-lg border border-[#334b61] bg-[#0b1827] px-4 py-3 text-sm text-white outline-none focus:border-[#62b6c1]" 
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-[#8297a5]">{content.length}/500</span>
          <button 
            type="submit" 
            disabled={isSaving || !content.trim()} 
            className="inline-flex items-center gap-2 rounded-lg bg-[#3d5df3] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? <FiLoader className="animate-spin" size={15} /> : <FiSend size={15} />} Publish
          </button>
        </div>
      </form>
      {error && <p role="alert" className="mt-4 text-xs text-[#f3a6a6]">{error}</p>}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p className="text-sm text-[#8297a5]">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-[#8297a5]">Your published updates will appear here.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="border border-[#263c50] bg-[#0b1827] p-4 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-[#d6e2e6]">{post.content}</p>
                <button 
                  type="button" 
                  onClick={() => handleDelete(post.id)} 
                  aria-label="Delete post" 
                  className="shrink-0 text-[#8297a5] transition hover:text-[#f3a6a6]"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}