import React, { useState } from 'react';
import { Button, Card } from '../ui';
import { Textarea } from '../ui/Textarea';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { useFileUpload } from '../../hooks/useFileUpload';
import { LazyMarkdownViewer } from '../common/LazyMarkdownViewer';

interface HITLInteractionModalProps {
  isOpen: boolean;
  messages: string[];
  currentNode?: string;
  onClose: () => void;
  onSendFeedback: (feedback: string, images?: File[]) => Promise<void>;
  isSubmitting?: boolean;
}

// Use the lazy-loaded MarkdownViewer for better performance
const HITLMarkdownViewer: React.FC<{ content: string }> = ({ content }) => {
  return <LazyMarkdownViewer content={content} />;
};

export const HITLInteractionModal: React.FC<HITLInteractionModalProps> = ({
  isOpen,
  messages,
  currentNode,
  onClose,
  onSendFeedback,
  isSubmitting = false,
}) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const { files, errors: fileErrors, addFiles, removeFile, clearFiles } = useFileUpload(10);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      setError('Please enter your feedback');
      return;
    }

    try {
      setError('');
      const imageList = files.map(f => f.file);
      await onSendFeedback(feedback, imageList);
      setFeedback('');
      clearFiles();
    } catch (err: any) {
      console.error('❌ HITL feedback error:', err);
      
      // More detailed error handling
      let errorMessage = 'Error sending feedback';
      
      if (err.status === 422) {
        errorMessage = 'Incorrect data for sending. Check the entered text.';
      } else if (err.status === 400) {
        errorMessage = 'Incorrect request. Try again.';
      } else if (err.status === 500) {
        errorMessage = 'Internal server error. Try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  };

  const getNodeDisplayName = (nodeName?: string) => {
    const nodeNames: Record<string, string> = {
      'edit_material': 'Material editing',
      'generating_questions': 'Question generation',
      'recognition_handwritten': 'Handwritten notes recognition',
      'synthesis_material': 'Material synthesis',
    };
    return nodeName ? nodeNames[nodeName] || nodeName : 'Processing';
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card 
          variant="elevated" 
          className="max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                <AlertCircle className="text-primary" size={24} />
                Your participation is required
              </h2>
              {currentNode && (
                <p className="text-sm text-muted mt-1">
                  Current stage: {getNodeDisplayName(currentNode)}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-light rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="space-y-2">
                  {message.includes('http') || message.includes('**') ? (
                    <div className="prose prose-sm max-w-none">
                      <HITLMarkdownViewer content={message} />
                    </div>
                  ) : (
                    <div className="p-4 bg-surface-light rounded-lg border border-border">
                      <p className="text-ink whitespace-pre-wrap">{message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink">
                  Images (optional)
                </label>
                <p className="text-sm text-muted">
                  Upload photos of handwritten notes or summaries
                </p>
                <FileUpload
                  files={files}
                  onAddFiles={addFiles}
                  onRemoveFile={removeFile}
                  maxFiles={10}
                  errors={fileErrors}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink">
                  Your feedback or instructions
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="For example: 'Add more examples', 'Simplify the explanation', 'Approved', etc."
                  rows={4}
                  error={error}
                  disabled={isSubmitting}
                  className="w-full placeholder:text-gray-400"
                />
                {error && (
                  <p className="text-sm text-error flex items-center gap-1">
                    <AlertCircle size={14} />
                    {error}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                loading={isSubmitting}
                icon={isSubmitting ? undefined : <Send size={18} />}
                className="flex-1"
              >
                {isSubmitting ? 'Sending...' : 'Send feedback'}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setFeedback('Approved');
                  handleSubmit();
                }}
                disabled={isSubmitting}
                icon={<CheckCircle2 size={18} />}
              >
                Approve
              </Button>
            </div>

            <p className="text-xs text-muted text-center">
              The system will continue processing after receiving your feedback
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

