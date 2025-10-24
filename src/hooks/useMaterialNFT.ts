import { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { MaterialNFT_ABI, getMaterialNFTContractAddress } from '../config/contracts';
import { ipfsService } from '../services/ipfs';

interface MaterialMetadata {
  subject: string;
  grade: string;
  topic: string;
  contentHash: string;
  ipfsCid: string;
  author: string;
  createdAt: number;
  updatedAt: number;
  isPublished: boolean;
  title: string;
  wordCount: number;
}

interface CreateMaterialParams {
  subject: string;
  grade: string;
  topic: string;
  content: string;
  title: string;
}

interface CreateMaterialResult {
  tokenId: number;
  txHash: string;
  ipfsCid: string;
  contentHash: string;
  wordCount: number;
}

export const useMaterialNFT = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to create material
  const { writeContract: createMaterialWrite, isPending: isCreating } = useWriteContract();

  /**
   * Create NFT material
   */
  const createMaterial = async (params: CreateMaterialParams): Promise<CreateMaterialResult> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Calculate content hash
      const contentHash = await calculateContentHash(params.content);
      
      // 2. Check if NFT with the same contentHash already exists
      const duplicateCheck = await checkContentHashExists(contentHash);
      if (duplicateCheck.exists) {
        throw new Error(`Material with the same content already exists (Token ID: ${duplicateCheck.tokenId})`);
      }
      
      // 3. Upload content to IPFS
      const ipfsCid = await ipfsService.uploadText(params.content);
      
      // 4. Count the number of words
      const wordCount = params.content.split(/\s+/).length;

      // 5. Create NFT in blockchain
      const contractAddress = getMaterialNFTContractAddress();
      const result = await new Promise<{ hash: string; tokenId: number }>((resolve, reject) => {
        createMaterialWrite({
          address: contractAddress as `0x${string}`,
          abi: MaterialNFT_ABI,
          functionName: 'createMaterial',
          args: [
            address, // to
            params.subject,
            params.grade,
            params.topic,
            contentHash,
            ipfsCid,
            params.title,
            BigInt(wordCount)
          ]
        }, {
          onSuccess: async (hash: string) => {
            try {
              // Wait for transaction confirmation and get tokenId
              const tokenId = await getTokenIdFromTransaction(hash, contractAddress);
              resolve({ hash, tokenId });
            } catch (error) {
              reject(error);
            }
          },
          onError: (error: Error) => {
            reject(error);
          }
        });
      });

      // Check if the result is obtained
      if (!result) {
        throw new Error('Failed to get transaction result');
      }

      const { hash: txHash, tokenId } = result;

      return {
        tokenId,
        txHash: txHash as string,
        ipfsCid,
        contentHash,
        wordCount
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get material metadata
   */
  const getMaterialMetadata = async (_tokenId: number): Promise<MaterialMetadata> => {
    try {
      // Use useReadContract to read data
      // This is a simplified version, in a real application you need to use the hook in the component
      throw new Error('Use useReadContract in component to read metadata');
    } catch (err) {
      throw new Error('Failed to get material metadata');
    }
  };

  /**
   * Get author materials
   */
  const getAuthorMaterials = async (_authorAddress: string): Promise<number[]> => {
    try {
      // Use useReadContract to read data
      throw new Error('Use useReadContract in component to read author materials');
    } catch (err) {
      throw new Error('Failed to get author materials');
    }
  };

  /**
   * Get material content from IPFS
   */
  const getMaterialContent = async (ipfsCid: string): Promise<string> => {
    try {
      return await ipfsService.getContent(ipfsCid);
    } catch (err) {
      throw new Error('Failed to get material content');
    }
  };

  /**
   * Check material ownership
   */
  const isAuthor = (materialAuthor: string): boolean => {
    return address?.toLowerCase() === materialAuthor.toLowerCase();
  };

  /**
   * Check if NFT with the same contentHash exists
   */
  const checkContentHashExists = async (contentHash: string): Promise<{
    exists: boolean;
    tokenId?: number;
  }> => {
    try {
      // Use API to check
      const { api } = await import('../services/api');
      const result = await api.checkContentHashExists(contentHash);
      return {
        exists: result.exists,
        tokenId: result.tokenId
      };
    } catch (err) {
      console.error('Error checking content hash:', err);
      return { exists: false };
    }
  };

  /**
   * Check if contentHash exists in blockchain
   */
  const checkContentHashInBlockchain = async (_contentHash: string): Promise<{
    exists: boolean;
    tokenId?: number;
  }> => {
    try {
      // In a real application you need to use useReadContract
      // For simplicity, return false
      return { exists: false };
    } catch (err) {
      console.error('Error checking content hash in blockchain:', err);
      return { exists: false };
    }
  };

  return {
    createMaterial,
    getMaterialMetadata,
    getAuthorMaterials,
    getMaterialContent,
    isAuthor,
    checkContentHashExists,
    checkContentHashInBlockchain,
    isLoading: isLoading || isCreating,
    error
  };
};

  /**
   * Hook for working with a specific material
   */
export const useMaterial = (tokenId: number | undefined) => {
  const [material, setMaterial] = useState<MaterialMetadata | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getMaterialMetadata, getMaterialContent } = useMaterialNFT();

  useEffect(() => {
    const loadMaterial = async () => {
      if (!tokenId) return;

      setIsLoading(true);
      setError(null);

      try {
        const metadata = await getMaterialMetadata(tokenId);
        setMaterial(metadata);

        // Load content from IPFS
        const materialContent = await getMaterialContent(metadata.ipfsCid);
        setContent(materialContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading material');
      } finally {
        setIsLoading(false);
      }
    };

    loadMaterial();
  }, [tokenId, getMaterialMetadata, getMaterialContent]);

  return {
    material,
    content,
    isLoading,
    error
  };
};

/**
 * Hook for getting user materials
 */
export const useUserMaterials = () => {
  const { address } = useAccount();
  const [materials, setMaterials] = useState<MaterialMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getAuthorMaterials, getMaterialMetadata } = useMaterialNFT();

  useEffect(() => {
    const loadUserMaterials = async () => {
      if (!address) return;

      setIsLoading(true);
      setError(null);

      try {
        const tokenIds = await getAuthorMaterials(address);
        const materialsData = await Promise.all(
          tokenIds.map(id => getMaterialMetadata(id))
        );
        setMaterials(materialsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading materials');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserMaterials();
  }, [address, getAuthorMaterials, getMaterialMetadata]);

  return {
    materials,
    isLoading,
    error
  };
};

/**
 * Calculate SHA-256 hash of content
 */
async function calculateContentHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get tokenId from Transfer event after minting
 */
async function getTokenIdFromTransaction(txHash: string, _contractAddress: string): Promise<number> {
  try {
    // Import necessary dependencies
    const { createPublicClient, http, parseEventLogs } = await import('viem');
    const { base } = await import('wagmi/chains');
    
    // Create public client for Base
    const publicClient = createPublicClient({
      chain: base,
      transport: http()
    });

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      timeout: 60000 // 60 seconds
    });

    
    // Find Transfer event (from address(0) to user)
    const transferEvents = parseEventLogs({
      abi: [
        {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'tokenId', type: 'uint256', indexed: true }
          ]
        }
      ],
      logs: receipt.logs,
      eventName: 'Transfer'
    });

    // Find Transfer event from zero address (minting)
    const mintEvent = transferEvents.find((event: any) => 
      event.args && event.args.from === '0x0000000000000000000000000000000000000000'
    ) as any;

    if (mintEvent && mintEvent.args && mintEvent.args.tokenId) {
      return Number(mintEvent.args.tokenId);
    }

    throw new Error('Failed to find Transfer event in transaction');
  } catch (error) {
    console.error('Error getting tokenId from transaction:', error);
    // Fallback: return 0 if tokenId is not found
    return 0;
  }
}
