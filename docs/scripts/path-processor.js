/**
 * 智能路径处理器 - 适配Vite构建流程
 * 
 * 这个脚本用于在构建过程中处理HTML/CSS/JS文件中的路径引用，
 * 确保它们在不同环境（本地开发/GitHub Pages）下正确工作。
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 获取部署目标
const isGitHubPages = process.env.DEPLOY_TARGET === 'github';
const basePath = isGitHubPages ? '/the-book-of-x-test/' : '/';

console.log(`[路径处理器] 当前部署目标: ${isGitHubPages ? 'GitHub Pages' : '本地环境'}`);
console.log(`[路径处理器] 基础路径: ${basePath}`);

/**
 * 处理HTML文件路径
 * @param {string} inputPath - 输入文件路径
 * @param {string} outputPath - 输出文件路径
 */
function processHtmlFile(inputPath, outputPath) {
  console.log(`[路径处理器] 处理HTML文件: ${path.basename(inputPath)}`);
  
  let content = fs.readFileSync(inputPath, 'utf8');
  
  // 处理路径引用
  content = content.replace(/(src|href|from)=["']\/([^"']*?)["']/g, 
    (match, attr, urlPath) => `${attr}="${basePath}${urlPath}"`);
    
  // 确保输出目录存在
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // 写入处理后的文件
  fs.writeFileSync(outputPath, content);
  console.log(`[路径处理器] 已输出到: ${outputPath}`);
}

/**
 * 处理CSS文件路径
 * @param {string} inputPath - 输入文件路径
 * @param {string} outputPath - 输出文件路径
 */
function processCssFile(inputPath, outputPath) {
  console.log(`[路径处理器] 处理CSS文件: ${path.basename(inputPath)}`);
  
  let content = fs.readFileSync(inputPath, 'utf8');
  
  // 处理URL引用
  content = content.replace(/url\(["']?\/([^"')]+)["']?\)/g, 
    (match, urlPath) => `url("${basePath}${urlPath}")`);
    
  // 确保输出目录存在
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // 写入处理后的文件
  fs.writeFileSync(outputPath, content);
  console.log(`[路径处理器] 已输出到: ${outputPath}`);
}

/**
 * 处理JavaScript文件路径
 * @param {string} inputPath - 输入文件路径
 * @param {string} outputPath - 输出文件路径
 */
function processJsFile(inputPath, outputPath) {
  console.log(`[路径处理器] 处理JS文件: ${path.basename(inputPath)}`);
  
  let content = fs.readFileSync(inputPath, 'utf8');
  
  // 处理import路径
  content = content.replace(/import\s+.*?\s+from\s+["']\/([^"']+)["']/g, 
    (match, urlPath) => match.replace(`"/${urlPath}"`, `"${basePath}${urlPath}"`));
    
  // 处理资源URL字符串
  content = content.replace(/["']\/(?:scripts|assets|styles|music)\/([^"']+)["']/g, 
    (match) => match.replace(/["']\//, `"${basePath}`));
    
  // 确保输出目录存在
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // 写入处理后的文件
  fs.writeFileSync(outputPath, content);
  console.log(`[路径处理器] 已输出到: ${outputPath}`);
}

/**
 * 处理单个文件
 * @param {string} inputPath - 输入文件路径
 */
function processFile(inputPath) {
  // 计算输出路径 (public/ -> dist/)
  const outputPath = inputPath.replace('public/', 'dist/');
  
  // 根据文件类型调用不同的处理函数
  if (inputPath.endsWith('.html')) {
    processHtmlFile(inputPath, outputPath);
  } else if (inputPath.endsWith('.css')) {
    processCssFile(inputPath, outputPath);
  } else if (inputPath.endsWith('.js')) {
    processJsFile(inputPath, outputPath);
  } else {
    // 如果不需要处理，直接复制
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.copyFileSync(inputPath, outputPath);
    console.log(`[路径处理器] 复制文件: ${path.basename(inputPath)}`);
  }
}

/**
 * 处理所有文件
 */
function processAllFiles() {
  console.log('[路径处理器] 开始处理文件...');
  
  // 确保dist目录存在
  fs.mkdirSync('dist', { recursive: true });
  
  // 找到所有需要处理的文件
  const htmlFiles = glob.sync('public/**/*.html');
  const cssFiles = glob.sync('public/**/*.css');
  const jsFiles = glob.sync('public/**/*.js');
  
  // 处理所有HTML文件
  htmlFiles.forEach(processFile);
  
  // 处理所有CSS文件
  cssFiles.forEach(processFile);
  
  // 处理所有JS文件
  jsFiles.forEach(processFile);
  
  console.log('[路径处理器] 处理完成!');
}

// 如果直接执行脚本
if (require.main === module) {
  processAllFiles();
}

// 导出函数供其他模块使用
module.exports = {
  processFile,
  processAllFiles,
  processHtmlFile,
  processCssFile,
  processJsFile
}; 