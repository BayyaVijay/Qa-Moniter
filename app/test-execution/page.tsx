'use client';

import React, { useState } from 'react';
import TestExecutionForm from '@/components/forms/TestExecutionForm';
import TestExecutionTable from '@/components/tables/TestExecutionTable';
import TestHistorySidebar from '@/components/TestHistorySidebar';
import { TestExecution } from '@/types/testExecution';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube2, History, Plus } from 'lucide-react';

export default function TestExecutionPage() {
  const [editingTestExecution, setEditingTestExecution] = useState<TestExecution | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('execute');

  const handleEditTestExecution = (testExecution: TestExecution) => {
    setEditingTestExecution(testExecution);
    setActiveTab('execute');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowHistory = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowHistory(true);
  };

  const handleSuccess = () => {
    setEditingTestExecution(null);
    setActiveTab('monitor');
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
    setSelectedTaskId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100/50">
          <TabsTrigger value="execute" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Execute Tests</span>
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center space-x-2">
            <TestTube2 className="h-4 w-4" />
            <span>Monitor & Results</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="execute" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube2 className="h-6 w-6 text-blue-600" />
                <span>{editingTestExecution ? 'Edit Test Execution' : 'New Test Execution'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TestExecutionForm 
                editTestExecution={editingTestExecution} 
                onSuccess={handleSuccess}
              />
              {editingTestExecution && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    You're editing an existing test execution. 
                    <button
                      onClick={() => setEditingTestExecution(null)}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      Cancel and create new
                    </button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor" className="space-y-6">
          <TestExecutionTable 
            onEditTestExecution={handleEditTestExecution}
            onShowHistory={handleShowHistory}
          />
        </TabsContent>
      </Tabs>

      <TestHistorySidebar
        isOpen={showHistory}
        onClose={handleCloseHistory}
        taskId={selectedTaskId}
      />
    </div>
  );
}