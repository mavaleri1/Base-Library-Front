import React, { Suspense, lazy } from 'react';

// Lazy load the MarkdownViewer component
const MarkdownViewer = lazy(() => import('./MarkdownViewer').then(module => ({ default: module.MarkdownViewer })));

interface LazyMarkdownViewerProps {
  content: string;
  className?: string;
}

export const LazyMarkdownViewer: React.FC<LazyMarkdownViewerProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      </div>
    }>
      <MarkdownViewer {...props} />
    </Suspense>
  );
};
