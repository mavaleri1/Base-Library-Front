import React from 'react';
import { Select } from '../ui';
import type { Placeholder, UserPlaceholderSetting } from '../../types';

interface PlaceholderSettingsProps {
  placeholders: Placeholder[];
  userSettings: { [key: string]: UserPlaceholderSetting };
  onChange: (placeholderId: string, valueId: string) => void;
}

export const PlaceholderSettings: React.FC<PlaceholderSettingsProps> = ({
  placeholders,
  userSettings,
  onChange,
}) => {
  const groupedPlaceholders = placeholders.reduce((acc, placeholder) => {
    const category = placeholder.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(placeholder);
    return acc;
  }, {} as Record<string, Placeholder[]>);

  const categoryNames: Record<string, string> = {
    role: 'Expert Role',
    subject: 'Subject Area',
    language: 'Language and Style',
    depth: 'Explanation Depth',
    format: 'Material Format',
    audience: 'Target Audience',
    other: 'Other Settings',
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedPlaceholders).map(([category, categoryPlaceholders]) => (
        <div key={category}>
          <h3 className="text-base font-semibold text-ink mb-3">
            {categoryNames[category] || category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryPlaceholders.map((placeholder) => {
              const currentSetting = userSettings[placeholder.name];
              const options = placeholder.values.map((v) => ({
                value: v.id,
                label: v.display_name,
                description: v.description,
              }));

              return (
                <div key={placeholder.id}>
                  <Select
                    label={placeholder.display_name}
                    options={options}
                    value={currentSetting?.value_id || ''}
                    onChange={(value) => onChange(placeholder.id, value)}
                  />
                  {placeholder.description && (
                    <p className="text-xs text-muted mt-1">{placeholder.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {placeholders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted">Settings not found</p>
        </div>
      )}
    </div>
  );
};

