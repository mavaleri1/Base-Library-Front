import React from 'react';
import { Select, Checkbox, Card, CardHeader, CardTitle, CardContent } from '../ui';
import { DIFFICULTY_OPTIONS, VOLUME_OPTIONS, SUBJECT_OPTIONS } from '../../utils/constants';
import type { MaterialSettings } from '../../types';
import { Settings } from 'lucide-react';

interface SettingsPanelProps {
  settings: MaterialSettings;
  onChange: (settings: MaterialSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange }) => {
  const handleChange = <K extends keyof MaterialSettings>(
    key: K,
    value: MaterialSettings[K]
  ) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <Card variant="bordered">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="text-primary" size={20} />
          <CardTitle>Generation Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          label="Difficulty Level"
          options={DIFFICULTY_OPTIONS}
          value={settings.difficulty}
          onChange={(value) => handleChange('difficulty', value as MaterialSettings['difficulty'])}
          hint={
            DIFFICULTY_OPTIONS.find((opt) => opt.value === settings.difficulty)?.description
          }
        />

        <Select
          label="Subject Area"
          options={SUBJECT_OPTIONS.map((subject) => ({
            value: subject,
            label: subject,
          }))}
          value={settings.subject}
          onChange={(value) => handleChange('subject', value)}
        />

        <Select
          label="Material Volume"
          options={VOLUME_OPTIONS}
          value={settings.volume}
          onChange={(value) => handleChange('volume', value as MaterialSettings['volume'])}
          hint={VOLUME_OPTIONS.find((opt) => opt.value === settings.volume)?.description}
        />

        <div className="border-t border-border pt-4 space-y-3">
          <h4 className="text-sm font-medium text-ink">Additional Options</h4>

          <Checkbox
            //#label="Human-in-the-Loop (HITL)"
            label="Refinement Mode"
            description="Ability to edit and refine materials during the process"
            checked={settings.enableHITL}
            onChange={(e) => handleChange('enableHITL', e.target.checked)}
          />

          <Checkbox
            label="Interactive editing"
            description="Targeted edits to synthesized material"
            checked={settings.enableEditing}
            onChange={(e) => handleChange('enableEditing', e.target.checked)}
          />

          <Checkbox
            label="Generate additional questions"
            description="Gap analysis and creating questions to test knowledge"
            checked={settings.enableGapQuestions}
            onChange={(e) => handleChange('enableGapQuestions', e.target.checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

