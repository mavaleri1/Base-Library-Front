import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from './constants';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must contain at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format. Use ${ACCEPTED_IMAGE_TYPES.join(', ')}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
    };
  }

  return { valid: true };
}

export function validateQuestion(question: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = question.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Enter a question or topic',
    };
  }

  if (trimmed.length < 10) {
    return {
      valid: false,
      error: 'Question too short (minimum 10 characters)',
    };
  }

  if (trimmed.length > 5000) {
    return {
      valid: false,
      error: 'Question too long (maximum 5000 characters)',
    };
  }

  return { valid: true };
}

