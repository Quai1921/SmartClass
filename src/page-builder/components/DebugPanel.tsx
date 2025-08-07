import React, { useState, useEffect } from 'react';
import { Bug, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { StorageAdapter } from '../../config/adapters/storage-adapter';
import { useInstitutionStatus } from '../../ui/hooks/useInstitutionStatus';
import { checkInstitutionShouldBeActive, performDetailedInstitutionDiagnostic } from '../../ui/utils/institutionStatusUtils';
import { verifyInstitutionStatusConsistency, forceRefreshUserStatus } from '../../actions/user/force-refresh-user-status';
import { useAuthStore } from '../../ui/store/auth/useAuthStore';

interface DebugPanelProps {
  courses: any[];
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ courses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [tokenInfo, setTokenInfo] = useState<any>({});
  const [institutionStatus, setInstitutionStatus] = useState<any>({});
  
  const { role } = useAuthStore();
  const { userData, isInstitutionInactive } = useInstitutionStatus();

  useEffect(() => {
    const updateTokenInfo = () => {
      const token = StorageAdapter.getItem('token');
      const refreshToken = StorageAdapter.getItem('refreshToken');
      
      setTokenInfo({
        token: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
        tokenLength: token ? token.length : 0,
        refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'NO REFRESH TOKEN',
        timestamp: new Date().toISOString()
      });
    };

    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Track course status changes
    const logMessage = `Course Status Update: ${new Date().toISOString()} - ${courses.length} courses loaded`;
    setDebugLogs(prev => [...prev.slice(-19), logMessage]); // Keep last 20 logs
  }, [courses]);

  // Enhanced institution status check
  useEffect(() => {
    const checkStatus = async () => {
      if (role === 'INSTITUTION_ADMIN' && userData) {
        try {
          const statusCheck = await checkInstitutionShouldBeActive();
          setInstitutionStatus({
            backendStatus: userData.status,
            hasAssignedCourses: statusCheck.hasAssignedCourses,
            shouldBeActive: statusCheck.shouldBeActive,
            reason: statusCheck.reason,
            isInactive: isInstitutionInactive,
            hasMismatch: statusCheck.hasAssignedCourses && userData.status === 'PENDING',
            institutionName: userData.institutionName,
            coursesCount: courses.length,
            lastCheck: new Date().toISOString()
          });
          
          // Log to debug logs
          const statusLog = `Institution Status: ${userData.status} | Courses: ${courses.length} | Should be active: ${statusCheck.shouldBeActive}`;
          setDebugLogs(prev => [...prev.slice(-19), statusLog]);
          
        } catch (error) {
          // console.error('Debug panel status check error:', error);
        }
      }
    };

    checkStatus();
  }, [role, userData, courses.length, isInstitutionInactive]);

  // Add diagnostic function
  const runComprehensiveDiagnostic = async () => {
    try {
      
      // Run the detailed diagnostic
      const diagnostic = await performDetailedInstitutionDiagnostic();
      
      // Also run consistency check
      const consistencyCheck = await verifyInstitutionStatusConsistency();
      
      // Update debug logs with comprehensive info
      const diagnosticLog = `DIAGNOSTIC: ${diagnostic.analysis.join(' | ')}`;
      const consistencyLog = `CONSISTENCY: ${consistencyCheck.analysis}`;
      setDebugLogs(prev => [...prev.slice(-15), '=== DIAGNOSTIC RUN ===', diagnosticLog, consistencyLog, ...diagnostic.analysis.slice(0, 2)]);
      
      // Show result
      const hasIssues = diagnostic.analysis.some(a => a.includes('🚨')) || !consistencyCheck.isConsistent;
      let message = '';
      
      if (hasIssues) {
        message = '🚨 ISSUES FOUND:\n';
        message += diagnostic.analysis.filter(a => a.includes('🚨')).join('\n');
        if (!consistencyCheck.isConsistent) {
          message += '\n🚨 ' + consistencyCheck.analysis;
        }
      } else {
        message = '✅ DIAGNOSTIC COMPLETE:\n';
        message += diagnostic.analysis.filter(a => a.includes('✅')).join('\n');
        message += '\n✅ ' + consistencyCheck.analysis;
      }
      
      alert(message);
      
    } catch (error) {
      // console.error('❌ Diagnostic error:', error);
      alert('❌ Diagnostic failed: ' + error);
    }
  };

  // Add force refresh function
  const forceRefreshStatus = async () => {
    try {
      
      const result = await forceRefreshUserStatus();
      
      if (result.success) {
        // Update debug logs
        const refreshLog = `FORCE REFRESH: Status=${result.userData?.status} at ${new Date().toISOString()}`;
        setDebugLogs(prev => [...prev.slice(-19), refreshLog]);
        
        alert(`✅ Status refreshed successfully!\nCurrent status: ${result.userData?.status}`);
        
        // Trigger a re-render by updating the component state
        window.location.reload();
      } else {
        alert('❌ Failed to refresh status: ' + result.error);
      }
      
    } catch (error) {
      // console.error('❌ Force refresh error:', error);
      alert('❌ Force refresh failed: ' + error);
    }
  };

  if (!isOpen) {
    const hasMismatch = institutionStatus.hasMismatch;
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 ${hasMismatch ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white p-2 rounded-full shadow-lg z-50 ${hasMismatch ? 'animate-pulse' : ''}`}
        title={hasMismatch ? "Debug Panel - Status Mismatch Detected!" : "Open Debug Panel"}
      >
        {hasMismatch ? <AlertTriangle size={20} /> : <Bug size={20} />}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-96 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <Bug size={20} className="mr-2" />
          Debug Panel
          {institutionStatus.hasMismatch && (
            <AlertTriangle size={16} className="ml-2 text-red-400" />
          )}
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Institution Status Section */}
        {role === 'INSTITUTION_ADMIN' && (
          <div>
            <h4 className="font-semibold text-purple-400 flex items-center">
              Institution Status
              {institutionStatus.hasMismatch ? (
                <AlertTriangle size={16} className="ml-2 text-red-400" />
              ) : (
                <CheckCircle size={16} className="ml-2 text-green-400" />
              )}
            </h4>
            <div className="text-xs bg-gray-700 p-2 rounded">
              <div className={`font-bold ${institutionStatus.hasMismatch ? 'text-red-400' : 'text-green-400'}`}>
                Backend Status: {institutionStatus.backendStatus || 'Loading...'}
              </div>
              <div>Institution: {institutionStatus.institutionName || 'N/A'}</div>
              <div>Assigned Courses: {institutionStatus.coursesCount || 0}</div>
              <div>Has Courses: {institutionStatus.hasAssignedCourses ? '✅' : '❌'}</div>
              <div>Should Be Active: {institutionStatus.shouldBeActive ? '✅' : '❌'}</div>
              <div>Is Inactive (Frontend): {institutionStatus.isInactive ? '❌' : '✅'}</div>
              {institutionStatus.hasMismatch && (
                <div className="text-red-400 font-bold mt-2">
                  ⚠️ MISMATCH: Has courses but status is PENDING!
                </div>
              )}
              <div className="text-gray-400 mt-1">
                Reason: {institutionStatus.reason}
              </div>
              <div className="text-gray-400">
                Last Check: {institutionStatus.lastCheck?.substring(11, 19)}
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-blue-400">Token Info:</h4>
          <div className="text-xs bg-gray-700 p-2 rounded">
            <div>Token: {tokenInfo.token}</div>
            <div>Length: {tokenInfo.tokenLength}</div>
            <div>Refresh: {tokenInfo.refreshToken}</div>
            <div>Updated: {tokenInfo.timestamp?.substring(11, 19)}</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-green-400">Course Status:</h4>
          <div className="text-xs bg-gray-700 p-2 rounded max-h-32 overflow-y-auto">
            {courses.length === 0 ? (
              <div className="text-gray-400">No courses loaded</div>
            ) : (
              courses.map(course => (
                <div key={course.id} className="mb-1">
                  {course.title}: {course.published ? '✅ Published' : '❌ Draft'}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-yellow-400">Recent Logs:</h4>
          <div className="text-xs bg-gray-700 p-2 rounded max-h-32 overflow-y-auto">
            {debugLogs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
        </div>

        {/* Diagnostic Buttons */}
        <div className="space-y-2">
          <button
            onClick={runComprehensiveDiagnostic}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm font-medium"
          >
            🔍 Run Diagnostic
          </button>
          <button
            onClick={forceRefreshStatus}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium"
          >
            🔄 Force Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};
