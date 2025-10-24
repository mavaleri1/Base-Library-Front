import React, { useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import type { Placeholder, UserPlaceholderSettings, Profile } from '../../types';
import { User, Settings, RotateCcw, Sparkles, Wallet } from 'lucide-react';
import { ProfileSelector } from './ProfileSelector';
import { PlaceholderSettings } from './PlaceholderSettings';
import { Web3WalletButton } from '../auth/Web3WalletButton';


export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [userSettings, setUserSettings] = useState<UserPlaceholderSettings | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isApplyingProfile, setIsApplyingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [pendingChanges, setPendingChanges] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    console.log('👤 ProfilePage - Current user:', user);
    console.log('👤 User wallet address:', user?.walletAddress);
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const [placeholdersData, settingsData, profilesData] = await Promise.all([
        api.getAllPlaceholders(),
        api.getUserPlaceholders(user.id),
        api.getProfiles(),
      ]);
      
      setPlaceholders(placeholdersData);
      setUserSettings(settingsData);
      setProfiles(profilesData);
      setPendingChanges(new Map());
    } catch (error) {
      console.error('Failed to load profile data:', error);
      setSaveMessage('Error loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceholderChange = (placeholderId: string, valueId: string) => {
    const newChanges = new Map(pendingChanges);
    newChanges.set(placeholderId, valueId);
    setPendingChanges(newChanges);
  };

  const handleSaveChanges = async () => {
    if (!user?.id || pendingChanges.size === 0) return;

    setIsSaving(true);
    setSaveMessage('');
    try {
      await Promise.all(
        Array.from(pendingChanges.entries()).map(([placeholderId, valueId]) =>
          api.updateUserPlaceholder(user.id, placeholderId, valueId)
        )
      );

      const updatedSettings = await api.getUserPlaceholders(user.id);
      setUserSettings(updatedSettings);
      setPendingChanges(new Map());
      setSaveMessage('Settings saved successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyProfile = async (profileId: string) => {
    if (!user?.id) return;

    setIsApplyingProfile(true);
    setSaveMessage('');
    try {
      const updatedSettings = await api.applyProfile(user.id, profileId);
      setUserSettings(updatedSettings);
      setPendingChanges(new Map());
      setSaveMessage(`Profile "${updatedSettings.active_profile_name}" applied`);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to apply profile:', error);
      setSaveMessage('Error applying profile');
    } finally {
      setIsApplyingProfile(false);
    }
  };

  const handleReset = async () => {
    if (!user?.id) return;
    if (!confirm('Are you sure you want to reset all settings to default values?')) {
      return;
    }

    setIsResetting(true);
    setSaveMessage('');
    try {
      const updatedSettings = await api.resetUserSettings(user.id);
      setUserSettings(updatedSettings);
      setPendingChanges(new Map());
      setSaveMessage('Settings reset to default values');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to reset settings:', error);
      setSaveMessage('Error resetting settings');
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading || !userSettings) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-ink mb-2">User Profile</h1>
        <p className="text-muted">Configure the system to your preferences</p>
      </div>

      {/* User Info */}
      <Card variant="bordered">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="text-primary" size={20} />
            <CardTitle>User Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <Wallet size={20} className="text-primary" />
              <div className="flex-1">
                <Web3WalletButton align="left" />
              </div>
            </div>
            {user?.createdAt && (
              <div className="text-sm text-muted">
                Registration Date: {new Date(user.createdAt).toLocaleDateString('en-US')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup - Profiles */}
      <Card variant="bordered">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              <CardTitle>Quick Setup</CardTitle>
            </div>
            {userSettings.active_profile_name && (
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                Active: {userSettings.active_profile_name}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted mb-4">
            Apply a ready-made profile for quick setup of all parameters
          </p>
          <ProfileSelector
            profiles={profiles}
            activeProfileId={userSettings.active_profile_id}
            onApply={handleApplyProfile}
            isApplying={isApplyingProfile}
          />
        </CardContent>
      </Card>

      {/* Manual Settings */}
      <Card variant="bordered">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="text-primary" size={20} />
            <CardTitle>Detailed Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted mb-4">
            Configure each parameter individually
          </p>
          <PlaceholderSettings
            placeholders={placeholders}
            userSettings={userSettings.placeholders}
            onChange={handlePlaceholderChange}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between sticky bottom-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
        <div className="flex items-center gap-3">
          {saveMessage && (
            <p
              className={`text-sm font-medium ${
                saveMessage.includes('successfully') || saveMessage.includes('applied') || saveMessage.includes('reset')
                  ? 'text-success'
                  : 'text-error'
              }`}
            >
              {saveMessage}
            </p>
          )}
          {pendingChanges.size > 0 && (
            <span className="text-sm text-muted">
              {pendingChanges.size} change{pendingChanges.size === 1 ? '' : 's'}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<RotateCcw size={18} />}
            onClick={handleReset}
            disabled={isResetting || isSaving}
            loading={isResetting}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSaveChanges}
            disabled={pendingChanges.size === 0 || isSaving}
            loading={isSaving}
          >
            {pendingChanges.size > 0 ? `Save (${pendingChanges.size})` : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};
