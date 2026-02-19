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

function Stars({ rating }) {
  return (
    <span className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-neutral-700'} style={{fontSize: '16px'}}>
          ★
        </span>
      ))}
    </span>
  );
}

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
      } catch {
        setError('Failed to load review');
      } finally {
        setLoading(false);
      }

      try {
        const q = query(
          collection(db, 'reviews'),
          orderBy('date', 'desc')
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
        // nav silently fails — review still renders
      }
    }

    loadReview();
  }, [id]);

  if (loading) {
    return (
      <main className="pt-32 max-w-2xl mx-auto px-6">
        <div className="animate-pulse space-y-4 mt-8">
          <div className="h-3 w-24 bg-neutral-800 rounded" />
          <div className="h-10 w-2/3 bg-neutral-800 rounded mt-8" />
          <div className="flex gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-neutral-800 rounded-sm" />
            ))}
          </div>
          <div className="space-y-3 mt-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-neutral-800 rounded w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-32 max-w-2xl mx-auto px-6 text-white">
        <p className="text-red-400">{error}</p>
        <Link href="/reviews" className="text-sm text-highlights hover:underline mt-4 inline-block">
          ← Back to Reviews
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 max-w-2xl mx-auto px-6 pb-20">

      {/* Breadcrumb */}
      <Link
        href="/reviews"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-600
                   hover:text-neutral-300 transition-colors duration-200 mb-10"
      >
        ← Reviews
      </Link>

      {/* Header */}
      <header className="mb-10 pb-8 border-b border-neutral-800/60">
        <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold mb-4">
          Food Review
        </p>
        <h1 className="font-bold text-white leading-tight tracking-tight
                        text-4xl sm:text-5xl">
          {review.businessName}
        </h1>
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <Stars rating={review.rating} />
          {review.date && (
            <span className="text-sm text-neutral-600">
              {review.date.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="text-neutral-300 text-[17px] leading-8 whitespace-pre-line
                      tracking-[0.01em]">
        {review.comment}
      </div>

      <StoryNav prev={prevReview} next={nextReview} basePath="/reviews" />
    </main>
  );
}
