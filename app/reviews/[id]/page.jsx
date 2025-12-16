'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, limit, startAfter } from 'firebase/firestore';
import { db } from '@/app/firebase';
import Link from 'next/link';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (loading) return;
    setLoading(true);

    let q = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    if (lastDoc) {
      q = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(5)
      );
    }

    const snap = await getDocs(q);

    setReviews(prev => [
      ...prev,
      ...snap.docs.map(d => ({ id: d.id, ...d.data() }))
    ]);

    setLastDoc(snap.docs[snap.docs.length - 1]);
    setLoading(false);
  }

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <main className="pt-32 max-w-3xl mx-auto px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Reviews</h1>

      <ul className="space-y-4">
        {reviews.map(r => (
          <li key={r.id}>
            <Link href={`/reviews/${r.id}`} prefetch={false}>
              <div className="p-4 rounded-lg bg-neutral-900/40 hover:bg-neutral-900">
                <h2 className="font-semibold">{r.title}</h2>
                <p className="text-sm text-neutral-400">{r.subtitle}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={loadMore}
        disabled={loading}
        className="mt-6 px-4 py-2 border rounded"
      >
        {loading ? 'Loading…' : 'Load more'}
      </button>
    </main>
  );
}
