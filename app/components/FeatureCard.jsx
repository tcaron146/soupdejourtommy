'use client';
import Image from "next/image";
import Link from "next/link";

export default function FeatureCard({ title, href, description, image }) {
  return (
    <article className="relative overflow-hidden rounded-2xl shadow-md transition hover:shadow-xl group">
      <Link href={href} className="block h-full w-full">
        {/* Background Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />

        {/* Gradient Overlay */}
        <div className="relative bg-gradient-to-t from-black/70 via-black/40 to-black/10 pt-32 sm:pt-48 lg:pt-64">
          <div className="p-5 sm:p-6">
            <h3 className="mt-0.5 text-xl font-semibold text-white">
              {title}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/90">
              {description}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

