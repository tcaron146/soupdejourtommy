"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/app/firebase";
import { collection, doc, getDoc, getCountFromServer } from "firebase/firestore";
import Link from "next/link";
import { UserAuth } from "@/app/context/AuthContext";
import { followUser, unfollowUser } from "@/app/utils/followActions";

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = UserAuth() || {};

  const [userInfo, setUserInfo] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.uid === userId;

  useEffect(() => {
    if (!userId) return;

    async function load() {
      try {
        const [userSnap, followersSnap, followingSnap] = await Promise.all([
          getDoc(doc(db, "users", userId)),
          getCountFromServer(collection(db, "users", userId, "followers")),
          getCountFromServer(collection(db, "users", userId, "following")),
        ]);

        if (userSnap.exists()) setUserInfo(userSnap.data());
        setFollowerCount(followersSnap.data().count);
        setFollowingCount(followingSnap.data().count);

        if (currentUser && !isOwnProfile) {
          const followSnap = await getDoc(
            doc(db, "users", currentUser.uid, "following", userId)
          );
          setIsFollowing(followSnap.exists());
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId, currentUser, isOwnProfile]);

  async function handleFollow() {
    if (!currentUser || followLoading) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(currentUser.uid, userId);
        setIsFollowing(false);
        setFollowerCount(c => c - 1);
      } else {
        await followUser(currentUser.uid, userId);
        setIsFollowing(true);
        setFollowerCount(c => c + 1);
      }
    } catch { /* silently fail */ }
    finally { setFollowLoading(false); }
  }

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
            {!isOwnProfile && currentUser && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                           border-0 shadow-none w-auto mt-0 disabled:opacity-50"
                style={{
                  backgroundColor: isFollowing ? 'transparent' : 'rgb(var(--color-highlights) / 0.9)',
                  color: isFollowing ? 'rgb(115,115,115)' : 'white',
                  outline: isFollowing ? '1px solid rgb(38,38,38)' : 'none',
                }}
              >
                {followLoading ? '…' : isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {userInfo.bio && (
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">{userInfo.bio}</p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-5 mt-3">
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{followerCount}</p>
              <p className="text-xs text-neutral-600">Followers</p>
            </div>
            <div className="w-px h-6 bg-neutral-800" />
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{followingCount}</p>
              <p className="text-xs text-neutral-600">Following</p>
            </div>
            {userInfo.createdAt && (
              <>
                <div className="w-px h-6 bg-neutral-800" />
                <p className="text-xs text-neutral-600">
                  Joined {(userInfo.createdAt.toDate
                    ? userInfo.createdAt.toDate()
                    : new Date(userInfo.createdAt)
                  ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800/60 pt-10">
        <p className="text-sm text-neutral-600 text-center">
          Stories and reviews coming soon.
        </p>
      </div>

    </main>
  );
}
