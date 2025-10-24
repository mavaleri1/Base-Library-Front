import React, { useState, useEffect } from 'react';
import { ipfsService } from '../../services/ipfs';
import { validatePinataConfig } from '../../config/contracts';

interface PinataStatusProps {
  className?: string;
}

export const PinataStatus: React.FC<PinataStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkPinataConnection();
  }, []);

  const checkPinataConnection = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check config
      if (!validatePinataConfig()) {
        setIsConnected(false);
        setError('Pinata API keys are not configured');
        return;
      }

      // Check connection, trying to get the list of files
      await ipfsService.getPinnedFiles();
      setIsConnected(true);
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Connection error to Pinata');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      );
    }

    if (isConnected) {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-600 text-sm font-medium">Connected</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-red-600 text-sm font-medium">Error</span>
      </div>
    );
  };

  const getStatusText = () => {
    if (isLoading) return 'Checking connection...';
    if (isConnected) return 'Pinata IPFS is available';
    if (error) return error;
    return 'Pinata is not available';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-muted-foreground">IPFS:</span>
      {getStatusIcon()}
      <span className="text-xs text-muted-foreground">{getStatusText()}</span>
      {!isConnected && !isLoading && (
        <button
          onClick={checkPinataConnection}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Repeat
        </button>
      )}
    </div>
  );
};
