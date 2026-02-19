"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { UserAuth } from "@/app/context/AuthContext";
import { saveItem, unsaveItem } from "@/app/utils/saveActions";

export default function SaveButton({ itemId, type, title }) {
  const { user, authLoading } = UserAuth() || {};
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !itemId) return;

    async function checkSaved() {
      try {
        const snap = await getDoc(doc(db, "users", user.uid, "saved", itemId));
        setSaved(snap.exists());
      } catch { /* silently fail */ }
    }

    checkSaved();
  }, [user, itemId]);

  async function toggle() {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        await unsaveItem(user.uid, itemId, type);
        setSaved(false);
      } else {
        await saveItem(user.uid, itemId, type, title);
        setSaved(true);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading || authLoading}
      title={saved ? "Remove from saved" : "Save"}
      className="flex items-center gap-2 text-sm transition-colors duration-200 disabled:opacity-50
                 border-0 shadow-none p-0 w-auto mt-0 font-normal rounded-none"
      style={{ color: saved ? "rgb(var(--color-highlights))" : "rgb(115,115,115)" }}
    >
      {saved ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3h14a1 1 0 011 1v17.27a.5.5 0 01-.78.42L12 17.27l-7.22 4.42A.5.5 0 014 21.27V4a1 1 0 011-1z"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 3h14a1 1 0 011 1v17.27a.5.5 0 01-.78.42L12 17.27l-7.22 4.42A.5.5 0 014 21.27V4a1 1 0 011-1z"/>
        </svg>
      )}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
