// import { base } from "viem/chains"; // Not used in this file

// Smart contracts configuration
const rawContractAddress = import.meta.env.VITE_MATERIAL_NFT_CONTRACT || "0xd40cf2739e48d3eaeef60f296f70b915fdd8f3fb";
console.log('🔍 Debug - Raw env variable:', JSON.stringify(import.meta.env.VITE_MATERIAL_NFT_CONTRACT));
console.log('🔍 Debug - Raw contract address:', JSON.stringify(rawContractAddress));

// Clean the address from any non-printable characters
const cleanContractAddress = String(rawContractAddress).replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim().toLowerCase();
console.log('🔍 Debug - Clean contract address:', JSON.stringify(cleanContractAddress));

export const CONTRACTS = {
  MaterialNFT: {
    address: cleanContractAddress,
    abi: [
      {
        "inputs": [
          {"internalType": "address", "name": "to", "type": "address"},
          {"internalType": "string", "name": "subject", "type": "string"},
          {"internalType": "string", "name": "grade", "type": "string"},
          {"internalType": "string", "name": "topic", "type": "string"},
          {"internalType": "string", "name": "contentHash", "type": "string"},
          {"internalType": "string", "name": "ipfsCid", "type": "string"},
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "uint256", "name": "wordCount", "type": "uint256"}
        ],
        "name": "createMaterial",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "getMaterialMetadata",
        "outputs": [
          {
            "components": [
              {"internalType": "string", "name": "subject", "type": "string"},
              {"internalType": "string", "name": "grade", "type": "string"},
              {"internalType": "string", "name": "topic", "type": "string"},
              {"internalType": "string", "name": "contentHash", "type": "string"},
              {"internalType": "string", "name": "ipfsCid", "type": "string"},
              {"internalType": "address", "name": "author", "type": "address"},
              {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
              {"internalType": "uint256", "name": "updatedAt", "type": "uint256"},
              {"internalType": "bool", "name": "isPublished", "type": "bool"},
              {"internalType": "string", "name": "title", "type": "string"},
              {"internalType": "uint256", "name": "wordCount", "type": "uint256"}
            ],
            "internalType": "struct MaterialNFT.MaterialMetadata",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "address", "name": "author", "type": "address"}],
        "name": "getAuthorMaterials",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "string", "name": "subject", "type": "string"}],
        "name": "getPublishedMaterialsBySubject",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
          {"internalType": "string", "name": "newIpfsCid", "type": "string"},
          {"internalType": "string", "name": "newContentHash", "type": "string"}
        ],
        "name": "updateMaterial",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
          {"internalType": "bool", "name": "published", "type": "bool"}
        ],
        "name": "setPublished",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "ownerOf",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "tokenURI",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "string", "name": "contentHash", "type": "string"}],
        "name": "contentHashExists",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "string", "name": "contentHash", "type": "string"}],
        "name": "getTokenIdByContentHash",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ] as const
  }
} as const;

// Contract events
export const CONTRACT_EVENTS = {
  MaterialCreated: 'MaterialCreated',
  MaterialUpdated: 'MaterialUpdated',
  MaterialPublished: 'MaterialPublished'
} as const;

// Network settings
export const NETWORKS = {
  base: {
    chainId: 8453,
    name: 'Base Mainnet',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org'
  },
  
} as const;

// IPFS settings (Pinata)
export const IPFS_CONFIG = {
  // Main gateway for Pinata
  gateway: 'https://gateway.pinata.cloud/ipfs/',
  
  // Alternative gateways for backup
  fallbackGateways: [
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/'
  ],
  
  // Pinata configuration
  pinata: {
    apiKey: import.meta.env.VITE_PINATA_API_KEY || 'af7a2d18f1e76f9f6e2b',
    secretKey: import.meta.env.VITE_PINATA_SECRET_KEY || '96d010d44e8e21691eefc0f5bccd55ebad539e7abe39e15e62ed4a3f64f94a3e',
    gateway: 'https://gateway.pinata.cloud/ipfs/',
    apiUrl: 'https://api.pinata.cloud',
    // Upload settings
    uploadOptions: {
      cidVersion: 0,
      wrapWithDirectory: false
    }
  }
} as const;

// Validate Pinata configuration
export const validatePinataConfig = (): boolean => {
  const { apiKey, secretKey } = IPFS_CONFIG.pinata;
  return !!(apiKey && secretKey);
};

// Get URL for accessing content with fallback
export const getIPFSURL = (cid: string, useFallback: boolean = false): string => {
  if (useFallback) {
    const fallbackGateway = IPFS_CONFIG.fallbackGateways[0];
    return `${fallbackGateway}${cid}`;
  }
  return `${IPFS_CONFIG.gateway}${cid}`;
};

// Export ABI for use in hooks
export const MaterialNFT_ABI = CONTRACTS.MaterialNFT.abi;

// Contract address validation
export const validateContractAddress = (address: string | undefined): string => {
  console.log('🔍 Debug - Raw address:', JSON.stringify(address));
  console.log('🔍 Debug - Address length:', address?.length);
  console.log('🔍 Debug - Address type:', typeof address);
  
  if (!address) {
    throw new Error('MaterialNFT contract address is not set. Check VITE_MATERIAL_NFT_CONTRACT variable in .env file.');
  }
  
  // Remove all non-printable characters and trim whitespace
  const cleanAddress = address.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim().toLowerCase();
  console.log('🔍 Debug - Clean address:', JSON.stringify(cleanAddress));
  console.log('🔍 Debug - Clean address length:', cleanAddress.length);
  
  if (cleanAddress === '0x...') {
    throw new Error('MaterialNFT contract address is not set. Check VITE_MATERIAL_NFT_CONTRACT variable in .env file.');
  }
  
  // Check Ethereum address format
  if (!/^0x[a-f0-9]{40}$/.test(cleanAddress)) {
    console.log('🔍 Debug - Regex test failed for:', cleanAddress);
    console.log('🔍 Debug - Regex pattern: /^0x[a-f0-9]{40}$/');
    console.log('🔍 Debug - Character codes:', Array.from(cleanAddress).map((c, i) => `${i}: ${c.charCodeAt(0)} (${JSON.stringify(c)})`));
    console.log('🔍 Debug - Expected length: 42, actual length:', cleanAddress.length);
    console.log('🔍 Debug - Extra character at position 42:', JSON.stringify(cleanAddress[42]));
    throw new Error(`Invalid contract address format: ${address}. Address should be in format 0x... (40 hex characters).`);
  }
  
  console.log('✅ Debug - Address validation passed:', cleanAddress);
  return cleanAddress;
};

// Get valid contract address
export const getMaterialNFTContractAddress = (): string => {
  return validateContractAddress(String(CONTRACTS.MaterialNFT.address));
};
