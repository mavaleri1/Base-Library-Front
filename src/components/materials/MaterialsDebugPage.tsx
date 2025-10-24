import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../ui';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export const MaterialsDebugPage: React.FC = () => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testAllMaterials = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Testing getAllMaterials...');
      const response = await api.getAllMaterials({ page: 1, page_size: 20 });
      setDebugInfo({
        endpoint: 'GET /api/materials/all',
        response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error testing getAllMaterials:', error);
      setDebugInfo({
        endpoint: 'GET /api/materials/all',
        error: error,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testMyMaterials = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Testing getMyMaterials...');
      const response = await api.getMyMaterials({ page: 1, page_size: 20 });
      setDebugInfo({
        endpoint: 'GET /api/materials/my',
        response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error testing getMyMaterials:', error);
      setDebugInfo({
        endpoint: 'GET /api/materials/my',
        error: error,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testCurrentUser = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Testing getCurrentUser...');
      const response = await api.getCurrentUser();
      setDebugInfo({
        endpoint: 'GET /api/auth/me',
        response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error testing getCurrentUser:', error);
      setDebugInfo({
        endpoint: 'GET /api/auth/me',
        error: error,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSubjectStats = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Testing getSubjectStats...');
      const response = await api.getSubjectStats();
      setDebugInfo({
        endpoint: 'GET /api/materials/stats/subjects',
        response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error testing getSubjectStats:', error);
      setDebugInfo({
        endpoint: 'GET /api/materials/stats/subjects',
        error: error,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink mb-2">
          Materials API Debug
        </h1>
        <p className="text-muted">
          Testing endpoints for working with materials
        </p>
      </div>



      {/* User Info */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-muted p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Test Buttons */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>API Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={testCurrentUser}
              disabled={isLoading}
            >
              Test /auth/me
            </Button>
            <Button
              variant="outline"
              onClick={testAllMaterials}
              disabled={isLoading}
            >
              Test /materials/all
            </Button>
            <Button
              variant="outline"
              onClick={testMyMaterials}
              disabled={isLoading}
            >
              Test /materials/my
            </Button>
            <Button
              variant="outline"
              onClick={testSubjectStats}
              disabled={isLoading}
            >
              Test /materials/stats/subjects
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debug Results */}
      {debugInfo && (
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p><strong>Endpoint:</strong> {debugInfo.endpoint}</p>
              <p><strong>Time:</strong> {debugInfo.timestamp}</p>
            </div>
            <pre className="text-sm bg-muted p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(debugInfo.response || debugInfo.error, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
