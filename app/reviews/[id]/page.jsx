'use client';

import { useEffect, useState, useCallback } from 'react';
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

function Lightbox({ media, index, setIndex, onClose }) {
  const item = media[index];
  const hasPrev = index > 0;
  const hasNext = index < media.length - 1;

  const prev = useCallback(() => setIndex(i => i - 1), [setIndex]);
  const next = useCallback(() => setIndex(i => i + 1), [setIndex]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft' && hasPrev) prev();
      if (e.key === 'ArrowRight' && hasNext) next();
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hasPrev, hasNext, prev, next, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="w-full max-w-4xl flex items-center justify-between px-4 pb-3"
        onClick={e => e.stopPropagation()}
      >
        <span className="text-sm text-neutral-500">{index + 1} / {media.length}</span>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white transition-colors border-0 shadow-none
                     p-0 w-auto mt-0 font-normal text-xl leading-none"
        >
          ✕
        </button>
      </div>

      {/* Media + arrows */}
      <div
        className="relative w-full max-w-4xl px-4 flex items-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Prev */}
        <button
          onClick={prev}
          disabled={!hasPrev}
          className="absolute left-0 z-10 w-10 h-10 flex items-center justify-center
                     text-white text-2xl disabled:opacity-0 border-0 shadow-none
                     p-0 w-auto mt-0 font-normal bg-black/40 rounded-full mx-2
                     hover:bg-black/70 transition-colors"
          style={{ width: '40px', height: '40px' }}
        >
          ‹
        </button>

        {item.type === 'video' ? (
          <video
            key={item.url}
            src={item.url}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full rounded-xl max-h-[80vh] object-contain"
          />
        ) : (
          <img
            key={item.url}
            src={item.url}
            alt=""
            className="w-full rounded-xl max-h-[80vh] object-contain"
          />
        )}

        {/* Next */}
        <button
          onClick={next}
          disabled={!hasNext}
          className="absolute right-0 z-10 w-10 h-10 flex items-center justify-center
                     text-white text-2xl disabled:opacity-0 border-0 shadow-none
                     p-0 w-auto mt-0 font-normal bg-black/40 rounded-full mx-2
                     hover:bg-black/70 transition-colors"
          style={{ width: '40px', height: '40px' }}
        >
          ›
        </button>
      </div>

      {/* Dot indicators */}
      {media.length > 1 && (
        <div
          className="flex gap-1.5 mt-4"
          onClick={e => e.stopPropagation()}
        >
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="w-1.5 h-1.5 rounded-full border-0 shadow-none p-0 w-auto mt-0 font-normal transition-colors"
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: i === index ? 'white' : 'rgb(64,64,64)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaGallery({ media }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!media?.length) return null;

  return (
    <>
      <div className="mt-10 grid grid-cols-3 gap-2">
        {media.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="relative aspect-square overflow-hidden rounded-xl bg-neutral-900
                       border-0 shadow-none p-0 w-auto mt-0 font-normal
                       group cursor-zoom-in"
          >
            {item.type === 'video' ? (
              <>
                <video
                  src={item.url}
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center
                                bg-black/30 group-hover:bg-black/20 transition-colors">
                  <span className="text-white text-2xl">▶</span>
                </div>
              </>
            ) : (
              <img
                src={item.url}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          media={media}
          index={lightboxIndex}
          setIndex={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
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

      <Link
        href="/reviews"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-600
                   hover:text-neutral-300 transition-colors duration-200 mb-10"
      >
        ← Reviews
      </Link>

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
        {review.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(review.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg
                       border border-neutral-800 text-sm text-neutral-400
                       hover:text-white hover:border-neutral-600 transition-colors duration-200"
          >
            <span>↗</span> Get Directions
          </a>
        )}
      </header>

      <div className="text-neutral-300 text-[17px] leading-8 whitespace-pre-line tracking-[0.01em]">
        {review.comment}
      </div>

      <MediaGallery media={review.media} />

      <StoryNav prev={prevReview} next={nextReview} basePath="/reviews" />
    </main>
  );
}
