import React from 'react';
import BookmarkIcon from './icons/BookmarkIcon';

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (query: string) => void;
  onSave: (query: string) => void;
  isLoading: boolean;
  t: {
    placeholder: string;
    button: string;
    buttonLoading: string;
    save: string;
  };
}

const SearchInput: React.FC<SearchInputProps> = ({ query, setQuery, onSearch, onSave, isLoading, t }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-brand-secondary border border-gray-600 rounded-md py-3 ps-3 pe-12 focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
            disabled={isLoading}
            aria-label={t.placeholder}
          />
          <button
            type="button"
            onClick={() => onSave(query)}
            disabled={!query.trim() || isLoading}
            className="absolute end-2 top-1/2 transform -translate-y-1/2 text-brand-text-secondary hover:text-brand-accent disabled:opacity-50 disabled:hover:text-brand-text-secondary transition-colors p-1"
            title={t.save}
            aria-label={t.save}
          >
            <BookmarkIcon className="w-6 h-6" />
          </button>
        </div>
        <button
          type="submit"
          className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-6 rounded-md transition disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? t.buttonLoading : t.button}
        </button>
      </form>
    </div>
  );
};

export default SearchInput;