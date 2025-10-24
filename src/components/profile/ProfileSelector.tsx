import React from 'react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui';
import type { Profile } from '../../types';
import { CheckCircle, Sparkles } from 'lucide-react';

interface ProfileSelectorProps {
  profiles: Profile[];
  activeProfileId?: string | null;
  onApply: (profileId: string) => void;
  isApplying?: boolean;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  activeProfileId,
  onApply,
  isApplying = false,
}) => {
  const styleProfiles = profiles.filter((p) => p.category === 'style');
  const subjectProfiles = profiles.filter((p) => p.category === 'subject');

  const ProfileCard: React.FC<{ profile: Profile }> = ({ profile }) => {
    const isActive = activeProfileId === profile.id;

    return (
      <Card
        variant="bordered"
        className={`relative transition-all ${
          isActive ? 'border-primary bg-primary/5 shadow-md' : 'hover:border-primary/50'
        }`}
      >
        {isActive && (
          <div className="absolute top-2 right-2">
            <CheckCircle size={20} className="text-primary" />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            {profile.display_name}
          </CardTitle>
          {profile.description && (
            <CardDescription className="text-sm mt-1">
              {profile.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Button
            variant={isActive ? 'secondary' : 'primary'}
            size="sm"
            className="w-full"
            onClick={() => onApply(profile.id)}
            disabled={isActive || isApplying}
          >
            {isActive ? 'Applied' : 'Apply'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {styleProfiles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-ink mb-3">Learning Style</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {styleProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      )}

      {subjectProfiles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-ink mb-3">Subject Area</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      )}

      {profiles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted">No profiles found</p>
        </div>
      )}
    </div>
  );
};

