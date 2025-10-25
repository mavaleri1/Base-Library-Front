import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and core libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // Router
          if (id.includes('react-router')) {
            return 'router';
          }
          // Radix UI components
          if (id.includes('@radix-ui')) {
            return 'ui-components';
          }
          // Web3 libraries - split into smaller chunks
          if (id.includes('wagmi')) {
            return 'wagmi';
          }
          if (id.includes('viem')) {
            return 'viem';
          }
          if (id.includes('@coinbase/onchainkit')) {
            return 'onchainkit';
          }
          // Markdown and syntax highlighting
          if (id.includes('react-markdown') || id.includes('react-syntax-highlighter')) {
            return 'markdown';
          }
          if (id.includes('katex') || id.includes('rehype-katex') || id.includes('remark-math')) {
            return 'math';
          }
          // IPFS and file handling
          if (id.includes('ipfs-http-client')) {
            return 'ipfs';
          }
          // Utility libraries
          if (id.includes('axios')) {
            return 'axios';
          }
          if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
            return 'utils';
          }
          if (id.includes('valtio')) {
            return 'valtio';
          }
          // TanStack Query
          if (id.includes('@tanstack')) {
            return 'tanstack';
          }
          // Lucide icons
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          // Large dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1500,
    target: 'esnext',
    minify: 'esbuild'
  },
  server: {
    host: true,
    port: 3001,
    proxy: {
      // Artifacts Service - material generation (without /api prefix)
      '/api/process': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api/upload-images': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api/hitl': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Materials API - backend expects /api/materials/*
      '/api/materials': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        // No rewrite, backend expects /api/materials/*
      },
      // Threads API - backend expects /threads/* (without /api prefix)
      '/api/threads': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Users API - backend expects /users/* (without /api prefix)
      '/api/users': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Auth API - backend expects /auth/* (without /api prefix)
      '/api/auth': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // State API - backend expects /state/* (without /api prefix)
      '/api/state': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Prompt Config Service - user profiles and settings
      '/api/v1': {
        target: 'http://147.93.144.61:8002',
        changeOrigin: true,
        // No rewrite, backend expects /api/v1/*
      },
    },
  },
})