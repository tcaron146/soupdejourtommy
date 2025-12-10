"use client";

import { useState } from "react";
import { UserAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { googleSignIn, emailSignIn } = UserAuth() || {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
  setLoading(true);
  try {
    await emailSignIn(email, password);
    window.location.href = "/";
  } catch (err: any) {
    alert(err.message);
  }
  setLoading(false);
};

const handleGoogleLogin = async () => {
  setLoading(true);
  try {
    await googleSignIn();
    window.location.href = "/";
  } catch (err: any) {
    alert(err.message);
  }
  setLoading(false);
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="bg-neutral-900 p-8 rounded-lg w-full max-w-md shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 bg-neutral-800 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-neutral-800 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* EMAIL LOGIN */}
        <button
          onClick={handleEmailLogin}
          disabled={loading}
          className="w-full bg-primary text-background py-2 rounded mb-4 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded disabled:opacity-50"
        >
          Continue with Google
        </button>

        <p className="text-center mt-4 text-neutral-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-primary underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
