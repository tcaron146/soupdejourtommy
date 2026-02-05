"use client";

import { useState } from "react";
import { db, storage } from "@/app/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditProfileModal({
  userId,
  currentBio,
  currentAvatar,
  onClose,
}) {
  const [bio, setBio] = useState(currentBio || "");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    let avatarUrl = currentAvatar;

    // Upload avatar if changed
    if (avatar) {
      const imgRef = ref(storage, `avatars/${userId}/${avatar.name}`);
      await uploadBytes(imgRef, avatar);
      avatarUrl = await getDownloadURL(imgRef);
    }

    // Save to Firestore
    await updateDoc(doc(db, "users", userId), {
      bio,
      avatarUrl,
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-neutral-900 p-6 rounded-lg w-96 shadow-xl">

        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <label className="text-sm">Profile Picture</label>
        <input
          type="file"
          onChange={(e) => setAvatar(e.target.files[0])}
          className="mb-4"
        />

        <label className="text-sm">Bio</label>
        <textarea
          className="w-full bg-neutral-800 p-2 rounded mb-4"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-neutral-700 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-1 bg-primary text-background rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
