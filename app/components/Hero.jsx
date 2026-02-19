"use client";
import Link from "next/link";
import MailchimpSubscribe from "react-mailchimp-subscribe";
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

export default function Hero() {
  const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL;
  const [featuredStory, setFeaturedStory] = useState(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(5));
        const snap = await getDocs(q);
        const withPhoto = snap.docs.map(d => ({ id: d.id, ...d.data() }))
          .find(s => s.media?.some(m => m.type === 'image'));
        if (withPhoto) setFeaturedStory(withPhoto);
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

      {/* ── NEWSLETTER ────────────────────────────────────── */}
      <section className="max-w-xl mx-auto px-6 pb-28">
        <div className="border border-neutral-800 rounded-2xl p-8 sm:p-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold mb-3">
            Newsletter
          </p>
          <h2 className="text-2xl font-bold text-white mb-2">Stay in the loop</h2>
          <p className="text-neutral-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
            New stories and reviews, straight to your inbox.
          </p>
          <MailchimpSubscribe url={url} />
        </div>
      </section>

    </main>
  );
}
