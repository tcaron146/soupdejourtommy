'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/app/firebase";
import { deleteObject, ref } from "firebase/storage";
import Link from "next/link";
import Comments from "./Comments";

export default function PostCard({ post }) {
  if (!post) return null;

  const {
    id,
    text = "",
    username = "Unknown",
    avatarUrl = "",
    imageUrl = "",
    createdAt = null,
    userId,
  } = post;

  const { user } = UserAuth() || {};

  // ⭐ Saved / favorite state
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(true);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState(text);

  // Comments toggle
  const [showComments, setShowComments] = useState(false);

  // Format time
  const formatTime = () => {
    if (!createdAt?.toDate) return "";
    const now = new Date();
    const date = createdAt.toDate();
    const diff = (now - date) / 1000;

    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  // Check if post is saved
  useEffect(() => {
    if (!user) {
      setSaveLoading(false);
      return;
    }

    const favRef = doc(db, "users", user.uid, "favorites", id);

    getDoc(favRef).then((snap) => {
      if (snap.exists()) setIsSaved(true);
      setSaveLoading(false);
    });
  }, [user, id]);

  // Toggle Save / Unsave
  const toggleSave = async () => {
    if (saveLoading) return;
    if (!user) return alert("Login to save posts!");

    const favRef = doc(db, "users", user.uid, "favorites", id);

    if (isSaved) {
      await deleteDoc(favRef);
      setIsSaved(false);
    } else {
      await setDoc(favRef, { saved: true, savedAt: Date.now() });
      setIsSaved(true);
    }
  };

  // DELETE POST (only you / owner)
  const handleDelete = async () => {
    if (!user || user.uid !== userId) return;
    if (!confirm("Delete this post?")) return;

    try {
      if (imageUrl) {
        const decoded = decodeURIComponent(imageUrl);
        const imagePath = decoded.split("/o/")[1].split("?")[0];
        const imgRef = ref(storage, imagePath);
        await deleteObject(imgRef).catch(() => {});
      }

      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete post.");
    }
  };

  // UPDATE TEXT
  const handleUpdate = async () => {
    if (!user || user.uid !== userId) return;

    await updateDoc(doc(db, "posts", id), {
      text: newText.trim(),
    });

    setEditing(false);
  };

  return (
    <article className="mb-5 rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3">
      {/* Header: avatar + name + time */}
      <header className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-full overflow-hidden bg-neutral-700/40">
          <Image
            src={avatarUrl || "/default-avatar.png"}
            alt="avatar"
            width={36}
            height={36}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        <div className="flex flex-col">
          <Link href={`/profile/${userId}`}>
            <span className="font-semibold text-sm hover:underline cursor-pointer">
              {username}
            </span>
          </Link>
          <span className="text-xs text-neutral-500">{formatTime()}</span>
        </div>
      </header>

      {/* Body: text first, image second */}
      <div className="space-y-3">
        {/* Text / blurb */}
        <p className="text-sm sm:text-[0.95rem] leading-relaxed whitespace-pre-line">
          {text}
        </p>

        {/* Image – smaller / more subtle */}
        {imageUrl && (
          <div className="rounded-lg overflow-hidden border border-neutral-800 w-full max-w-md">
            <Image
              src={imageUrl}
              alt="post image"
              width={600}
              height={350}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>

      {/* Actions: save + comments toggle */}
      <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
        {/* Save */}
        <button
          onClick={toggleSave}
          disabled={saveLoading}
          className={`flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-900 border border-neutral-700 hover:border-yellow-400 transition ${
            isSaved ? "text-yellow-400" : "hover:text-yellow-300"
          }`}
        >
          <span>{isSaved ? "★" : "☆"}</span>
          <span>{isSaved ? "Saved" : "Save"}</span>
        </button>

        {/* Comments toggle */}
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-900 border border-neutral-700 hover:border-neutral-400 hover:text-white transition"
        >
          💬
          <span>{showComments ? "Hide comments" : "Show comments"}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && <Comments postId={id} />}

      {/* Edit / Delete (owner) */}
      {user && user.uid === userId && (
        <footer className="flex gap-3 text-xs mt-3">
          <button
            onClick={() => setEditing(true)}
            className="text-blue-400 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-400 hover:underline"
          >
            Delete
          </button>
        </footer>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-3">Edit post</h2>
            <textarea
              className="w-full bg-neutral-800 p-2 rounded text-sm"
              rows={4}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-1 bg-neutral-700 rounded text-sm"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 bg-primary text-background rounded text-sm"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
