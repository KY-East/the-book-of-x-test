const fs = require('fs');
const path = require('path');

// 配置
const sourceDir = path.resolve(__dirname, '../../docs');
const targetDir = path.resolve(__dirname, '../src/content');
const languages = ['zh', 'en', 'ko', 'ja'];

console.log('开始内容迁移...');
console.log('源目录：', sourceDir);
console.log('目标目录：', targetDir);

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 解析 Markdown
function parseMarkdown(content) {
  const lines = content.split('\n');
  const result = {
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
      const dreamContent = extractElement(lines, i, '</div>');
      result.interactiveElements.push({
        id: `dream-${Date.now()}`,
        type: 'scene',
        data: dreamContent
      });
      i += dreamContent.lines.length;
      continue;
    }

    if (line.includes('class="pill-choice"')) {
      const pillContent = extractElement(lines, i, '</div>');
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
}

function extractElement(lines, startIndex, endTag) {
  const content = [];
  let i = startIndex;
  
  while (i < lines.length && !lines[i].includes(endTag)) {
    content.push(lines[i]);
    i++;
  }
  
  return {
    lines: content,
    content: content.join('\n')
  };
}

function convertToContent(parsed) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: 'fragment',
    title: {
      zh: parsed.title,
      en: parsed.title,
      ko: parsed.title,
      ja: parsed.title
    },
    content: {
      zh: parsed.content,
      en: parsed.content,
      ko: parsed.content,
      ja: parsed.content
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
}

// 读取章节目录
const chapters = fs.readdirSync(sourceDir)
  .filter(dir => fs.statSync(path.join(sourceDir, dir)).isDirectory())
  .filter(dir => !dir.startsWith('.'));

console.log('找到章节：', chapters);

// 处理每个章节
for (const chapter of chapters) {
  console.log(`处理章节: ${chapter}`);
  const chapterPath = path.join(sourceDir, chapter);
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
    for (const lang of languages) {
      const langDir = path.join(targetDir, lang);
      if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
      }

      const outputPath = path.join(langDir, `${path.parse(file).name}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(contentObj, null, 2));
      console.log(`已保存: ${outputPath}`);
    }

    // 保存样式和脚本
    if (parsed.styles.length > 0) {
      const stylesDir = path.join(targetDir, 'styles');
      if (!fs.existsSync(stylesDir)) {
        fs.mkdirSync(stylesDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(stylesDir, `${path.parse(file).name}.css`),
        parsed.styles.join('\n')
      );
    }

    if (parsed.scripts.length > 0) {
      const scriptsDir = path.join(targetDir, 'scripts');
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