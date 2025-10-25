# Base Library Frontend

A comprehensive Web3-enabled educational platform for creating, managing, and minting educational materials as NFTs on the Base blockchain. The platform integrates AI-powered content generation with blockchain technology to create a decentralized educational ecosystem.

## 🚀 Features

### Core Functionality
- **AI-Powered Material Generation**: Create educational content using advanced AI with customizable settings
- **Web3 Integration**: Connect with crypto wallets (Coinbase Wallet, MetaMask, WalletConnect)
- **NFT Minting**: Convert educational materials into NFTs on Base blockchain
- **IPFS Storage**: Decentralized content storage using Pinata IPFS service
- **Refinement Mode**: Interactive content refinement during generation
- **Material Management**: Organize materials by subject, grade, and topic
- **Leaderboard System**: Track top content creators and NFT holders
- **User Authentication**: Both traditional email/password and Web3 wallet authentication

### Technical Features
- **Modern React Architecture**: Built with React 19, TypeScript, and Vite
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Context API with React Query for server state
- **Web3 Integration**: Wagmi v2 with OnchainKit for seamless blockchain interaction
- **Real-time Updates**: Live processing status and Refinement Mode 
- **File Upload**: Support for images and documents with IPFS integration

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v7** - Client-side routing

### Web3 & Blockchain
- **Wagmi v2** - React hooks for Ethereum
- **OnchainKit** - Coinbase's Web3 UI components
- **Viem** - TypeScript interface for Ethereum

### State Management & Data
- **React Query (TanStack Query)** - Server state management
- **Context API** - Client state management
- **Axios** - HTTP client for API calls

### Content & Storage
- **IPFS** - Decentralized file storage
- **Pinata** - IPFS pinning service
- **React Markdown** - Markdown rendering
- **KaTeX** - Mathematical formula rendering

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=/api
VITE_PROMPT_CONFIG_API_URL=http://147.93.144.61:8002/api/v1

# Web3 Configuration
VITE_MATERIAL_NFT_CONTRACT=0xd40cf2739e48d3eaef60f296f70b915fdd8f3fbe
VITE_ONCHAINKIT_API_KEY=your_onchainkit_api_key
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# IPFS Configuration
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
```

### Smart Contract

The project includes a Solidity smart contract (`contracts/MaterialNFT.sol`) for minting educational materials as NFTs:

- **ERC721 Standard**: Non-fungible tokens for unique materials
- **Metadata Storage**: Subject, grade, topic, content hash, IPFS CID
- **Ownership Tracking**: Author verification and material ownership
- **Content Verification**: SHA-256 content hashing for integrity
- **Publication Control**: Draft/published status management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Base-Library-Front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Application Routes

### Public Routes
- `/` - Landing page
- `/login` - User authentication
- `/register` - User registration

### Protected Routes
- `/dashboard` - Main materials registry
- `/create` - Create new educational materials
- `/profile` - User profile and settings
- `/threads` - Browse educational materials
- `/leaderboard` - Top creators and NFT holders
- `/materials/:materialId` - View specific material
- `/debug/materials` - Development tools

## 🔐 Authentication

The platform supports two authentication methods:

### Traditional Authentication
- Email/password registration and login
- JWT token-based sessions
- User profile management

### Web3 Authentication
- Wallet connection (MetaMask, Coinbase Wallet, WalletConnect)
- Message signing for authentication
- Nonce-based security
- Wallet address linking

## 🎨 UI Components

The project uses a custom component library built on top of Radix UI primitives:

- **Form Components**: Input, Textarea, Select, Checkbox
- **Layout Components**: Card, Dialog, Tabs, Navigation
- **Feedback Components**: Toast, Progress, Badge
- **Data Display**: Table, Markdown viewer
- **Interactive Components**: Button, Modal, Dropdown

## 🔄 API Integration

### Backend Services
The frontend integrates with multiple backend services:

1. **Materials API** (`/api/materials`) - Material CRUD operations
2. **Processing API** (`/api/process`) - AI content generation
3. **Refinement Mode API** (`/api/hitl`) - Refinement Mode
4. **Auth API** (`/api/auth`) - Authentication services
5. **Threads API** (`/api/threads`) - Session management
6. **Prompt Config API** (`/api/v1`) - User preferences and settings

### API Features
- **Real-time Status**: Live processing updates
- **File Upload**: Image and document handling
- **Refinement Mode**: Interactive content refinement
- **Export Functionality**: Material export in multiple formats
- **User Preferences**: Customizable generation settings

## 🌐 Web3 Integration

### Blockchain Features
- **NFT Minting**: Convert materials to blockchain assets
- **Ownership Verification**: Prove material ownership
- **Content Integrity**: SHA-256 content hashing
- **Decentralized Storage**: IPFS for content persistence
- **Transaction History**: Track all blockchain interactions

### Supported Networks
- **Base Mainnet** - Primary network

### Wallet Support
- **MetaMask** - Browser extension wallet
- **Coinbase Wallet** - Mobile and browser wallet
- **WalletConnect** - Multi-wallet support

## 📊 Data Models

### Core Entities

**Material**
- Unique identifier and metadata
- Content hash and IPFS CID
- Subject, grade, and topic classification
- Author information and ownership
- Blockchain integration (NFT status)

**User**
- Authentication credentials
- Wallet address linking
- Profile preferences and statistics
- Material creation history

**Session**
- Processing status tracking
- Refinement interaction history
- File upload management
- Generation settings

## 🚀 Deployment

### Vercel Deployment
The project is configured for Vercel deployment with:
- Automatic builds on git push
- Environment variable configuration
- Custom domain support
- Serverless function integration

### Build Configuration
- **Vite** for optimized production builds
- **TypeScript** compilation
- **Tailwind CSS** purging for minimal bundle size
- **Asset optimization** for fast loading

## 🔧 Development

### Code Quality
- **ESLint** configuration for code standards
- **TypeScript** strict mode for type safety
- **Prettier** integration for code formatting
- **Husky** for pre-commit hooks

### Testing
- Component testing with React Testing Library
- API integration testing
- Web3 interaction testing
- End-to-end testing with Playwright

## 📈 Performance

### Optimization Features
- **Code Splitting**: Lazy loading of routes and components
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Image Optimization**: Responsive images with WebP support
- **Caching**: React Query for intelligent data caching
- **CDN Integration**: Static asset delivery optimization

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
---

**Built with ❤️ for the education ecosystem**
