'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Bell,
  Plus,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  Zap,
  Brain,
  Rocket,
  Shield,
  Activity,
  Wifi,
} from 'lucide-react';

const pageConfig = {
  '/dashboard': {
    title: 'Command Center',
    subtitle: 'Real-time QA mission control and intelligence',
    actions: ['refresh', 'export'],
    gradient: 'from-blue-600 to-purple-600',
  },
  '/test-execution': {
    title: 'Test Laboratory',
    subtitle: 'Execute and monitor test operations',
    actions: ['create', 'filter', 'refresh'],
    gradient: 'from-green-600 to-teal-600',
  },
  '/test-management': {
    title: 'Test Arsenal',
    subtitle: 'Manage test cases and scenarios',
    actions: ['create', 'filter', 'export'],
    gradient: 'from-orange-600 to-red-600',
  },
  '/reports': {
    title: 'Intelligence Hub',
    subtitle: 'Advanced analytics and insights',
    actions: ['filter', 'export', 'schedule'],
    gradient: 'from-purple-600 to-pink-600',
  },
};

export default function FuturisticHeader() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  
  const config = pageConfig[pathname as keyof typeof pageConfig] || {
    title: 'TestForge Pro',
    subtitle: 'Next-generation testing platform',
    actions: [],
    gradient: 'from-gray-600 to-slate-600',
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderActionButton = (action: string) => {
    const buttonProps = {
      size: 'sm' as const,
      className: 'h-10 transition-all duration-300 hover:scale-105',
    };

    switch (action) {
      case 'create':
        return (
          <Button key={action} {...buttonProps} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        );
      case 'filter':
        return (
          <DropdownMenu key={action}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" {...buttonProps} className="border-2 hover:border-purple-300">
                <Filter className="h-4 w-4 mr-2" />
                Smart Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Zap className="h-4 w-4 mr-2" />
                High Priority
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Brain className="h-4 w-4 mr-2" />
                AI Suggested
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case 'export':
        return (
          <Button key={action} variant="outline" {...buttonProps} className="border-2 hover:border-blue-300">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        );
      case 'refresh':
        return (
          <Button key={action} variant="outline" {...buttonProps} className="border-2 hover:border-green-300">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        );
      case 'schedule':
        return (
          <Button key={action} variant="outline" {...buttonProps} className="border-2 hover:border-purple-300">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <header className="glass-morphism border-b border-white/20 px-8 py-6 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Page Info with Gradient */}
        <div className="flex-1">
          <div className="flex items-center space-x-6">
            <div>
              <div className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                <h1 className="text-3xl font-bold">{config.title}</h1>
              </div>
              <p className="text-sm text-gray-600 mt-1">{config.subtitle}</p>
            </div>
            
            {/* Status Indicators */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Wifi className={`h-4 w-4 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
                <span className="text-xs font-medium text-gray-700">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-700">Active</span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-medium text-gray-700 font-mono">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Search */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="AI-powered search across tests, tasks, and reports..."
              className="pl-12 pr-4 h-12 bg-white/10 backdrop-blur-sm border-2 border-white/20 focus:border-purple-300 focus:bg-white/20 rounded-2xl text-gray-700 placeholder-gray-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                AI
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {config.actions.map(renderActionButton)}
          
          {/* Notifications with Animation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 w-10 p-0 relative border-2 hover:border-purple-300 transition-all duration-300 hover:scale-105">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 pulse-animation">
                  5
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-0">
              <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-purple-600" />
                  Smart Notifications
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-l-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Rocket className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-semibold">Test Suite Completed</p>
                      <Badge className="text-xs bg-blue-100 text-blue-700">2 min ago</Badge>
                    </div>
                    <p className="text-xs text-gray-600">API tests finished with 98% pass rate</p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-l-yellow-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm font-semibold">AI Insight Available</p>
                      <Badge className="text-xs bg-yellow-100 text-yellow-700">5 min ago</Badge>
                    </div>
                    <p className="text-xs text-gray-600">Performance optimization suggestions ready</p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-l-green-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <p className="text-sm font-semibold">Security Scan Complete</p>
                      <Badge className="text-xs bg-green-100 text-green-700">10 min ago</Badge>
                    </div>
                    <p className="text-xs text-gray-600">No vulnerabilities detected</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}