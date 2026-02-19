"use client";

import Link from "next/link";

export default function StoryNav({ prev, next, basePath = "/stories" }) {
  return (
    <nav className="mt-16 pt-8 border-t border-neutral-800/60">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Previous */}
        {prev ? (
          <Link
            href={`${basePath}/${prev.id}`}
            className="group relative flex flex-col gap-2 p-5 rounded-2xl
                       border border-neutral-800 bg-neutral-900/30
                       hover:border-highlights/40 hover:bg-neutral-900/70
                       transition-all duration-200 overflow-hidden"
          >
            <span
              className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full
                         bg-highlights/0 group-hover:bg-highlights/60
                         transition-all duration-200"
            />
            <span
              className="text-[10px] uppercase tracking-[0.15em] font-semibold
                         text-neutral-600 group-hover:text-neutral-400
                         flex items-center gap-2 transition-colors duration-200"
            >
              <span className="inline-block group-hover:-translate-x-0.5 transition-transform duration-200">
                ←
              </span>
              Previous
            </span>
            <span
              className="text-sm font-semibold text-neutral-400
                         group-hover:text-white transition-colors duration-200
                         line-clamp-2 leading-snug"
            >
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {/* Next */}
        {next ? (
          <Link
            href={`${basePath}/${next.id}`}
            className="group relative flex flex-col gap-2 p-5 rounded-2xl
                       border border-neutral-800 bg-neutral-900/30
                       hover:border-highlights/40 hover:bg-neutral-900/70
                       transition-all duration-200 overflow-hidden
                       sm:text-right sm:items-end"
          >
            <span
              className="absolute right-0 top-3 bottom-3 w-[3px] rounded-full
                         bg-highlights/0 group-hover:bg-highlights/60
                         transition-all duration-200"
            />
            <span
              className="text-[10px] uppercase tracking-[0.15em] font-semibold
                         text-neutral-600 group-hover:text-neutral-400
                         flex items-center gap-2 sm:flex-row-reverse transition-colors duration-200"
            >
              <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-200">
                →
              </span>
              Next
            </span>
            <span
              className="text-sm font-semibold text-neutral-400
                         group-hover:text-white transition-colors duration-200
                         line-clamp-2 leading-snug"
            >
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

      </div>
    </nav>
  );
}
