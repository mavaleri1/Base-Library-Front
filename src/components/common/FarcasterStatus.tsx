import React from 'react';
import { useFarcaster } from './FarcasterProvider';

export const FarcasterStatus: React.FC = () => {
  const { isInFarcaster, user, isLoading } = useFarcaster();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        Loading Farcaster...
      </div>
    );
  }

  if (!isInFarcaster) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        Web version
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      Farcaster: {user?.displayName || user?.username || 'User'}
    </div>
  );
};
