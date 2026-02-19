"use client";
import Link from "next/link";
import FeatureCard from "./FeatureCard";
import fisherman from "../../public/fisherman.jpg";
import stew from "../../public/pho.jpg";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";

function FeaturedStory({ story }) {
  const photo = story.media?.find(m => m.type === 'image');
  if (!photo) return null;

  const dateTs = story.createdAt || story.date;
  const formattedDate = dateTs
    ? (dateTs.toDate ? dateTs.toDate() : new Date(dateTs))
        .toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <Link href={`/stories/${story.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl aspect-[16/9] sm:aspect-[21/9]">
        <img
          src={photo.url}
          alt={story.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.15em] text-highlights font-semibold mb-2">
            Latest Chronicle {formattedDate && `· ${formattedDate}`}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight max-w-lg">
            {story.title}
          </h2>
          <span className="inline-flex items-center gap-1.5 mt-3 text-sm text-white/60
                           group-hover:text-white transition-colors">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}

function Stars({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: '12px', color: i <= rating ? '#facc15' : '#404040' }}>★</span>
      ))}
    </span>
  );
}

function LatestReviews({ reviews }) {
  if (!reviews.length) return null;
  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold">
          Latest Reviews
        </p>
        <Link href="/reviews" className="text-xs text-neutral-600 hover:text-white transition-colors">
          See all →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {reviews.map(r => {
          const thumb = r.media?.find(m => m.type === 'image');
          return (
            <Link key={r.id} href={`/reviews/${r.id}`} className="group">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/20
                              hover:bg-neutral-900/60 hover:border-neutral-700
                              transition-all duration-200 overflow-hidden h-full flex flex-col">
                {thumb && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={thumb.url}
                      alt={r.businessName}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white leading-tight">
                      {r.businessName}
                    </h3>
                    <Stars rating={r.rating} />
                  </div>
                  {r.comment && (
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed flex-1">
                      {r.comment}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    {r.tags?.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-500">
                        {r.tags[0]}
                      </span>
                    )}
                    {r.date && (
                      <span className="text-[11px] text-neutral-700 ml-auto">
                        {r.date.toDate().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function Hero() {
  const [featuredStory, setFeaturedStory] = useState(null);
  const [latestReviews, setLatestReviews] = useState([]);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const [storiesSnap, reviewsSnap] = await Promise.all([
          getDocs(query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(5))),
          getDocs(query(collection(db, 'reviews'), orderBy('date', 'desc'), limit(3))),
        ]);
        const withPhoto = storiesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
          .find(s => s.media?.some(m => m.type === 'image'));
        if (withPhoto) setFeaturedStory(withPhoto);
        setLatestReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch { /* silently fail */ }
    }
    loadFeatured();
  }, []);

  return (
    <main className="min-h-screen">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-36 pb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold mb-6">
          SoupDeJour Tommy
        </p>

        <h1 className="font-bold text-white tracking-tight leading-[0.92]
                        text-6xl sm:text-7xl lg:text-8xl mb-8">
          Stories &amp;<br />Reviews.
        </h1>

        <div className="w-10 h-[2px] bg-highlights/60 mb-7" />

        <p className="text-neutral-400 text-base sm:text-lg max-w-sm leading-relaxed mb-10">
          Personal narratives and honest food reviews from the road,
          the kitchen, and wild places.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                       bg-white/5 border border-neutral-700 text-white text-sm font-medium
                       hover:border-highlights/50 hover:bg-white/[0.08]
                       transition-all duration-200"
          >
            Read the Chronicles
            <span className="text-highlights text-base leading-none">→</span>
          </Link>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                       text-neutral-500 text-sm font-medium
                       hover:text-white transition-colors duration-200"
          >
            Browse Reviews
            <span className="text-base leading-none">→</span>
          </Link>
        </div>
      </section>

      {/* ── FEATURED STORY ────────────────────────────────── */}
      {featuredStory && (
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <FeaturedStory story={featuredStory} />
        </section>
      )}

      {/* ── LATEST REVIEWS ────────────────────────────────── */}
      <LatestReviews reviews={latestReviews} />

      {/* ── FEATURE CARDS ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FeatureCard
            title="Chronicles"
            href="/stories"
            description="Short stories from the water, the mountains, and the wild places."
            image={fisherman}
          />
          <FeatureCard
            title="Eggs & Bacon"
            href="/reviews"
            description="A collection of favorite dishes, sandwiches, and drinks worth trying."
            image={stew}
          />
        </div>
      </section>

    </main>
  );
}
