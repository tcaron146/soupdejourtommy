'use client';

import { useState, useEffect, useRef } from 'react';
import { db, storage } from '@/app/firebase';
import { doc, setDoc, collection, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

function today() {
  return new Date().toISOString().split('T')[0];
}

function MediaPreview({ file, onRemove }) {
  const [url, setUrl] = useState('');
  const isVideo = file.type.startsWith('video/');

  useEffect(() => {
    const obj = URL.createObjectURL(file);
    setUrl(obj);
    return () => URL.revokeObjectURL(obj);
  }, [file]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-neutral-900 aspect-video">
      {isVideo
        ? <video src={url} className="w-full h-full object-cover" muted />
        : <img src={url} alt="" className="w-full h-full object-cover" />
      }
      <span className="absolute top-1.5 left-1.5 text-[9px] uppercase tracking-wider
                       bg-black/60 text-white px-1.5 py-0.5 rounded font-semibold">
        {isVideo ? 'Video' : 'Photo'}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60
                   text-white text-xs hover:bg-red-500/80 transition-colors
                   border-0 shadow-none p-0 w-auto mt-0 font-normal
                   flex items-center justify-center"
        style={{ width: '24px', height: '24px' }}
      >
        ✕
      </button>
    </div>
  );
}

export default function AdminStoriesPage() {
  const { user } = UserAuth() || {};
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(today());
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.uid !== ADMIN_UID) {
    return (
      <main className="pt-32 max-w-md mx-auto px-6 text-center">
        <p className="text-neutral-500">Unauthorized.</p>
      </main>
    );
  }

  function addFiles(e) {
    const picked = Array.from(e.target.files || []);
    setMediaFiles(prev => [...prev, ...picked]);
    e.target.value = '';
  }

  function removeFile(index) {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function submit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Generate story ID upfront so we can use it as the storage path
      const storyRef = doc(collection(db, 'stories'));

      // Upload media
      const media = [];
      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        setUploadStatus(`Uploading ${i + 1} of ${mediaFiles.length}…`);
        const storageRef = ref(storage, `stories/${storyRef.id}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        media.push({ type: file.type.startsWith('video/') ? 'video' : 'image', url });
      }

      setUploadStatus('Publishing…');
      await setDoc(storyRef, {
        title: title.trim(),
        content: content.trim(),
        createdAt: Timestamp.fromDate(new Date(date + 'T12:00:00')),
        media,
      });

      setTitle('');
      setContent('');
      setDate(today());
      setMediaFiles([]);
      setSuccess(true);
    } catch {
      setError('Failed to publish. Check your connection and try again.');
    } finally {
      setLoading(false);
      setUploadStatus('');
    }
  }

  return (
    <main className="pt-28 max-w-2xl mx-auto px-6 pb-20">

      <Link href="/admin"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-600
                   hover:text-neutral-300 transition-colors duration-200 mb-10">
        ← Admin
      </Link>

      <p className="text-xs uppercase tracking-[0.2em] text-highlights font-semibold mb-3">
        Admin
      </p>
      <h1 className="font-bold text-white tracking-tight text-4xl mb-8">Add Story</h1>

      <form onSubmit={submit} className="flex flex-col gap-6">

        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="The Night the Bridger Chairs Froze"
            className="bg-neutral-900/60 border-neutral-800 rounded-lg px-4 py-3
                       text-white placeholder:text-neutral-700 focus:outline-none
                       focus:border-highlights/50 transition-colors shadow-none my-0"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">
            Content
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your story here…"
            rows={16}
            className="bg-neutral-900/60 border border-neutral-800 rounded-lg px-4 py-3
                       text-white placeholder:text-neutral-700 focus:outline-none
                       focus:border-highlights/50 transition-colors resize-y
                       text-[15px] leading-7 w-full"
          />
        </div>

        {/* Media */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">
              Photos & Videos
            </label>
            <span className="text-xs text-neutral-700">
              {mediaFiles.length > 0 ? `${mediaFiles.length} selected` : 'optional'}
            </span>
          </div>

          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mediaFiles.map((file, i) => (
                <MediaPreview key={i} file={file} onRemove={() => removeFile(i)} />
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={addFiles}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-lg border border-neutral-800 border-dashed
                       text-sm text-neutral-500 hover:text-white hover:border-neutral-600
                       transition-colors border-0 shadow-none w-full mt-0 font-normal
                       bg-transparent"
            style={{ border: '1px dashed rgb(38,38,38)' }}
          >
            + Add photos or videos
          </button>
          {mediaFiles.length > 0 && (
            <p className="text-xs text-neutral-700">
              Media will be placed automatically throughout the story, alternating left and right.
            </p>
          )}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-semibold">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-neutral-900/60 border-neutral-800 rounded-lg px-4 py-3
                       text-white focus:outline-none focus:border-highlights/50
                       transition-colors shadow-none my-0 w-auto"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {uploadStatus && <p className="text-neutral-400 text-sm">{uploadStatus}</p>}
        {success && (
          <p className="text-green-400 text-sm">
            Story published! <Link href="/stories" className="underline">View stories →</Link>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-6 py-3 rounded-lg bg-highlights/90 hover:bg-highlights
                     text-white font-semibold text-sm transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     border-0 shadow-none w-full sm:w-auto"
        >
          {loading ? uploadStatus || 'Publishing…' : 'Publish Story'}
        </button>

      </form>
    </main>
  );
}
