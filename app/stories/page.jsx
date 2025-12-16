'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ForumIndexPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/stories");
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setStories(data);
        } else {
          setError("Invalid data format");
        }
      } catch (err) {
        console.error("Error loading stories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="pt-32 text-center text-white">Loading…</div>;
  if (error) return <div className="pt-32 text-center text-white">Error: {error}</div>;

  return (
    <main className="pt-32 max-w-3xl mx-auto px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Chronicles</h1>
      <ul className="space-y-4">
        {stories.map(story => (
          <li key={story.id}>
            <Link
              href={`/stories/${story.id}`}
              className="block p-4 rounded-lg bg-neutral-900/40 hover:bg-neutral-900 transition"
            >
              <h2 className="text-xl font-semibold">{story.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}