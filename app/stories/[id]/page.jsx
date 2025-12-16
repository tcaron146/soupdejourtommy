'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';

export default function StoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const snap = await getDoc(doc(db, 'stories', id));
      if (snap.exists()) {
        setStory(snap.data());
      }
      setLoading(false);
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
      <div className="prose prose-invert">{story.content}</div>
    </article>
  );
}
