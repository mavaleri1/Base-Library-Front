import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

// Safe injected connector that handles conflicts
const safeInjected = () => {
  try {
    return injected({
      target: 'metaMask', // Only target MetaMask specifically
    });
  } catch (error) {
    console.warn('Injected connector error:', error);
    return null;
  }
};

// Type guard to filter out null values
const isNotNull = <T,>(value: T | null): value is T => value !== null;

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    safeInjected(),
    coinbaseWallet({
      appName: 'Base Library',
      appLogoUrl: 'https://www.base-library.site/src/components/auth/logo/LogoLogin.jpg',
    }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3dc052b5-73b6-4318-9b1b-0da64f2d3ca8',
    }),
  ].filter(isNotNull),
  transports: {
    [base.id]: http()
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}

