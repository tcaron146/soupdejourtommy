import { db } from "@/app/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

export const followUser = async (currentUid, targetUid) => {
  // current user → following target
  await setDoc(doc(db, "users", currentUid, "following", targetUid), {
    followedAt: Date.now(),
  });

  // target user → gets follower
  await setDoc(doc(db, "users", targetUid, "followers", currentUid), {
    followedAt: Date.now(),
  });
};

export const unfollowUser = async (currentUid, targetUid) => {
  await deleteDoc(doc(db, "users", currentUid, "following", targetUid));
  await deleteDoc(doc(db, "users", targetUid, "followers", currentUid));
};
