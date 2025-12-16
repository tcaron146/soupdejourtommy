import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log("Fetching review with id:", id, "db:", db ? "initialized" : "null");
    
    const snap = await getDoc(doc(db, "reviews", id));

    if (!snap.exists()) {
      return Response.json({ error: "Review not found" }, { status: 404 });
    }

    const data = snap.data();
    return Response.json({
      id: snap.id,
      ...data,
      date: data.date?.toDate?.().toISOString() || data.date,
    });
  } catch (error) {
    console.error("CRITICAL ERROR in /api/reviews/[id]:", error);
    return Response.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';