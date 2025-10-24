import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui';
import { FileUpload } from './FileUpload';
import { QuestionInput } from './QuestionInput';
import { SettingsPanel } from './SettingsPanel';
import { HITLInteractionModal } from './HITLInteractionModal';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useHITLPolling } from '../../hooks/useHITLPolling';
import { useAuth } from '../../hooks/useAuth';
import { validateQuestion } from '../../utils/validators';
import { api } from '../../services/api';
import type { MaterialSettings, ProcessingStatusWithHITL } from '../../types';
import { Loader2, Send, Clock } from 'lucide-react';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { files, errors: fileErrors, addFiles, removeFile, clearFiles } = useFileUpload();
  
  const [question, setQuestion] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [settings, setSettings] = useState<MaterialSettings>({
    difficulty: 'beginner',
    subject: 'Computer Science',
    volume: 'brief',
    enableHITL: false,
    enableEditing: false,
    enableGapQuestions: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [isHITLModalOpen, setIsHITLModalOpen] = useState(false);
  const [hitlMessages, setHitlMessages] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<string | undefined>();
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  const handleHITLInterrupt = useCallback((status: ProcessingStatusWithHITL) => {
    if (status.interrupt_message && status.interrupt_message.length > 0) {
      setHitlMessages(status.interrupt_message);
      setCurrentNode(status.current_node);
      setIsHITLModalOpen(true);
    }
  }, []);

  const handleComplete = useCallback((status: ProcessingStatusWithHITL) => {
    setIsSubmitting(false);
    clearFiles();
    
    if (status.sessionId) {
      navigate(`/threads/${status.threadId}/sessions/${status.sessionId}`);
    } else {
      navigate(`/threads/${status.threadId}`);
    }
  }, [navigate, clearFiles]);

  const handlePollingError = useCallback((error: Error) => {
    setSubmitError(error.message);
    setIsSubmitting(false);
  }, []);

  const { startPolling, stopPolling } = useHITLPolling({
    threadId: currentThreadId,
    enabled: false,
    interval: 3000,
    onInterrupt: handleHITLInterrupt,
    onComplete: handleComplete,
    onError: handlePollingError,
  });

  const handleSubmit = async () => {
    setQuestionError('');
    setSubmitError('');

    const validation = validateQuestion(question);
    if (!validation.valid) {
      setQuestionError(validation.error || 'Validation error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.createMaterial({
        question,
        images: files.map((f) => f.file),
        settings,
        wallet_address: user?.walletAddress,
      });

      setCurrentThreadId(result.threadId);

      if (result.interrupted && settings.enableHITL) {
        handleHITLInterrupt(result);
        startPolling();
      } else {
        handleComplete(result);
      }
    } catch (error: any) {
      setSubmitError(error.message || 'Error creating material');
      setIsSubmitting(false);
    }
  };

  const handleSendFeedback = async (feedback: string, images?: File[]) => {
    if (!currentThreadId) return;

    setIsSendingFeedback(true);
    try {
      console.log('📤 Sending feedback for thread:', currentThreadId, 'Message:', feedback, 'Images:', images?.length || 0);
      
      const result = await api.sendFeedback({
        thread_id: currentThreadId,
        message: feedback,
        question: question,
        wallet_address: user?.walletAddress,
        images: images,
      });

      console.log('✅ Feedback sent successfully:', result);

      setIsHITLModalOpen(false);
      setHitlMessages([]);

      if (result.interrupted) {
        handleHITLInterrupt(result);
      } else {
        startPolling();
      }
    } catch (error: any) {
      console.error('❌ Failed to send feedback:', error);
      throw new Error(error.message || 'Error sending feedback');
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const handleCloseModal = () => {
    setIsHITLModalOpen(false);
    stopPolling();
    setIsSubmitting(false);
    setCurrentThreadId(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">
            Create New Material
          </h1>
          <p className="text-muted">
            Enter your question, upload images and configure generation parameters
          </p>
        </div>

        {isSubmitting && currentThreadId && (
          <Card variant="elevated" className="border-primary">
            <CardContent className="flex items-center gap-4 py-4">
              <Loader2 className="animate-spin text-primary" size={24} />
              <div className="flex-1">
                <h3 className="font-medium text-ink">Processing material...</h3>
                <p className="text-sm text-muted mt-1">
                  {settings.enableHITL 
                    ? 'HITL enabled: you may be asked for feedback'
                    : 'Please wait, this may take several minutes'
                  }
                </p>
              </div>
              {currentNode && (
                <div className="text-sm text-muted flex items-center gap-2">
                  <Clock size={16} />
                  <span>Stage: {currentNode}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Main Information</CardTitle>
              <CardDescription>
                Describe the topic or question for which you need to create material
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionInput
                value={question}
                onChange={setQuestion}
                error={questionError}
              />
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Images (optional)</CardTitle>
              <CardDescription>
                Upload photos of handwritten notes or summaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                files={files}
                onAddFiles={addFiles}
                onRemoveFile={removeFile}
                maxFiles={10}
                errors={fileErrors}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <SettingsPanel settings={settings} onChange={setSettings} />

          {/* HITLSettingsPanel is temporarily disabled, until the endpoints are implemented on the backend */}
          {/* {settings.enableHITL && (
            <HITLSettingsPanel
              threadId={currentThreadId}
              enabled={settings.enableHITL}
            />
          )} */}

          <Card variant="elevated" className="sticky top-4">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-ink">Ready to start?</h4>
                <p className="text-sm text-muted">
                  The system will create educational material based on your question
                  {files.length > 0 && ' and uploaded images'}
                </p>
              </div>

              {submitError && (
                <div className="p-3 rounded-lg bg-error/10 text-error text-sm">
                  {submitError}
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting || !question.trim()}
                icon={isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              >
                {isSubmitting ? 'Creating...' : 'Create Material'}
              </Button>

              <p className="text-xs text-muted text-center">
                {settings.enableHITL 
                  ? 'With Dynamic Editing: the system will request your feedback'
                  : 'The process may take several minutes'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>

      <HITLInteractionModal
        isOpen={isHITLModalOpen}
        messages={hitlMessages}
        currentNode={currentNode}
        onClose={handleCloseModal}
        onSendFeedback={handleSendFeedback}
        isSubmitting={isSendingFeedback}
      />
    </>
  );
};

