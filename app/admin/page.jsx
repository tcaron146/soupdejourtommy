'use client';

import Link from 'next/link';
import { UserAuth } from '@/app/context/AuthContext';

const ADMIN_UID = '0pAMwWMZhIZ21qGsQLqNYFrveLd2';

export default function AdminPage() {
  const { user } = UserAuth() || {};

  if (!user || user.uid !== ADMIN_UID) {
    return (
      <main className="pt-32 max-w-md mx-auto px-6 text-center">
        <p className="text-neutral-500">Unauthorized.</p>
      </main>
    );
  }

  return (
    <main className="pt-28 max-w-2xl mx-auto px-6 pb-20">
      <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold mb-4">
        Admin
      </p>
      <h1 className="font-bold text-white tracking-tight text-4xl mb-2">Dashboard</h1>
      <p className="text-neutral-500 text-sm mb-12">Add content to SoupDeJour.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Link href="/admin/stories"
          className="group flex flex-col gap-3 p-6 rounded-2xl border border-neutral-800
                     bg-neutral-900/20 hover:bg-neutral-900/60 hover:border-neutral-700
                     transition-all duration-200">
          <span className="text-2xl">📖</span>
          <div>
            <p className="font-semibold text-white text-base">Add Story</p>
            <p className="text-xs text-neutral-500 mt-1">Publish a new Chronicle</p>
          </div>
          <span className="text-neutral-700 group-hover:text-highlights text-sm
                           transition-colors mt-auto">→</span>
        </Link>

        <Link href="/admin/reviews"
          className="group flex flex-col gap-3 p-6 rounded-2xl border border-neutral-800
                     bg-neutral-900/20 hover:bg-neutral-900/60 hover:border-neutral-700
                     transition-all duration-200">
          <span className="text-2xl">🍽️</span>
          <div>
            <p className="font-semibold text-white text-base">Add Review</p>
            <p className="text-xs text-neutral-500 mt-1">Log a new food review</p>
          </div>
          <span className="text-neutral-700 group-hover:text-highlights text-sm
                           transition-colors mt-auto">→</span>
        </Link>

        <Link href="/admin/post"
          className="group flex flex-col gap-3 p-6 rounded-2xl border border-neutral-800
                     bg-neutral-900/20 hover:bg-neutral-900/60 hover:border-neutral-700
                     transition-all duration-200">
          <span className="text-2xl">✏️</span>
          <div>
            <p className="font-semibold text-white text-base">Add Post</p>
            <p className="text-xs text-neutral-500 mt-1">Publish a forum post</p>
          </div>
          <span className="text-neutral-700 group-hover:text-highlights text-sm
                           transition-colors mt-auto">→</span>
        </Link>

      </div>
    </main>
  );
}
