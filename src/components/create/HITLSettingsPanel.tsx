import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Checkbox, Button } from '../ui';
import { Settings2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import type { HITLConfig } from '../../types';

interface HITLSettingsPanelProps {
  threadId: string | null;
  enabled: boolean;
}

export const HITLSettingsPanel: React.FC<HITLSettingsPanelProps> = ({
  threadId,
  enabled,
}) => {
  const [config, setConfig] = useState<HITLConfig>({
    edit_material: true,
    generating_questions: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-loading disabled as endpoint may not be implemented
  // useEffect(() => {
  //   if (threadId && enabled) {
  //     loadConfig();
  //   }
  // }, [threadId, enabled]);

  const loadConfig = async () => {
    if (!threadId) return;

    setIsLoading(true);
    setError('');
    try {
      const fetchedConfig = await api.getHITLConfig(threadId);
      setConfig(fetchedConfig);
    } catch (err: any) {
      // 404 means endpoint is not implemented - ignore
      if (err.status === 404) {
        console.warn('HITL config endpoint not implemented yet');
        return;
      }
      setError(err.message || 'Error loading HITL settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateNodeSetting = async (nodeName: string, nodeEnabled: boolean) => {
    if (!threadId) return;

    setIsLoading(true);
    setError('');
    try {
      const updatedConfig = await api.updateHITLNode(threadId, nodeName, nodeEnabled);
      setConfig(updatedConfig);
    } catch (err: any) {
      setError(err.message || 'Error updating setting');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAll = async (enableAll: boolean) => {
    if (!threadId) return;

    setIsLoading(true);
    setError('');
    try {
      const updatedConfig = await api.bulkUpdateHITL(threadId, enableAll);
      setConfig(updatedConfig);
    } catch (err: any) {
      setError(err.message || 'Error in bulk update');
    } finally {
      setIsLoading(false);
    }
  };

  if (!enabled) {
    return null;
  }

  return (
    <Card variant="bordered" className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="text-primary" size={20} />
            <CardTitle>Detailed HITL Settings</CardTitle>
          </div>
          {threadId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={loadConfig}
              disabled={isLoading}
              icon={<RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />}
            >
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!threadId ? (
          <div className="text-sm text-muted p-4 bg-surface-light rounded-lg border border-border">
            HITL settings will be available after creating a material
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 rounded-lg bg-error/10 text-error text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Checkbox
                label="Material Editing"
                description="Request feedback when editing synthesized material"
                checked={config.edit_material}
                onChange={(e) => updateNodeSetting('edit_material', e.target.checked)}
                disabled={isLoading}
              />

              <Checkbox
                label="Question Generation"
                description="Request confirmation for generated questions"
                checked={config.generating_questions}
                onChange={(e) => updateNodeSetting('generating_questions', e.target.checked)}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleToggleAll(true)}
                disabled={isLoading}
                className="flex-1"
              >
                Enable All
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleToggleAll(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Disable All
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

