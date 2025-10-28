import React, { useState } from 'react';
import { Button, Card } from '../ui';
import { Textarea } from '../ui/Textarea';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { useFileUpload } from '../../hooks/useFileUpload';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as PrismStyles from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from '../../hooks/useTheme';
import { cleanArtifactUrls, convertBackendFileUrlToFrontendRoute } from '../../utils/formatters';

interface HITLInteractionModalProps {
  isOpen: boolean;
  messages: string[];
  currentNode?: string;
  onClose: () => void;
  onSendFeedback: (feedback: string, images?: File[]) => Promise<void>;
  isSubmitting?: boolean;
}

// Special component for displaying markdown in HITL mode
const HITLMarkdownViewer: React.FC<{ content: string }> = ({ content }) => {
    const { isDark  } = useTheme();
  const cleanedContent = cleanArtifactUrls(content);

  return (
    <div className="prose max-w-none space-y-8">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            
            if (!inline && match) {
              return (
                <SyntaxHighlighter
                    style={isDark  ? PrismStyles.oneDark : PrismStyles.oneLight}
  language="typescript"
                  PreTag="div"
                  customStyle={{
                    backgroundColor: isDark ? '#282c34' : '#fafafa',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    margin: '1rem 0'
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }

            return (
              <code 
                className="bg-surface border border-border px-1.5 py-0.5 rounded text-xs font-mono text-primary"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem', marginTop: '2rem' }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1.25rem', marginTop: '1.75rem' }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: '1.625rem', fontWeight: '600', marginBottom: '1rem', marginTop: '1.5rem' }}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 style={{ fontSize: '1.375rem', fontWeight: '600', marginBottom: '0.25rem', marginTop: '0.75rem' }}>
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-lg mb-2 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 pl-6 space-y-3 text-lg list-disc">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 pl-6 space-y-3 text-lg list-decimal">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="relative leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <div className="pl-6 my-8 border-l-4 border-primary">
              <div className="text-lg italic opacity-90">
                {children}
              </div>
            </div>
          ),
          a: ({ href, children }) => {
            // Clean URL from @ prefix before use
            const cleanedHref = href ? cleanArtifactUrls(href) : href;
            
            // Check if the link is internal (to a backend file)
            const isBackendFileUrl = cleanedHref?.includes('/thread/') && cleanedHref?.includes('/file/');
            
            // Check if the link is an incomplete session URL (without /file/)
            const isIncompleteSessionUrl = cleanedHref?.includes('/thread/') && 
                                         cleanedHref?.includes('/session/') && 
                                         !cleanedHref?.includes('/file/');
            
            if (isBackendFileUrl && cleanedHref) {
              // Convert backend URL to frontend route
              const frontendRoute = convertBackendFileUrlToFrontendRoute(cleanedHref);
              
              return (
                <a 
                  href={frontendRoute}
                  className="text-primary hover:brightness-110 underline underline-offset-2 transition-all duration-120 cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              );
            }
            
            if (isIncompleteSessionUrl && cleanedHref) {
              // Complete the incomplete session URL to full format with generated_material.md
              const completeUrl = `${cleanedHref}/file/generated_material.md`;
              const frontendRoute = convertBackendFileUrlToFrontendRoute(completeUrl);
              
              return (
                <a 
                  href={frontendRoute}
                  className="text-primary hover:brightness-110 underline underline-offset-2 transition-all duration-120 cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              );
            }
            
            // External links open in new tab
            return (
              <a 
                href={cleanedHref} 
                className="text-primary hover:brightness-110 underline underline-offset-2 transition-all duration-120"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto mb-8">
              <div className="bg-surface rounded-lg border border-border">
                <table className="w-full">
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface border-b border-border">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">
              {children}
            </tbody>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold" style={{ fontSize: '1.125rem' }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-base align-top" style={{ whiteSpace: 'pre-wrap' }}>
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-t border-border" />,
        }}
      >
        {cleanedContent}
      </ReactMarkdown>
    </div>
  );
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
                  placeholder="For example: 'Add more examples', 'Simplify the explanation', 'Skipped', etc."
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
                  setFeedback('Skip');
                  handleSubmit();
                }}
                disabled={isSubmitting}
                icon={<CheckCircle2 size={18} />}
              >
                Skit
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

