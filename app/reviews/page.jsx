import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default async function ReviewsPage() {
  const snap = await getDocs(collection(db, "reviews"));
  const reviews = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return (
    <main className="pt-32 max-w-3xl mx-auto text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Reviews</h1>

      <div className="space-y-6">
        {reviews.map((r) => {
          // --- SAFE DATE HANDLING ----
          const formattedDate = (() => {
            if (!r.date) return "Unknown";

            // Firestore Timestamp
            if (typeof r.date.toDate === "function") {
              return r.date.toDate().toISOString().split("T")[0];
            }

            // Regular ISO string
            const d = new Date(r.date);
            if (!isNaN(d.getTime())) {
              return d.toISOString().split("T")[0];
            }

            // Fallback
            try {
              return new Date(Date.parse(r.date))
                .toISOString()
                .split("T")[0];
            } catch {
              return "Unknown";
            }
          })();
          // -----------------------------

          return (
            <Link
              key={r.id}
              href={`/reviews/${r.id}`}
              className="block p-5 rounded-xl bg-black/30 hover:bg-black/40 border border-white/10 transition"
            >
              <h2 className="text-2xl font-semibold">{r.businessName}</h2>

              <div className="flex items-center gap-2 text-yellow-400 mt-1">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>

              <p className="mt-2 line-clamp-2 text-white/70">{r.comment}</p>

              <p className="text-sm text-white/50 mt-2">{formattedDate}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
