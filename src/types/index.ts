export interface User {
  id: string;
  email?: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  walletAddress?: string;
  authMethod?: 'email' | 'web3' | 'both';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface Thread {
  thread_id: string;
  created_at: string;
  updated_at: string;
  sessions: Session[];
  metadata?: Record<string, any>;
}

export interface Session {
  session_id: string;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  files_count?: number;
  subject?: string;
  grade?: string;
  topic?: string;
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  type: string;
  created_at: string;
}

export interface CreateMaterialParams {
  question: string;
  images?: File[];
  settings: MaterialSettings;
  wallet_address?: string;
}

export interface MaterialSettings {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
  volume: 'brief' | 'standard' | 'detailed';
  enableHITL: boolean;
  enableEditing: boolean;
  enableGapQuestions: boolean;
}

export interface UserProfile {
  userId: string;
  preferences: UserPreferences;
  statistics: UserStatistics;
}

export interface UserPreferences {
  defaultDifficulty: 'beginner' | 'intermediate' | 'advanced';
  defaultSubject: string;
  defaultVolume: 'brief' | 'standard' | 'detailed';
  enableHITLByDefault: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface UserStatistics {
  totalMaterials: number;
  totalSessions: number;
  favoriteSubjects: string[];
  lastActivity: string;
}

export interface ProcessingStatus {
  threadId: string;
  sessionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  currentNode?: string;
  progress?: number;
  error?: string;
  result?: any;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Web3 Auth Types
export interface Web3NonceRequest {
  wallet_address: string;
}

export interface Web3NonceResponse {
  nonce: string;
  message: string;
  expires_in: number;
}

export interface Web3SignatureVerifyRequest {
  wallet_address: string;
  signature: string;
  nonce: string;
}

export interface Web3AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    wallet_address: string;
    created_at: string;
    last_login: string | null;
  };
}

// Export Settings Types
export type ExportFormat = 'markdown' | 'pdf';
export type PackageType = 'final' | 'all';

export interface ExportSettings {
  user_id: string;
  default_format: ExportFormat;
  default_package_type: PackageType;
  created: string;
  modified: string;
}

export interface SessionSummary {
  thread_id: string;
  session_id: string;
  input_content: string;
  question_preview: string;
  display_name: string;
  created_at: string;
  has_synthesized: boolean;
  has_questions: boolean;
  answers_count: number;
}

// Placeholder Types (Prompt Config Service)
export interface PlaceholderValue {
  id: string;
  placeholder_id: string;
  value: string;
  display_name: string;
  description?: string;
}

export interface Placeholder {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  category: string;
  values: PlaceholderValue[];
}

export interface UserPlaceholderSetting {
  placeholder_id: string;
  placeholder_name: string;
  placeholder_display_name: string;
  value_id: string;
  value: string;
  display_name: string;
}

export interface UserPlaceholderSettings {
  placeholders: {
    [key: string]: UserPlaceholderSetting;
  };
  active_profile_id?: string | null;
  active_profile_name?: string | null;
}

export interface ProfilePlaceholderSetting {
  placeholder_id: string;
  placeholder_value_id: string;
  placeholder?: Placeholder;
  placeholder_value?: PlaceholderValue;
}

export interface Profile {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  category: 'style' | 'subject';
  created_at: string;
  updated_at: string;
  placeholder_settings: ProfilePlaceholderSetting[];
}

export interface SetPlaceholderRequest {
  value_id: string;
}

// HITL Types
export interface HITLConfig {
  edit_material: boolean;
  generating_questions: boolean;
}

export interface HITLInterrupt {
  value: {
    message: string[];
  };
  resumable: boolean;
  ns?: string[];
  when?: string;
}

export interface HITLNodeSetting {
  node_name: string;
  enabled: boolean;
}

export interface ProcessingStatusWithHITL extends ProcessingStatus {
  interrupted?: boolean;
  interrupt_message?: string[];
  awaiting_feedback?: boolean;
  current_node?: string;
}

export interface SendFeedbackParams {
  thread_id: string;
  message: string;
  question: string;
  wallet_address?: string;
  images?: File[];
}

export interface BulkUpdateHITLRequest {
  enable_all: boolean;
}

// Materials Types
export interface Material {
  id: string;
  author_id: string;
  author_wallet: string;
  thread_id: string;
  session_id: string;
  file_path: string;
  subject: string;
  grade: string;
  topic: string;
  content_hash: string;
  ipfs_cid: string;
  title: string;
  word_count: number;
  status: 'draft' | 'published' | 'archived';
  content?: string;
  input_query?: string;
  created_at: string;
  updated_at: string;
  // Web3 fields
  blockchain?: {
    tokenId?: number;
    txHash?: string;
    ipfsCid?: string;
    contentHash?: string;
    isPublished?: boolean;
    createdAt?: number;
    updatedAt?: number;
  };
  // Fields for ownership verification and NFT status
  is_owner?: boolean;
  nft_minted?: boolean;
  nft_token_id?: number;
}

export interface MaterialsResponse {
  materials: Material[];
  total: number;
  page: number;
  page_size: number;
}

export interface MaterialsFilter {
  page?: number;
  page_size?: number;
  subject?: string;
  grade?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface SubjectStats {
  subject: string;
  count: number;
}

export interface GradeInfo {
  name: string;
  count: number;
}

export interface TopicInfo {
  name: string;
  count: number;
  grades: GradeInfo[];
}

export interface SubjectInfo {
  name: string;
  count: number;
  topics: TopicInfo[];
}

export interface MaterialsHierarchy {
  subjects: SubjectInfo[];
}

// Web3 & NFT Types
export interface MaterialNFTMetadata {
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

export interface CreateMaterialNFTParams {
  subject: string;
  grade: string;
  topic: string;
  content: string;
  title: string;
}

export interface MaterialNFTResult {
  tokenId: number;
  txHash: string;
  ipfsCid: string;
  contentHash: string;
  wordCount: number;
}

export interface BlockchainStats {
  totalNFTs: number;
  publishedNFTs: number;
  subjects: { subject: string; count: number }[];
}

export interface IPFSUploadResult {
  cid: string;
  size: number;
  path: string;
}

// NFT Minting Types
export interface MintNFTRequest {
  materialId: string;
  subject: string;
  grade: string;
  topic: string;
  title: string;
  content: string;
}

export interface MintNFTResponse {
  success: boolean;
  tokenId?: number;
  txHash?: string;
  ipfsCid?: string;
  contentHash?: string;
  error?: string;
}

export interface MaterialOwnershipCheck {
  isOwner: boolean;
  nftMinted: boolean;
  tokenId?: number;
  canMint: boolean;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  materialsCount: number;
  nftCount: number;
  totalScore: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total: number;
  page: number;
  page_size: number;
}

