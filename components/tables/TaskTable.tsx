'use client';

import React, { useEffect, useState } from 'react';
import { useTask } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Search, Filter, Calendar, FlaskConical } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskTableProps {
  onEditTask: (task: Task) => void;
}

export default function TaskTable({ onEditTask }: TaskTableProps) {
  const { tasks, loading, error, getTasks, deleteTask } = useTask();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = tasks.filter(task =>
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    try {
      setDeleteLoading(id);
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting unit test case:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTaskSummary = (description: string) => {
    return description.length > 80 
      ? description.substring(0, 80) + '...' 
      : description;
  };

  if (loading && tasks.length === 0) {
    return (
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FlaskConical className="h-6 w-6 text-blue-600" />
            <span>Unit Test Cases</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="spinner w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Unit Test Cases</h3>
            <p className="text-gray-500">Please wait while we fetch your data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FlaskConical className="h-6 w-6 text-red-600" />
            <span>Unit Test Cases</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
              <FlaskConical className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-red-800 font-semibold mb-2 text-lg">Error Loading Data</h3>
              <p className="text-red-600 text-sm mb-6">{error}</p>
              <Button 
                onClick={() => getTasks()} 
                variant="outline" 
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FlaskConical className="h-6 w-6 text-blue-600" />
            <span>Unit Test Cases Management</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search unit tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredTasks.length} unit tests
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-12 max-w-lg text-center">
              <FlaskConical className="h-16 w-16 text-blue-400 mx-auto mb-6" />
              <h3 className="text-blue-800 font-bold text-xl mb-3">
                {searchTerm ? 'No Matching Unit Tests' : 'No Unit Test Cases Found'}
              </h3>
              <p className="text-blue-600 mb-6 leading-relaxed">
                {searchTerm 
                  ? 'No unit tests match your search criteria. Try adjusting your search terms.'
                  : 'Create your first unit test case to get started with quality assurance testing!'
                }
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                  <TableHead className="font-bold text-gray-800 py-4 w-20">ID</TableHead>
                  <TableHead className="font-bold text-gray-800">Unit Test Description</TableHead>
                  <TableHead className="font-bold text-gray-800">Categories</TableHead>
                  <TableHead className="font-bold text-gray-800 text-center">Test Cases</TableHead>
                  <TableHead className="font-bold text-gray-800">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Created</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-bold text-gray-800">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task, index) => (
                  <TableRow key={task._id} className="hover:bg-blue-50/50 transition-colors border-b border-gray-100">
                    <TableCell className="font-medium py-4">
                      <Badge variant="outline" className="font-mono text-xs">
                        {(index + 1).toString().padStart(3, '0')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="font-medium text-gray-900 mb-1">{getTaskSummary(task.description)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {task.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="text-xs bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            +{task.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-bold ${
                          task.testCases.length > 5 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : task.testCases.length > 2 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {task.testCases.length}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {task.createdAt && formatDate(task.createdAt.toString())}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditTask(task)}
                          className="h-8 w-8 p-0 border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-red-200 text-red-700 hover:bg-red-50"
                              disabled={deleteLoading === task._id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Unit Test Case</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this unit test case? This action cannot be undone and will remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => task._id && handleDelete(task._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {deleteLoading === task._id ? 'Deleting...' : 'Delete Unit Test'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}