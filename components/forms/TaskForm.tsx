'use client';

import React, { useState, useEffect } from 'react';
import { useTask } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, X, FlaskConical, Tag, TestTube } from 'lucide-react';
import { Task } from '@/types/task';
import MultiSelectTags from '@/components/MultiSelectTags';

interface TaskFormProps {
  editTask?: Task | null;
  onSuccess?: () => void;
}

export default function TaskForm({ editTask, onSuccess }: TaskFormProps) {
  const { createTask, updateTask, loading } = useTask();
  
  const [formData, setFormData] = useState({
    tags: [] as string[],
    description: '',
    testCases: [''],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editTask) {
      setFormData({
        tags: editTask.tags || [],
        description: editTask.description || '',
        testCases: editTask.testCases.length > 0 ? editTask.testCases : [''],
      });
    }
  }, [editTask]);

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

  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({
      ...prev,
      tags,
    }));

    if (errors.tags) {
      setErrors(prev => ({
        ...prev,
        tags: '',
      }));
    }
  };

  const handleTestCaseChange = (index: number, value: string) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index] = value;
    setFormData(prev => ({
      ...prev,
      testCases: updatedTestCases,
    }));

    if (errors.testCases) {
      setErrors(prev => ({
        ...prev,
        testCases: '',
      }));
    }
  };

  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, ''],
    }));
  };

  const removeTestCase = (index: number) => {
    if (formData.testCases.length > 1) {
      const updatedTestCases = formData.testCases.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        testCases: updatedTestCases,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.tags || formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    const validTestCases = formData.testCases.filter(tc => tc.trim() !== '');
    if (validTestCases.length === 0) {
      newErrors.testCases = 'At least one test case is required';
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
      const taskData = {
        ...formData,
        testCases: formData.testCases.filter(tc => tc.trim() !== ''),
      };

      if (editTask && editTask._id) {
        await updateTask(editTask._id, taskData);
      } else {
        await createTask(taskData);
      }

      if (!editTask) {
        setFormData({
          tags: [],
          description: '',
          testCases: [''],
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving unit test case:', error);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tags Section */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="h-5 w-5 text-blue-600" />
              <Label className="text-lg font-semibold">Test Categories</Label>
            </div>
            <MultiSelectTags
              selectedTags={formData.tags}
              onTagsChange={handleTagsChange}
              placeholder="Select or create test categories..."
              error={errors.tags}
            />
            <p className="text-sm text-gray-600 mt-2">
              Categorize your unit test to help with organization and filtering
            </p>
          </CardContent>
        </Card>

        {/* Description Section */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FlaskConical className="h-5 w-5 text-green-600" />
              <Label className="text-lg font-semibold">Unit Test Description</Label>
            </div>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what this unit test should validate, including expected behavior and acceptance criteria..."
              rows={4}
              className={`${errors.description ? 'border-red-500' : ''} resize-none`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-2 flex items-center space-x-1">
                <X className="h-3 w-3" />
                <span>{errors.description}</span>
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Provide clear, detailed description of what needs to be tested
            </p>
          </CardContent>
        </Card>

        {/* Test Cases Section */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TestTube className="h-5 w-5 text-purple-600" />
                <Label className="text-lg font-semibold">Test Cases</Label>
                <Badge variant="outline" className="ml-2">
                  {formData.testCases.filter(tc => tc.trim()).length} cases
                </Badge>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTestCase}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Case</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.testCases.map((testCase, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 mt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Input
                      value={testCase}
                      onChange={(e) => handleTestCaseChange(index, e.target.value)}
                      placeholder={`Test case ${index + 1}: Describe the specific test step or scenario`}
                      className="w-full"
                    />
                  </div>
                  {formData.testCases.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTestCase(index)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {errors.testCases && (
              <p className="text-sm text-red-500 mt-3 flex items-center space-x-1">
                <X className="h-3 w-3" />
                <span>{errors.testCases}</span>
              </p>
            )}
            <p className="text-sm text-gray-600 mt-3">
              Define specific test scenarios that need to be validated
            </p>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-gray-500">
            {editTask ? 'Update existing unit test case' : 'Create new unit test case'}
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
            ) : editTask ? (
              'Update Unit Test Case'
            ) : (
              'Create Unit Test Case'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}