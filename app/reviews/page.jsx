'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';

export default function ReviewPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const snap = await getDoc(doc(db, 'reviews', id));
      if (snap.exists()) {
        setReview(snap.data());
      }
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) return <div className="pt-32 text-white text-center">Loading…</div>;
  if (!review) return <div className="pt-32 text-white text-center">Not found</div>;

  return (
    <article className="pt-32 max-w-3xl mx-auto px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">{review.title}</h1>
      <div className="prose prose-invert">{review.content}</div>
    </article>
  );
}
