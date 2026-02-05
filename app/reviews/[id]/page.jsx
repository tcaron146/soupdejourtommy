'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ReviewDetailPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function loadReview() {
      try {
        const ref = doc(db, 'reviews', id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError('Review not found');
          return;
        }

        setReview({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error(err);
        setError('Failed to load review');
      } finally {
        setLoading(false);
      }
    }

    loadReview();
  }, [id]);

  if (loading) {
    return (
      <main className="pt-32 max-w-3xl mx-auto px-4 text-white">
        <p className="text-neutral-400">Loading review…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-32 max-w-3xl mx-auto px-4 text-white">
        <p className="text-red-400">{error}</p>
        <Link href="/reviews" className="underline mt-4 inline-block">
          ← Back to reviews
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-32 max-w-3xl mx-auto px-4 text-white">
      <Link href="/reviews" className="text-sm underline text-neutral-400">
        ← Back to reviews
      </Link>

      <h1 className="text-3xl font-bold mt-4">{review.businessName}</h1>

      <p className="mt-4 text-neutral-300 whitespace-pre-line">
        {review.comment}
      </p>

      <p className="mt-6 text-sm text-neutral-400">
        Rating: {review.rating} ⭐
      </p>

      {review.date && (
        <p className="text-xs text-neutral-500 mt-2">
          {review.date.toDate().toLocaleDateString()}
        </p>
      )}
    </main>
  );
}
