import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import CategorySelector from './components/CategorySelector';
import SearchInput from './components/SearchInput';
import ResultsDisplay from './components/ResultsDisplay';
import SavedSearches from './components/SavedSearches';
import Loader from './components/Loader';
import { findDatasets } from './services/geminiService';
import type { Dataset, GroundingChunk } from './types';
import { translations } from './i18n/translations';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [datasets, setDatasets] = useState<Dataset[] | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'he'>('he');
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  // Load saved searches from localStorage on mount
  useEffect(() => {
    const storedSearches = localStorage.getItem('savedSearches');
    if (storedSearches) {
      try {
        setSavedSearches(JSON.parse(storedSearches));
      } catch (e) {
        console.error("Failed to parse saved searches", e);
      }
    }
  }, []);

  const t = translations[language];

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setDatasets(null);
    setSources([]);

    try {
      const result = await findDatasets(searchQuery, language);
      setDatasets(result.datasets);
      setSources(result.sources);
    } catch (e) {
      setError(t.error);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [language, t.error]);

  const handleSaveSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setSavedSearches(prev => {
      if (prev.includes(searchQuery)) return prev;
      const newSearches = [searchQuery, ...prev].slice(0, 10); // Limit to 10
      localStorage.setItem('savedSearches', JSON.stringify(newSearches));
      return newSearches;
    });
  };

  const handleRemoveSearch = (searchQuery: string) => {
    setSavedSearches(prev => {
      const newSearches = prev.filter(s => s !== searchQuery);
      localStorage.setItem('savedSearches', JSON.stringify(newSearches));
      return newSearches;
    });
  };

  const handleCategorySelect = (categoryQuery: string) => {
    setQuery(categoryQuery);
    handleSearch(categoryQuery);
  };

  return (
    <div className="bg-brand-primary min-h-screen text-brand-text font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col flex-grow">
        <Header 
          title={t.headerTitle} 
          language={language}
          setLanguage={setLanguage}
        />
        <main className="flex-grow flex flex-col">
          <p className="text-center text-brand-text-secondary mb-6 text-lg">
            {t.headerSubtitle}
          </p>
          <CategorySelector onSelect={handleCategorySelect} t={t.categories} />
          <SearchInput
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            onSave={handleSaveSearch}
            isLoading={isLoading}
            t={{
              placeholder: t.searchInputPlaceholder,
              button: t.searchButton,
              buttonLoading: t.searchButtonLoading,
              save: t.saveSearch,
            }}
          />
          
          <SavedSearches 
            searches={savedSearches} 
            onSelect={(q) => { setQuery(q); handleSearch(q); }} 
            onRemove={handleRemoveSearch}
            t={{
              title: t.savedSearchesTitle,
              empty: t.noSavedSearches
            }}
          />

          <div className="mt-8 flex-grow">
            {isLoading && <Loader />}
            {error && <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">{error}</div>}
            {datasets && <ResultsDisplay datasets={datasets} sources={sources} t={t.results} />}
            {!isLoading && !datasets && !error && (
               <div className="text-center text-brand-text-secondary pt-16">
                  <p className="text-2xl">{t.welcomeMessage}</p>
                  <p className="mt-2">{t.welcomeInstructions}</p>
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;