import React, { useRef } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { Button } from '../ui';
import { formatFileSize } from '../../utils/formatters';
import type { UploadedFile } from '../../hooks/useFileUpload';
import { cn } from '../../utils/cn';

interface FileUploadProps {
  files: UploadedFile[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  maxFiles: number;
  errors?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
  maxFiles,
  errors = [],
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAddFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      onAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-surface'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="text-primary" size={24} />
          </div>
          <div>
            <p className="text-ink font-medium mb-1">
              Drag images here or{' '}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-primary hover:text-primary-hover underline"
              >
                select files
              </button>
            </p>
            <p className="text-sm text-muted">
              PNG, JPG up to 10 MB (max {maxFiles} files)
            </p>
          </div>
          <p className="text-xs text-muted">
            {files.length} of {maxFiles} files uploaded
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-error">
              {error}
            </p>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative group rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
            >
              <div className="aspect-square bg-surface flex items-center justify-center">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileImage className="text-muted" size={32} />
                )}
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="danger"
                  size="sm"
                  icon={<X size={16} />}
                  onClick={() => onRemoveFile(file.id)}
                >
                  Remove
                </Button>
              </div>
              <div className="p-2 bg-white">
                <p className="text-xs text-ink truncate" title={file.file.name}>
                  {file.file.name}
                </p>
                <p className="text-xs text-muted">
                  {formatFileSize(file.file.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

