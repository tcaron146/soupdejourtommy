"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { AuthContextProvider } from "./context/AuthContext";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className={inter.className}>
        {/* 🔥 Wrap the entire app in the provider */}
        <AuthContextProvider>
          <div className="min-h-[100vh] bg-secondary">
            <Navbar />
            {children}
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
