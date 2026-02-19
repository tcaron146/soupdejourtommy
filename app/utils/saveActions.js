import { db } from "@/app/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

export async function saveItem(uid, itemId, type, title) {
  await setDoc(doc(db, "users", uid, "saved", itemId), {
    type,
    itemId,
    title,
    savedAt: serverTimestamp(),
  });

  const collectionName = type === "story" ? "stories" : "reviews";
  await updateDoc(doc(db, collectionName, itemId), {
    saveCount: increment(1),
  });
}

export async function unsaveItem(uid, itemId, type) {
  await deleteDoc(doc(db, "users", uid, "saved", itemId));

  const collectionName = type === "story" ? "stories" : "reviews";
  await updateDoc(doc(db, collectionName, itemId), {
    saveCount: increment(-1),
  });
}
