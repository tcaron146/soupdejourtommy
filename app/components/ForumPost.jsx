"use client";

export default function ForumPost({ title, content }) {
  return (
    <div className="flex justify-center px-4 py-10 pt-24">
      
      <article className="max-w-3xl w-full">
        
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-white leading-tight">
          {title}
        </h1>

        {/* Story Text */}
        <div className="text-lg leading-relaxed whitespace-pre-line text-neutral-200">
          {content}
        </div>

      </article>
    </div>
  );
}
