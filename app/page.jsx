"use client";
import Hero from "./components/Hero";
import Login from "./components/Login";
import { UserAuth } from "./context/AuthContext";

export default function Page() {
  const { user } = UserAuth() || {};

  return (
    <div>
      <Hero />

      {/* Optional login section */}
      {!user && (
        <div className="max-w-xl mx-auto mt-10">
          <Login />
        </div>
      )}
    </div>
  );
}
