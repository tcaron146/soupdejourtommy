'use client';

import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, orderBy, query, limit, startAfter } from 'firebase/firestore';
import { db } from '@/app/firebase';
import Link from 'next/link';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const hasLoadedOnce = useRef(false);

  async function loadMore() {
    if (loading) return;
    setLoading(true);

    try {
      let q = query(
        collection(db, 'reviews'),
        orderBy('date', 'desc'),
        limit(5)
      );

      if (lastDoc) {
        q = query(
          collection(db, 'reviews'),
          orderBy('date', 'desc'),
          startAfter(lastDoc),
          limit(5)
        );
      }

      const snap = await getDocs(q);

      setReviews(prev => {
        const existingIds = new Set(prev.map(r => r.id));

        const newOnes = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(r => !existingIds.has(r.id));

        return [...prev, ...newOnes];
      });

      if (!snap.empty) {
        setLastDoc(snap.docs[snap.docs.length - 1]);
      }
    } catch (err) {
      // silently fail — reviews list stays empty on error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasLoadedOnce.current) return;
    hasLoadedOnce.current = true;
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="pt-32 max-w-3xl mx-auto px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Reviews</h1>

      <ul className="space-y-4">
        {reviews.map(r => (
          <li key={r.id}>
            <Link href={`/reviews/${r.id}`} prefetch={false}>
              <div className="p-4 rounded-lg bg-neutral-900/40 hover:bg-neutral-900">
                <h2 className="font-semibold">{r.businessName}</h2>
                <p className="text-sm text-neutral-400 line-clamp-2">
                  {r.comment}
                </p>
                <p className="text-xs text-neutral-500 mt-2">
                  Rating: {r.rating} ⭐
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={loadMore}
        disabled={loading}
        className="mt-6 px-4 py-2 border rounded disabled:opacity-50"
      >
        {loading ? 'Loading…' : 'Load more'}
      </button>
    </main>
  );
}
