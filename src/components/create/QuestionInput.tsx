import React from 'react';
import { Textarea } from '../ui';
import { HelpCircle } from 'lucide-react';

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({ value, onChange, error }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="text-primary" size={20} />
        <h3 className="text-lg font-semibold text-ink">Your question or topic</h3>
      </div>
      
      <Textarea 
        placeholder="For example: Explain RSA encryption"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        characterCount
        maxLength={5000}
        rows={6}
        className="resize-none placeholder:text-gray-400"
      />
      
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-muted">
          <strong className="text-ink">Tips:</strong>
        </p>
        <ul className="mt-2 space-y-1 text-sm text-muted list-disc list-inside">
          <li>Formulate your question clearly and specifically</li>
          <li>Specify context or knowledge level</li>
          <li>You can add several related questions</li>
          <li>Upload images of notes for more accurate material</li>
        </ul>
      </div>
    </div>
  );
};

