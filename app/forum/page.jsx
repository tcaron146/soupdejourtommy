import Link from "next/link";
import { db } from "@/app/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export default async function ForumIndexPage() {
  const q = query(
    collection(db, "stories"),
    orderBy("createdAt", "asc")
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    return (
      <div className="pt-40 text-center text-white">
        No stories yet.
      </div>
    );
  }

  const stories = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return (
    <main className="pt-32 max-w-3xl mx-auto text-white px-4">
      <h1 className="text-4xl font-bold mb-8">Chronicles</h1>

      <div className="space-y-4">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/forum/${story.id}`}
            className="block p-5 rounded-xl bg-black/30 hover:bg-black/40 border border-white/10 transition"
          >
            <h2 className="text-2xl font-semibold">{story.title}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
