import React, { useEffect } from 'react';
import { Content, InteractiveElement } from '../types/content';

interface ContentRendererProps {
  content: Content;
  language: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content, language = 'zh' }) => {
  useEffect(() => {
    // Dynamically load styles
    const styleId = `style-${content.id}`;
    if (!document.getElementById(styleId) && content.media.interactive.length > 0) {
      fetch(`/src/content/styles/${content.id}.css`)
        .then(response => {
          if (response.ok) return response.text();
          return '';
        })
        .then(css => {
          if (css) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = css;
            document.head.appendChild(style);
          }
        })
        .catch(error => console.error('Failed to load styles:', error));
    }

    // Dynamically load scripts
    const scriptId = `script-${content.id}`;
    if (!document.getElementById(scriptId) && content.media.interactive.length > 0) {
      fetch(`/src/content/scripts/${content.id}.js`)
        .then(response => {
          if (response.ok) return response.text();
          return '';
        })
        .then(js => {
          if (js) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.textContent = js;
            document.body.appendChild(script);
          }
        })
        .catch(error => console.error('Failed to load scripts:', error));
    }

    return () => {
      // Clean up styles and scripts
      const style = document.getElementById(styleId);
      if (style) document.head.removeChild(style);
      
      const script = document.getElementById(scriptId);
      if (script) document.body.removeChild(script);
    };
  }, [content.id, content.media.interactive.length]);

  // Render interactive elements
  const renderInteractiveElement = (element: InteractiveElement) => {
    switch (element.type) {
      case 'scene':
        return (
          <div 
            key={element.id} 
            className="dream-sequence"
            dangerouslySetInnerHTML={{ __html: element.data.content }}
          />
        );
      case 'choice':
        return (
          <div 
            key={element.id} 
            className="pill-choice"
            dangerouslySetInnerHTML={{ __html: element.data.content }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="content-renderer">
      <h1>{content.title[language as keyof typeof content.title]}</h1>
      <div 
        className="content-body"
        dangerouslySetInnerHTML={{ 
          __html: content.content[language as keyof typeof content.content] 
        }}
      />
      
      {content.media.interactive.map(renderInteractiveElement)}
    </div>
  );
};

export default ContentRenderer; 