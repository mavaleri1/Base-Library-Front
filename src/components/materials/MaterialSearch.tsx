import React, { useState } from 'react';
import { Input } from '../ui';
import { Search, X } from 'lucide-react';

interface MaterialSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const MaterialSearch: React.FC<MaterialSearchProps> = ({ 
  onSearch, 
  placeholder = "Search materials..." 
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-10 placeholder:text-gray-400"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
