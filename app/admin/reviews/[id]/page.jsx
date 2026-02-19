'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/app/firebase';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { UserAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

const ADMIN_UID = '0pAMwWMZhIZ21qGsQLqNYFrveLd2';

function tsToDateInput(ts) {
  if (!ts) return new Date().toISOString().split('T')[0];
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toISOString().split('T')[0];
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
                     p-0 w-auto mt-0 font-normal leading-none focus:outline-none"
          style={{ color: i <= active ? '#facc15' : '#404040' }}
          aria-label={`${i} star${i !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
      {value > 0 && <span className="text-sm text-neutral-500 self-center ml-1">{value}/5</span>}
    </div>
  );
}

export default function EditReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, authLoading } = UserAuth() || {};

  const [businessName, setBusinessName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'reviews', id));
        if (!snap.exists()) { setError('Review not found.'); return; }
        const data = snap.data();
        setBusinessName(data.businessName || '');
        setComment(data.comment || '');
        setRating(data.rating || 0);
        setDate(tsToDateInput(data.date));
      } catch {
        setError('Failed to load review.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (authLoading || loading) {
    return (
      <main className="pt-32 max-w-2xl mx-auto px-6">
        <div className="animate-pulse space-y-4 mt-4">
          <div className="h-8 w-48 bg-neutral-800 rounded" />
          <div className="h-4 w-full bg-neutral-800 rounded" />
          <div className="h-48 w-full bg-neutral-800 rounded" />
        </div>
      </main>
    );
  }

  if (!user || user.uid !== ADMIN_UID) {
    return <main className="pt-32 text-center"><p className="text-neutral-500">Unauthorized.</p></main>;
  }

  if (error && !businessName) {
    return (
      <main className="pt-32 max-w-2xl mx-auto px-6">
        <p className="text-red-400 text-sm">{error}</p>
        <Link href="/admin" className="text-xs text-highlights hover:underline mt-4 inline-block">← Admin</Link>
      </main>
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!businessName.trim()) { setError('Business name is required.'); return; }
    if (!comment.trim())      { setError('Comment is required.'); return; }
    if (rating === 0)         { setError('Please select a rating.'); return; }
    setError(''); setSuccess(false); setSaving(true);
    try {
      await updateDoc(doc(db, 'reviews', id), {
        businessName: businessName.trim(),
        comment: comment.trim(),
        rating,
        date: Timestamp.fromDate(new Date(date + 'T12:00:00')),
      });
      setSuccess(true);
    } catch {
      setError('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'reviews', id));
      router.push('/admin');
    } catch {
      setError('Failed to delete.');
      setDeleting(false);
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
      <h1 className="font-bold text-white tracking-tight text-4xl mb-8">Edit Review</h1>

      <form onSubmit={handleSave} className="flex flex-col gap-6">

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            className="bg-neutral-900/60 border-neutral-800 rounded-lg px-4 py-3
                       text-white focus:outline-none focus:border-highlights/50
                       transition-colors shadow-none my-0"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">Comment</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={12}
            className="bg-neutral-900/60 border border-neutral-800 rounded-lg px-4 py-3
                       text-white focus:outline-none focus:border-highlights/50
                       transition-colors resize-y text-[15px] leading-7 w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">Rating</label>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-neutral-900/60 border-neutral-800 rounded-lg px-4 py-3
                       text-white focus:outline-none focus:border-highlights/50
                       transition-colors shadow-none my-0 w-auto"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">Saved! <Link href={`/reviews/${id}`} className="underline">View review →</Link></p>}

        <div className="flex items-center justify-between gap-4 flex-wrap mt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-lg bg-highlights/90 hover:bg-highlights
                       text-white font-semibold text-sm transition-colors duration-200
                       disabled:opacity-50 border-0 shadow-none w-full sm:w-auto"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-sm text-neutral-600 hover:text-red-400 transition-colors
                         border-0 shadow-none p-0 w-auto mt-0 font-normal"
            >
              Delete review
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-400">Delete forever?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm text-red-400 hover:text-red-300 transition-colors
                           border-0 shadow-none p-0 w-auto mt-0 font-semibold disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-sm text-neutral-600 hover:text-white transition-colors
                           border-0 shadow-none p-0 w-auto mt-0 font-normal"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

      </form>
    </main>
  );
}
