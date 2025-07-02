'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Loader2 } from 'lucide-react';

const publicRoutes = ['/login', '/register'];

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Loading QualityHub</h3>
            <p className="text-sm text-gray-600">Preparing your testing environment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicRoute) {
    window.location.href = '/login';
    return null;
  }

  if (isAuthenticated && isPublicRoute) {
    window.location.href = '/dashboard';
    return null;
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex">
      {/* Fixed Sidebar */}
      <div className="w-80 h-screen fixed top-0 left-0 z-50">
        <Sidebar />
      </div>
  
      {/* Main Content Area */}
      <div className="ml-80 flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}