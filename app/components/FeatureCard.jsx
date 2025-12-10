'use client'
import Image from "next/image";
import Link from "next/link";

export default function FeatureCard({ title, href, description, image }) {
  return (
    <Link
      href={href}
      className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-200 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Text */}
      <div className="p-5">
        <h3 className="text-2xl font-semibold text-neutral-900 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-neutral-600 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
