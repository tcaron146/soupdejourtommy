"use client";

import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db, storage } from "@/app/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CreatePost() {
  const { user } = UserAuth() || {};
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return setError("You must be logged in to post.");

    // --- Validation ---
    if (!image) return setError("A photo or video is required.");
    if (!text.trim()) return setError("Caption cannot be empty.");

    setError("");
    setLoading(true);

    try {
      // Upload image
      const imgRef = ref(storage, `posts/${user.uid}/${image.name}`);
      await uploadBytes(imgRef, image);
      const imageUrl = await getDownloadURL(imgRef);

      // Save post to Firestore
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        username: user.username, 
        avatarUrl: user.avatarUrl, 
        text: text.trim(),
        imageUrl,
        createdAt: serverTimestamp(),
        likes: 0,
      });

      setText("");
      setImage(null);
    } catch (err) {
      console.error("Post error:", err);
      setError("Failed to post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8 p-4 border-b border-neutral-700/30">
      <textarea
        className="w-full bg-neutral-900/20 p-3 rounded-xl text-sm"
        placeholder="Write a caption..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mt-3 text-sm"
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-3 px-4 py-2 rounded-lg text-background ${
          loading ? "bg-neutral-700" : "bg-primary"
        }`}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
}
