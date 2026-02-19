'use client';

import { useState, useEffect } from 'react';

const BTN =
  'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-800 shadow-none ' +
  'text-sm font-normal text-neutral-400 hover:text-white hover:border-neutral-600 ' +
  'transition-colors duration-200 w-auto mt-0';

export default function ShareButtons({ title, text }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const twitterUrl = url
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    : '#';

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, text: text || title, url: url || window.location.href });
    } catch {}
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={BTN}>
        <span>↗</span> Share on X
      </a>
      <button type="button" onClick={handleCopy} className={BTN}>
        {copied ? '✓ Copied!' : '⎘ Copy link'}
      </button>
      {canNativeShare && (
        <button type="button" onClick={handleNativeShare} className={BTN}>
          ↑ Share
        </button>
      )}
    </div>
  );
}
