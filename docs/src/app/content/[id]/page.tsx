import React from 'react';
import { Suspense } from 'react';
import ContentViewer from './ContentViewer';

interface ContentPageProps {
  params: {
    id: string;
  };
  searchParams: {
    lang?: string;
  };
}

export default function ContentPage({ params, searchParams }: ContentPageProps) {
  const { id } = params;
  const language = searchParams.lang || 'zh';

  return (
    <div className="content-page">
      <Suspense fallback={<div>Loading...</div>}>
        <ContentViewer contentId={id} language={language} />
      </Suspense>
    </div>
  );
} 