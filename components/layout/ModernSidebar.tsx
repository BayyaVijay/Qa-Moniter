'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  TestTube2,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Zap,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Rocket,
  Shield,
  Brain,
  Menu,
  X,
} from 'lucide-react';

const navigation = [
  {
    name: 'Command Center',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Mission Control',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    name: 'Test Laboratory',
    href: '/test-execution',
    icon: TestTube2,
    description: 'Execute & Monitor',
    gradient: 'from-green-500 to-teal-600',
  },
  {
    name: 'Test Arsenal',
    href: '/test-management',
    icon: FileText,
    description: 'Create & Manage',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    name: 'Intelligence Hub',
    href: '/reports',
    icon: BarChart3,
    description: 'Analytics & Insights',
    gradient: 'from-purple-500 to-pink-600',
  },
];

const quickActions = [
  {
    name: 'Lightning Test',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    name: 'Smart Task',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    gradient: 'from-purple-400 to-indigo-500',
  },
  {
    name: 'Rocket Analytics',
    icon: Rocket,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    name: 'Shield Guard',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    gradient: 'from-green-400 to-emerald-500',
  },
];

export default function ModernSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'manager':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'tester':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TooltipProvider>
      <div className={`flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-80'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-3 rounded-2xl neon-glow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TestForge Pro</h1>
                <p className="text-xs text-slate-400">Next-Gen QA Platform</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`group flex items-center space-x-4 px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl neon-glow`
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-105'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-slate-700/50 group-hover:bg-slate-600/50'}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className="font-semibold">{item.name}</div>
                        <div className={`text-xs ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="px-4 py-4 border-t border-slate-700/50">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <Sparkles className="h-3 w-3 mr-2" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Tooltip key={action.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-16 flex-col space-y-2 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-105 transition-all duration-300"
                    >
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${action.gradient}`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs font-medium">{action.name}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                    <p>{action.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`w-full justify-start p-3 h-auto hover:bg-slate-800/50 ${isCollapsed ? 'px-2' : ''}`}>
                <div className={`flex items-center space-x-3 w-full ${isCollapsed ? 'justify-center' : ''}`}>
                  <Avatar className="h-12 w-12 ring-2 ring-purple-500/50">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-600 text-white text-sm font-bold">
                      {user ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-white truncate">
                          {user?.name || 'User'}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs px-3 py-1 ${getRoleColor(user?.role || 'tester')}`}>
                            {user?.role || 'tester'}
                          </Badge>
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
              <DropdownMenuLabel className="text-slate-200">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 hover:text-white">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-700 hover:text-white">
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                onClick={logout} 
                className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}