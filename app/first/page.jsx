import Link from 'next/link';

export default function FirstPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold mb-4">
          Coming Soon
        </p>
        <h1 className="font-bold text-white tracking-tight leading-tight text-5xl sm:text-6xl mb-6">
          Something&apos;s<br />brewing.
        </h1>
        <div className="w-10 h-[2px] bg-highlights/60 mx-auto mb-6" />
        <p className="text-neutral-500 text-base leading-relaxed mb-10">
          This page is on its way. Check back soon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                     bg-white/5 border border-neutral-700 text-white text-sm font-medium
                     hover:border-highlights/50 hover:bg-white/[0.08]
                     transition-all duration-200"
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
