import React, { useState, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui';
import { 
  Coins, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Copy,
  Shield,
  Zap
} from 'lucide-react';
import { api } from '../../services/api';
import { useMaterialNFT } from '../../hooks/useMaterialNFT';
import { getMaterialNFTContractAddress } from '../../config/contracts';
import { base } from 'wagmi/chains';
import type { Material, MaterialOwnershipCheck } from '../../types';

interface MaterialNFTMintProps {
  material: Material;
  onMintSuccess?: (tokenId: number, txHash: string) => void;
}

export const MaterialNFTMint: React.FC<MaterialNFTMintProps> = ({
  material,
  onMintSuccess
}) => {
  const { address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { createMaterial } = useMaterialNFT();
  
  // Check contract configuration
  const [contractConfigError, setContractConfigError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      getMaterialNFTContractAddress();
      setContractConfigError(null);
    } catch (error) {
      setContractConfigError(error instanceof Error ? error.message : 'Contract configuration error');
    }
  }, []);
  
  const [ownershipCheck, setOwnershipCheck] = useState<MaterialOwnershipCheck | null>(null);
  const [isCheckingOwnership, setIsCheckingOwnership] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const [mintSuccess, setMintSuccess] = useState<{
    tokenId: number;
    txHash: string;
    ipfsCid: string;
  } | null>(null);
  const [duplicateCheck, setDuplicateCheck] = useState<{
    exists: boolean;
    tokenId?: number;
    materialId?: string;
  } | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // Check material ownership on load
  useEffect(() => {
    if (material.id && address) {
      checkOwnership();
      checkForDuplicates();
    }
  }, [material.id, address]);

  const checkOwnership = async () => {
    setIsCheckingOwnership(true);
    try {
      // Check material ownership
      const ownership = await api.checkMaterialOwnership(material.id);
      
      // Check NFT status
      const nftStatus = await api.getMaterialNFTStatus(material.id);
      
      // Combine data
      const combinedOwnership: MaterialOwnershipCheck = {
        ...ownership,
        nftMinted: nftStatus.nftMinted,
        tokenId: nftStatus.tokenId,
        canMint: ownership.isOwner && !nftStatus.nftMinted
      };
      
      setOwnershipCheck(combinedOwnership);
    } catch (error) {
      console.error('Error checking ownership:', error);
      // Fallback: use data from material
      setOwnershipCheck({
        isOwner: material.author_wallet?.toLowerCase() === address?.toLowerCase(),
        nftMinted: material.nft_minted || false,
        tokenId: material.nft_token_id,
        canMint: material.author_wallet?.toLowerCase() === address?.toLowerCase() && !material.nft_minted
      });
    } finally {
      setIsCheckingOwnership(false);
    }
  };

  const checkForDuplicates = async () => {
    if (!material.content) return;
    
    setIsCheckingDuplicate(true);
    try {
      // Calculate content hash
      const encoder = new TextEncoder();
      const data = encoder.encode(material.content);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Check for existence
      const result = await api.checkContentHashExists(contentHash);
      setDuplicateCheck(result);
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      setDuplicateCheck({ exists: false });
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  const handleMintNFT = async () => {
    if (!address) {
      setMintError('Wallet not connected');
      return;
    }

    if (!material.content) {
      setMintError('Material content not available');
      return;
    }

    // Check for duplicates
    if (duplicateCheck?.exists) {
      setMintError(`Material with the same content already exists (Token ID: ${duplicateCheck.tokenId})`);
      return;
    }

    // Check that we are on Base network
    if (chainId !== base.id) {
      setIsSwitchingChain(true);
      setMintError(null);
      
      try {
        await switchChain({ chainId: base.id });
        // Give time for network switching
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        setIsSwitchingChain(false);
        setMintError('Failed to switch to Base network. Please switch manually in your wallet.');
        return;
      }
      
      setIsSwitchingChain(false);
    }

    setIsMinting(true);
    setMintError(null);

    try {
      // Create NFT through Web3 hook
      const nftResult = await createMaterial({
        subject: material.subject,
        grade: material.grade,
        topic: material.topic,
        content: material.content,
        title: material.title
      });

      // Sync with backend
      await api.syncMaterialWithBlockchain(material.id, {
        ipfsCid: nftResult.ipfsCid,
        contentHash: nftResult.contentHash,
        txHash: nftResult.txHash,
        tokenId: nftResult.tokenId || 0
      });

      setMintSuccess({
        tokenId: nftResult.tokenId || 0,
        txHash: nftResult.txHash,
        ipfsCid: nftResult.ipfsCid
      });

      // Update ownership check with the new tokenId
      setOwnershipCheck(prev => prev ? {
        ...prev,
        nftMinted: true,
        tokenId: nftResult.tokenId || 0,
        canMint: false
      } : null);

      // Also update the backend
      await checkOwnership();

      // Call success callback
      if (onMintSuccess) {
        onMintSuccess(nftResult.tokenId || 0, nftResult.txHash);
      }

    } catch (error) {
      console.error('NFT minting error:', error);
      setMintError(error instanceof Error ? error.message : 'NFT minting error');
    } finally {
      setIsMinting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getExplorerUrl = (txHash: string) => {
    // Base explorer
    return `https://basescan.org/tx/${txHash}`;
  };

  // If wallet not connected
  if (!address) {
    return (
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins size={20} className="text-yellow-500" />
Material NFT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertCircle size={48} className="text-muted mx-auto mb-4" />
            <p className="text-muted mb-4">
              Web3 wallet connection required for NFT minting
            </p>
            <Button variant="primary" disabled>
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If checking ownership or duplicates
  if (isCheckingOwnership || isCheckingDuplicate) {
    return (
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins size={20} className="text-yellow-500" />
Material NFT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Loader2 size={32} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted">
              {isCheckingOwnership ? 'Checking material ownership...' : 'Checking for duplicates...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If duplicate exists
  if (duplicateCheck?.exists) {
    return (
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-500" />
            Material NFT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertCircle size={48} className="text-orange-500 mx-auto mb-4" />
            <p className="text-orange-600 font-medium mb-2">
              Material already exists
            </p>
            <p className="text-muted text-sm mb-4">
              NFT with the same content has already been created
            </p>
            {duplicateCheck.tokenId && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-700 text-sm">
                  Token ID: #{duplicateCheck.tokenId}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // If not owner
  if (ownershipCheck && !ownershipCheck.isOwner) {
    return (
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} className="text-red-500" />
Material NFT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-muted">
             Only author can mint NFT
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If NFT already minted
  if (ownershipCheck && ownershipCheck.nftMinted) {
    return (
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-500" />
Material NFT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <p className="text-green-600 font-medium mb-2">
                NFT successfully minted!
              </p>
              <p className="text-sm text-muted">
                Token ID: #{mintSuccess?.tokenId ?? ownershipCheck.tokenId}
              </p>
            </div>
            
            {mintSuccess && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Transaction Hash:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white px-2 py-1 rounded">
                      {mintSuccess.txHash.slice(0, 10)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(mintSuccess.txHash)}
                      icon={<Copy size={14} />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(getExplorerUrl(mintSuccess.txHash), '_blank')}
                      icon={<ExternalLink size={14} />}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">IPFS CID:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white px-2 py-1 rounded">
                      {mintSuccess.ipfsCid.slice(0, 10)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(mintSuccess.ipfsCid)}
                      icon={<Copy size={14} />}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // If can mint
  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins size={20} className="text-yellow-500" />
          NFT Topic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <Zap size={48} className="text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Mint NFT
            </h3>
            <p className="text-muted text-sm mb-4">
              Create NFT to confirm authorship and get material editing rights
            </p>
          </div>

          {contractConfigError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-red-700 text-sm">{contractConfigError}</span>
              </div>
            </div>
          )}

          {mintError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-red-700 text-sm">{mintError}</span>
              </div>
            </div>
          )}

          {duplicateCheck && !duplicateCheck.exists && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-green-700 text-sm">
                  Unique - you can mint NFT
                </span>
              </div>
            </div>
          )}

        

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subject:</span>
              <span className="font-medium">{material.subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Grade:</span>
              <span className="font-medium">{material.grade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Topic:</span>
              <span className="font-medium">{material.topic}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Words:</span>
              <span className="font-medium">{material.word_count}</span>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleMintNFT}
            disabled={isMinting || isSwitchingChain || !!contractConfigError || (duplicateCheck?.exists)}
            className="w-full"
            icon={isMinting || isSwitchingChain ? <Loader2 size={18} className="animate-spin" /> : <Coins size={18} />}
          >
            {isSwitchingChain ? 'Switching to Base...' : isMinting ? 'Minting NFT...' : 'Mint NFT'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
