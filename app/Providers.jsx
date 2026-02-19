'use client';

import Navbar from '@/app/components/Navbar';
import { AuthContextProvider } from './context/AuthContext';

export default function Providers({ children }) {
  return (
    <AuthContextProvider>
      <div className="min-h-[100vh] bg-secondary">
        <Navbar />
        {children}
      </div>
    </AuthContextProvider>
  );
}
