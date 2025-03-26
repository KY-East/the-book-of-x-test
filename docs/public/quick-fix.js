/**
 * 快速修复脚本
 * 用于自动修正页面中的资源路径和链接
 */
(function() {
  'use strict';
  
  // 检测环境
  const isGithubPages = window.location.hostname.includes('github.io');
  const basePath = isGithubPages ? '/the-book-of-x-test/' : '/';
  
  console.log('[快速修复] 当前环境:', isGithubPages ? 'GitHub Pages' : '本地开发');
  console.log('[快速修复] 基础路径:', basePath);
  
  /**
   * 修复图片路径
   */
  function fixImagePaths() {
    document.querySelectorAll('img[src]').forEach(function(img) {
      const originalSrc = img.getAttribute('src');
      
      if (!originalSrc) return;
      
      let newSrc = originalSrc;
      
      // 处理相对路径
      if (originalSrc.startsWith('../assets/')) {
        newSrc = originalSrc.replace('../assets/', basePath + 'assets/');
      } 
      // 处理无前缀的绝对路径
      else if (originalSrc.startsWith('/assets/')) {
        newSrc = basePath + originalSrc.substring(1);
      }
      // 处理GitHub Pages格式的路径在本地环境
      else if (!isGithubPages && originalSrc.startsWith('/the-book-of-x-test/')) {
        newSrc = originalSrc.replace('/the-book-of-x-test/', '/');
      }
      
      if (newSrc !== originalSrc) {
        console.log('[快速修复] 图片路径:', originalSrc, '->', newSrc);
        img.setAttribute('src', newSrc);
      }
    });
  }
  
  /**
   * 修复链接路径
   */
  function fixLinkPaths() {
    document.querySelectorAll('a[href]').forEach(function(a) {
      const originalHref = a.getAttribute('href');
      
      if (!originalHref || originalHref.startsWith('#') || originalHref.includes('://')) return;
      
      let newHref = originalHref;
      
      // 处理相对路径 (如 ../chapter2/page.html)
      if (originalHref.startsWith('../') && !originalHref.startsWith('../assets/')) {
        newHref = originalHref.replace('../', basePath + 'public/');
      }
      // 处理页面绝对路径
      else if (originalHref.startsWith('/') && 
               !originalHref.startsWith('/assets/') && 
               !originalHref.startsWith('/the-book-of-x-test/')) {
        newHref = basePath + originalHref.substring(1);
      }
      // 处理GitHub Pages格式的路径在本地环境
      else if (!isGithubPages && originalHref.startsWith('/the-book-of-x-test/')) {
        newHref = originalHref.replace('/the-book-of-x-test/', '/');
      }
      
      if (newHref !== originalHref) {
        console.log('[快速修复] 链接路径:', originalHref, '->', newHref);
        a.setAttribute('href', newHref);
      }
    });
  }
  
  /**
   * 修复CSS背景图片
   */
  function fixBackgroundImages() {
    // 获取所有包含style属性的元素
    document.querySelectorAll('[style*="background"], [style*="background-image"]').forEach(function(el) {
      const style = el.getAttribute('style');
      if (!style) return;
      
      // 查找background-image: url(...)或background: url(...)
      const match = style.match(/background(?:-image)?:\s*url\(['"]?([^'")]+)['"]?\)/i);
      if (!match) return;
      
      const originalUrl = match[1];
      let newUrl = originalUrl;
      
      // 处理相对路径
      if (originalUrl.startsWith('../assets/')) {
        newUrl = originalUrl.replace('../assets/', basePath + 'assets/');
      } 
      // 处理无前缀的绝对路径
      else if (originalUrl.startsWith('/assets/')) {
        newUrl = basePath + originalUrl.substring(1);
      }
      // 处理GitHub Pages格式的路径在本地环境
      else if (!isGithubPages && originalUrl.startsWith('/the-book-of-x-test/')) {
        newUrl = originalUrl.replace('/the-book-of-x-test/', '/');
      }
      
      if (newUrl !== originalUrl) {
        console.log('[快速修复] 背景图片:', originalUrl, '->', newUrl);
        const newStyle = style.replace(originalUrl, newUrl);
        el.setAttribute('style', newStyle);
      }
    });
  }
  
  /**
   * 修复音频路径
   */
  function fixAudioPaths() {
    document.querySelectorAll('audio[src], source[src]').forEach(function(audio) {
      const originalSrc = audio.getAttribute('src');
      
      if (!originalSrc) return;
      
      let newSrc = originalSrc;
      
      // 处理相对路径
      if (originalSrc.startsWith('../music/')) {
        newSrc = originalSrc.replace('../music/', basePath + 'music/');
      } 
      // 处理无前缀的绝对路径
      else if (originalSrc.startsWith('/music/')) {
        newSrc = basePath + originalSrc.substring(1);
      }
      // 处理GitHub Pages格式的路径在本地环境
      else if (!isGithubPages && originalSrc.startsWith('/the-book-of-x-test/')) {
        newSrc = originalSrc.replace('/the-book-of-x-test/', '/');
      }
      
      if (newSrc !== originalSrc) {
        console.log('[快速修复] 音频路径:', originalSrc, '->', newSrc);
        audio.setAttribute('src', newSrc);
      }
    });
  }
  
  /**
   * 修复sidebar.js和其他相对路径引用的脚本
   */
  function fixScriptPaths() {
    // 仅在页面加载完成后执行，避免干扰正在加载的脚本
    window.addEventListener('load', function() {
      const sidebarScript = document.querySelector('script[src="../sidebar.js"]');
      if (sidebarScript) {
        sidebarScript.src = basePath + 'public/sidebar.js';
        console.log('[快速修复] 边栏脚本路径已修复');
      }
      
      const visualEffectsScript = document.querySelector('script[src="../scripts/xi-visual-effects.js"]');
      if (visualEffectsScript) {
        visualEffectsScript.src = basePath + 'scripts/xi-visual-effects.js';
        console.log('[快速修复] 视觉效果脚本路径已修复');
      }
    });
  }
  
  /**
   * 初始化所有修复
   */
  function init() {
    // 等待DOM完全加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        fixImagePaths();
        fixLinkPaths();
        fixBackgroundImages();
        fixAudioPaths();
      });
      
      // 脚本路径需要等待窗口完全加载
      fixScriptPaths();
    } else {
      // 如果DOM已加载完成
      fixImagePaths();
      fixLinkPaths();
      fixBackgroundImages();
      fixAudioPaths();
      fixScriptPaths();
    }
  }
  
  // 执行初始化
  init();
})(); 