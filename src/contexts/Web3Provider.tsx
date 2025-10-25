import React, { ReactNode, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { wagmiConfig } from '../config/wagmi';
import { base } from 'wagmi/chains';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  useEffect(() => {
    // Handle Web3 provider conflicts
    const handleProviderError = (error: Error) => {
      console.warn('Web3 provider error:', error);
    };

    // Add error boundary for Web3
    window.addEventListener('error', handleProviderError);
    window.addEventListener('unhandledrejection', handleProviderError);

    return () => {
      window.removeEventListener('error', handleProviderError);
      window.removeEventListener('unhandledrejection', handleProviderError);
    };
  }, []);

  try {
    return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
            chain={base}
            config={{
              appearance: {
                mode: 'light',
                theme: 'default',
              },
            }}
          >
            {children}
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
  } catch (error) {
    console.error('Web3Provider error:', error);
    // Fallback without Web3
    return <>{children}</>;
  }
};


