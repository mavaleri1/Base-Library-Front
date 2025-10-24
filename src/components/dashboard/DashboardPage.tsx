import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import type { SessionSummary } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';
import { BookOpen, Plus, FileText, Clock, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadSessions();
    }
  }, [user?.id]);

  const loadSessions = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await api.getRecentSessions(user.id, 5);
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-muted">
            Create educational materials with AI
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={<Plus size={20} />}
          onClick={() => navigate('/create')}
        >
          Create material
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="bordered">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{sessions.length}</p>
              <p className="text-sm text-muted">Total materials</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <BookOpen className="text-secondary" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{sessions.length}</p>
              <p className="text-sm text-muted">Processing sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="text-success" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">
                {sessions.filter(s => s.has_synthesized).length}
              </p>
              <p className="text-sm text-muted">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Materials */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-ink">Last materials</h2>
          <Link to="/threads">
            <Button variant="ghost">View all</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
              <p className="text-muted">Loading materials...</p>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <Card variant="bordered">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="text-primary" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">
                No materials yet
              </h3>
              <p className="text-muted mb-6">
                Create your first educational material
              </p>
              <Button
                variant="primary"
                icon={<Plus size={18} />}
                onClick={() => navigate('/create')}
              >
                Create first material
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sessions.map((session) => (
              <Card
                key={session.session_id}
                variant="bordered"
                className="hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/threads/${session.thread_id}`)}
              >
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="text-primary" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-ink mb-1">
                        {session.display_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatRelativeTime(session.created_at)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          session.has_synthesized
                            ? 'bg-success/10 text-success'
                            : 'bg-muted/10 text-muted'
                        }`}>
                          {session.has_synthesized ? 'completed' : 'pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card variant="bordered" className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>
            Manage your materials and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => navigate('/create')}
            >
              <div className="text-left">
                <p className="font-semibold">New material</p>
                <p className="text-sm text-muted">Create educational content</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => navigate('/threads')}
            >
              <div className="text-left">
                <p className="font-semibold">All materials</p>
                <p className="text-sm text-muted">View all materials</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto py-4"
              onClick={() => navigate('/profile')}
            >
              <div className="text-left">
                <p className="font-semibold">Settings</p>
                <p className="text-sm text-muted">Personal preferences</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

