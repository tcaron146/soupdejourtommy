'use client';
import Image from "next/image";
import Link from "next/link";

export default function FeatureCard({ title, href, description, image }) {
  return (
    <article className="relative overflow-hidden rounded-2xl group">
      <Link href={href} className="block h-full w-full">

        {/* Background image */}
        <Image
          src={image}
          alt={title}
          fill
          className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />

        {/* Gradient overlay */}
        <div className="relative bg-gradient-to-t from-black/80 via-black/40 to-black/10
                        pt-40 sm:pt-56 lg:pt-72">
          <div className="p-5 sm:p-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-semibold mb-1">
                Explore
              </p>
              <h3 className="text-xl font-bold text-white leading-tight">
                {title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/70">
                {description}
              </p>
            </div>
            <span className="shrink-0 w-9 h-9 rounded-full border border-white/20
                             flex items-center justify-center text-white/60
                             group-hover:border-white/60 group-hover:text-white
                             group-hover:translate-x-1 transition-all duration-300 text-sm">
              →
            </span>
          </div>
        </div>

      </Link>
    </article>
  );
}
