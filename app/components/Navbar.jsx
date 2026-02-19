"use client";

import { useRef, useState, useEffect } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
export default function Navbar() {
  const [nav, setNav] = useState(false);
  const navRef = useRef(null);

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
                         transition-colors duration-150 last:border-0"
            >
              {label}
              <span className="text-neutral-700 text-sm">→</span>
            </Link>
          ))}


        </nav>
      </div>
    </div>
  );
}
