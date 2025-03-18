import fs from 'fs';
import path from 'path';

interface Content {
  id: string;
  type: 'fragment' | 'chapter';
  title: {
    zh: string;
    en: string;
    ko: string;
    ja: string;
  };
  content: {
    zh: string;
    en: string;
    ko: string;
    ja: string;
  };
  metadata: {
    chapter: number;
    fragment: number;
    isHidden: boolean;
  };
  media: {
    interactive: InteractiveElement[];
  };
}

interface InteractiveElement {
  id: string;
  type: 'scene' | 'choice';
  data: {
    lines: string[];
    content: string;
  };
}

interface ParsedContent {
  title: string;
  content: string;
  interactiveElements: InteractiveElement[];
  styles: string[];
  scripts: string[];
}

export interface MigrationConfig {
  sourceDir: string;
  targetDir: string;
  languages: string[];
}

const parseMarkdown = (content: string): ParsedContent => {
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

const convertToContent = (parsed: ParsedContent): Content => {
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

export const migrateContent = async (config: MigrationConfig): Promise<void> => {
  console.log('开始内容迁移...');
  console.log(`源目录: ${config.sourceDir}`);
  console.log(`目标目录: ${config.targetDir}`);

  // 确保目标目录存在
  if (!fs.existsSync(config.targetDir)) {
    fs.mkdirSync(config.targetDir, { recursive: true });
  }

  // 读取章节目录
  const chapters = fs.readdirSync(config.sourceDir)
    .filter(dir => fs.statSync(path.join(config.sourceDir, dir)).isDirectory())
    .filter(dir => !dir.startsWith('.'));

  for (const chapter of chapters) {
    console.log(`处理章节: ${chapter}`);
    const chapterPath = path.join(config.sourceDir, chapter);
    const files = fs.readdirSync(chapterPath)
      .filter(file => file.endsWith('.md'));

    for (const file of files) {
      console.log(`处理文件: ${file}`);
      const filePath = path.join(chapterPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // 解析内容
      const parsed = parseMarkdown(content);
      const contentObj = convertToContent(parsed);

      // 为每种语言保存 JSON 文件
      for (const lang of config.languages) {
        const langDir = path.join(config.targetDir, lang);
        if (!fs.existsSync(langDir)) {
          fs.mkdirSync(langDir, { recursive: true });
        }

        const outputPath = path.join(langDir, `${path.parse(file).name}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(contentObj, null, 2));
        console.log(`已保存: ${outputPath}`);
      }

      // 保存样式和脚本
      if (parsed.styles.length > 0) {
        const stylesDir = path.join(config.targetDir, 'styles');
        if (!fs.existsSync(stylesDir)) {
          fs.mkdirSync(stylesDir, { recursive: true });
        }
        fs.writeFileSync(
          path.join(stylesDir, `${path.parse(file).name}.css`),
          parsed.styles.join('\n')
        );
      }

      if (parsed.scripts.length > 0) {
        const scriptsDir = path.join(config.targetDir, 'scripts');
        if (!fs.existsSync(scriptsDir)) {
          fs.mkdirSync(scriptsDir, { recursive: true });
        }
        fs.writeFileSync(
          path.join(scriptsDir, `${path.parse(file).name}.js`),
          parsed.scripts.join('\n')
        );
      }
    }
  }

  console.log('内容迁移完成！');
}; 