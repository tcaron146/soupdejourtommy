import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDocs(collection(db, "stories"));
    const stories = snap.docs.map((d) => ({
      id: d.id,
      title: d.data().title,
      content: d.data().content,
    })).sort((a, b) => a.title.localeCompare(b.title));
    
    return Response.json(stories);
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';