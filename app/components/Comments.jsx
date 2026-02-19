"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";

export default function Comments({ postId, collectionName = "posts" }) {
  const { user } = UserAuth() || {};
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, collectionName, postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [postId, collectionName]);

  const submitComment = async () => {
    if (!user) return alert("Login to comment");
    if (!text.trim()) return;

    await addDoc(collection(db, collectionName, postId, "comments"), {
      text: text.trim(),
      parentId: null,
      userId: user.uid,
      username: user.username,
      avatarUrl: user.avatarUrl,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div className="mt-6">

      {/* TOGGLE */}
      <button
        onClick={() => setOpen(!open)}
        className="text-sm flex items-center gap-1 text-neutral-300 hover:text-white"
      >
        💬 Comments ({comments.length})
      </button>

      {!open ? null : (
        <>
          {/* Comment box — only shown when logged in */}
          {user && (
            <div className="mt-4">
              <textarea
                className="w-full bg-neutral-800 p-3 rounded text-sm resize-none mb-2"
                rows={3}
                placeholder="Add a comment…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                onClick={submitComment}
                className="px-3 py-1 bg-secondary text-primary rounded text-sm hover:opacity-80"
              >
                Comment
              </button>
            </div>
          )}


          <CommentThread
            comments={comments}
            parentId={null}
            postId={postId}
            collectionName={collectionName}
          />
        </>
      )}
    </div>
  );
}

/* COMMENT THREAD */
function CommentThread({ comments, parentId, postId, collectionName }) {
  const filtered = comments.filter((c) => c.parentId === parentId);

  return (
    <div className="ml-10 mt-3 border-l border-neutral-800 pl-4">
      {filtered.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          comments={comments}
          postId={postId}
          collectionName={collectionName}
        />
      ))}
    </div>
  );
}


/* SINGLE COMMENT */
function CommentItem({ comment, comments, postId, collectionName }) {
  const { user } = UserAuth() || {};
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const submitReply = async () => {
    if (!replyText.trim()) return;

    await addDoc(collection(db, collectionName, postId, "comments"), {
      text: replyText.trim(),
      parentId: comment.id,
      userId: user.uid,
      username: user.username,
      avatarUrl: user.avatarUrl,
      createdAt: serverTimestamp(),
    });

    setReplyText("");
    setReplying(false);
  };

  return (
    <div className="mb-4">

      {/* MAIN COMMENT ROW */}
      <div className="flex gap-3">

        {/* Avatar */}
        <img
          src={comment.avatarUrl}
          alt={comment.username || ""}
          className="w-7 h-7 rounded-full mt-1"
        />

        <div className="flex-1">
          <p className="text-sm leading-5">
            <span className="font-semibold">{comment.username}</span>{" "}
            <span className="text-neutral-300">{comment.text}</span>
          </p>

          {/* Reply link — only shown when logged in */}
          {user && (
            <span
              className="text-xs text-neutral-500 hover:text-white cursor-pointer"
              onClick={() => setReplying(!replying)}
            >
              Reply
            </span>
          )}

          {/* CHILD THREAD */}
          <CommentThread
            comments={comments}
            parentId={comment.id}
            postId={postId}
            collectionName={collectionName}
          />
        </div>
      </div>

      {/* REPLY INPUT ROW */}
      {replying && (
        <div className="ml-10 mt-2">
          <input
            className="w-full p-2 rounded bg-neutral-800 text-sm mb-1"
            placeholder="Reply…"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            onClick={submitReply}
            className="text-xs px-3 py-1 bg-secondary rounded"
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
}
