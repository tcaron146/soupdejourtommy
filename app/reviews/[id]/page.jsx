'use client';

import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';

export default function ReviewPage() {
  const [id, setId] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extract ID from URL path on client side
    const pathname = window.location.pathname;
    const reviewId = pathname.split('/').pop();
    setId(reviewId);
  }, []);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await fetch(`/api/reviews/${id}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setReview(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <div className="pt-32 text-center text-white">Loading…</div>;
  if (error) return <div className="pt-32 text-center text-white">Error: {error}</div>;
  if (!review) return <div className="pt-32 text-center text-white">Not found</div>;

  return (
    <main className="pt-32 max-w-3xl mx-auto text-white px-4">
      <h1 className="text-4xl font-bold mb-4">{review.businessName}</h1>
      <div className="flex items-center gap-2 text-yellow-400 text-xl">
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </div>
      <p className="text-sm text-white/50 mt-2">{review.date}</p>
      <p className="mt-6 text-lg leading-relaxed whitespace-pre-line">{review.comment}</p>
    </main>
  );
}