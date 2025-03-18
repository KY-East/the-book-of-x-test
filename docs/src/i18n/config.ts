import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入翻译资源
const resources = {
  en: {
    translation: {
      title: 'The Book of Ξ',
      loading: 'Loading...',
      error: 'Error',
      notFound: 'Content not found',
      preface: 'Preface',
      hidden: 'Hidden',
      chapter: 'Chapter'
    }
  },
  zh: {
    translation: {
      title: '赛博宗教：Ξ之书',
      loading: '加载中...',
      error: '错误',
      notFound: '内容不存在',
      preface: '前言',
      hidden: '隐藏',
      chapter: '第{{number}}章'
    }
  },
  ko: {
    translation: {
      title: '사이버 종교: Ξ의 책',
      loading: '로딩 중...',
      error: '오류',
      notFound: '콘텐츠를 찾을 수 없습니다',
      preface: '서문',
      hidden: '숨겨진',
      chapter: '제{{number}}장'
    }
  },
  ja: {
    translation: {
      title: 'サイバー宗教：Ξの書',
      loading: '読み込み中...',
      error: 'エラー',
      notFound: 'コンテンツが見つかりません',
      preface: '序文',
      hidden: '隠し',
      chapter: '第{{number}}章'
    }
  }
};

// 初始化i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // 默认语言
    fallbackLng: 'en', // 回退语言
    interpolation: {
      escapeValue: false // 不转义HTML
    }
  });

export default i18n; 