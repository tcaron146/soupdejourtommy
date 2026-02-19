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
    return <div className="pt-32 text-white text-center">Loading…</div>;
  }

  if (!story) {
    return <div className="pt-32 text-white text-center">Story not found.</div>;
  }

  return (
    <article className="pt-32 max-w-3xl mx-auto px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">{story.title}</h1>

      <div className="mb-12">{story.content}</div>

      <StoryNav prev={prevStory} next={nextStory} />
    </article>
  );
}
