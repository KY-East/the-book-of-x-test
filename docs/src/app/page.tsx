'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadContent } from '../utils/content-loader';
import { Content } from '../types/content';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import '../i18n/config'; // 导入i18n配置

export default function Home() {
  const { t, i18n } = useTranslation();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('zh');

  // 简化内容ID列表，只加载几个用于测试
  const contentIds = [
    'recursive-trap-decoder',
    'neural-network-counterintelligence',
    'first-contact'
  ];

  useEffect(() => {
    // 切换i18n语言
    i18n.changeLanguage(language);
    
    const fetchContents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 模拟内容加载，避免实际请求可能的错误
        const mockContents: Content[] = contentIds.map(id => ({
          id,
          type: 'fragment',
          title: {
            zh: `测试标题 ${id}`,
            en: `Test Title ${id}`,
            ko: `테스트 제목 ${id}`,
            ja: `テストタイトル ${id}`
          },
          content: {
            zh: '测试内容',
            en: 'Test content',
            ko: '테스트 내용',
            ja: 'テストコンテンツ'
          },
          metadata: {
            chapter: contentIds.indexOf(id) + 1,
            fragment: 1,
            isHidden: false
          },
          media: {
            interactive: []
          }
        }));
        
        setContents(mockContents);
      } catch (err) {
        console.error('Failed to load content list:', err);
        setError('Unable to load content list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [language, i18n, contentIds]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  if (loading) {
    return <div className="loading">{t('loading')}</div>;
  }

  if (error) {
    return <div className="error">{t('error')}</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
        
        <div className="mb-4">
          <LanguageSwitcher 
            currentLanguage={language} 
            onLanguageChange={handleLanguageChange} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map(content => (
            <Link 
              key={content.id} 
              href={`/content/${content.id}?lang=${language}`}
              className="p-4 border rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h2 className="text-xl font-semibold">
                {content.title[language as keyof typeof content.title]}
              </h2>
              <p className="text-gray-600">
                {content.metadata.chapter === 0 ? t('preface') : 
                 content.metadata.chapter === -1 ? t('hidden') : 
                 t('chapter', { number: content.metadata.chapter })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 