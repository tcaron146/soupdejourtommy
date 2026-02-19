import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-neutral-400 mb-8">Page not found</p>
      <Link
        href="/"
        className="px-6 py-2 bg-primary text-background rounded hover:opacity-80 transition"
      >
        Go home
      </Link>
    </div>
  );
}
