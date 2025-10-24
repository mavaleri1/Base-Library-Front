import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useWeb3Auth, Web3AuthErrorType } from '../../hooks/useWeb3Auth';
import { AuthContext } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui';
import { Web3WalletButton } from './Web3WalletButton';
import { AlertCircle, Clock, Shield } from 'lucide-react';
import LogoLogin from './logo/LogoLogin.jpg';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { loginWithWallet, isLoading, error, clearError } = useWeb3Auth();
  const { refreshUser } = useContext(AuthContext);

  const handleWeb3Login = async () => {
    clearError();
    try {
      const response = await loginWithWallet();
      if (response) {
        await refreshUser();
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  const getErrorIcon = () => {
    if (!error) return null;
    
    switch (error.type) {
      case Web3AuthErrorType.NONCE_EXPIRED:
        return <Clock className="w-5 h-5" />;
      case Web3AuthErrorType.SIGNATURE_REJECTED:
      case Web3AuthErrorType.CONNECTION_REJECTED:
        return <AlertCircle className="w-5 h-5" />;
      case Web3AuthErrorType.VERIFICATION_FAILED:
        return <Shield className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-16" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-2">
          <div className="flex justify-center">
            <img src={LogoLogin} alt="Base Library Logo" className="w-60 h-60 object-contain" />
          </div>
          <p className="text-muted">Where education meets Web3</p>
        </div>

        <Card variant="elevated">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              Login via Web3 wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-center">
              <div>
                <Web3WalletButton />
              </div>

              {isConnected && address && !isLoading && (
                <button
                  onClick={handleWeb3Login}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Login via wallet
                </button>
              )}

              {isLoading && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span className="font-medium text-primary text-sm">
                      Authentication in progress...
                    </span>
                  </div>
                  <p className="text-sm text-muted">
                    Confirm the signature in your wallet
                  </p>
                </div>
              )}


              {!isConnected && !isLoading && (
                <div className="p-4 rounded-lg bg-muted border border-border text-center">
                  <p className="text-sm text-muted mb-2">
                    Supported: Coinbase Wallet, MetaMask, WalletConnect and others
                  </p>
                  <p className="text-xs text-muted">
                    Connect your wallet and click "Login via wallet"
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="text-error">
                      {getErrorIcon()}
                    </div>
                    <p className="font-medium text-error text-sm">
                      Login error
                    </p>
                  </div>
                  <p className="text-sm text-error/80 mb-2">
                    {error.message}
                  </p>
                  {error.type === Web3AuthErrorType.NONCE_EXPIRED && (
                    <p className="text-xs text-error/70">
                      💡 Hint: The request to sign is valid for 5 minutes
                    </p>
                  )}
                  {error.type === Web3AuthErrorType.SIGNATURE_REJECTED && (
                    <p className="text-xs text-error/70">
                      💡 Hint: To login, you need to confirm the signature in your wallet
                    </p>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-border text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-muted">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <p>
                    We use cryptographic signature for secure authentication. 
                    Your private key never leaves your wallet.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
