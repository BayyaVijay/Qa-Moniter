'use client';

import React, { useState } from 'react';
import TestExecutionForm from '@/components/forms/TestExecutionForm';
import TestExecutionTable from '@/components/tables/TestExecutionTable';
import TestHistorySidebar from '@/components/TestHistorySidebar';
import { TestExecution } from '@/types/testExecution';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, History, Plus } from 'lucide-react';

export default function TestExecutionPage() {
  const [editingTestExecution, setEditingTestExecution] = useState<TestExecution | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('monitor');
  const [showForm, setShowForm] = useState(false);

  const handleEditTestExecution = (testExecution: TestExecution) => {
    setEditingTestExecution(testExecution);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowHistory = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowHistory(true);
  };

  const handleSuccess = () => {
    setEditingTestExecution(null);
    setShowForm(false);
    setActiveTab('monitor');
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
    setSelectedTaskId(null);
  };

  const handleAddNewExecution = () => {
    setEditingTestExecution(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100/50">
          <TabsTrigger value="monitor" className="flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span>UT Executions Monitor</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>Execution History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="space-y-6">
          <TestExecutionTable 
            onEditTestExecution={handleEditTestExecution}
            onShowHistory={handleShowHistory}
          />
          
          <div className="flex justify-center">
            <button
              onClick={handleAddNewExecution}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
            >
              <Plus className="h-5 w-5" />
              <span>Add New UT Execution</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-6 w-6 text-purple-600" />
                <span>Execution History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TestExecutionTable 
                onEditTestExecution={handleEditTestExecution}
                onShowHistory={handleShowHistory}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Modal/Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTestExecution ? 'Edit UT Execution' : 'New UT Execution'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <TestExecutionForm 
                editTestExecution={editingTestExecution} 
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </div>
      )}

      <TestHistorySidebar
        isOpen={showHistory}
        onClose={handleCloseHistory}
        taskId={selectedTaskId}
      />
    </div>
  );
}