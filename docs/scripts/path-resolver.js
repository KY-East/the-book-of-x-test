/**
 * 路径解析器
 * 在客户端环境中提供统一的路径解析功能
 */
(function() {
  'use strict';
  
  // 确保不重复定义
  if (window.pathResolver) return;
  
  // 创建路径解析器对象
  window.pathResolver = {
    /**
     * 检测当前是否在GitHub Pages环境
     * @returns {boolean} 是否在GitHub Pages环境
     */
    isGitHubPages: function() {
      return window.location.hostname.includes('github.io');
    },
    
    /**
     * 获取正确的基础路径
     * @returns {string} 基础路径
     */
    getBasePath: function() {
      return this.isGitHubPages() ? '/the-book-of-x-test/' : '/';
    },
    
    /**
     * 解析路径，确保在任何环境中都能正确引用资源
     * @param {string} path - 需要解析的路径
     * @returns {string} 处理后的路径
     */
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
      
      // 其他情况原样返回
      return path;
    },
    
    /**
     * 解析图片路径
     * @param {string} path - 图片路径
     * @returns {string} 处理后的图片路径
     */
    resolveImagePath: function(path) {
      return this.resolvePath(path);
    },
    
    /**
     * 解析脚本路径
     * @param {string} path - 脚本路径
     * @returns {string} 处理后的脚本路径
     */
    resolveScriptPath: function(path) {
      return this.resolvePath(path);
    },
    
    /**
     * 解析样式路径
     * @param {string} path - 样式路径
     * @returns {string} 处理后的样式路径
     */
    resolveStylePath: function(path) {
      return this.resolvePath(path);
    },
    
    /**
     * 解析链接路径
     * @param {string} path - 链接路径
     * @returns {string} 处理后的链接路径
     */
    resolveLinkPath: function(path) {
      return this.resolvePath(path);
    },
    
    /**
     * 根据当前环境修复所有页面中的路径
     * 这个方法会自动处理所有图片、脚本、样式和链接的路径
     */
    fixAllPaths: function() {
      const self = this;
      
      // 修复图片路径
      document.querySelectorAll('img[src]').forEach(function(img) {
        const originalSrc = img.getAttribute('src');
        if (originalSrc) {
          img.setAttribute('src', self.resolveImagePath(originalSrc));
        }
      });
      
      // 修复脚本路径
      document.querySelectorAll('script[src]').forEach(function(script) {
        const originalSrc = script.getAttribute('src');
        if (originalSrc) {
          script.setAttribute('src', self.resolveScriptPath(originalSrc));
        }
      });
      
      // 修复样式路径
      document.querySelectorAll('link[rel="stylesheet"][href]').forEach(function(link) {
        const originalHref = link.getAttribute('href');
        if (originalHref) {
          link.setAttribute('href', self.resolveStylePath(originalHref));
        }
      });
      
      // 修复超链接路径
      document.querySelectorAll('a[href]').forEach(function(a) {
        const originalHref = a.getAttribute('href');
        if (originalHref && !originalHref.startsWith('#') && !originalHref.includes('://')) {
          a.setAttribute('href', self.resolveLinkPath(originalHref));
        }
      });
      
      // 修复background-image
      // 这需要比较复杂的处理，暂不实现
    },
    
    /**
     * 自动执行修复函数
     * @param {boolean} autoFix - 是否自动修复所有路径
     */
    init: function(autoFix) {
      // 输出当前环境信息
      console.log('[路径解析器] 当前环境:', this.isGitHubPages() ? 'GitHub Pages' : '本地开发');
      console.log('[路径解析器] 基础路径:', this.getBasePath());
      
      // 如果需要自动修复
      if (autoFix) {
        // 等待DOM完全加载后执行
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', this.fixAllPaths.bind(this));
        } else {
          this.fixAllPaths();
        }
      }
    }
  };
  
  // 自动初始化，但不自动修复
  window.pathResolver.init(false);
})(); 