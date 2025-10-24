import React, { useState, useEffect } from 'react';
import { ipfsService } from '../../services/ipfs';
import { validatePinataConfig } from '../../config/contracts';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PinnedFile {
  id: string;
  ipfs_pin_hash: string;
  size: number;
  date_pinned: string;
  metadata: {
    name: string;
    keyvalues?: {
      type?: string;
      uploadedAt?: string;
    };
  };
}

export const PinataManager: React.FC = () => {
  const [pinnedFiles, setPinnedFiles] = useState<PinnedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigValid, setIsConfigValid] = useState(false);

  useEffect(() => {
    setIsConfigValid(validatePinataConfig());
    if (validatePinataConfig()) {
      loadPinnedFiles();
    }
  }, []);

  const loadPinnedFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const files = await ipfsService.getPinnedFiles();
      setPinnedFiles(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpinFile = async (cid: string) => {
    if (!confirm('Are you sure you want to delete this file from Pinata?')) {
      return;
    }

    try {
      await ipfsService.unpinFile(cid);
      setPinnedFiles(prev => prev.filter(file => file.ipfs_pin_hash !== cid));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting file');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileTypeIcon = (type?: string): string => {
    switch (type) {
      case 'educational-material-file':
        return '📄';
      case 'educational-material-json':
        return '📋';
      case 'educational-material-text':
        return '📝';
      default:
        return '📁';
    }
  };

  if (!isConfigValid) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Pinata not configured
          </h3>
          <p className="text-muted-foreground mb-4">
            API keys need to be configured to work with Pinata
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <h4 className="font-medium text-yellow-800 mb-2">Setup instructions:</h4>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Register at <a href="https://pinata.cloud" target="_blank" rel="noopener noreferrer" className="underline">pinata.cloud</a></li>
              <li>2. Create an API key in the "API Keys" section</li>
              <li>3. Add environment variables:</li>
              <li className="ml-4">VITE_PINATA_API_KEY=your_api_key</li>
              <li className="ml-4">VITE_PINATA_SECRET_KEY=your_secret_key</li>
            </ol>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-foreground">
            Pinata file management
          </h3>
          <p className="text-sm text-muted-foreground">
            View and manage files pinned to IPFS
          </p>
        </div>
        <Button
          onClick={loadPinnedFiles}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {pinnedFiles.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground text-4xl mb-4">📁</div>
          <h4 className="text-lg font-medium text-foreground mb-2">
            No files found
          </h4>
          <p className="text-muted-foreground">
            No pinned files in Pinata yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pinnedFiles.map((file) => (
            <div
              key={file.id}
              className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">
                    {getFileTypeIcon(file.metadata.keyvalues?.type)}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">
                      {file.metadata.name}
                    </h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {file.ipfs_pin_hash}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>Size: {formatFileSize(file.size)}</span>
                      <span>Date: {formatDate(file.date_pinned)}</span>
                      {file.metadata.keyvalues?.type && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {file.metadata.keyvalues.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${file.ipfs_pin_hash}`, '_blank')}
                  >
                    Open
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUnpinFile(file.ipfs_pin_hash)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Total files: {pinnedFiles.length}</span>
          <span>
            Total size: {formatFileSize(pinnedFiles.reduce((sum, file) => sum + file.size, 0))}
          </span>
        </div>
      </div>
    </Card>
  );
};
