import fs from 'fs';
import path from 'path';
import type { Content } from '@/types/content';
import { parseMarkdown, convertToContent } from './content-parser';

export interface MigrationConfig {
  sourceDir: string;
  targetDir: string;
  languages: string[];
}

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

// 使用示例
const config: MigrationConfig = {
  sourceDir: './docs',
  targetDir: './src/content',
  languages: ['zh', 'en', 'ko', 'ja']
};

// 运行迁移
migrateContent(config).catch(console.error); 