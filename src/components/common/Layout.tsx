import React from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted">
          <p>© 2025 Base Library. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

