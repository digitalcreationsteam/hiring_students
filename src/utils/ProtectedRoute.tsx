// src/utils/ProtectedRoute.tsx - COMPLETE UPDATED VERSION
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { isAuthenticated } from './authUtils';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requireIncomplete?: boolean; // ADD THIS PROP
}

// Process steps that should be blocked after completion
const PROCESS_STEPS = [
  '/complete-profile',
  '/upload-resume',
  '/demographics',
  '/education',
  '/experience',
  '/certifications',
  '/awards',
  '/projects',
  '/skill-index-intro',
  '/job-domain',
  '/skills',
  '/assessment-intro',
  '/assessment',
  '/assessment-results'
];

// Helper functions inside same file
const isProcessComplete = (): boolean => {
  return localStorage.getItem('process_completed') === 'true';
};

const markProcessComplete = (): void => {
  localStorage.setItem('process_completed', 'true');
  console.log('✅ Process marked as complete');
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireIncomplete = false 
}) => {
  const { isAuthenticated: isAuthRedux } = useSelector((state: RootState) => state.auth);
  const isAuthLocal = isAuthenticated();
  const location = useLocation();

  // 1. Check authentication
  if (!isAuthRedux && !isAuthLocal) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. NEW: Check if process is already complete
  if (requireIncomplete && isProcessComplete()) {
    console.log('🚫 Blocked access - process already complete');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Export the mark function for use in AssessmentResult
export { markProcessComplete };
export default ProtectedRoute;