import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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