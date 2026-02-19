"use client";

import Link from "next/link";

export default function StoryNav({ prev, next, basePath = "/stories" }) {
  return (
    <nav className="mt-12 pt-6 border-t border-neutral-800/60 flex justify-between items-center gap-4">

      {prev ? (
        <Link
          href={`${basePath}/${prev.id}`}
          className="group flex items-center gap-2 px-3 py-2 rounded-lg
                     border border-neutral-800/80 hover:border-highlights/40
                     hover:bg-neutral-900/50 transition-all duration-200
                     overflow-hidden max-w-[45%]"
          title={prev.title}
        >
          <span className="shrink-0 text-neutral-500 group-hover:text-highlights
                           group-hover:-translate-x-0.5 transition-all duration-200 text-sm">
            ←
          </span>
          <span className="text-sm text-neutral-400 group-hover:text-white
                           transition-colors duration-200 truncate">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`${basePath}/${next.id}`}
          className="group flex items-center gap-2 px-3 py-2 rounded-lg
                     border border-neutral-800/80 hover:border-highlights/40
                     hover:bg-neutral-900/50 transition-all duration-200
                     overflow-hidden max-w-[45%] ml-auto"
          title={next.title}
        >
          <span className="text-sm text-neutral-400 group-hover:text-white
                           transition-colors duration-200 truncate">
            {next.title}
          </span>
          <span className="shrink-0 text-neutral-500 group-hover:text-highlights
                           group-hover:translate-x-0.5 transition-all duration-200 text-sm">
            →
          </span>
        </Link>
      ) : (
        <div />
      )}

    </nav>
  );
}
