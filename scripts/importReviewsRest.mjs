import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Path to reviews.json
const dataPath = path.resolve("data", "reviews.json");
const reviews = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/reviews?key=${API_KEY}`;

async function uploadReview(review, index) {
  const body = {
    fields: {
      businessName: { stringValue: review["Business Name"] },
      rating: { integerValue: review["Rating"] },
      comment: { stringValue: review["Comment"] },
      date: { timestampValue: review["Date"] },
    },
  };

  try {
    const res = await fetch(FIRESTORE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.log(`❌ ${review["Business Name"]}: ${err}`);
      return;
    }

    console.log(`✅ Uploaded ${index + 1}: ${review["Business Name"]}`);
  } catch (err) {
    console.log(`❌ FAILED ${review["Business Name"]}:`, err);
  }
}

async function run() {
  console.log(`📦 Importing ${reviews.length} reviews...\n`);
  for (let i = 0; i < reviews.length; i++) {
    await uploadReview(reviews[i], i);
  }
  console.log("\n🎉 DONE!");
}

run();
