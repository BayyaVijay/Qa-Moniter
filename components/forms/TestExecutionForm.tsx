'use client';

import React, { useState, useEffect } from 'react';
import { useTestExecution } from '@/context/TestExecutionContext';
import { useTask } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TestExecution, TestCase } from '@/types/testExecution';
import { Task } from '@/types/task';
import ImageUpload from '@/components/ImageUpload';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Hash, 
  User, 
  FileText, 
  TestTube2,
  Target,
  Upload,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface TestExecutionFormProps {
  editTestExecution?: TestExecution | null;
  onSuccess?: () => void;
}

export default function TestExecutionForm({ editTestExecution, onSuccess }: TestExecutionFormProps) {
  const { createTestExecution, updateTestExecution, loading, uploadImages } = useTestExecution();
  const { tasks, getTasks } = useTask();
  
  const [formData, setFormData] = useState({
    taskId: '',
    testId: '',
    testCases: [] as TestCase[],
    status: 'pending' as 'pending' | 'in-progress' | 'completed' | 'failed',
    feedback: '',
    attachedImages: [] as string[],
    testerName: '',
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [executionTimer, setExecutionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setExecutionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const generateTestId = () => {
    const prefix = 'TEST';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  useEffect(() => {
    if (editTestExecution) {
      setFormData({
        taskId: editTestExecution.taskId?._id || '',
        testId: editTestExecution.testId,
        testCases: editTestExecution.testCases,
        status: editTestExecution.status,
        feedback: editTestExecution.feedback,
        attachedImages: editTestExecution.attachedImages || [],
        testerName: editTestExecution.testerName,
      });
      
      const task = tasks.find((t:any) => t._id === editTestExecution.taskId);
      if (task) {
        setSelectedTask(task);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        testId: generateTestId(),
      }));
    }
  }, [editTestExecution, tasks]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (task) {
      setSelectedTask(task);
      setFormData(prev => ({
        ...prev,
        taskId,
        testCases: task.testCases.map(tc => ({
          testCase: tc,
          passed: false,
          notes: '',
        })),
        testId: editTestExecution ? prev.testId : generateTestId(),
      }));
    }
  };

  const handleTestCaseChange = (index: number, field: 'passed' | 'notes', value: boolean | string) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index] = {
      ...updatedTestCases[index],
      [field]: value,
    };
    setFormData(prev => ({
      ...prev,
      testCases: updatedTestCases,
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      attachedImages: images,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.taskId) {
      newErrors.taskId = 'Task selection is required';
    }

    if (!formData.testId.trim()) {
      newErrors.testId = 'Test ID is required';
    }

    if (!formData.testerName.trim()) {
      newErrors.testerName = 'Tester name is required';
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const testExecutionData = {
        ...formData,
        testId: formData.testId.trim(),
        testerName: formData.testerName.trim(),
        feedback: formData.feedback.trim(),
      };

      if (editTestExecution && editTestExecution._id) {
        await updateTestExecution(editTestExecution._id, testExecutionData);
      } else {
        await createTestExecution(testExecutionData);
      }

      if (!editTestExecution) {
        setFormData({
          taskId: '',
          testId: generateTestId(),
          testCases: [],
          status: 'pending',
          feedback: '',
          attachedImages: [],
          testerName: '',
        });
        setSelectedTask(null);
        setExecutionTimer(0);
        setIsTimerRunning(false);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving test execution:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-pending';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
    if (!isTimerRunning && formData.status === 'pending') {
      setFormData(prev => ({ ...prev, status: 'in-progress' }));
    }
  };

  const resetTimer = () => {
    setExecutionTimer(0);
    setIsTimerRunning(false);
  };

  const passedCount = formData.testCases.filter(tc => tc.passed).length;
  const totalCount = formData.testCases.length;
  const passRate = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Test Execution Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <TestTube2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editTestExecution ? 'Edit Test Execution' : 'New Test Execution'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Execute and document test results with detailed feedback
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatTime(executionTimer)}</div>
                  <div className="text-xs text-gray-500">Execution Time</div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleTimer}
                    className="flex items-center space-x-1"
                  >
                    {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-5 w-5 text-green-600" />
                <Label className="text-lg font-semibold">Select Test Task</Label>
              </div>
              <Select
                value={formData.taskId}
                onValueChange={handleTaskSelect}
                disabled={!!editTestExecution}
              >
                <SelectTrigger className={`h-12 ${errors.taskId ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Choose a task to test" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((task) => (
                    <SelectItem key={task._id} value={task._id!}>
                      <div className="flex flex-col py-1">
                        <span className="font-medium text-gray-900">
                          {task.description.substring(0, 60)}...
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {task.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{task.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.taskId && (
                <p className="text-sm text-red-500 mt-2">{errors.taskId}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Hash className="h-5 w-5 text-purple-600" />
                <Label className="text-lg font-semibold">Test Execution ID</Label>
              </div>
              <Input
                name="testId"
                value={formData.testId}
                onChange={handleInputChange}
                placeholder="Auto-generated test ID"
                className={`h-12 font-mono ${errors.testId ? 'border-red-500' : ''}`}
                readOnly
              />
              {errors.testId && (
                <p className="text-sm text-red-500 mt-2">{errors.testId}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tester Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-orange-600" />
                <Label className="text-lg font-semibold">Tester Information</Label>
              </div>
              <Input
                name="testerName"
                value={formData.testerName}
                onChange={handleInputChange}
                placeholder="Enter tester name"
                className={`h-12 ${errors.testerName ? 'border-red-500' : ''}`}
              />
              {errors.testerName && (
                <p className="text-sm text-red-500 mt-2">{errors.testerName}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                {getStatusIcon(formData.status)}
                <Label className="text-lg font-semibold">Execution Status</Label>
              </div>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                      <span>Pending</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>In Progress</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Completed</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="failed">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Failed</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Test Cases Execution */}
        {selectedTask && formData.testCases.length > 0 && (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                  <span>Test Cases Execution</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-sm">
                    {passedCount}/{totalCount} Passed
                  </Badge>
                  <Badge className={`text-sm ${passRate >= 80 ? 'bg-green-100 text-green-800' : passRate >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {passRate.toFixed(0)}% Pass Rate
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {formData.testCases.map((testCase, index) => (
                  <div key={index} className="p-4 bg-gray-50/50 border rounded-xl hover:bg-gray-100/50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                          {index + 1}
                        </div>
                        <Checkbox
                          checked={testCase.passed}
                          onCheckedChange={(checked) => 
                            handleTestCaseChange(index, 'passed', checked as boolean)
                          }
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${testCase.passed ? 'text-green-700' : 'text-gray-700'}`}>
                            {testCase.testCase}
                          </p>
                          <Badge className={`status-indicator ${testCase.passed ? 'status-completed' : 'status-pending'}`}>
                            {testCase.passed ? 'Passed' : 'Pending'}
                          </Badge>
                        </div>
                        <Input
                          placeholder="Add notes for this test case..."
                          value={testCase.notes || ''}
                          onChange={(e) => 
                            handleTestCaseChange(index, 'notes', e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback Section */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-yellow-600" />
              <Label className="text-lg font-semibold">Test Execution Feedback</Label>
            </div>
            <Textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              placeholder="Provide detailed feedback about the test execution, including any issues found, observations, or recommendations..."
              rows={6}
              className={`${errors.feedback ? 'border-red-500' : ''} resize-none`}
            />
            {errors.feedback && (
              <p className="text-sm text-red-500 mt-2">{errors.feedback}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Include detailed observations, issues found, and recommendations
            </p>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="border-l-4 border-l-pink-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Upload className="h-5 w-5 text-pink-600" />
              <Label className="text-lg font-semibold">Evidence & Screenshots</Label>
              <Badge variant="secondary" className="text-xs">Optional</Badge>
              {formData.attachedImages.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {formData.attachedImages.length} files
                </Badge>
              )}
            </div>
            <ImageUpload
              images={formData.attachedImages}
              onImagesChange={handleImagesChange}
              onUpload={uploadImages}
            />
            <p className="text-sm text-gray-600 mt-2">
              Upload screenshots, error logs, or other evidence from test execution
            </p>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-gray-500">
            {editTestExecution ? 'Update existing test execution' : 'Create new test execution'}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <div className="spinner mr-2" />
                Saving...
              </>
            ) : editTestExecution ? (
              'Update Test Execution'
            ) : (
              'Save Test Execution'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}