'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';
import MailchimpSubscribe from 'react-mailchimp-subscribe';

const inputStyle = {
  border: 'none',
  boxShadow: 'none',
  outline: 'none',
  margin: 0,
};

function NewsletterForm({ onSubmitted }) {
  const emailRef = useRef(null);

  const submit = () => {
    const val = emailRef.current?.value?.trim();
    if (val && val.includes('@')) {
      onSubmitted({ EMAIL: val });
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="flex gap-2 mt-4 max-w-sm">
      <input
        ref={emailRef}
        type="email"
        placeholder="your@email.com"
        onKeyDown={handleKey}
        style={inputStyle}
        className="flex-1 bg-neutral-900 ring-1 ring-neutral-800 focus:ring-neutral-600
                   rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600
                   transition-all duration-200 my-0 min-w-0"
      />
      <button
        onClick={submit}
        className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg
                   hover:bg-neutral-200 transition-colors border-0 shadow-none w-auto mt-0"
      >
        Subscribe
      </button>
    </div>
  );
}

export default function Footer() {
  const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-800/60 mt-24 pt-14 pb-10 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="text-base font-bold tracking-wide text-white">
              Soup<span style={{ color: 'rgb(168 85 247)' }}>DeJour</span>
            </Link>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Stories, food reviews, and whatever else is on the menu.
            </p>
            <Link
              href="https://www.instagram.com/soupdejourtommy/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-neutral-500 hover:text-white transition-colors text-sm"
            >
              <FaInstagram size={16} />
              @soupdejourtommy
            </Link>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-700 font-semibold mb-4">
              Explore
            </p>
            <div className="flex flex-col gap-2.5">
              <Link href="/stories" className="text-sm text-neutral-500 hover:text-white transition-colors">Stories</Link>
              <Link href="/reviews" className="text-sm text-neutral-500 hover:text-white transition-colors">Reviews</Link>
              <Link href="/first" className="text-sm text-neutral-500 hover:text-white transition-colors">First</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-700 font-semibold mb-1">
              Newsletter
            </p>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              New stories and reviews, straight to your inbox.
            </p>
            {url ? (
              <MailchimpSubscribe
                url={url}
                render={({ subscribe, status }) => (
                  <div>
                    {status === 'success' ? (
                      <p className="text-xs text-green-500 mt-4">You&apos;re subscribed!</p>
                    ) : (
                      <>
                        <NewsletterForm onSubmitted={subscribe} />
                        {status === 'sending' && (
                          <p className="text-xs text-neutral-600 mt-2">Subscribing…</p>
                        )}
                        {status === 'error' && (
                          <p className="text-xs text-red-400 mt-2">Something went wrong. Try again.</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              />
            ) : (
              <NewsletterForm onSubmitted={() => {}} />
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-neutral-800/40 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-neutral-700">
            © {year} SoupDeJourTommy. All rights reserved.
          </p>
          <p className="text-xs text-neutral-700">
            Made with good taste.
          </p>
        </div>

      </div>
    </footer>
  );
}
