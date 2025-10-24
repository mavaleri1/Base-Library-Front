import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';


import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as PrismStyles from 'react-syntax-highlighter/dist/cjs/styles/prism';


import { useTheme } from "../../hooks/useTheme";
import { cleanArtifactUrls, convertBackendFileUrlToFrontendRoute } from '../../utils/formatters';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
  content, 
  className = '' 
}) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  // Additional cleaning of URL from artifact prefixes (@)
  const cleanedContent = cleanArtifactUrls(content);

  return (
    <div className={`prose max-w-none space-y-8 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');

            if (!inline && match) {
              return (
                <SyntaxHighlighter
                style={isDark ? PrismStyles.oneDark : PrismStyles.oneLight}
                language={match[1]}
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
            // Cleaning URL from the @ prefix before using
            const cleanedHref = href ? cleanArtifactUrls(href) : href;
            
            // Check if the link is internal (on a file from the backend)
            const isBackendFileUrl = cleanedHref?.includes('/thread/') && cleanedHref?.includes('/file/');
            
            if (isBackendFileUrl && cleanedHref) {
              // Convert the backend URL to the frontend route
              const frontendRoute = convertBackendFileUrlToFrontendRoute(cleanedHref);
              
              return (
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(frontendRoute);
                  }}
                  className="text-primary hover:brightness-110 underline underline-offset-2 transition-all duration-120 cursor-pointer"
                >
                  {children}
                </a>
              );
            }
            
            // External links open in a new tab
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


