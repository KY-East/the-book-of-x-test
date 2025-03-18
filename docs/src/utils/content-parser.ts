import { Content, InteractiveElement } from '@/types/content';

interface ParsedContent {
  title: string;
  content: string;
  interactiveElements: InteractiveElement[];
  styles: string[];
  scripts: string[];
}

export const parseMarkdown = (content: string): ParsedContent => {
  const lines = content.split('\n');
  const result: ParsedContent = {
    title: '',
    content: '',
    interactiveElements: [],
    styles: [],
    scripts: []
  };

  let currentSection = '';
  let currentContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 解析标题
    if (line.startsWith('# ')) {
      result.title = line.replace('# ', '').trim();
      continue;
    }

    // 解析样式
    if (line.includes('<style>')) {
      currentSection = 'style';
      continue;
    }
    if (line.includes('</style>')) {
      currentSection = '';
      continue;
    }
    if (currentSection === 'style') {
      result.styles.push(line);
      continue;
    }

    // 解析脚本
    if (line.includes('<script>')) {
      currentSection = 'script';
      continue;
    }
    if (line.includes('</script>')) {
      currentSection = '';
      continue;
    }
    if (currentSection === 'script') {
      result.scripts.push(line);
      continue;
    }

    // 解析交互元素
    if (line.includes('class="dream-sequence"')) {
      const dreamContent = extractDreamSequence(lines, i);
      result.interactiveElements.push({
        id: `dream-${Date.now()}`,
        type: 'scene',
        data: dreamContent
      });
      i += dreamContent.lines.length;
      continue;
    }

    if (line.includes('class="pill-choice"')) {
      const pillContent = extractPillChoice(lines, i);
      result.interactiveElements.push({
        id: `pill-${Date.now()}`,
        type: 'choice',
        data: pillContent
      });
      i += pillContent.lines.length;
      continue;
    }

    // 普通内容
    if (!line.startsWith('---') && !line.startsWith('*')) {
      currentContent += line + '\n';
    }
  }

  result.content = currentContent.trim();
  return result;
};

const extractDreamSequence = (lines: string[], startIndex: number) => {
  const content = [];
  let i = startIndex;
  
  while (i < lines.length && !lines[i].includes('</div>')) {
    content.push(lines[i]);
    i++;
  }
  
  return {
    lines: content,
    content: content.join('\n')
  };
};

const extractPillChoice = (lines: string[], startIndex: number) => {
  const content = [];
  let i = startIndex;
  
  while (i < lines.length && !lines[i].includes('</div>')) {
    content.push(lines[i]);
    i++;
  }
  
  return {
    lines: content,
    content: content.join('\n')
  };
};

export const convertToContent = (parsed: ParsedContent): Content => {
  return {
    id: generateId(),
    type: 'fragment',
    title: {
      zh: parsed.title,
      en: parsed.title, // 需要翻译
      ko: parsed.title, // 需要翻译
      ja: parsed.title  // 需要翻译
    },
    content: {
      zh: parsed.content,
      en: parsed.content, // 需要翻译
      ko: parsed.content, // 需要翻译
      ja: parsed.content  // 需要翻译
    },
    metadata: {
      chapter: 1,
      fragment: 1,
      isHidden: false
    },
    media: {
      interactive: parsed.interactiveElements
    }
  };
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
}; 