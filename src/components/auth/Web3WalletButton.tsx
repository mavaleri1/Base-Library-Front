import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';

interface Web3WalletButtonProps {
  onConnect?: (address: string) => void;
  align?: 'left' | 'center' | 'right';
}

export const Web3WalletButton: React.FC<Web3WalletButtonProps> = ({
  onConnect,
  align = 'center',
}) => {
  const { address, isConnected } = useAccount();
  const [hasError, setHasError] = useState(false);

  // track the connection of the wallet (only notify about the connection)
  useEffect(() => {
    if (isConnected && address) {
      onConnect?.(address);
    }
  }, [isConnected, address, onConnect]);

  // Handle Web3 errors
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      if (error.message.includes('ethereum') || error.message.includes('viem')) {
        console.warn('Web3 error caught:', error.message);
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const getJustifyClass = () => {
    switch (align) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      case 'center':
      default:
        return 'justify-center';
    }
  };

  if (hasError) {
    return (
      <div className={`w-full flex ${getJustifyClass()}`}>
        <button 
          className="w-full bg-gray-500 text-white rounded-lg font-medium py-2 px-4 cursor-not-allowed"
          disabled
        >
          Web3 Unavailable
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full flex ${getJustifyClass()}`}>
      <Wallet>
        <ConnectWallet
          className="w-full bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2 text-center" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
          </Identity>
          <WalletDropdownDisconnect 
            text="Disconnect"
          />
        </WalletDropdown>
      </Wallet>
    </div>
  );
};

