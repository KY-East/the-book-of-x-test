import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cyberpunkTheme } from '@/themes/cyberpunk';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0a0a0c] text-[#e0e0e8]"
      style={{
        background: `linear-gradient(45deg, ${cyberpunkTheme.colors.background}, #1a1a1c)`
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-[#00ff9d] text-center mb-4">
            {t('common.title')}
          </h1>
          <nav className="flex justify-center space-x-4">
            <LanguageSelector />
          </nav>
        </header>
        
        <main className="prose prose-invert max-w-none">
          {children}
        </main>
      </div>
    </motion.div>
  );
};

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  
  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' },
    { code: 'ja', name: '日本語' }
  ];

  return (
    <div className="flex space-x-4">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-4 py-2 rounded ${
            i18n.language === lang.code
              ? 'bg-[#00ff9d] text-black'
              : 'bg-transparent border border-[#00ff9d] text-[#00ff9d]'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}; 