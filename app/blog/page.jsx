'use client'

import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";

import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

export default function Page() {
  const [posts, setPosts] = useState([]);

  // 🔥 Fetch posts in real-time from Firestore
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub(); // cleanup listener on unmount
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-primary pt-28 pb-16 flex justify-center px-4">
      <div className="w-full max-w-2xl">

        {/* Render posts */}
        {posts.length === 0 ? (
          <p className="text-center text-neutral-500 mt-10">No posts yet…</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}

      </div>
    </div>
  );
}
