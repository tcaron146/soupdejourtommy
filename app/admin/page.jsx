'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserAuth } from '@/app/context/AuthContext';
import { db } from '@/app/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

// ── Login form shown when not authenticated ───────────────────────────────────
function LoginForm() {
  const { emailSignIn } = UserAuth() || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await emailSignIn(email, password);
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold mb-3">
          Admin
        </p>
        <h1 className="font-bold text-white text-4xl tracking-tight mb-8">Sign in</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="bg-neutral-900/60 border-neutral-800 rounded-lg px-4 py-3
                       text-white placeholder:text-neutral-700 focus:outline-none
                       focus:border-highlights/50 transition-colors shadow-none my-0"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="bg-neutral-900/60 border-neutral-800 rounded-lg px-4 py-3
                       text-white placeholder:text-neutral-700 focus:outline-none
                       focus:border-highlights/50 transition-colors shadow-none my-0"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 px-6 py-3 rounded-lg bg-highlights/90 hover:bg-highlights
                       text-white font-semibold text-sm transition-colors duration-200
                       disabled:opacity-50 border-0 shadow-none w-full"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}

// ── Main dashboard shown when authenticated as admin ─────────────────────────
function Dashboard() {
  const { logOut } = UserAuth() || {};
  const [stories, setStories] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [sSnap, rSnap] = await Promise.all([
          getDocs(query(collection(db, 'stories'), orderBy('title', 'asc'), limit(20))),
          getDocs(query(collection(db, 'reviews'), orderBy('date', 'desc'), limit(20))),
        ]);
        setStories(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setReviews(rSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {
        // silently fail — lists stay empty
      }
    }
    load();
  }, []);

  return (
    <main className="pt-28 max-w-2xl mx-auto px-6 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold">
          Admin
        </p>
        <button
          onClick={logOut}
          className="text-xs text-neutral-600 hover:text-white transition-colors
                     border-0 shadow-none p-0 w-auto mt-0 font-normal"
        >
          Log out
        </button>
      </div>
      <h1 className="font-bold text-white tracking-tight text-4xl mb-10">Dashboard</h1>

      {/* Create */}
      <section className="mb-12">
        <p className="text-xs uppercase tracking-[0.15em] text-neutral-600 font-semibold mb-4">
          Create
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/admin/stories', label: 'Add Story', icon: '📖' },
            { href: '/admin/reviews', label: 'Add Review', icon: '🍽️' },
            { href: '/admin/post',    label: 'Add Post',   icon: '✏️' },
          ].map(({ href, label, icon }) => (
            <Link key={href} href={href}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl
                         border border-neutral-800 bg-neutral-900/20
                         hover:bg-neutral-900/60 hover:border-neutral-700
                         transition-all duration-200 text-sm font-medium text-neutral-300
                         hover:text-white">
              <span>{icon}</span>
              {label}
              <span className="ml-auto text-neutral-700 group-hover:text-highlights
                               transition-colors text-xs">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Stories list */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-[0.15em] text-neutral-600 font-semibold">
            Stories
          </p>
          <Link href="/admin/stories"
            className="text-xs text-highlights hover:underline">
            + Add new
          </Link>
        </div>
        <div className="space-y-1">
          {stories.length === 0 && (
            <p className="text-neutral-700 text-sm py-2">No stories yet.</p>
          )}
          {stories.map((s, i) => (
            <div key={s.id}
              className="flex items-center justify-between gap-4 py-2.5
                         border-b border-neutral-800/40 last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-neutral-700 tabular-nums w-5 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-neutral-300 truncate">{s.title}</span>
              </div>
              <Link href={`/admin/stories/${s.id}`}
                className="text-xs text-neutral-600 hover:text-highlights shrink-0
                           transition-colors">
                Edit
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews list */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-[0.15em] text-neutral-600 font-semibold">
            Reviews
          </p>
          <Link href="/admin/reviews"
            className="text-xs text-highlights hover:underline">
            + Add new
          </Link>
        </div>
        <div className="space-y-1">
          {reviews.length === 0 && (
            <p className="text-neutral-700 text-sm py-2">No reviews yet.</p>
          )}
          {reviews.map((r, i) => (
            <div key={r.id}
              className="flex items-center justify-between gap-4 py-2.5
                         border-b border-neutral-800/40 last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-neutral-700 tabular-nums w-5 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-neutral-300 truncate">{r.businessName}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-yellow-600">{r.rating}★</span>
                <Link href={`/admin/reviews/${r.id}`}
                  className="text-xs text-neutral-600 hover:text-highlights
                             transition-colors">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

// ── Page entry point ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, authLoading } = UserAuth() || {};

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <span className="text-neutral-700 text-sm">Loading…</span>
      </main>
    );
  }

  if (!user) return <LoginForm />;

  if (user.uid !== ADMIN_UID) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-neutral-500">Unauthorized.</p>
      </main>
    );
  }

  return <Dashboard />;
}
