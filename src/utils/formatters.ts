export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${pluralize(minutes, 'minute', 'minutes', 'minutes')} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${pluralize(hours, 'hour', 'hours', 'hours')} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${pluralize(days, 'day', 'days', 'days')} ago`;
  } else {
    return formatDate(d);
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

export function pluralize(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return one;
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few;
  } else {
    return many;
  }
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) {
    return text;
  }
  return text.slice(0, length) + '...';
}

/**
 * Cleans special prefixes (@) from LangGraph artifact URLs
 * Example: @http://example.com → http://example.com
 */
export function cleanArtifactUrls(text: string): string {
  return text.replace(/@(https?:\/\/)/g, '$1');
}

/**
 * Cleans an array of messages from artifact prefixes
 */
export function cleanArtifactMessages(messages: string[]): string[] {
  return messages.map(msg => cleanArtifactUrls(msg));
}

/**
 * Converts backend file URL to correct frontend route
 * Example: http://127.0.0.1/thread/{id}/session/{sid}/file/material.md
 *        → /threads/{id}/sessions/{sid}?file=material.md
 */
export function convertBackendFileUrlToFrontendRoute(url: string): string {
  // Pattern: /thread/{thread_id}/session/{session_id}/file/{filename}
  const match = url.match(/\/thread\/([^/]+)\/session\/([^/]+)\/file\/(.+)/);
  
  if (match) {
    const [, threadId, sessionId, filename] = match;
    return `/threads/${threadId}/sessions/${sessionId}?file=${encodeURIComponent(filename)}`;
  }
  
  // If pattern doesn't match, return original URL
  return url;
}

