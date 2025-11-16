import React from 'react';

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
  t: {
    placeholder: string;
    button: string;
    buttonLoading: string;
  };
}

const SearchInput: React.FC<SearchInputProps> = ({ query, setQuery, onSearch, isLoading, t }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.placeholder}
        className="flex-grow bg-brand-secondary border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand-accent focus:outline-none transition w-full"
        disabled={isLoading}
        aria-label={t.placeholder}
      />
      <button
        type="submit"
        className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-6 rounded-md transition disabled:bg-gray-500 disabled:cursor-not-allowed"
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? t.buttonLoading : t.button}
      </button>
    </form>
  );
};

export default SearchInput;
