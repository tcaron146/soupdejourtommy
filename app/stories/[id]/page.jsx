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

export default function StoryPage() {
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);

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

const q = query(
  collection(db, 'stories'),
  orderBy('date', 'asc'),
  orderBy('__name__', 'asc')
);

const all = await getDocs(q);
const ids = all.docs.map(d => d.id);

const index = ids.indexOf(id);
if (index === -1) return;

setPrevId(index > 0 ? ids[index - 1] : null);
setNextId(index < ids.length - 1 ? ids[index + 1] : null);


      } finally {
        setLoading(false);
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

      <div className=" mb-12">{story.content}</div>

      {/*Navigation */}
<div className="mt-12 flex justify-between items-center border-t border-neutral-800 pt-6">
  {prevId ? (
    <Link
      href={`/stories/${prevId}`}
      className="flex items-center gap-2 px-3 py-2 rounded
                 text-sm text-neutral-300 hover:text-white
                 hover:bg-neutral-800 cursor-pointer select-none"
    >
      ← Previous
    </Link>
  ) : (
    <span
      className="flex items-center gap-2 px-3 py-2 rounded
                 text-sm text-neutral-600 opacity-50 select-none"
    >
      ← Previous
    </span>
  )}

  {nextId ? (
    <Link
      href={`/stories/${nextId}`}
      className="flex items-center gap-2 px-3 py-2 rounded
                 text-sm text-neutral-300 hover:text-white
                 hover:bg-neutral-800 cursor-pointer select-none"
    >
      Next →
    </Link>
  ) : (
    <span
      className="flex items-center gap-2 px-3 py-2 rounded
                 text-sm text-neutral-600 opacity-50 select-none"
    >
      Next →
    </span>
  )}
</div>


    </article>
  );
}
