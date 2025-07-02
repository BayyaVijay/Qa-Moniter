'use client';

import React, { useEffect, useState } from 'react';
import { useTask } from '@/context/TaskContext';
import { useTestExecution } from '@/context/TestExecutionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Filter,
} from 'lucide-react';

export default function ReportsPage() {
  const { tasks, getTasks } = useTask();
  const { testExecutions, getTestExecutions } = useTestExecution();
  const [timeRange, setTimeRange] = useState('7d');
  const [reportType, setReportType] = useState('overview');

  useEffect(() => {
    getTasks();
    getTestExecutions();
  }, []);

  // Generate comprehensive analytics data
  const generateAnalytics = () => {
    const totalTests = testExecutions.length;
    const completedTests = testExecutions.filter(t => t.status === 'completed').length;
    const failedTests = testExecutions.filter(t => t.status === 'failed').length;
    const passRate = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;

    // Team performance data
    const testerPerformance = testExecutions.reduce((acc, test) => {
      if (!acc[test.testerName]) {
        acc[test.testerName] = { total: 0, passed: 0, failed: 0 };
      }
      acc[test.testerName].total++;
      if (test.status === 'completed') acc[test.testerName].passed++;
      if (test.status === 'failed') acc[test.testerName].failed++;
      return acc;
    }, {} as Record<string, { total: number; passed: number; failed: number }>);

    // Daily test activity (mock data for demo)
    const dailyActivity = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tests: Math.floor(Math.random() * 20) + 5,
      passed: Math.floor(Math.random() * 15) + 3,
      failed: Math.floor(Math.random() * 5),
    }));

    // Test coverage by category
    const categoryData = tasks.reduce((acc, task) => {
      task.tags.forEach(tag => {
        if (!acc[tag]) acc[tag] = 0;
        acc[tag]++;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTests,
      completedTests,
      failedTests,
      passRate,
      testerPerformance,
      dailyActivity,
      categoryData: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
    };
  };

  const analytics = generateAnalytics();

  const statusColors = {
    completed: '#10B981',
    failed: '#EF4444',
    'in-progress': '#3B82F6',
    pending: '#F59E0B',
  };

  const exportReport = () => {
    // Mock export functionality
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      analytics,
      testExecutions: testExecutions.slice(0, 10), // Sample data
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Report Controls */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span>QA Analytics & Reports</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="team">Team Performance</SelectItem>
                  <SelectItem value="trends">Trends</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportReport} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tests</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.totalTests}</div>
            <p className="text-xs text-gray-600 mt-1">Across all test suites</p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.passRate.toFixed(1)}%</div>
            <Progress value={analytics.passRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Failed Tests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{analytics.failedTests}</div>
            <p className="text-xs text-gray-600 mt-1">Require attention</p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Testers</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {Object.keys(analytics.testerPerformance).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Contributing to tests</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Test Activity */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Daily Test Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.dailyActivity.slice(-14)}>
                <defs>
                  <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
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

        {/* Test Coverage by Category */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>Test Coverage by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.categoryData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p>No category data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span>Team Performance Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(analytics.testerPerformance).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>No team performance data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(analytics.testerPerformance).map(([tester, stats]) => {
                const successRate = stats.total > 0 ? (stats.passed / stats.total) * 100 : 0;
                return (
                  <div key={tester} className="p-4 bg-gray-50/50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{tester}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {stats.total} tests
                        </Badge>
                        <Badge className={`text-xs ${successRate >= 80 ? 'bg-green-100 text-green-800' : successRate >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {successRate.toFixed(0)}% success
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{stats.passed} passed</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        <span>{stats.failed} failed</span>
                      </span>
                    </div>
                    <Progress value={successRate} className="mt-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Execution Timeline */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <span>Test Execution Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={analytics.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
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
                dataKey="tests" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                name="Total Tests"
              />
              <Line 
                type="monotone" 
                dataKey="passed" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                name="Passed Tests"
              />
              <Line 
                type="monotone" 
                dataKey="failed" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                name="Failed Tests"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}