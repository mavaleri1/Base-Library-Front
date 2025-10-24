import { useAccount, useSignMessage } from 'wagmi';
import { useState, useCallback } from 'react';
import { api } from '../services/api';

export enum Web3AuthErrorType {
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  CONNECTION_REJECTED = 'CONNECTION_REJECTED',
  SIGNATURE_REJECTED = 'SIGNATURE_REJECTED',
  NONCE_EXPIRED = 'NONCE_EXPIRED',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface Web3AuthError {
  type: Web3AuthErrorType;
  message: string;
}

const getErrorType = (error: any): Web3AuthError => {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorDetails = error?.details?.message?.toLowerCase() || error?.details?.detail?.toLowerCase() || '';
  
  if (errorMessage.includes('user rejected') || errorMessage.includes('user denied') || 
      errorMessage.includes('rejected') || errorDetails.includes('user rejected')) {
    return {
      type: Web3AuthErrorType.SIGNATURE_REJECTED,
      message: 'You rejected the signature request'
    };
  }
  
  if (errorMessage.includes('not connected') || errorMessage.includes('wallet not connected')) {
    return {
      type: Web3AuthErrorType.WALLET_NOT_CONNECTED,
      message: 'Wallet not connected'
    };
  }
  
  if (errorDetails.includes('nonce') && (errorDetails.includes('expired') || errorDetails.includes('invalid'))) {
    return {
      type: Web3AuthErrorType.NONCE_EXPIRED,
      message: 'The request has expired (5 minutes). Please try again'
    };
  }
  
  if (errorDetails.includes('signature') && errorDetails.includes('invalid')) {
    return {
      type: Web3AuthErrorType.VERIFICATION_FAILED,
      message: 'Signature verification failed'
    };
  }
  
  if (error?.status === 401 || errorDetails.includes('unauthorized')) {
    return {
      type: Web3AuthErrorType.VERIFICATION_FAILED,
      message: 'Signature verification failed. Check the correctness of the signature'
    };
  }
  
  if (error?.status === 0 || errorMessage.includes('network') || errorMessage.includes('timeout')) {
    return {
      type: Web3AuthErrorType.NETWORK_ERROR,
      message: 'Network error. Check the connection to the internet'
    };
  }
  
  return {
    type: Web3AuthErrorType.UNKNOWN_ERROR,
    message: error?.message || 'Unknown error during authentication'
  };
};

export const useWeb3Auth = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Web3AuthError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const authenticateWithWallet = useCallback(async () => {
    if (!address) {
      const error = {
        type: Web3AuthErrorType.WALLET_NOT_CONNECTED,
        message: 'Wallet not connected'
      };
      setError(error);
      throw error;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get nonce from artifacts-service
      const nonceResponse = await api.requestWeb3Nonce(address);
      
      // 2. Sign message
      const signature = await signMessageAsync({
        message: nonceResponse.message,
      });

      // 3. Verify signature in artifacts-service
      const response = await api.verifyWeb3Signature({
        wallet_address: address,
        signature,
        nonce: nonceResponse.nonce,
      });

      // 4. CRITICALLY IMPORTANT: Access prompt-config-service
      try {
        await api.initializePromptConfigUser();
      } catch (error) {
        // Continue with authentication even if prompt-config-service fails
      }

      return {
        token: response.access_token,
        user: {
          id: response.user.wallet_address,
          name: response.user.wallet_address,
          walletAddress: response.user.wallet_address,
          authMethod: 'web3' as const,
          createdAt: response.user.created_at,
        }
      };
    } catch (err: any) {
      console.error('❌ Authentication failed:', err);
      const authError = getErrorType(err);
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [address, signMessageAsync]);

  return {
    address,
    isConnected,
    isLoading,
    error,
    clearError,
    loginWithWallet: authenticateWithWallet,
    registerWithWallet: authenticateWithWallet,
  };
};


