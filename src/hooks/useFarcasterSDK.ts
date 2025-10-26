import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export const useFarcasterSDK = () => {
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Check if we are in Farcaster context
        if (sdk) {
          // Hide splash screen and show app
          await sdk.actions.ready();
          console.log('Farcaster SDK initialized successfully');
        }
      } catch (error) {
        console.log('Farcaster SDK not available or error:', error);
        // This is normal if the app is not running in Farcaster
      }
    };

    initializeSDK();
  }, []);
};
