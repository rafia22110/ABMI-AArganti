import React from 'react';
import SparkIcon from './icons/SparkIcon';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  title: string;
  language: 'en' | 'he';
  setLanguage: (lang: 'en' | 'he') => void;
}

const Header: React.FC<HeaderProps> = ({ title, language, setLanguage }) => {
  return (
    <header className="text-center mb-8 relative">
      <div className="flex items-center justify-center gap-4 pt-4">
        <SparkIcon className="w-12 h-12 text-brand-accent" />
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          {title}
        </h1>
      </div>
       <div className="absolute top-0 right-0">
        <LanguageSwitcher currentLang={language} setLang={setLanguage} />
      </div>
    </header>
  );
};

export default Header;