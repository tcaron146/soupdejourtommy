"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/app/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.userId;

  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user info
  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);
    getDoc(userRef).then((snap) => {
      if (snap.exists()) setUserInfo(snap.data());
    });
  }, [userId]);

  // ⭐ Fetch Saved Posts
  useEffect(() => {
    if (!userId) return;

    const favRef = collection(db, "users", userId, "favorites");

    getDocs(favRef).then(async (snap) => {
      const savedIds = snap.docs.map((d) => d.id);

      if (savedIds.length === 0) return setSavedPosts([]);

      // Fetch the actual post data
      const postPromises = savedIds.map((id) =>
        getDoc(doc(db, "posts", id)).then((postSnap) =>
          postSnap.exists() ? { id, ...postSnap.data() } : null
        )
      );

      const resolved = await Promise.all(postPromises);
      setSavedPosts(resolved.filter(Boolean));
    });
  }, [userId]);

  if (!userInfo)
    return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto pt-28 px-4">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={userInfo.avatarUrl}
          className="w-20 h-20 rounded-full border border-neutral-700/30"
        />
        <div>
          <h1 className="text-xl font-semibold">{userInfo.username}</h1>
        </div>
      </div>

    </div>
  );
}
