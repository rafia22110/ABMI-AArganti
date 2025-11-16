import React from 'react';

interface LanguageSwitcherProps {
  currentLang: 'en' | 'he';
  setLang: (lang: 'en' | 'he') => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, setLang }) => {
  const inactiveClass = "text-brand-text-secondary hover:text-brand-text";
  const activeClass = "text-brand-text font-bold underline";

  return (
    <div className="flex items-center gap-2 bg-brand-secondary p-1 rounded-full">
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 text-sm transition-colors rounded-full ${currentLang === 'en' ? activeClass : inactiveClass}`}
        aria-pressed={currentLang === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => setLang('he')}
        className={`px-3 py-1 text-sm transition-colors rounded-full ${currentLang === 'he' ? activeClass : inactiveClass}`}
        aria-pressed={currentLang === 'he'}
      >
        HE
      </button>
    </div>
  );
};

export default LanguageSwitcher;
