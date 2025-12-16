"use client";
// Component for navigating between stories/posts

import Link from "next/link";

export default function StoryNav({ prev, next }) {
  return (
    <div className="flex justify-between items-center mt-14 pt-6 border-t border-neutral-700/40">

      {/* Previous */}
      {prev ? (
        <Link 
          href={`/stories/${prev.id}`}
          className="text-neutral-400 hover:text-white text-sm flex items-center gap-2"
        >
          <span className="text-xl">←</span> {prev.title}
        </Link>
      ) : (
        <div />
      )}

      {/* Next */}
      {next ? (
        <Link 
          href={`/stories/${next.id}`}
          className="text-neutral-400 hover:text-white text-sm flex items-center gap-2"
        >
          {next.title} <span className="text-xl">→</span>
        </Link>
      ) : (
        <div />
      )}

    </div>
  );
}
