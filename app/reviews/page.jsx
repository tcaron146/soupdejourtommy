'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="pt-32 text-center text-white">Loading…</div>;

  return (
    <main className="pt-32 max-w-3xl mx-auto text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Reviews</h1>
      <div className="space-y-6">
        {reviews.map((r) => (
          <Link
            key={r.id}
            href={`/reviews/${r.id}`}
            className="block p-5 rounded-xl bg-black/30 hover:bg-black/40 border border-white/10 transition"
          >
            <h2 className="text-2xl font-semibold">{r.businessName}</h2>
            <div className="flex items-center gap-2 text-yellow-400 mt-1">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>
            <p className="mt-2 line-clamp-2 text-white/70">{r.comment}</p>
            <p className="text-sm text-white/50 mt-2">{r.date}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}