import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function ReviewPage({ params }) {
  const snap = await getDoc(doc(db, "reviews", params.id));

  if (!snap.exists()) {
    return (
      <div className="pt-32 text-center text-white text-xl">
        Review not found.
      </div>
    );
  }

  const review = snap.data();

  // --- SAFE DATE PARSE ---
  const formattedDate = (() => {
    if (!review.date) return "Unknown";
    if (typeof review.date.toDate === "function") {
      return review.date.toDate().toISOString().split("T")[0];
    }
    const d = new Date(review.date);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
    try {
      return new Date(Date.parse(review.date))
        .toISOString()
        .split("T")[0];
    } catch {
      return "Unknown";
    }
  })();
  // ------------------------

  return (
    <main className="pt-32 max-w-3xl mx-auto text-white px-4">
      <h1 className="text-4xl font-bold mb-4">{review.businessName}</h1>

      <div className="flex items-center gap-2 text-yellow-400 text-xl">
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </div>

      <p className="text-sm text-white/50 mt-2">{formattedDate}</p>

      <p className="mt-6 text-lg leading-relaxed whitespace-pre-line">
        {review.comment}
      </p>
    </main>
  );
}
