"use client";

import { useState } from "react";
import { db } from "@/app/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ReviewUploader() {
  const [status, setStatus] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const data = JSON.parse(text);

    // Yelp gives nested JSON — we will map it later once you upload
    const reviews = data.reviews || data.user?.reviews || [];

    setStatus("Uploading...");

    for (let r of reviews) {
      await addDoc(collection(db, "yelpReviews"), {
        restaurant: r.businessName || r.restaurant || "",
        rating: r.rating || 0,
        category: r.category || "",
        location: r.location || "",
        date: r.date ? new Date(r.date) : serverTimestamp(),
        review: r.text || "",
        yelpUrl: r.url || "",
        imageUrl: "",
      });
    }

    setStatus("Done! Imported " + reviews.length + " reviews.");
  };

  return (
    <div className="pt-32 px-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6 text-white">Import Yelp Reviews</h1>

      <input
        type="file"
        accept=".json"
        className="mb-4"
        onChange={handleFile}
      />

      <p className="text-neutral-400">{status}</p>
    </div>
  );
}
