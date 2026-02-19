"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import Link from "next/link";
import StoryNav from "@/app/components/StoryNav";

export default function StoryPage() {
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [prevStory, setPrevStory] = useState(null);
  const [nextStory, setNextStory] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const snap = await getDoc(doc(db, "stories", id));
        if (!snap.exists()) {
          setLoading(false);
          return;
        }
        setStory(snap.data());
      } finally {
        setLoading(false);
      }

      try {
        const q = query(
          collection(db, "stories"),
          orderBy("title", "asc")
        );

        const all = await getDocs(q);
        const docs = all.docs.map((d) => ({ id: d.id, title: d.data().title }));

        const index = docs.findIndex((d) => d.id === id);
        if (index === -1) return;

        setPrevStory(index > 0 ? docs[index - 1] : null);
        setNextStory(index < docs.length - 1 ? docs[index + 1] : null);
      } catch {
        // nav silently fails — story still renders
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <main className="pt-32 max-w-2xl mx-auto px-6">
        <div className="animate-pulse space-y-4 mt-8">
          <div className="h-3 w-24 bg-neutral-800 rounded" />
          <div className="h-10 w-3/4 bg-neutral-800 rounded mt-8" />
          <div className="h-4 w-1/3 bg-neutral-800 rounded" />
          <div className="space-y-3 mt-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-neutral-800 rounded w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="pt-32 max-w-2xl mx-auto px-6 text-white">
        <p className="text-neutral-400">Story not found.</p>
        <Link href="/stories" className="text-sm text-highlights hover:underline mt-4 inline-block">
          ← Back to Chronicles
        </Link>
      </main>
    );
  }

  return (
    <article className="pt-28 max-w-2xl mx-auto px-6 pb-20">

      {/* Breadcrumb */}
      <Link
        href="/stories"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-600
                   hover:text-neutral-300 transition-colors duration-200 mb-10"
      >
        ← Chronicles
      </Link>

      {/* Header */}
      <header className="mb-10 pb-8 border-b border-neutral-800/60">
        <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold mb-4">
          Chronicle
        </p>
        <h1 className="font-bold text-white leading-tight tracking-tight
                        text-4xl sm:text-5xl">
          {story.title}
        </h1>
        {story.date && (
          <p className="text-sm text-neutral-600 mt-4">
            {story.date.toDate
              ? story.date.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
              : story.date}
          </p>
        )}
      </header>

      {/* Content */}
      <div className="text-neutral-300 text-[17px] leading-8 whitespace-pre-line
                      [&>p]:mb-6 tracking-[0.01em]">
        {story.content}
      </div>

      <StoryNav prev={prevStory} next={nextStory} />
    </article>
  );
}
