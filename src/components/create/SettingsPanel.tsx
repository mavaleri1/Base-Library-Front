import React from 'react';
import { Checkbox, Card, CardHeader, CardTitle, CardContent } from '../ui';
import type { MaterialSettings } from '../../types';
import { Settings, User, BookOpen, Target, Brain, Layers } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUserPlaceholders } from '../../hooks/useUserPlaceholders';

interface SettingsPanelProps {
  settings: MaterialSettings;
  onChange: (settings: MaterialSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange }) => {
  const { user } = useAuth();
  const { placeholders, isLoading, error } = useUserPlaceholders(user?.id || null);

  const handleChange = <K extends keyof MaterialSettings>(
    key: K,
    value: MaterialSettings[K]
  ) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const getPlaceholderValue = (placeholderName: string) => {
    if (!placeholders?.placeholders) return null;
    return placeholders.placeholders[placeholderName]?.display_name || null;
  };

  // Check if user is new (has no profile settings)
  const isNewUser = !isLoading && !error && (!placeholders?.placeholders || Object.keys(placeholders.placeholders).length === 0);

  return (
    <Card variant="bordered">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="text-primary" size={20} />
          <CardTitle>Generation Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isNewUser ? (
          /* Show message for new users */
          <div className="text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <User className="text-primary" size={32} />
            </div>
            <h3 className="text-lg font-medium text-ink mb-2">Profile Setup Required</h3>
            <p className="text-sm text-muted-foreground">
              Please fill in the settings on the Profile tab
            </p>
          </div>
        ) : (
          <>
            {/* Current Profile Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="text-primary" size={16} />
                <h3 className="text-sm font-medium text-ink">Current Profile Settings</h3>
              </div>
              
              {isLoading ? (
                <div className="text-sm text-muted-foreground">Loading profile settings...</div>
              ) : error ? (
                <div className="text-sm text-destructive">Failed to load profile settings</div>
              ) : placeholders?.placeholders ? (
                <div className="grid grid-cols-1 gap-3">
                  {/* Expert Role */}
                  {getPlaceholderValue('expert_role') && (
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Brain className="text-primary" size={14} />
                        <span className="text-sm font-medium">Expert Role</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {getPlaceholderValue('expert_role')}
                      </span>
                    </div>
                  )}

                  {/* Subject Area */}
                  {getPlaceholderValue('subject_name') && (
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen className="text-primary" size={14} />
                        <span className="text-sm font-medium">Subject Area</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {getPlaceholderValue('subject_name')}
                      </span>
                    </div>
                  )}

                  {/* Target Audience */}
                  {getPlaceholderValue('target_audience_inline') && (
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target className="text-primary" size={14} />
                        <span className="text-sm font-medium">Target Audience</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {getPlaceholderValue('target_audience_inline')}
                      </span>
                    </div>
                  )}

                  {/* Writing Style */}
                  {getPlaceholderValue('style') && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="text-primary" size={14} />
                        <span className="text-sm font-medium">Writing Style</span>
                      </div>
                      <div className="text-sm text-muted-foreground break-words">
                        {getPlaceholderValue('style')}
                      </div>
                    </div>
                  )}

                  {/* Explanation Depth */}
                  {getPlaceholderValue('explanation_depth') && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="text-primary" size={14} />
                        <span className="text-sm font-medium">Explanation Depth</span>
                      </div>
                      <div className="text-sm text-muted-foreground break-words">
                        {getPlaceholderValue('explanation_depth')}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No profile settings found</div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border"></div>

            {/* Additional Options */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-ink">Additional Options</h4>

              <Checkbox
                label="Refinement Mode (beta)"
                description="Ability to edit and refine materials during the process"
                checked={settings.enableHITL}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  handleChange('enableHITL', newValue);
                  //
                  if (!newValue && settings.enableEditing) {
                    handleChange('enableEditing', false);
                  }
                }}
              />

              <Checkbox
                label="Interactive editing"
                description="Targeted edits to synthesized material"
                checked={settings.enableEditing}
                disabled={!settings.enableHITL}
                onChange={(e) => handleChange('enableEditing', e.target.checked)}
              />

              <Checkbox
                label="Generate additional questions"
                description="Gap analysis and creating questions to test knowledge"
                checked={settings.enableGapQuestions}
                onChange={(e) => handleChange('enableGapQuestions', e.target.checked)}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

