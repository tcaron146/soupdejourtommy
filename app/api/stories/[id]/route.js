import { db } from "@/app/firebase";
import { collection, getDocs, orderBy, query, doc, getDoc } from "firebase/firestore";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return Response.json({ error: "Story ID is required" }, { status: 400 });
    }

    // Get current story
    const snap = await getDoc(doc(db, "stories", id));
    if (!snap.exists()) {
      return Response.json({ error: "Story not found" }, { status: 404 });
    }

    // Get all stories for navigation
    const q = query(collection(db, "stories"), orderBy("title"));
    const allSnap = await getDocs(q);
    const allStories = allSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    const currentIndex = allStories.findIndex(s => s.id === id);
    const prevStory = currentIndex > 0 ? allStories[currentIndex - 1] : null;
    const nextStory = currentIndex < allStories.length - 1 ? allStories[currentIndex + 1] : null;

    return Response.json({
      id: snap.id,
      ...snap.data(),
      prev: prevStory,
      next: nextStory,
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    return Response.json(
      { error: error.message || "Failed to fetch story" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';