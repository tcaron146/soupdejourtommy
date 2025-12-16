import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDocs(collection(db, "reviews"));
    const reviews = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        businessName: data.businessName,
        rating: data.rating,
        comment: data.comment,
        date: data.date?.toDate?.().toISOString() || data.date,
      };
    });
    
    return Response.json(reviews);
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';