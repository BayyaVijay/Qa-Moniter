'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import axios from 'axios';
import { TestExecution, CreateTestExecutionRequest, TestExecutionContextType } from '@/types/testExecution';

interface TestExecutionState {
  testExecutions: TestExecution[];
  loading: boolean;
  error: string | null;
}

type TestExecutionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TEST_EXECUTIONS'; payload: TestExecution[] }
  | { type: 'ADD_TEST_EXECUTION'; payload: TestExecution }
  | { type: 'UPDATE_TEST_EXECUTION'; payload: TestExecution }
  | { type: 'DELETE_TEST_EXECUTION'; payload: string };

const initialState: TestExecutionState = {
  testExecutions: [],
  loading: false,
  error: null,
};

function testExecutionReducer(state: TestExecutionState, action: TestExecutionAction): TestExecutionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TEST_EXECUTIONS':
      return { ...state, testExecutions: action.payload, loading: false, error: null };
    case 'ADD_TEST_EXECUTION':
      return { 
        ...state, 
        testExecutions: [action.payload, ...state.testExecutions], 
        loading: false, 
        error: null 
      };
    case 'UPDATE_TEST_EXECUTION':
      return {
        ...state,
        testExecutions: state.testExecutions.map(testExecution => 
          testExecution._id === action.payload._id ? action.payload : testExecution
        ),
        loading: false,
        error: null,
      };
    case 'DELETE_TEST_EXECUTION':
      return {
        ...state,
        testExecutions: state.testExecutions.filter(testExecution => testExecution._id !== action.payload),
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}

const TestExecutionContext = createContext<TestExecutionContextType | undefined>(undefined);

export function TestExecutionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(testExecutionReducer, initialState);

  const createTestExecution = async (testExecutionData: CreateTestExecutionRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await axios.post('/api/test-executions', testExecutionData);
      
      if (response.data.success) {
        dispatch({ type: 'ADD_TEST_EXECUTION', payload: response.data.data });
      } else {
        throw new Error(response.data.error || 'Failed to create UT execution');
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.error || error.message 
        : 'An unexpected error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const getTestExecutions = async (filters?: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const params = new URLSearchParams();
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] && filters[key] !== 'all') {
            params.append(key, filters[key]);
          }
        });
      }

      const response = await axios.get(`/api/test-executions?${encodeURIComponent(params.toString())}`);
      if (response.data.success) { 
        dispatch({ type: 'SET_TEST_EXECUTIONS', payload: response.data.data });
      } else {
        throw new Error(response.data.error || 'Failed to fetch UT executions');
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.error || error.message 
        : 'An unexpected error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateTestExecution = async (id: string, testExecutionData: CreateTestExecutionRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await axios.put(`/api/test-executions/${id}`, testExecutionData);
      
      if (response.data.success) {
        dispatch({ type: 'UPDATE_TEST_EXECUTION', payload: response.data.data });
      } else {
        throw new Error(response.data.error || 'Failed to update UT execution');
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.error || error.message 
        : 'An unexpected error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const deleteTestExecution = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await axios.delete(`/api/test-executions/${id}`);
      
      if (response.data.success) {
        dispatch({ type: 'DELETE_TEST_EXECUTION', payload: id });
      } else {
        throw new Error(response.data.error || 'Failed to delete UT execution');
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.error || error.message 
        : 'An unexpected error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const getTestExecutionById = async (id: string): Promise<TestExecution | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await axios.get(`/api/test-executions/${id}`);
      
      if (response.data.success) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch UT execution');
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.error || error.message 
        : 'An unexpected error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    }
  };

  const getTestExecutionsByTaskId = async (taskId: string): Promise<TestExecution[]> => {
    try {
      const response = await axios.get(`/api/test-executions/by-task/${taskId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch UT executions');
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.error || error.message 
        : 'An unexpected error occurred';
      throw new Error(errorMessage);
    }
  };

  const contextValue: TestExecutionContextType = {
    testExecutions: state.testExecutions,
    loading: state.loading,
    error: state.error,
    createTestExecution,
    getTestExecutions,
    updateTestExecution,
    deleteTestExecution,
    getTestExecutionById,
    getTestExecutionsByTaskId,
  };

  return (
    <TestExecutionContext.Provider value={contextValue}>
      {children}
    </TestExecutionContext.Provider>
  );
}

export function useTestExecution() {
  const context = useContext(TestExecutionContext);
  if (context === undefined) {
    throw new Error('useTestExecution must be used within a TestExecutionProvider');
  }
  return context;
}