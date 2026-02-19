"use client";
import Link from "next/link";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import FeatureCard from "./FeatureCard";
import fisherman from "../../public/fisherman.jpg";
import stew from "../../public/pho.jpg";

export default function Hero() {
  const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL;

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
