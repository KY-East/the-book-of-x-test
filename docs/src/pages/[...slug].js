import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Layout from '../components/layout/Layout';

/**
 * 动态路由组件
 * 处理所有章节页面的渲染
 * 
 * 修改记录：
 * - 2024-03-19: 基于_nextjs_structure/pages/[...slug].js创建初始版本
 * - 2024-03-19: 使用Layout组件包装内容
 * - 2024-03-19: 配置从content/chapters目录读取内容
 * - 2024-03-19: 修复HTML内容渲染问题，配置marked允许HTML
 */
export default function ChapterPage({ content, frontMatter, slug }) {
  const router = useRouter();
  
  // 初始化特殊效果和交互
  useEffect(() => {
    // 如果是特定章节，初始化特殊效果
    if (slug && slug.length === 2) {
      const [chapter, section] = slug;
      
      // 量子涟漪事件(1.2)特殊效果
      if (chapter === 'chapter1' && section === 'quantum-ripple-events') {
        console.log('初始化量子涟漪事件特效');
        // 这里可以添加特殊效果的初始化代码
        
        // 例如: 动态显示终端界面的打字效果
        const terminalElements = document.querySelectorAll('.terminal-interface');
        if (terminalElements.length > 0) {
          terminalElements.forEach(el => {
            el.style.opacity = '0';
            setTimeout(() => {
              el.style.transition = 'opacity 1s ease-in-out';
              el.style.opacity = '1';
            }, 500);
          });
        }
      }
      
      // 第一次接触协议(1.3)特殊效果
      if (chapter === 'chapter1' && section === 'first-contact-protocol') {
        console.log('初始化第一次接触协议特效');
        // 初始化特殊效果
      }
    }
  }, [slug]);
  
  // 如果页面正在加载或内容不存在，显示加载状态
  if (router.isFallback || !content) {
    return (
      <Layout>
        <div>加载中...</div>
      </Layout>
    );
  }

  return (
    <Layout title={frontMatter.title} description={frontMatter.description}>
      <article 
        className={`chapter-content ${slug ? `chapter-${slug.join('-')}` : ''}`}
      >
        <h1 className="chapter-title">{frontMatter.title}</h1>
        
        {frontMatter.subtitle && (
          <h2 className="chapter-subtitle">{frontMatter.subtitle}</h2>
        )}

        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </Layout>
  );
}

// 获取路径匹配的内容文件
export async function getStaticProps({ params }) {
  // 从参数中拿到路径数组
  const { slug } = params;
  
  // 构建完整的Markdown文件路径
  const filePath = path.join(process.cwd(), 'content/chapters', ...slug) + '.md';
  
  try {
    // 读取Markdown文件内容
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // 解析front matter和正文内容
    const { data: frontMatter, content: markdownContent } = matter(fileContents);
    
    // 配置marked允许HTML内容
    marked.setOptions({
      headerIds: true,
      mangle: false,
      breaks: true,
      gfm: true,
      // 最重要的部分：允许HTML
      sanitize: false, // 不对HTML进行转义
      sanitizer: null, // 不使用sanitizer
      renderer: new marked.Renderer(),
      pedantic: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    });
    
    // 将Markdown转换为HTML
    const content = marked(markdownContent);

    return {
      props: {
        content,
        frontMatter: {
          ...frontMatter,
          title: frontMatter.title || slug[slug.length - 1],
        },
        slug: slug,
      },
      // 增量静态再生成
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error loading content:', error);
    
    // 如果文件不存在，提供一个默认内容
    return {
      props: {
        content: `<p>内容不存在或正在加载中...</p>`,
        frontMatter: {
          title: slug[slug.length - 1],
        },
        slug: slug,
      },
      revalidate: 60,
    };
  }
}

// 获取所有可能的路径
export async function getStaticPaths() {
  // 定义章节目录
  const chapterDirs = [
    'preface',
    'chapter1',
    'chapter2',
    'chapter3',
    'chapter4',
    'chapter5',
    'chapter6',
    'chapter7',
    'chapter8',
    'chapter9',
    'hidden'
  ];
  
  // 收集所有可能的路径
  const paths = [];
  
  // 遍历章节目录，收集所有Markdown文件
  for (const dir of chapterDirs) {
    const chapterPath = path.join(process.cwd(), 'content/chapters', dir);
    
    try {
      // 确认目录存在
      if (fs.existsSync(chapterPath)) {
        const files = fs.readdirSync(chapterPath);
        
        // 收集每个Markdown文件的路径
        for (const file of files) {
          if (file.endsWith('.md')) {
            const slug = [dir, file.replace('.md', '')];
            paths.push({ params: { slug } });
          }
        }
      }
    } catch (error) {
      console.error(`Error reading chapter directory ${dir}:`, error);
    }
  }
  
  return {
    paths,
    // 对于未预渲染的路径，显示404页面
    fallback: true,
  };
} 