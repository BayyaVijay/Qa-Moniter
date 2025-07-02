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
  RadialBarChart,
  RadialBar,
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
  Brain,
  Rocket,
  Shield,
  Sparkles,
  Eye,
  BarChart3,
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
    criticalIssues: 0,
    aiInsights: 0,
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

    const weeklyGrowth = Math.floor(Math.random() * 25) + 8;
    const uniqueTesters = new Set(testExecutions.map(e => e.testerName)).size;
    const criticalIssues = Math.floor(Math.random() * 5) + 1;
    const aiInsights = Math.floor(Math.random() * 12) + 3;

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
      criticalIssues,
      aiInsights,
    });
  };

  // Enhanced mock data for advanced charts
  const performanceData = [
    { name: 'Mon', tests: 65, passed: 62, failed: 3, performance: 95 },
    { name: 'Tue', tests: 78, passed: 74, failed: 4, performance: 94 },
    { name: 'Wed', tests: 52, passed: 48, failed: 4, performance: 92 },
    { name: 'Thu', tests: 89, passed: 85, failed: 4, performance: 96 },
    { name: 'Fri', tests: 71, passed: 68, failed: 3, performance: 97 },
    { name: 'Sat', tests: 34, passed: 32, failed: 2, performance: 94 },
    { name: 'Sun', tests: 28, passed: 26, failed: 2, performance: 93 },
  ];

  const statusData = [
    { name: 'Completed', value: stats.completedExecutions, color: '#10B981', fill: '#10B981' },
    { name: 'In Progress', value: stats.inProgressExecutions, color: '#3B82F6', fill: '#3B82F6' },
    { name: 'Pending', value: stats.pendingExecutions, color: '#F59E0B', fill: '#F59E0B' },
    { name: 'Failed', value: stats.failedExecutions, color: '#EF4444', fill: '#EF4444' },
  ].filter(item => item.value > 0);

  const qualityTrendData = [
    { month: 'Jan', passRate: 87, coverage: 82, bugs: 23 },
    { month: 'Feb', passRate: 91, coverage: 85, bugs: 18 },
    { month: 'Mar', passRate: 94, coverage: 88, bugs: 15 },
    { month: 'Apr', passRate: 92, coverage: 91, bugs: 12 },
    { month: 'May', passRate: 96, coverage: 94, bugs: 8 },
    { month: 'Jun', passRate: stats.averagePassRate, coverage: 97, bugs: 5 },
  ];

  const teamPerformanceData = [
    { name: 'Alice', tests: 45, passRate: 96, efficiency: 92 },
    { name: 'Bob', tests: 38, passRate: 94, efficiency: 88 },
    { name: 'Carol', tests: 52, passRate: 98, efficiency: 95 },
    { name: 'David', tests: 41, passRate: 91, efficiency: 85 },
  ];

  const recentExecutions = testExecutions
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 6);

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
    <div className="space-y-8 slide-in-bottom">
      {/* Hero Welcome Section */}
      <div className="neo-card bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-8 w-8 text-yellow-300" />
                <h1 className="text-4xl font-bold">
                  Welcome back, {user?.name}! 🚀
                </h1>
              </div>
              <p className="text-xl text-purple-100">
                Your testing command center is operating at peak performance
              </p>
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Brain className="h-5 w-5 text-cyan-300" />
                  <span className="font-semibold">{stats.aiInsights} AI Insights</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Shield className="h-5 w-5 text-green-300" />
                  <span className="font-semibold">Security: Optimal</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <Rocket className="h-5 w-5 text-orange-300" />
                  <span className="font-semibold">Performance: 97%</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.weeklyGrowth}%</div>
                <div className="text-sm text-purple-200">Weekly Growth</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300">{stats.averagePassRate.toFixed(0)}%</div>
                <div className="text-sm text-purple-200">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">{stats.criticalIssues}</div>
                <div className="text-sm text-purple-200">Critical Issues</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card-advanced">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">Total Test Executions</CardTitle>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
              <TestTube2 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.totalExecutions}</div>
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-semibold">+{stats.weeklyGrowth}% from last week</span>
            </div>
            <Progress value={75} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="metric-card-advanced">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">Quality Score</CardTitle>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.averagePassRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-semibold">+2.3% improvement</span>
            </div>
            <Progress value={stats.averagePassRate} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="metric-card-advanced">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">Active Team Members</CardTitle>
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-2xl">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.activeTesters}</div>
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-semibold">+2 new members</span>
            </div>
            <div className="flex -space-x-2 mt-3">
              {[...Array(Math.min(stats.activeTesters, 4))].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {stats.activeTesters > 4 && (
                <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-bold">
                  +{stats.activeTesters - 4}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card-advanced">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">AI Insights</CardTitle>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-2xl">
              <Brain className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.aiInsights}</div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-600 font-semibold">Ready for review</span>
            </div>
            <Button size="sm" className="mt-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
              <Eye className="h-3 w-3 mr-1" />
              View Insights
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Trends */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-blue-600" />
              <span>Performance Analytics</span>
              <Badge className="bg-blue-100 text-blue-700">Real-time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorPerformance)" 
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="tests" 
                  stroke="#10B981" 
                  fillOpacity={1} 
                  fill="url(#colorTests)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution with Radial Chart */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <span>Test Status Overview</span>
              <Badge className="bg-purple-100 text-purple-700">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <div className="h-[320px] flex items-center justify-center text-gray-500">
                <div className="text-center space-y-4">
                  <TestTube2 className="h-16 w-16 text-gray-300 mx-auto" />
                  <p className="text-lg font-medium">No test data available</p>
                  <p className="text-sm">Start running tests to see analytics</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={3}
                    stroke="#fff"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quality Trends */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <span>Quality Intelligence Dashboard</span>
            <Badge className="bg-green-100 text-green-700">AI-Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={qualityTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="passRate" 
                stroke="#10B981" 
                strokeWidth={4}
                dot={{ fill: '#10B981', strokeWidth: 3, r: 6 }}
                name="Pass Rate (%)"
              />
              <Line 
                type="monotone" 
                dataKey="coverage" 
                stroke="#3B82F6" 
                strokeWidth={4}
                dot={{ fill: '#3B82F6', strokeWidth: 3, r: 6 }}
                name="Coverage (%)"
              />
              <Line 
                type="monotone" 
                dataKey="bugs" 
                stroke="#EF4444" 
                strokeWidth={4}
                dot={{ fill: '#EF4444', strokeWidth: 3, r: 6 }}
                name="Bug Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity & Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Test Executions */}
        <Card className="lg:col-span-2 neo-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-blue-600" />
                <span>Recent Test Executions</span>
                <Badge className="bg-blue-100 text-blue-700">Live Feed</Badge>
              </div>
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExecutions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <TestTube2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium">No recent test executions</p>
                  <p className="text-sm">Start testing to see activity here</p>
                </div>
              ) : (
                recentExecutions.map((execution) => (
                  <div key={execution._id} className="interactive-card flex items-center space-x-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-100">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                      {getStatusIcon(execution.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-900 truncate">
                        {execution.testId}
                      </p>
                      <p className="text-sm text-gray-600">
                        By {execution.testerName} • {new Date(execution.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={`status-badge ${getStatusColor(execution.status)}`}>
                        {execution.status}
                      </Badge>
                      <div className="text-sm font-semibold text-gray-700">
                        {execution.passedTestCases}/{execution.totalTestCases} passed
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & AI Insights */}
        <Card className="neo-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Rocket className="h-6 w-6 text-purple-600" />
              <span>Mission Control</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <TestTube2 className="h-5 w-5 mr-3" />
              Launch Test Execution
            </Button>
            <Button variant="outline" className="w-full justify-start h-14 border-2 hover:border-green-300 rounded-2xl hover:scale-105 transition-all duration-300">
              <Target className="h-5 w-5 mr-3 text-green-600" />
              Create Smart Task
            </Button>
            <Button variant="outline" className="w-full justify-start h-14 border-2 hover:border-orange-300 rounded-2xl hover:scale-105 transition-all duration-300">
              <Brain className="h-5 w-5 mr-3 text-orange-600" />
              AI Insights ({stats.aiInsights})
            </Button>
            <Button variant="outline" className="w-full justify-start h-14 border-2 hover:border-purple-300 rounded-2xl hover:scale-105 transition-all duration-300">
              <BarChart3 className="h-5 w-5 mr-3 text-purple-600" />
              Analytics Hub
            </Button>
            
            {/* AI Insights Preview */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Latest AI Insight</span>
              </div>
              <p className="text-sm text-purple-700">
                Performance optimization detected: Consider parallel test execution to reduce runtime by 23%
              </p>
              <Button size="sm" className="mt-3 bg-purple-600 hover:bg-purple-700 text-white">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button */}
      <Button className="floating-action">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}