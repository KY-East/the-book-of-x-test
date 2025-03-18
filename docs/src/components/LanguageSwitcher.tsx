import React from 'react';
import { getSupportedLanguages, getLanguageName } from '../utils/content-loader';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  currentLanguage, 
  onLanguageChange 
}) => {
  const languages = getSupportedLanguages();

  return (
    <div className="language-switcher">
      <select 
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="language-select"
      >
        {languages.map(lang => (
          <option key={lang} value={lang}>
            {getLanguageName(lang)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher; 