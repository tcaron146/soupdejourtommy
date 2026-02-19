"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";
import Link from "next/link";

const inputStyle = {
  border: 'none',
  boxShadow: 'none',
  outline: 'none',
  margin: 0,
};

export default function SignupPage() {
  const { emailSignUp } = UserAuth() || {};
  const router = useRouter();

  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !birthday) {
      setError("Please fill out all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await emailSignUp(email, password, name, birthday);
      router.push(`/profile/${user.uid}`);
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/ \(auth\/.*\)/, ""));
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-neutral-950">

      {/* Brand */}
      <Link href="/" className="text-xl font-bold tracking-wide mb-10 text-white">
        Soup<span style={{ color: 'rgb(168 85 247)' }}>DeJour</span>
      </Link>

      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-1 text-center">Create an account</h1>
        <p className="text-sm text-neutral-500 text-center mb-8">Join to save and comment</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKey}
            style={inputStyle}
            className="w-full bg-neutral-900 ring-1 ring-neutral-800 focus:ring-neutral-600
                       rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600
                       transition-all duration-200 my-0"
          />

          <div>
            <label className="block text-xs text-neutral-600 mb-1.5 pl-1">Birthday</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              style={inputStyle}
              className="w-full bg-neutral-900 ring-1 ring-neutral-800 focus:ring-neutral-600
                         rounded-xl px-4 py-3 text-sm text-neutral-300
                         transition-all duration-200 my-0
                         [color-scheme:dark]"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKey}
            style={inputStyle}
            className="w-full bg-neutral-900 ring-1 ring-neutral-800 focus:ring-neutral-600
                       rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600
                       transition-all duration-200 my-0"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKey}
            style={inputStyle}
            className="w-full bg-neutral-900 ring-1 ring-neutral-800 focus:ring-neutral-600
                       rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600
                       transition-all duration-200 my-0"
          />
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="mt-4 w-full bg-white text-black text-sm font-semibold py-3 rounded-xl
                     hover:bg-neutral-200 transition-colors disabled:opacity-50
                     border-0 shadow-none mt-0"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center mt-6 text-sm text-neutral-600">
          Already have an account?{" "}
          <Link href="/login" className="text-neutral-300 hover:text-white transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
