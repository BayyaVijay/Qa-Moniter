'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import ModernSidebar from '@/components/layout/ModernSidebar';
import FuturisticHeader from '@/components/layout/FuturisticHeader';
import { Sparkles, Rocket, Brain } from 'lucide-react';

const publicRoutes = ['/login', '/register'];

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="particles-bg">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  animationDelay: `${Math.random() * 6}s`,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center space-y-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-3xl neon-glow">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <h3 className="text-3xl font-bold text-white">TestForge Pro</h3>
              <Rocket className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-xl text-purple-200">Initializing next-gen testing environment...</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-purple-300">
              <Brain className="h-4 w-4" />
              <span>AI systems online</span>
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="particles-bg">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Fixed Sidebar */}
      <div className="h-screen fixed top-0 left-0 z-50">
        <ModernSidebar />
      </div>
  
      {/* Main Content Area */}
      <div className="ml-80 flex-1 flex flex-col min-h-screen">
        <FuturisticHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="fade-in-scale">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}