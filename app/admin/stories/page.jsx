'use client';

import { useState } from 'react';
import { db } from '@/app/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { UserAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

const ADMIN_UID = '0pAMwWMZhIZ21qGsQLqNYFrveLd2';

function today() {
  return new Date().toISOString().split('T')[0];
}

export default function AdminStoriesPage() {
  const { user } = UserAuth() || {};

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const ts = Timestamp.fromDate(new Date(date + 'T12:00:00'));
      await addDoc(collection(db, 'stories'), {
        title: title.trim(),
        content: content.trim(),
        createdAt: ts,
      });

      setTitle('');
      setContent('');
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
      <h1 className="font-bold text-white tracking-tight text-4xl mb-8">Add Story</h1>

      <form onSubmit={submit} className="flex flex-col gap-6">

        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="The Night the Bridger Chairs Froze"
            className="bg-neutral-900/60 border-neutral-800 rounded-lg px-4 py-3
                       text-white placeholder:text-neutral-700 focus:outline-none
                       focus:border-highlights/50 transition-colors shadow-none my-0"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">
            Content
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your story here…"
            rows={16}
            className="bg-neutral-900/60 border border-neutral-800 rounded-lg px-4 py-3
                       text-white placeholder:text-neutral-700 focus:outline-none
                       focus:border-highlights/50 transition-colors resize-y
                       text-[15px] leading-7 w-full"
          />
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
            Story published! <Link href="/stories" className="underline">View stories →</Link>
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
          {loading ? 'Publishing…' : 'Publish Story'}
        </button>

      </form>
    </main>
  );
}
