"use client";

import { useRef, useState, useEffect } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logOut } = UserAuth() || {};
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

  // Provide guaranteed safe avatar
  const avatarSrc =
    user?.avatarUrl && user.avatarUrl.trim() !== ""
      ? user.avatarUrl
      : "/default-avatar.png";

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

        {/* LOGIN / PROFILE */}
        {!user ? (
          <Link href="/login" className="hover:text-accent">
            Login
          </Link>
        ) : (
          <div className="flex items-center gap-4">

            {/* SAFE AVATAR */}
            <Link href={`/profile/${user.uid}`}>
              <img
                src={avatarSrc}
                alt="profile"
                className="w-9 h-9 rounded-full cursor-pointer border border-primary/40 hover:opacity-80"
              />
            </Link>

            <button
              onClick={logOut}
              className="hover:text-accent transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* MOBILE HAMBURGER */}
      <div onClick={toggleNav} className="md:hidden cursor-pointer">
        {nav ? <AiOutlineClose size={22} /> : <HiOutlineMenuAlt4 size={22} />}
      </div>

      {/* MOBILE MENU */}
      <div
        ref={navRef}
        className={`absolute bg-secondary w-full left-0 top-20 shadow-xl transition-all duration-300 md:hidden ${
          nav ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-4 p-6 text-lg">

          <Link href="/" onClick={() => setNav(false)}>Home</Link>
          <Link href="/forum" onClick={() => setNav(false)}>Forum</Link>
          <Link href="/blog" onClick={() => setNav(false)}>Blog</Link>
          <Link href="/first" onClick={() => setNav(false)}>First</Link>

          {/* MOBILE PROFILE */}
          {user && (
            <Link
              href={`/profile/${user.uid}`}
              className="flex items-center gap-3 mt-4"
              onClick={() => setNav(false)}
            >
              <img
                src={avatarSrc}
                className="w-10 h-10 rounded-full border border-primary/40"
              />
              <p className="text-primary">{user.username}</p>
            </Link>
          )}

          {/* LOGIN / LOGOUT */}
          <div className="flex items-center gap-4 pt-4 border-t mt-4">
            {!user ? (
              <Link href="/login" onClick={() => setNav(false)}>
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  logOut();
                  setNav(false);
                }}
              >
                Logout
              </button>
            )}
          </div>

        </ul>
      </div>
    </div>
  );
}
