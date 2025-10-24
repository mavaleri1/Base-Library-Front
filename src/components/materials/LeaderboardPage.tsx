import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui';
import { api } from '../../services/api';
import type { LeaderboardEntry } from '../../types';
import { Trophy, Medal, Award, Users, FileText, Image, AlertCircle } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    loadLeaderboard();
  }, [currentPage]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔄 Loading leaderboard data...');
      const response = await api.getLeaderboard(currentPage, 50);
      
      console.log('✅ Leaderboard data loaded:', response);
      setEntries(response.entries);
      setTotalEntries(response.total);
      setTotalPages(Math.ceil(response.total / 50));
    } catch (error) {
      console.error('❌ Failed to load leaderboard:', error);
      setError('Failed to load leaderboard data. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={20} />;
      case 2:
        return <Medal className="text-muted-foreground" size={20} />;
      case 3:
        return <Award className="text-amber-600" size={20} />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2 flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} />
            Leaderboard
          </h1>
          <p className="text-muted">
            User ranking by number of created materials and NFTs
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{totalEntries}</div>
            <div className="text-sm text-muted">Participants</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Loading leaderboard...</p>
          </div>
        </div>
      ) : error ? (
        <Card variant="bordered">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">
              Loading Error
            </h3>
            <p className="text-muted mb-6">{error}</p>
            <button
              onClick={loadLeaderboard}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      ) : entries.length === 0 ? (
        <Card variant="bordered">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-primary" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">
              Leaderboard is Empty
            </h3>
            <p className="text-muted">
              No participants in the leaderboard yet. Create the first material!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card variant="bordered">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Wallet</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">Materials</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">NFTs</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">Total Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {entries.map((entry) => (
                    <tr 
                      key={entry.rank} 
                      className={`hover:bg-muted transition-colors ${
                        entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-full w-fit ${getRankBadgeColor(entry.rank)}`}>
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users size={16} className="text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-ink">
                              {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="font-semibold text-ink">{entry.materialsCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Image size={16} className="text-purple-500" />
                          <span className="font-semibold text-ink">{entry.nftCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Trophy size={16} className="text-yellow-500" />
                          <span className="font-bold text-lg text-primary">{entry.totalScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-border rounded-lg text-muted hover:text-ink hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted text-muted'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="px-2 text-muted">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 rounded transition-colors ${
                    totalPages === currentPage
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted text-muted'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-border rounded-lg text-muted hover:text-ink hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-ink">
                  {entries.reduce((sum, entry) => sum + entry.materialsCount, 0)}
                </div>
                <div className="text-sm text-muted">Total Materials</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Image className="text-purple-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-ink">
                  {entries.reduce((sum, entry) => sum + entry.nftCount, 0)}
                </div>
                <div className="text-sm text-muted">Total NFTs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Trophy className="text-yellow-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-ink">
                  {entries.reduce((sum, entry) => sum + entry.totalScore, 0)}
                </div>
                <div className="text-sm text-muted">Total Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
