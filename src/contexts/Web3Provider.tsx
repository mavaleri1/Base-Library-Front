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
    const handleError = (event: ErrorEvent) => {
      const error = event.error || new Error(event.message || 'Unknown error');
      console.warn('Web3 provider error:', error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      console.warn('Web3 unhandled rejection:', error);
    };

    // Add error boundary for Web3
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
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


