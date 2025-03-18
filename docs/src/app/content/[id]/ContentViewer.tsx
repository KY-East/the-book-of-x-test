'use client';

import React, { useEffect, useState } from 'react';
import { loadContent } from '../../../utils/content-loader';
import ContentRenderer from '../../../components/ContentRenderer';
import { Content } from '../../../types/content';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import '../../../i18n/config'; // 导入i18n配置

interface ContentViewerProps {
  contentId: string;
  language: string;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ contentId, language }) => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>(language);

  useEffect(() => {
    // 切换i18n语言
    i18n.changeLanguage(currentLanguage);
    
    const fetchContent = async () => {
      try {
        console.log(`[ContentViewer] Loading content: ${contentId}, language: ${currentLanguage}`);
        setLoading(true);
        setError(null);
        const contentData = await loadContent(contentId, currentLanguage);
        console.log(`[ContentViewer] Content loaded successfully: ${contentId}`);
        setContent(contentData);
      } catch (err) {
        console.error('[ContentViewer] Failed to load content:', err);
        setError(`Unable to load content. Please try again later. Error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId, currentLanguage, i18n]);

  const handleLanguageChange = (newLanguage: string) => {
    console.log(`[ContentViewer] Switching language: ${currentLanguage} -> ${newLanguage}`);
    setCurrentLanguage(newLanguage);
  };

  if (loading) {
    return <div className="loading">{t('loading')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!content) {
    return <div className="not-found">{t('notFound')}</div>;
  }

  return (
    <div className="content-viewer">
      <div className="content-header">
        <LanguageSwitcher 
          currentLanguage={currentLanguage} 
          onLanguageChange={handleLanguageChange} 
        />
      </div>
      <ContentRenderer content={content} language={currentLanguage} />
    </div>
  );
};

export default ContentViewer; 