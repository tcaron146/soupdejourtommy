'use client';

// Component to display a forum post with navigation to previous and next posts

import StoryNav from "@/app/components/StoryNav";

export default function ForumPost({ title, content, prev, next }) {
  return (
    <div className="flex justify-center px-4 pt-28 pb-10">
      <article className="max-w-3xl w-full">

        <h1 className="text-3xl font-bold mb-6 text-white leading-tight">
          {title}
        </h1>

        <div className="text-lg leading-relaxed whitespace-pre-line text-neutral-200">
          {content}
        </div>

        <StoryNav prev={prev} next={next} />

      </article>
    </div>
  );
}
