import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui';
import { Home, Plus, FileText, User, LogOut, Menu, X, Trophy } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { Web3WalletButton } from '../auth/Web3WalletButton';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { address, isConnected } = useAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { path: '/create', label: 'Create', icon: <Plus size={18} /> },
    { path: '/threads', label: 'Materials', icon: <FileText size={18} /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
    { path: '/profile', label: 'Profile', icon: <User size={18} /> },
    //{ path: '/debug/materials', label: 'Debug', icon: <Bug size={18} /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">LF</span>
            </div>
            <span className="font-bold text-ink text-lg">Base Library</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'primary' : 'ghost'}
                  size="sm"
                  icon={item.icon}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {user.authMethod === 'web3' && user.walletAddress && isConnected && address ? (
                  <Wallet>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6" />
                      <div>
                <Web3WalletButton />
              </div>
                    </div>
                  </Wallet>
                ) : (
                  <div className="text-right">
                    <p className="text-sm font-medium text-ink">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-right">
                <p className="text-sm font-medium text-ink">Not authorized</p>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              icon={<LogOut size={16} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-border">
              {user ? (
                user.authMethod === 'web3' && user.walletAddress && isConnected && address ? (
                  <Wallet>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8" />
                      <div>
                        <Name />
                        <p className="text-xs text-muted">
                          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </Wallet>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-ink">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </div>
                )
              ) : (
                <div>
                  <p className="text-sm font-medium text-ink">Not authorized</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      location.pathname === item.path
                        ? 'bg-primary text-white'
                        : 'text-ink hover:bg-surface'
                    )}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink hover:bg-surface transition-colors"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

