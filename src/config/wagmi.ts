import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Base Library',
      appLogoUrl: 'https://yourdomain.com/logo.png',
    }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3dc052b5-73b6-4318-9b1b-0da64f2d3ca8',
    }),
  ],
  transports: {
    [base.id]: http()
    },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}

