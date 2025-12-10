"use client";

import { useState } from "react";
import { db, storage } from "@/app/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserAuth } from "@/app/context/AuthContext";

export default function AdminPostPage() {
  const { user } = UserAuth() || {};
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  // only let Tom post
  const ADMIN_UID = "0pAMwWMZhIZ21qGsQLqNYFrveLd2";

  if (!user || user.uid !== ADMIN_UID)
    return <p className="pt-32 text-center">Unauthorized</p>;

  const submit = async () => {
    let imageUrl = "";

    if (image) {
      const imgRef = ref(storage, `posts/${ADMIN_UID}/${image.name}`);
      await uploadBytes(imgRef, image);
      imageUrl = await getDownloadURL(imgRef);
    }

    await addDoc(collection(db, "posts"), {
      userId: user.uid,
      username: user.username,
      avatarUrl: user.avatarUrl,
      text,
      imageUrl,
      createdAt: serverTimestamp(),
    });

    setText("");
    setImage(null);
    alert("Posted!");
  };

  return (
    <div className="pt-32 px-6 max-w-2xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Create Post</h1>

      <textarea
        className="w-full bg-neutral-900 p-3 rounded mb-3"
        placeholder="Write something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={submit}
        className="px-6 py-2 bg-primary text-background rounded"
      >
        Post
      </button>
    </div>
  );
}
