'use client';

import { useState } from 'react';
import { db } from '@/app/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { UserAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

function today() {
  return new Date().toISOString().split('T')[0];
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="text-3xl transition-colors duration-100 border-0 shadow-none
                     p-0 w-auto mt-0 font-normal leading-none
                     focus:outline-none"
          style={{ color: i <= active ? '#facc15' : '#404040' }}
          aria-label={`${i} star${i !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
      {value > 0 && (
        <span className="text-sm text-neutral-500 self-center ml-1">
          {value}/5
        </span>
      )}
    </div>
  );
}

export default function AdminReviewsPage() {
  const { user } = UserAuth() || {};

  const [businessName, setBusinessName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.uid !== ADMIN_UID) {
    return (
      <main className="pt-32 max-w-md mx-auto px-6 text-center">
        <p className="text-neutral-500">Unauthorized.</p>
      </main>
    );
  }

  async function submit(e) {
    e.preventDefault();
    if (!businessName.trim()) { setError('Business name is required.'); return; }
    if (!comment.trim())      { setError('Comment is required.'); return; }
    if (rating === 0)         { setError('Please select a rating.'); return; }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const ts = Timestamp.fromDate(new Date(date + 'T12:00:00'));
      await addDoc(collection(db, 'reviews'), {
        businessName: businessName.trim(),
        comment: comment.trim(),
        rating,
        date: ts,
      });

      setBusinessName('');
      setComment('');
      setRating(0);
      setDate(today());
      setSuccess(true);
    } catch {
      setError('Failed to publish. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-28 max-w-2xl mx-auto px-6 pb-20">

      <Link href="/admin"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-600
                   hover:text-neutral-300 transition-colors duration-200 mb-10">
        ← Admin
      </Link>

      <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold mb-3">
        Admin
      </p>
      <h1 className="font-bold text-white tracking-tight text-4xl mb-8">Add Review</h1>

      <form onSubmit={submit} className="flex flex-col gap-6">

        {/* Business Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">
            Business Name
          </label>
          <input
            type="text"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="Santarpio's Pizza"
            className="bg-neutral-900/60 border-neutral-800 rounded-lg px-4 py-3
                       text-white placeholder:text-neutral-700 focus:outline-none
                       focus:border-highlights/50 transition-colors shadow-none my-0"
          />
        </div>

        {/* Comment */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your review here…"
            rows={10}
            className="bg-neutral-900/60 border border-neutral-800 rounded-lg px-4 py-3
                       text-white placeholder:text-neutral-700 focus:outline-none
                       focus:border-highlights/50 transition-colors resize-y
                       text-[15px] leading-7 w-full"
          />
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">
            Rating
          </label>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-neutral-900/60 border-neutral-800 rounded-lg px-4 py-3
                       text-white focus:outline-none focus:border-highlights/50
                       transition-colors shadow-none my-0 w-auto"
          />
        </div>

        {/* Feedback */}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && (
          <p className="text-green-400 text-sm">
            Review published! <Link href="/reviews" className="underline">View reviews →</Link>
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-6 py-3 rounded-lg bg-highlights/90 hover:bg-highlights
                     text-white font-semibold text-sm transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     border-0 shadow-none w-full sm:w-auto"
        >
          {loading ? 'Publishing…' : 'Publish Review'}
        </button>

      </form>
    </main>
  );
}
