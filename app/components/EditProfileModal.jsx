"use client";

import { useState, useRef } from "react";
import { db, storage } from "@/app/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditProfileModal({
  userId,
  currentBio,
  currentAvatar,
  currentUsername,
  onClose,
}) {
  const [bio, setBio] = useState(currentBio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const initial = currentUsername?.[0]?.toUpperCase() || "?";
  const displayAvatar = avatarPreview || currentAvatar;

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      let avatarUrl = currentAvatar;
      if (avatarFile) {
        const imgRef = ref(storage, `avatars/${userId}/${Date.now()}_${avatarFile.name}`);
        await uploadBytes(imgRef, avatarFile);
        avatarUrl = await getDownloadURL(imgRef);
      }
      await updateDoc(doc(db, "users", userId), { bio, avatarUrl });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-sm shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-800/60">
          <h2 className="text-sm font-semibold text-white tracking-tight">Edit Profile</h2>
          <div
            role="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer
                       text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="11" y1="1" x2="1" y2="11" />
            </svg>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">

          {/* Avatar picker */}
          <div className="flex flex-col items-center gap-2">
            <div
              role="button"
              onClick={() => fileRef.current?.click()}
              className="relative group cursor-pointer"
              style={{ width: 80, height: 80 }}
            >
              {/* Avatar circle */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neutral-700
                              group-hover:border-neutral-500 transition-colors">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <span className="text-2xl font-medium text-neutral-400">{initial}</span>
                  </div>
                )}
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100
                              transition-opacity flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>

            <span className="text-xs text-neutral-600">
              {avatarPreview ? "New photo selected" : "Click to change photo"}
            </span>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people a little about yourself…"
              style={{ border: 'none', outline: 'none' }}
              className="w-full bg-neutral-900 rounded-xl px-4 py-3 text-sm text-white
                         placeholder:text-neutral-600 resize-none
                         ring-1 ring-neutral-800 focus:ring-neutral-600
                         transition-all duration-200 shadow-none my-0 mt-0 p-3"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white
                       transition-colors border border-neutral-800 hover:border-neutral-600
                       shadow-none w-auto mt-0 font-normal"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-white text-black
                       hover:bg-neutral-200 transition-colors disabled:opacity-50
                       border-0 shadow-none w-auto mt-0"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
