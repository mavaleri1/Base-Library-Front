import { useState, useCallback } from 'react';
import { validateFile } from '../utils/validators';
import { MAX_FILES } from '../utils/constants';

export interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

export function useFileUpload(maxFiles: number = MAX_FILES) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    const currentCount = files.length;
    const availableSlots = maxFiles - currentCount;

    if (availableSlots <= 0) {
      setErrors([`Maximum ${maxFiles} files`]);
      return;
    }

    const filesToAdd = newFiles.slice(0, availableSlots);
    const newErrors: string[] = [];
    const validFiles: UploadedFile[] = [];

    filesToAdd.forEach((file) => {
      const validation = validateFile(file);
      if (!validation.valid) {
        newErrors.push(validation.error || 'Error: file error');
      } else {
        validFiles.push({
          file,
          preview: URL.createObjectURL(file),
          id: `${file.name}-${Date.now()}-${Math.random()}`,
        });
      }
    });

    setFiles((prev) => [...prev, ...validFiles]);
    setErrors(newErrors);
  }, [files.length, maxFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach((file) => {
      URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setErrors([]);
  }, [files]);

  return {
    files,
    errors,
    addFiles,
    removeFile,
    clearFiles,
  };
}

