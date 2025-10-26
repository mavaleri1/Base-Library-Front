import React, { createContext, useContext, useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface FarcasterContextType {
  isInFarcaster: boolean;
  user: any | null;
  isLoading: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
  isInFarcaster: false,
  user: null,
  isLoading: true,
});

export const useFarcaster = () => {
  const context = useContext(FarcasterContext);
  if (!context) {
    throw new Error('useFarcaster must be used within a FarcasterProvider');
  }
  return context;
};

interface FarcasterProviderProps {
  children: React.ReactNode;
}

export const FarcasterProvider: React.FC<FarcasterProviderProps> = ({ children }) => {
  const [isInFarcaster, setIsInFarcaster] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        if (sdk) {
          setIsInFarcaster(true);
          
          // Get user information if available
          // Note: getUser method may not be available in all SDK versions
          try {
            const userInfo = await (sdk.actions as any).getUser();
            setUser(userInfo);
            console.log('Farcaster user:', userInfo);
          } catch (userError) {
            console.log('Could not get user info:', userError);
            // Continue without user info
          }
        }
      } catch (error) {
        console.log('Not in Farcaster context or error:', error);
        setIsInFarcaster(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFarcaster();
  }, []);

  return (
    <FarcasterContext.Provider value={{ isInFarcaster, user, isLoading }}>
      {children}
    </FarcasterContext.Provider>
  );
};
