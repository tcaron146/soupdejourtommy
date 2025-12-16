'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ForumPost from "@/app/components/ForumPost";
import StoryNav from "@/app/components/StoryNav";

export const dynamic = 'force-dynamic';

export default function ForumStoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get ID from pathname
    const pathname = window.location.pathname;
    const id = pathname.split('/').pop();
    
    if (!id) {
      setError("No story ID");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch(`/api/stories/${id}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setStory(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="pt-32 text-center text-white">Loading…</div>;
  if (error) return <div className="pt-32 text-center text-white">Error: {error}</div>;
  if (!story) return <div className="pt-32 text-center text-white">Not found</div>;

  return (
    <>
      <ForumPost title={story.title} content={story.content} prev={story.prev} next={story.next} />
      <StoryNav prev={story.prev} next={story.next} />
    </>
  );
}