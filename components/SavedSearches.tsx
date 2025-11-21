import React from 'react';
import TrashIcon from './icons/TrashIcon';

interface SavedSearchesProps {
  searches: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
  t: {
    title: string;
    empty: string;
  };
}

const SavedSearches: React.FC<SavedSearchesProps> = ({ searches, onSelect, onRemove, t }) => {
  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-6 animate-fade-in">
      <h3 className="text-brand-text-secondary text-sm font-semibold mb-3 uppercase tracking-wider">{t.title}</h3>
      <div className="flex flex-wrap gap-2">
        {searches.map((query, index) => (
          <div
            key={index}
            className="flex items-center bg-brand-secondary border border-gray-700 rounded-full ps-4 pe-2 py-1.5 hover:border-brand-accent transition-colors group"
          >
            <button
              onClick={() => onSelect(query)}
              className="text-sm text-brand-text hover:text-white truncate max-w-[200px]"
              title={query}
            >
              {query}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(query);
              }}
              className="ms-2 p-1 text-gray-500 hover:text-red-400 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Remove saved search"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedSearches;