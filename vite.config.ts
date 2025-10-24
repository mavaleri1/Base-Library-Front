import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3001,
    proxy: {
      // Artifacts Service - material generation
      '/api/process': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        // No rewrite, backend expects /api/process
      },
      '/api/upload-images': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        // No rewrite, backend expects /api/upload-images
      },
      '/api/hitl': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        // No rewrite, backend expects /api/hitl
      },
      // Materials API - with rewrite (backend expects /materials/*)
      '/api/materials': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Threads API - session files (with rewrite, backend expects /threads/*)
      '/api/threads': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Users API - user sessions (with rewrite, backend expects /users/*)
      '/api/users': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Auth API - authorization (with rewrite, backend expects /auth/*)
      '/api/auth': {
        target: 'http://147.93.144.61:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // State API - processing status (with rewrite, backend expects /state/*)
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