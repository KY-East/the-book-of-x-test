const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// GitHub Pages路径前缀
const GITHUB_PREFIX = '/the-book-of-x-test';

// 需要修复的文件路径模式
const pathPatterns = [
  // quick-fix.js相对路径
  {
    pattern: /<script src="\.\.\/quick-fix\.js"><\/script>/g,
    replacement: `<script src="${GITHUB_PREFIX}/public/quick-fix.js"></script>`
  },
  // sidebar.js相对路径
  {
    pattern: /<script src="\.\.\/sidebar\.js"><\/script>/g,
    replacement: `<script src="${GITHUB_PREFIX}/public/sidebar.js"></script>`
  },
  // 两级目录sidebar.js相对路径
  {
    pattern: /<script src="\.\.\/\.\.\/sidebar\.js"><\/script>/g,
    replacement: `<script src="${GITHUB_PREFIX}/public/sidebar.js"></script>`
  },
  // 相对路径图片引用
  {
    pattern: /src="\.\.\/\.\.\/assets\/images\//g,
    replacement: `src="${GITHUB_PREFIX}/assets/images/`
  }
];

// 递归遍历目录
async function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      // 排除某些目录
      if (!file.startsWith('_') && !file.startsWith('.') && file !== 'node_modules') {
        await traverseDirectory(fullPath);
      }
    } else if (stats.isFile() && (file.endsWith('.html') || file.endsWith('.htm'))) {
      await processFile(fullPath);
    }
  }
}

// 处理单个文件
async function processFile(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    let modified = false;
    
    // 应用所有路径模式替换
    for (const { pattern, replacement } of pathPatterns) {
      const originalContent = content;
      content = content.replace(pattern, replacement);
      
      if (originalContent !== content) {
        modified = true;
      }
    }
    
    // 如果文件内容已修改，则写入文件
    if (modified) {
      await writeFile(filePath, content, 'utf8');
      console.log(`已修复: ${filePath}`);
    }
  } catch (err) {
    console.error(`处理文件 ${filePath} 时出错:`, err);
  }
}

// 主函数
async function main() {
  const rootDir = path.resolve(__dirname, 'public');
  console.log(`开始处理目录: ${rootDir}`);
  await traverseDirectory(rootDir);
  console.log('所有路径修复完成!');
}

main().catch(console.error); 