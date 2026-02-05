"use client";

import { useState } from "react";
import { UserAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function SignupPage() {
  const { emailSignUp } = UserAuth() || {};

  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !birthday) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const user = await emailSignUp(email, password, name, birthday);
      window.location.href = `/profile/${user.uid}`;
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="bg-neutral-900 p-8 rounded-lg w-full max-w-md shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {/* FULL NAME */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-3 p-2 bg-neutral-800 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* BIRTHDAY */}
        <input
          type="date"
          className="w-full mb-3 p-2 bg-neutral-800 rounded"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 bg-neutral-800 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-neutral-800 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-primary text-background py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline">
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
}
