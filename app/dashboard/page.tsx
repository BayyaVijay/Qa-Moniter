'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import { useTestExecution } from '@/context/TestExecutionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  TestTube2,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, getTasks } = useTask();
  const { testExecutions, getTestExecutions } = useTestExecution();
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalExecutions: 0,
    completedExecutions: 0,
    pendingExecutions: 0,
    failedExecutions: 0,
    inProgressExecutions: 0,
    averagePassRate: 0,
    weeklyGrowth: 0,
    activeTesters: 0,
  });

  useEffect(() => {
    getTasks();
    getTestExecutions();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || testExecutions.length > 0) {
      calculateStats();
    }
  }, [tasks, testExecutions]);

  const calculateStats = () => {
    const totalTasks = tasks.length;
    const totalExecutions = testExecutions.length;
    
    const statusCounts = testExecutions.reduce((acc, execution) => {
      acc[execution.status] = (acc[execution.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalPassedTests = testExecutions.reduce((sum, execution) => sum + execution.passedTestCases, 0);
    const totalTests = testExecutions.reduce((sum, execution) => sum + execution.totalTestCases, 0);
    const averagePassRate = totalTests > 0 ? (totalPassedTests / totalTests) * 100 : 0;

    // Calculate weekly growth (mock data for demo)
    const weeklyGrowth = Math.floor(Math.random() * 20) + 5;
    
    // Count unique testers
    const uniqueTesters = new Set(testExecutions.map(e => e.testerName)).size;

    setStats({
      totalTasks,
      totalExecutions,
      completedExecutions: statusCounts.completed || 0,
      pendingExecutions: statusCounts.pending || 0,
      failedExecutions: statusCounts.failed || 0,
      inProgressExecutions: statusCounts['in-progress'] || 0,
      averagePassRate,
      weeklyGrowth,
      activeTesters: uniqueTesters,
    });
  };

  // Mock data for charts
  const weeklyData = [
    { name: 'Mon', tests: 45, passed: 42, failed: 3 },
    { name: 'Tue', tests: 52, passed: 48, failed: 4 },
    { name: 'Wed', tests: 38, passed: 35, failed: 3 },
    { name: 'Thu', tests: 61, passed: 58, failed: 3 },
    { name: 'Fri', tests: 55, passed: 51, failed: 4 },
    { name: 'Sat', tests: 28, passed: 26, failed: 2 },
    { name: 'Sun', tests: 22, passed: 20, failed: 2 },
  ];

  const statusData = [
    { name: 'Completed', value: stats.completedExecutions, color: '#10B981' },
    { name: 'In Progress', value: stats.inProgressExecutions, color: '#3B82F6' },
    { name: 'Pending', value: stats.pendingExecutions, color: '#F59E0B' },
    { name: 'Failed', value: stats.failedExecutions, color: '#EF4444' },
  ].filter(item => item.value > 0);

  const trendData = [
    { month: 'Jan', passRate: 85, coverage: 78 },
    { month: 'Feb', passRate: 88, coverage: 82 },
    { month: 'Mar', passRate: 92, coverage: 85 },
    { month: 'Apr', passRate: 89, coverage: 88 },
    { month: 'May', passRate: 94, coverage: 91 },
    { month: 'Jun', passRate: stats.averagePassRate, coverage: 93 },
  ];

  const recentExecutions = testExecutions
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name}! 🚀
              </h1>
              <p className="text-blue-100 text-lg">
                Your testing dashboard is looking great today
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.weeklyGrowth}%</div>
                <div className="text-sm text-blue-200">Weekly Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.averagePassRate.toFixed(0)}%</div>
                <div className="text-sm text-blue-200">Pass Rate</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tests</CardTitle>
            <div className="bg-blue-100 p-2 rounded-lg">
              <TestTube2 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalExecutions}</div>
            <div className="flex items-center space-x-1 mt-2">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pass Rate</CardTitle>
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.averagePassRate.toFixed(1)}%</div>
            <Progress value={stats.averagePassRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Testers</CardTitle>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.activeTesters}</div>
            <div className="flex items-center space-x-1 mt-2">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+2 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Test Tasks</CardTitle>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Target className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalTasks}</div>
            <div className="flex items-center space-x-1 mt-2">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+5 this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Test Activity */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Weekly Test Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="tests" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorTests)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Test Status Distribution */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <span>Test Status Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TestTube2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p>No test data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Quality Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="passRate" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Pass Rate (%)"
              />
              <Line 
                type="monotone" 
                dataKey="coverage" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Coverage (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Test Executions */}
        <Card className="lg:col-span-2 glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Recent Test Executions</span>
              </span>
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExecutions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TestTube2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p>No recent test executions</p>
                </div>
              ) : (
                recentExecutions.map((execution) => (
                  <div key={execution._id} className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                    {getStatusIcon(execution.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {execution.testId}
                      </p>
                      <p className="text-sm text-gray-500">
                        By {execution.testerName} • {new Date(execution.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`status-indicator ${getStatusColor(execution.status)}`}>
                        {execution.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {execution.passedTestCases}/{execution.totalTestCases} passed
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <TestTube2 className="h-4 w-4 mr-2" />
                New Test Execution
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Create Test Task
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Team Overview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}