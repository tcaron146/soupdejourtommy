"use client";
import Image from "next/image";
import Link from "next/link";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import FeatureCard from "./FeatureCard";
import fisherman from "../../public/fisherman.jpg";
import stew from "../../public/pho.jpg";

export default function Hero() {
  const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL;

  return (
    <div className="w-full pt-32 pb-16 bg-gradient-to-b from-secondary to-background px-6">
      {/* Main intro */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold text-primary tracking-tight">
          Welcome to <span className="text-accent">SoupDeJour</span>
        </h1>
        <p className="text-lg text-primary/80 mt-4">
          Stories from the mountains, the kitchen, and everywhere in between.
        </p>

        <Link
          href="/blog"
          className="inline-block mt-6 px-6 py-3 rounded-lg bg-primary text-background font-semibold hover:opacity-90"
        >
          Read the Chronicles
        </Link>
      </div>

      {/* Two feature cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
        <FeatureCard
          title="Chronicles"
          href="/chronicles"
          description="Short stories and photos from the water, the mountains, and the wild places."
          image={fisherman}
        />

        <FeatureCard
          title="Eggs & Bacon"
          href="/grits"
          description="A collection of favorite dishes, sandwiches, and drinks worth trying."
          image={stew}
        />
      </div>

      {/* Newsletter */}
      <div className="max-w-xl mx-auto text-center bg-white shadow-lg p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-neutral-900 mb-3">
          Join the Newsletter
        </h2>
        <MailchimpSubscribe url={url} />
      </div>
    </div>
  );
}
