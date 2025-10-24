export const APP_NAME = 'Base Library';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CREATE: '/create',
  PROFILE: '/profile',
  THREADS: '/threads',
  THREAD_DETAIL: '/threads/:threadId',
  SESSION_DETAIL: '/threads/:threadId/sessions/:sessionId',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  MATERIALS: {
    PROCESS: '/process',
    UPLOAD_IMAGES: '/upload-images',
  },
  THREADS: {
    LIST: '/threads',
    DETAIL: '/threads/:threadId',
    SESSIONS: '/threads/:threadId/sessions',
    SESSION_FILES: '/threads/:threadId/sessions/:sessionId',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    PREFERENCES: '/profile/preferences',
  },
} as const;

export const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner', description: 'Simple explanation with examples' },
  { value: 'intermediate', label: 'Intermediate', description: 'Deeper understanding' },
  { value: 'advanced', label: 'Advanced', description: 'Academic level' },
] as const;

export const VOLUME_OPTIONS = [
  { value: 'brief', label: 'Brief', description: '1-2 pages' },
  { value: 'standard', label: 'Standard', description: '3-5 pages' },
  { value: 'detailed', label: 'Detailed', description: '5+ pages' },
] as const;

export const SUBJECT_OPTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Literature',
  'History',
  'Foreign Languages',
  'Philosophy',
  'Economics',
  'Other',
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_FILES = 10;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

