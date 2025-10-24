import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import type { User, LoginCredentials, RegisterCredentials } from '../types';


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loginWithWeb3: (walletAddress: string, signature: string, nonce: string) => Promise<void>;
  registerWithWeb3: (walletAddress: string, signature: string, nonce: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  loginWithWeb3: async () => {},
  registerWithWeb3: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to load user:', error);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.login(credentials);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await api.register(credentials);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const loginWithWeb3 = async (walletAddress: string, signature: string, nonce: string) => {
    try {
      console.log('🔐 Starting Web3 login in AuthContext...');
      console.log('📍 Wallet address:', walletAddress);
      
      const response = await api.verifyWeb3Signature({ 
        wallet_address: walletAddress, 
        signature, 
        nonce 
      });
      
      console.log('✅ Authentication successful in artifacts-service');
      console.log('🔑 JWT Token received:', response.access_token.substring(0, 20) + '...');
      
      // CRITICALLY IMPORTANT: Access prompt-config-service
      try {
        await api.initializePromptConfigUser();
      } catch (error) {
        // Continue with authentication even if prompt-config-service fails
      }
      
      setUser({
        id: response.user.id,
        name: response.user.wallet_address,
        walletAddress: response.user.wallet_address,
        authMethod: 'web3',
        createdAt: response.user.created_at,
      });
    } catch (error) {
      console.error('❌ Web3 login failed:', error);
      throw error;
    }
  };

  const registerWithWeb3 = async (
    walletAddress: string,
    signature: string, 
    nonce: string, 
    name?: string
  ) => {
    try {
      const response = await api.verifyWeb3Signature({ 
        wallet_address: walletAddress, 
        signature, 
        nonce 
      });
      
      // CRITICALLY IMPORTANT: Access prompt-config-service
      try {
        await api.initializePromptConfigUser();
      } catch (error) {
        // Continue with authentication even if prompt-config-service fails
      }
      
      setUser({
        id: response.user.id,
        name: name || response.user.wallet_address,
        walletAddress: response.user.wallet_address,
        authMethod: 'web3',
        createdAt: response.user.created_at,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithWeb3,
        registerWithWeb3,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

