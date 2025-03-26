/**
 * Vite自定义插件集合
 * 用于处理项目特定的需求，如路径处理、资源复制等
 */

const fs = require('fs');
const path = require('path');
const { processHtmlUrls, processCssUrls, processJsUrls } = require('./vite-path-utils');

/**
 * 静态资源复制插件
 * 用于确保所有静态资源被正确复制到构建目录
 */
function staticResourcesPlugin() {
  return {
    name: 'vite-plugin-static-resources',
    
    // 构建后钩子
    closeBundle() {
      console.log('[静态资源插件] 开始复制静态资源...');
      
      // 确保目标目录存在
      const dirs = [
        'dist/assets',
        'dist/assets/images',
        'dist/assets/images/hologram',
        'dist/music',
        'dist/scripts',
        'dist/styles',
        'dist/public'
      ];
      
      dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });
      
      // 复制必要的静态资源
      copyDirRecursive('assets', 'dist/assets');
      copyDirRecursive('public', 'dist/public');
      copyDirRecursive('music', 'dist/music');
      copyDirRecursive('scripts', 'dist/scripts');
      copyDirRecursive('styles', 'dist/styles');
      
      console.log('[静态资源插件] 静态资源复制完成!');
    }
  };
}

/**
 * 路径重写插件
 * 用于处理HTML中的路径引用
 * 增强版: 处理不同类型的资源路径
 */
function pathRewritePlugin(options = {}) {
  const { base = '/' } = options;
  
  return {
    name: 'vite-plugin-path-rewrite',
    
    // 转换HTML文件
    transformIndexHtml(html, ctx) {
      console.log(`[路径重写插件] 处理HTML: ${ctx.filename}`);
      return processHtmlUrls(html, base);
    },
    
    // 转换JS文件
    transform(code, id) {
      // 处理JavaScript文件
      if (id.endsWith('.js')) {
        console.log(`[路径重写插件] 处理JS: ${path.basename(id)}`);
        return {
          code: processJsUrls(code, base),
          map: null
        };
      }
      
      // 处理CSS文件
      if (id.endsWith('.css')) {
        console.log(`[路径重写插件] 处理CSS: ${path.basename(id)}`);
        return {
          code: processCssUrls(code, base),
          map: null
        };
      }
      
      return null;
    }
  };
}

/**
 * 完整HTML处理插件
 * 不仅处理路径，还处理特定组件的逻辑
 */
function enhancedHtmlPlugin(options = {}) {
  const { base = '/' } = options;
  
  return {
    name: 'vite-plugin-enhanced-html',
    
    transformIndexHtml(html, ctx) {
      console.log(`[增强HTML插件] 处理HTML: ${path.basename(ctx.filename)}`);
      
      // 先用基本路径处理器处理路径
      let processed = processHtmlUrls(html, base);
      
      // 处理特殊组件引用
      processed = processed
        // 处理sidebar.js引用
        .replace(/<script src="(?:\.\.\/)+sidebar\.js"><\/script>/g, 
          `<script src="${base}public/sidebar.js"></script>`)
        
        // 处理quick-fix.js引用
        .replace(/<script src="(?:\.\.\/)+quick-fix\.js"><\/script>/g, 
          `<script src="${base}public/quick-fix.js"></script>`)
        
        // 处理xi-visual-effects.js引用
        .replace(/<script src="(?:\.\.\/)+scripts\/xi-visual-effects\.js"><\/script>/g, 
          `<script src="${base}scripts/xi-visual-effects.js"></script>`);
      
      return processed;
    }
  };
}

/**
 * 客户端路径适配器插件
 * 注入可在浏览器中使用的路径解析工具
 */
function clientPathResolverPlugin(options = {}) {
  const { base = '/' } = options;
  
  return {
    name: 'vite-plugin-client-path-resolver',
    
    transformIndexHtml(html) {
      // 创建客户端路径解析器脚本
      const script = `
        <script>
          window.pathResolver = {
            isGitHubPages: function() {
              return window.location.hostname.includes('github.io');
            },
            getBasePath: function() {
              return this.isGitHubPages() ? '/the-book-of-x-test/' : '/';
            },
            resolvePath: function(path) {
              const basePath = this.getBasePath();
              
              // 如果是相对路径，保持不变
              if (path.startsWith('./') || path.startsWith('../')) {
                return path;
              }
              
              // 如果是绝对路径但没有项目前缀
              if (path.startsWith('/') && !path.startsWith('/the-book-of-x-test/')) {
                return basePath + path.substring(1);
              }
              
              // 如果已经是GitHub Pages格式的路径
              if (path.startsWith('/the-book-of-x-test/')) {
                return this.isGitHubPages() ? path : path.replace('/the-book-of-x-test/', '/');
              }
              
              return path;
            }
          };
        </script>
      `;
      
      // 将脚本注入到<head>标签结束前
      return html.replace('</head>', script + '</head>');
    }
  };
}

/**
 * 递归复制目录及其内容
 */
function copyDirRecursive(src, dest) {
  // 如果源目录不存在，直接返回
  if (!fs.existsSync(src)) {
    console.warn(`[静态资源插件] 警告: 源目录不存在: ${src}`);
    return;
  }
  
  // 确保目标目录存在
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // 读取源目录内容
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  // 遍历并复制每个条目
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // 递归复制子目录
      copyDirRecursive(srcPath, destPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
      console.log(`[静态资源插件] 复制: ${srcPath} -> ${destPath}`);
    }
  }
}

module.exports = {
  staticResourcesPlugin,
  pathRewritePlugin,
  enhancedHtmlPlugin,
  clientPathResolverPlugin
}; 