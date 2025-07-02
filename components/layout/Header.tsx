'use client';

import React from 'react';
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
} from 'lucide-react';

const pageConfig = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Quality assurance overview and insights',
    actions: ['refresh', 'export'],
  },
  '/test-execution': {
    title: 'Test Execution',
    subtitle: 'Execute and monitor test cases',
    actions: ['create', 'filter', 'refresh'],
  },
  '/test-management': {
    title: 'Test Management',
    subtitle: 'Manage test cases and scenarios',
    actions: ['create', 'filter', 'export'],
  },
  '/reports': {
    title: 'Reports & Analytics',
    subtitle: 'Comprehensive testing insights',
    actions: ['filter', 'export', 'schedule'],
  },
};

export default function Header() {
  const pathname = usePathname();
  const config = pageConfig[pathname as keyof typeof pageConfig] || {
    title: 'QualityHub',
    subtitle: 'Professional testing platform',
    actions: [],
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderActionButton = (action: string) => {
    const buttonProps = {
      size: 'sm' as const,
      className: 'h-9',
    };

    switch (action) {
      case 'create':
        return (
          <Button key={action} {...buttonProps} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        );
      case 'filter':
        return (
          <DropdownMenu key={action}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" {...buttonProps}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Status: All</DropdownMenuItem>
              <DropdownMenuItem>Priority: High</DropdownMenuItem>
              <DropdownMenuItem>Date Range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case 'export':
        return (
          <Button key={action} variant="outline" {...buttonProps}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        );
      case 'refresh':
        return (
          <Button key={action} variant="outline" {...buttonProps}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        );
      case 'schedule':
        return (
          <Button key={action} variant="outline" {...buttonProps}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Page Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
              <p className="text-sm text-gray-600">{config.subtitle}</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{getCurrentTime()}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tests, tasks, or reports..."
              className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {config.actions.map(renderActionButton)}
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-600">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Recent Notifications</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium">Test Suite Completed</p>
                    <p className="text-xs text-gray-600">API tests finished with 95% pass rate</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium">Review Required</p>
                    <p className="text-xs text-gray-600">2 test cases need your attention</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium">Report Generated</p>
                    <p className="text-xs text-gray-600">Weekly QA report is ready</p>
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