"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import ForumPost from "@/app/components/ForumPost";

export default function ForumStoryPage() {
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const q = query(
        collection(db, "stories"),
        orderBy("createdAt", "asc")
      );

      const snap = await getDocs(q);

      const stories = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const index = stories.findIndex((s) => s.id === id);

      if (index === -1) {
        setStory(null);
      } else {
        setStory(stories[index]);
        setPrev(stories[index - 1] || null);
        setNext(stories[index + 1] || null);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 text-center text-white">
        Loading story…
      </div>
    );
  }

  if (!story) {
    return (
      <div className="pt-40 text-center text-white">
        Story not found.
      </div>
    );
  }

  return (
    <ForumPost
      title={story.title}
      content={story.content}
      prev={prev}
      next={next}
    />
  );
}
