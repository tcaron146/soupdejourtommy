'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/app/firebase';
import Link from 'next/link';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const q = query(collection(db, 'stories'), orderBy('title'));
      const snap = await getDocs(q);
      setStories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="pt-32 text-white text-center">Loading stories…</div>;
  }

  return (
    <main className="pt-32 max-w-3xl mx-auto px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Chronicles</h1>

      <ul className="space-y-4">
        {stories.map(story => (
          <li key={story.id}>
            <Link href={`/stories/${story.id}`} prefetch={false}>
              <div className="p-4 rounded-lg bg-neutral-900/40 hover:bg-neutral-900">
                <h2 className="text-xl font-semibold">{story.title}</h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
