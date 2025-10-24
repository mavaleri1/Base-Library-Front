import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useWeb3Auth, Web3AuthErrorType } from '../../hooks/useWeb3Auth';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui';
import { Web3WalletButton } from './Web3WalletButton';
import { CheckCircle, AlertCircle, Clock, Shield, UserPlus } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { registerWithWallet, isLoading, error, clearError } = useWeb3Auth();

  const handleWeb3Register = async () => {
    clearError();
    try {
      const response = await registerWithWallet();
      if (response) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Register error:', err);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5 px-4 py-8">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-ink mb-2">Base Library</h1>
          <p className="text-muted">Educational content generation system</p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Registration via Web3 wallet
            </CardTitle>
            <CardDescription>
              Create an account using blockchain authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Web3WalletButton />
              </div>

              {isConnected && address && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="font-medium text-success text-sm">
                        Wallet connected
                      </span>
                    </div>
                    <div className="text-sm text-muted">
                      <span className="font-mono bg-background px-2 py-1 rounded border border-border">
                        {formatAddress(address)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleWeb3Register}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Register with wallet
                  </Button>
                </div>
              )}

              {!isConnected && (
                <div className="p-4 rounded-lg bg-muted border border-border text-center">
                  <p className="text-sm text-muted mb-2">
                    Or connect any Web3 wallet
                  </p>
                  <p className="text-xs text-muted">
                    Supported: Coinbase Wallet, MetaMask, WalletConnect and others
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-lg bg-error/10 border border-error/20">
                  <div className="flex items-start gap-3">
                    <div className="text-error mt-0.5">
                      {getErrorIcon()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-error text-sm mb-1">
                        Registration error
                      </p>
                      <p className="text-sm text-error/80">
                        {error.message}
                      </p>
                      {error.type === Web3AuthErrorType.NONCE_EXPIRED && (
                        <p className="text-xs text-error/70 mt-2">
                          💡 Tip: Signature request is valid for 5 minutes
                        </p>
                      )}
                      {error.type === Web3AuthErrorType.SIGNATURE_REJECTED && (
                        <p className="text-xs text-error/70 mt-2">
                          💡 Tip: You need to confirm the signature in your wallet for registration
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <div className="flex items-start gap-2 text-xs text-muted mb-4">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    We use cryptographic signature for secure registration. 
                    Your private key never leaves your wallet.
                  </p>
                </div>
                
                <div className="text-center text-sm text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:text-primary-hover font-medium">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
