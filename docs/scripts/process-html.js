/**
 * HTML文件路径处理工具
 * 用于自动修复HTML文件中的资源路径，适配不同的部署环境
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 获取部署目标
const isGitHubPages = process.env.DEPLOY_TARGET === 'github';
const basePath = isGitHubPages ? '/the-book-of-x-test/' : '/';

console.log(`当前部署目标: ${isGitHubPages ? 'GitHub Pages' : '本地开发'}`);
console.log(`基础路径: ${basePath}`);

// 路径替换规则
const pathMappings = {
  // 绝对路径替换为带基础路径的版本
  'src="/scripts/': `src="${basePath}scripts/`,
  'href="/scripts/': `href="${basePath}scripts/`,
  'src="/styles/': `src="${basePath}styles/`,
  'href="/styles/': `href="${basePath}styles/`,
  'src="/assets/': `src="${basePath}assets/`,
  'href="/assets/': `href="${basePath}assets/`,
  'src="/music/': `src="${basePath}music/`,
  'href="/music/': `href="${basePath}music/`,
  'src="/': `src="${basePath}`,
  'href="/': `href="${basePath}`,
  
  // 处理import语句
  'import ': 'import ',
  'from "/scripts/': `from "${basePath}scripts/`,
  'from "/': `from "${basePath}`,
  
  // 特殊处理xi-visual-effects.js路径
  'src="/scripts/xi-visual-effects.js': `src="${basePath}scripts/xi-visual-effects.js`,
};

// 正则表达式for路径检测
const srcHrefRegex = /(src|href|from)=["']\/([^"']*?)["']/g;

// 待处理的HTML文件
function processHtmlFiles() {
  console.log('开始处理HTML文件...');
  const files = glob.sync('public/**/*.html');
  
  files.forEach(file => {
    console.log(`处理文件: ${file}`);
    let content = fs.readFileSync(file, 'utf8');
    let modifiedContent = content;
    
    // 替换所有匹配的路径
    modifiedContent = modifiedContent.replace(srcHrefRegex, function(match, attr, path) {
      return `${attr}="${basePath}${path}"`;
    });
    
    // 检查是否有变更
    if (content !== modifiedContent) {
      fs.writeFileSync(file, modifiedContent);
      console.log(`  ✓ 已修复路径`);
    } else {
      console.log(`  - 无需修改`);
    }
  });
  
  console.log('HTML文件处理完成!');
}

// 处理JavaScript文件
function processJsFiles() {
  console.log('\n开始处理JavaScript文件...');
  const files = glob.sync('public/scripts/**/*.js');
  
  files.forEach(file => {
    console.log(`处理文件: ${file}`);
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    // 替换JS中的资源路径引用
    const importRegex = /import\s+.*?\s+from\s+["']\/([^"']+)["']/g;
    content = content.replace(importRegex, function(match, path) {
      return match.replace(`"/${path}"`, `"${basePath}${path}"`);
    });
    
    // 替换资源URL字符串
    const urlRegex = /["']\/(?:scripts|assets|styles|music)\/([^"']+)["']/g;
    content = content.replace(urlRegex, function(match, path) {
      return match.replace(/["']\//, `"${basePath}`);
    });
    
    // 检查是否有变更
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`  ✓ 已修复路径`);
    } else {
      console.log(`  - 无需修改`);
    }
  });
  
  console.log('JavaScript文件处理完成!');
}

// CSS文件处理
function processCssFiles() {
  console.log('\n开始处理CSS文件...');
  const files = glob.sync('public/**/*.css');
  
  files.forEach(file => {
    console.log(`处理文件: ${file}`);
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    // 替换CSS中的URL引用
    const urlRegex = /url\(["']?\/([^"')]+)["']?\)/g;
    content = content.replace(urlRegex, function(match, path) {
      return `url("${basePath}${path}")`;
    });
    
    // 检查是否有变更
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`  ✓ 已修复路径`);
    } else {
      console.log(`  - 无需修改`);
    }
  });
  
  console.log('CSS文件处理完成!');
}

// 执行处理
processHtmlFiles();
processJsFiles();
processCssFiles();

console.log('\n所有文件路径处理完成! ✨'); 