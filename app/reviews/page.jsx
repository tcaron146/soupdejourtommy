'use client';

import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/app/firebase';
import Link from 'next/link';

function Stars({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-neutral-700'} style={{fontSize: '13px'}}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (hasLoadedOnce.current) return;
    hasLoadedOnce.current = true;

    async function load() {
      try {
        const q = query(collection(db, 'reviews'), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = search.trim()
    ? reviews.filter(r =>
        r.businessName?.toLowerCase().includes(search.toLowerCase())
      )
    : reviews;

  return (
    <main className="pt-32 min-h-screen px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold mb-3">
            Food & Drinks
          </p>
          <h1 className="text-5xl font-bold text-white tracking-tight">Reviews</h1>
          <p className="mt-3 text-neutral-500 text-base">
            Favorite dishes, sandwiches, and drinks worth trying.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none text-sm">
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search restaurants…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-900/60 border border-neutral-800
                       rounded-lg text-sm text-white placeholder:text-neutral-600
                       focus:outline-none focus:border-highlights/50 transition-colors duration-200
                       shadow-none my-0 mt-0"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600
                         hover:text-white transition-colors border-0 shadow-none p-0
                         w-auto mt-0 rounded-none font-normal text-sm leading-none"
            >
              ✕
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/20 animate-pulse">
                <div className="h-5 bg-neutral-800 rounded w-2/3 mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-3 h-3 bg-neutral-800 rounded-sm" />
                  ))}
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 bg-neutral-800 rounded w-full" />
                  <div className="h-3 bg-neutral-800 rounded w-4/5" />
                  <div className="h-3 bg-neutral-800 rounded w-3/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-sm">
              {search ? `No results for "${search}"` : 'No reviews yet.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-xs text-highlights hover:underline border-0 shadow-none
                           p-0 w-auto mt-2 rounded-none font-normal"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {search && (
              <p className="text-xs text-neutral-600 mb-4">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(r => {
                const thumb = r.media?.find(m => m.type === 'image');
                return (
                  <Link key={r.id} href={`/reviews/${r.id}`} prefetch={false}>
                    <div className="group rounded-xl border border-neutral-800 bg-neutral-900/20
                                    hover:bg-neutral-900/60 hover:border-neutral-700
                                    transition-all duration-200 h-full flex flex-col overflow-hidden">
                      {thumb && (
                        <div className="w-full aspect-video overflow-hidden">
                          <img
                            src={thumb.url}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="font-semibold text-white leading-tight text-sm">
                            {r.businessName}
                          </h2>
                          <Stars rating={r.rating} />
                        </div>
                        {r.comment && (
                          <p className="text-xs text-neutral-500 line-clamp-3 flex-1 leading-relaxed">
                            {r.comment}
                          </p>
                        )}
                        {r.date && (
                          <p className="text-[11px] text-neutral-700">
                            {r.date.toDate().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

      </div>
    </main>
  );
}
