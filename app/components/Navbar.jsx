"use client";

import { useRef, useState, useEffect } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { UserAuth } from "@/app/context/AuthContext";

export default function Navbar() {
  const [nav, setNav] = useState(false);
  const navRef = useRef(null);
  const { user, authLoading, logOut } = UserAuth() || {};

  const toggleNav = () => setNav((prev) => !prev);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (nav && navRef.current && !navRef.current.contains(e.target)) {
        setNav(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [nav]);

  return (
    <div className="flex justify-between items-center w-full h-20 px-6 bg-secondary text-primary fixed top-0 left-0 z-20 shadow-md">

      {/* BRAND */}
      <Link href="/" className="text-2xl font-bold tracking-wide cursor-pointer">
        Soup<span className="text-accent">DeJour</span>
      </Link>

      {/* DESKTOP MENU */}
      <ul className="hidden md:flex items-center gap-8 text-lg">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/stories" prefetch={false}>Stories</Link></li>
        <li><Link href="/reviews" prefetch={false}>Reviews</Link></li>
        <li><Link href="/first">First</Link></li>
      </ul>

      {/* DESKTOP RIGHT SIDE */}
      <div className="hidden md:flex items-center gap-5">

        <BsSearch size={20} className="cursor-pointer" />

        <Link href="https://www.instagram.com/soupdejourtommy/">
          <FaInstagram size={20} className="cursor-pointer" />
        </Link>

        {!authLoading && (
          user ? (
            <div className="flex items-center gap-3">
              <Link
                href={`/profile/${user.uid}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username || ""}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-medium">
                    {user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <span className="text-sm text-neutral-300">{user.username}</span>
              </Link>
              <button
                onClick={logOut}
                title="Log out"
                className="text-xs text-neutral-500 hover:text-white transition-colors
                           border-0 shadow-none p-0 w-auto mt-0 font-normal rounded-none"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-neutral-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
          )
        )}

      </div>

      {/* MOBILE HAMBURGER */}
      <div onClick={toggleNav} className="md:hidden cursor-pointer">
        {nav ? <AiOutlineClose size={22} /> : <HiOutlineMenuAlt4 size={22} />}
      </div>

      {/* MOBILE MENU */}
      <div
        ref={navRef}
        className={`absolute bg-secondary w-full left-0 top-20 border-t border-neutral-800/60
                    shadow-2xl transition-all duration-300 ease-out md:hidden
                    ${nav
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
      >
        <nav className="flex flex-col px-6 py-4">

          {[
            { href: "/", label: "Home" },
            { href: "/stories", label: "Stories" },
            { href: "/reviews", label: "Reviews" },
            { href: "/first", label: "First" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setNav(false)}
              className="flex items-center justify-between py-4 border-b border-neutral-800/40
                         text-base font-medium text-neutral-300 hover:text-white
                         transition-colors duration-150"
            >
              {label}
              <span className="text-neutral-700 text-sm">→</span>
            </Link>
          ))}

          {!authLoading && (
            user ? (
              <>
                <Link
                  href={`/profile/${user.uid}`}
                  onClick={() => setNav(false)}
                  className="flex items-center justify-between py-4 border-b border-neutral-800/40
                             text-base font-medium text-neutral-300 hover:text-white
                             transition-colors duration-150"
                >
                  <span className="flex items-center gap-3">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-xs">
                        {user.username?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    {user.username}
                  </span>
                  <span className="text-neutral-700 text-sm">→</span>
                </Link>
                <button
                  onClick={() => { logOut(); setNav(false); }}
                  className="flex items-center justify-between py-4 last:border-0
                             text-base font-medium text-neutral-500 hover:text-white
                             transition-colors duration-150 border-0 shadow-none
                             w-full text-left mt-0 rounded-none"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setNav(false)}
                className="flex items-center justify-between py-4 last:border-0
                           text-base font-medium text-neutral-300 hover:text-white
                           transition-colors duration-150"
              >
                Log in
                <span className="text-neutral-700 text-sm">→</span>
              </Link>
            )
          )}

        </nav>
      </div>
    </div>
  );
}
