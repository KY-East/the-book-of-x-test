/**
 * Vite路径处理工具
 * 提供处理项目中不同环境下资源路径的辅助函数
 */

// 检测当前环境是否为GitHub Pages
function isGitHubPages() {
  if (typeof window !== 'undefined') {
    return window.location.hostname.includes('github.io');
  }
  return process.env.DEPLOY_TARGET === 'github';
}

/**
 * 获取正确的基础路径
 * @returns {string} 返回基础路径
 */
function getBasePath() {
  return isGitHubPages() ? '/the-book-of-x-test/' : '/';
}

/**
 * 解析路径，确保在任何环境中都能正确引用资源
 * @param {string} path - 需要解析的路径
 * @returns {string} 返回处理后的路径
 */
function resolvePath(path) {
  const basePath = getBasePath();
  
  // 如果是相对路径，保持不变
  if (path.startsWith('./') || path.startsWith('../')) {
    return path;
  }
  
  // 如果是绝对路径但没有项目前缀
  if (path.startsWith('/') && !path.startsWith('/the-book-of-x-test/')) {
    return `${basePath}${path.substring(1)}`;
  }
  
  // 如果已经是GitHub Pages格式的路径
  if (path.startsWith('/the-book-of-x-test/')) {
    return isGitHubPages() ? path : path.replace('/the-book-of-x-test/', '/');
  }
  
  // 其他情况原样返回
  return path;
}

/**
 * 将HTML中的URL转换为正确的格式
 * @param {string} html - HTML内容
 * @param {string} base - 基础路径
 * @returns {string} 返回处理后的HTML
 */
function processHtmlUrls(html, base) {
  // 处理src和href属性中的URL
  let processedHtml = html
    // 修复绝对路径但没有项目前缀的URL
    .replace(/(src|href|action)=["']\/(?!the-book-of-x-test\/)([^"']*?)["']/g, 
      (match, attr, path) => `${attr}="${base}${path}"`)
      
    // 修复相对路径引用的问题 (如果需要)
    .replace(/(src|href)=["']\.\.\/((?!assets\/).+?)["']/g,
      (match, attr, path) => `${attr}="${base}public/${path}"`)
      
    // 将GitHub Pages格式路径在本地环境转回为绝对路径
    .replace(/(src|href)=["']\/the-book-of-x-test\/(.+?)["']/g,
      (match, attr, path) => base === '/' ? `${attr}="/${path}"` : match);
  
  // 处理background-image等CSS URL
  processedHtml = processedHtml
    .replace(/url\(["']?\/(?!the-book-of-x-test\/)([^"')]*?)["']?\)/g,
      (match, path) => `url("${base}${path}")`)
    .replace(/url\(["']?\/the-book-of-x-test\/(.+?)["']?\)/g,
      (match, path) => base === '/' ? `url("/${path}")` : match);
  
  return processedHtml;
}

/**
 * 处理CSS文件中的URL路径
 * @param {string} css - CSS内容
 * @param {string} base - 基础路径
 * @returns {string} 返回处理后的CSS
 */
function processCssUrls(css, base) {
  return css
    .replace(/url\(["']?\/(?!the-book-of-x-test\/)([^"')]*?)["']?\)/g,
      (match, path) => `url("${base}${path}")`)
    .replace(/url\(["']?\/the-book-of-x-test\/(.+?)["']?\)/g,
      (match, path) => base === '/' ? `url("/${path}")` : match);
}

/**
 * 处理JavaScript文件中的路径
 * @param {string} js - JavaScript内容
 * @param {string} base - 基础路径
 * @returns {string} 返回处理后的JavaScript
 */
function processJsUrls(js, base) {
  // 处理字符串中的路径
  return js
    .replace(/["']\/(?!the-book-of-x-test\/)([^"']*?\.(jpg|png|gif|svg|mp3|mp4|webm|css|js))["']/g,
      (match, path) => match.replace(/["']\//, `"${base}`))
    .replace(/["']\/the-book-of-x-test\/(.+?)["']/g,
      (match, path) => base === '/' ? match.replace(/["']\/the-book-of-x-test\//, `"/${path}`) : match);
}

// 导出工具函数
module.exports = {
  isGitHubPages,
  getBasePath,
  resolvePath,
  processHtmlUrls,
  processCssUrls,
  processJsUrls
}; 