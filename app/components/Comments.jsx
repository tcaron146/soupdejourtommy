"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import Link from "next/link";

function Avatar({ url, name, size = "sm" }) {
  const dim = size === "md" ? "w-9 h-9" : "w-8 h-8";
  const textSize = size === "md" ? "text-sm" : "text-xs";
  const initial = name?.[0]?.toUpperCase() || "?";

  if (url) {
    return (
      <img
        src={url}
        alt={name || ""}
        className={`${dim} rounded-full object-cover shrink-0`}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0`}>
      <span className={`${textSize} font-medium text-neutral-400`}>{initial}</span>
    </div>
  );
}

function timeAgo(ts) {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Comments({ postId, collectionName = "posts" }) {
  const { user } = UserAuth() || {};
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const topLevel = comments.filter((c) => c.parentId === null);

  const submitComment = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, collectionName, postId, "comments"), {
        text: text.trim(),
        parentId: null,
        userId: user.uid,
        username: user.username,
        avatarUrl: user.avatarUrl || "",
        createdAt: serverTimestamp(),
      });
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitComment();
  };

  return (
    <div className="mt-16 pt-10 border-t border-neutral-800/60">

      {/* Section header */}
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 font-semibold mb-8">
        {comments.length > 0
          ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`
          : "Comments"}
      </p>

      {/* Compose */}
      {user ? (
        <div className="flex gap-3 mb-10">
          <Avatar url={user.avatarUrl} name={user.username} size="md" />
          <div className="flex-1">
            <textarea
              rows={2}
              placeholder="Add a comment…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              style={{ border: 'none', outline: 'none' }}
              className="w-full bg-neutral-900/60 rounded-xl px-4 py-3 text-sm text-white
                         placeholder:text-neutral-600 resize-none
                         ring-1 ring-neutral-800 focus:ring-neutral-600
                         transition-all duration-200 shadow-none my-0 mt-0 p-3"
            />
            {text.trim() && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-neutral-700">⌘↵ to post</span>
                <button
                  onClick={submitComment}
                  disabled={submitting}
                  className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-lg
                             hover:bg-neutral-200 transition-colors duration-150 disabled:opacity-50
                             border-0 shadow-none w-auto mt-0"
                >
                  {submitting ? "Posting…" : "Post"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-10 py-6 rounded-xl border border-neutral-800/60 text-center">
          <p className="text-sm text-neutral-500 mb-3">Sign in to leave a comment</p>
          <Link
            href="/login"
            className="inline-block px-4 py-1.5 border border-neutral-700 text-sm
                       text-neutral-300 hover:text-white hover:border-neutral-500
                       rounded-lg transition-colors duration-150"
          >
            Log in
          </Link>
        </div>
      )}

      {/* Thread */}
      <div>
        {topLevel.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            allComments={comments}
            postId={postId}
            collectionName={collectionName}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}

function CommentItem({ comment, allComments, postId, collectionName, depth }) {
  const { user } = UserAuth() || {};
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const replies = allComments.filter((c) => c.parentId === comment.id);

  const submitReply = async () => {
    if (!replyText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, collectionName, postId, "comments"), {
        text: replyText.trim(),
        parentId: comment.id,
        userId: user.uid,
        username: user.username,
        avatarUrl: user.avatarUrl || "",
        createdAt: serverTimestamp(),
      });
      setReplyText("");
      setReplying(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitReply();
  };

  const isNested = depth > 0;

  return (
    <div className={isNested ? "mt-4 ml-11" : "py-5 border-b border-neutral-800/40 last:border-0"}>
      <div className="flex gap-3">
        <Avatar url={comment.avatarUrl} name={comment.username} />

        <div className="flex-1 min-w-0">
          {/* Name + time */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-semibold text-white leading-none">
              {comment.username}
            </span>
            <span className="text-xs text-neutral-700 leading-none">
              {timeAgo(comment.createdAt)}
            </span>
          </div>

          {/* Text */}
          <p className="text-sm text-neutral-300 leading-relaxed">{comment.text}</p>

          {/* Reply button */}
          {user && (
            <button
              onClick={() => setReplying((v) => !v)}
              className="mt-2 text-xs text-neutral-600 hover:text-neutral-300 transition-colors
                         border-0 shadow-none p-0 w-auto mt-0 font-normal rounded-none"
            >
              {replying ? "Cancel" : "Reply"}
            </button>
          )}

          {/* Reply compose */}
          {replying && (
            <div className="mt-3 flex gap-2">
              <Avatar url={user.avatarUrl} name={user.username} />
              <div className="flex-1">
                <textarea
                  rows={2}
                  autoFocus
                  placeholder={`Reply to ${comment.username}…`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleKey}
                  style={{ border: 'none', outline: 'none' }}
                  className="w-full bg-neutral-900/60 rounded-xl px-4 py-2.5 text-sm text-white
                             placeholder:text-neutral-600 resize-none
                             ring-1 ring-neutral-800 focus:ring-neutral-600
                             transition-all duration-200 shadow-none my-0 mt-0 p-3"
                />
                {replyText.trim() && (
                  <div className="flex justify-end mt-1.5">
                    <button
                      onClick={submitReply}
                      disabled={submitting}
                      className="px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg
                                 hover:bg-neutral-200 transition-colors disabled:opacity-50
                                 border-0 shadow-none w-auto mt-0"
                    >
                      {submitting ? "Posting…" : "Reply"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nested replies */}
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              allComments={allComments}
              postId={postId}
              collectionName={collectionName}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
