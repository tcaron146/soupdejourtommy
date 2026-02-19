"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/app/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import { UserAuth } from "@/app/context/AuthContext";
import EditProfileModal from "@/app/components/EditProfileModal";

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = UserAuth() || {};

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedItems, setSavedItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwnProfile = currentUser?.uid === userId;

  useEffect(() => {
    if (!userId) return;

    async function load() {
      try {
        const userSnap = await getDoc(doc(db, "users", userId));
        if (userSnap.exists()) setUserInfo(userSnap.data());
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId]);

  useEffect(() => {
    if (!isOwnProfile || !userId) return;

    async function loadSaved() {
      try {
        const q = query(
          collection(db, "users", userId, "saved"),
          orderBy("savedAt", "desc")
        );
        const snap = await getDocs(q);
        setSavedItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch { /* silently fail */ }
    }

    loadSaved();
  }, [isOwnProfile, userId]);

  if (loading) {
    return (
      <main className="pt-32 max-w-2xl mx-auto px-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-full bg-neutral-800" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 bg-neutral-800 rounded" />
              <div className="h-3 w-48 bg-neutral-800 rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!userInfo) {
    return (
      <main className="pt-32 max-w-2xl mx-auto px-6 text-center">
        <p className="text-neutral-500">User not found.</p>
        <Link href="/" className="text-sm text-highlights hover:underline mt-4 inline-block">← Home</Link>
      </main>
    );
  }

  const savedReviews = savedItems.filter((s) => s.type === "review");
  const savedStories = savedItems.filter((s) => s.type === "story");

  return (
    <main className="pt-28 max-w-2xl mx-auto px-6 pb-20">

      {/* Profile header */}
      <div className="flex items-start gap-5 mb-8">
        {userInfo.avatarUrl ? (
          <img
            src={userInfo.avatarUrl}
            alt={userInfo.username || ''}
            className="w-20 h-20 rounded-full object-cover border border-neutral-800 shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
            <span className="text-2xl text-neutral-600">
              {userInfo.username?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-white tracking-tight">
              {userInfo.username}
            </h1>
            {isOwnProfile && (
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                           border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500
                           shadow-none w-auto mt-0"
              >
                Edit Profile
              </button>
            )}
          </div>

          {userInfo.bio && (
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">{userInfo.bio}</p>
          )}

          {userInfo.createdAt && (
            <p className="text-xs text-neutral-600 mt-3">
              Joined {(userInfo.createdAt.toDate
                ? userInfo.createdAt.toDate()
                : new Date(userInfo.createdAt)
              ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      {/* Saved items — owner only */}
      {isOwnProfile && (
        <div className="border-t border-neutral-800/60 pt-10 space-y-10">
          {savedReviews.length > 0 && (
            <section>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 font-semibold mb-4">
                Saved Reviews
              </p>
              <div className="flex flex-col gap-2">
                {savedReviews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/reviews/${item.itemId}`}
                    className="flex items-center justify-between py-3 border-b border-neutral-800/40
                               hover:border-neutral-700 transition-colors group"
                  >
                    <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                      {item.title}
                    </span>
                    <span className="text-neutral-700 group-hover:text-highlights group-hover:translate-x-1
                                     transition-all duration-200 text-sm shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {savedStories.length > 0 && (
            <section>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 font-semibold mb-4">
                Saved Stories
              </p>
              <div className="flex flex-col gap-2">
                {savedStories.map((item) => (
                  <Link
                    key={item.id}
                    href={`/stories/${item.itemId}`}
                    className="flex items-center justify-between py-3 border-b border-neutral-800/40
                               hover:border-neutral-700 transition-colors group"
                  >
                    <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                      {item.title}
                    </span>
                    <span className="text-neutral-700 group-hover:text-highlights group-hover:translate-x-1
                                     transition-all duration-200 text-sm shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {savedItems.length === 0 && (
            <p className="text-sm text-neutral-600">Nothing saved yet.</p>
          )}
        </div>
      )}

      {showEditModal && (
        <EditProfileModal
          userId={userId}
          currentBio={userInfo.bio}
          currentAvatar={userInfo.avatarUrl}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </main>
  );
}
