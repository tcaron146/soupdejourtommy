'use client';

import { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/app/firebase';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StoryNav from '@/app/components/StoryNav';

export default function ReviewDetailPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [prevReview, setPrevReview] = useState(null);
  const [nextReview, setNextReview] = useState(null);

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

        const q = query(
          collection(db, 'reviews'),
          orderBy('date', 'desc'),
          orderBy('__name__', 'asc')
        );

        const all = await getDocs(q);
        const docs = all.docs.map((d) => ({
          id: d.id,
          title: d.data().businessName,
        }));

        const index = docs.findIndex((d) => d.id === id);
        if (index !== -1) {
          setPrevReview(index > 0 ? docs[index - 1] : null);
          setNextReview(index < docs.length - 1 ? docs[index + 1] : null);
        }
      } catch {
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

      <StoryNav prev={prevReview} next={nextReview} basePath="/reviews" />
    </main>
  );
}
