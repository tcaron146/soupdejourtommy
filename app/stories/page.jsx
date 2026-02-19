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

  return (
    <main className="pt-32 min-h-screen px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold mb-3">
            Personal Narratives
          </p>
          <h1 className="text-5xl font-bold text-white tracking-tight">Chronicles</h1>
          <p className="mt-3 text-neutral-500 text-base">
            Stories from the road, the kitchen, and wild places.
          </p>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="py-5 border-b border-neutral-800/50 flex items-center gap-6 animate-pulse">
                <div className="w-8 h-6 bg-neutral-800 rounded" />
                <div className="h-5 bg-neutral-800 rounded flex-1 max-w-xs" />
              </div>
            ))}
          </div>
        ) : (
          <ol className="list-none">
            {stories.map((story, index) => (
              <li key={story.id} className="group">
                <Link href={`/stories/${story.id}`} prefetch={false}>
                  <div className="flex items-center gap-6 py-5 border-b border-neutral-800/40
                                  group-hover:border-neutral-700 transition-colors duration-200">
                    <span className="text-2xl font-bold text-neutral-800 group-hover:text-highlights
                                     transition-colors duration-200 tabular-nums w-8 shrink-0 text-right">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-medium text-neutral-300 group-hover:text-white
                                     transition-colors duration-200 flex-1 leading-snug">
                      {story.title}
                    </span>
                    <span className="text-neutral-700 group-hover:text-highlights shrink-0
                                     group-hover:translate-x-1 transition-all duration-200 text-sm">
                      →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}

        {!loading && stories.length === 0 && (
          <p className="text-neutral-600 text-sm mt-8">No stories yet.</p>
        )}

      </div>
    </main>
  );
}
