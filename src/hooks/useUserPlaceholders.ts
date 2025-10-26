import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { UserPlaceholderSettings } from '../types';

export const useUserPlaceholders = (userId: string | null) => {
  const [placeholders, setPlaceholders] = useState<UserPlaceholderSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaceholders = async () => {
    if (!userId) {
      setPlaceholders(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getUserPlaceholders(userId);
      setPlaceholders(data);
    } catch (err: any) {
      console.error('Error fetching user placeholders:', err);
      setError(err.message || 'Failed to fetch user settings');
      setPlaceholders(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaceholders();
  }, [userId]);

  return {
    placeholders,
    isLoading,
    error,
    refetch: fetchPlaceholders,
  };
};
