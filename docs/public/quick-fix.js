// GitHub Pages路径修复全局脚本
(function() {
  // 检测是否在GitHub Pages环境中
  if (window.location.hostname.includes('github.io')) {
    console.log('检测到GitHub Pages环境，正在修复所有资源路径...');
    
    // 仓库名称（用于构建GitHub Pages中的正确路径）
    const repoName = '/the-book-of-x-test';
    
    // 修复所有链接
    function fixAllLinks() {
      // 处理所有a标签链接
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        fixElementSrc(link, 'href');
      });
      
      // 处理所有图片和媒体资源
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        fixElementSrc(img, 'src');
      });
      
      // 处理所有音频资源
      const audios = document.querySelectorAll('audio');
      audios.forEach(audio => {
        fixElementSrc(audio, 'src');
      });
      
      // 处理所有视频资源
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        fixElementSrc(video, 'src');
      });
      
      // 处理所有嵌入资源
      const embeds = document.querySelectorAll('embed, iframe, source, script');
      embeds.forEach(embed => {
        fixElementSrc(embed, 'src');
      });
      
      // 处理所有style中的背景图片
      const elementsWithStyle = document.querySelectorAll('[style*="background-image"]');
      elementsWithStyle.forEach(el => {
        const style = el.getAttribute('style');
        if (style && style.includes('url(')) {
          const newStyle = style.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, url) => {
            if (shouldFixUrl(url)) {
              return `url("${fixUrl(url)}")`;
            }
            return match;
          });
          el.setAttribute('style', newStyle);
        }
      });
      
      // 处理CSS里的引用 (有限支持)
      const styleElements = document.querySelectorAll('style');
      styleElements.forEach(style => {
        if (style.textContent) {
          style.textContent = style.textContent.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, url) => {
            if (shouldFixUrl(url)) {
              return `url("${fixUrl(url)}")`;
            }
            return match;
          });
        }
      });

      // 特别处理continue-link按钮
      const continueLink = document.getElementById('continue-link');
      if (continueLink) {
        // 确保使用正确的相对路径
        const href = continueLink.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith(repoName)) {
          continueLink.setAttribute('href', repoName + href);
        }
      }
      
      console.log('所有资源路径修复完成');
    }
    
    // 修复元素的src或href属性
    function fixElementSrc(element, attrName) {
      const value = element.getAttribute(attrName);
      if (value && shouldFixUrl(value)) {
        const newValue = fixUrl(value);
        element.setAttribute(attrName, newValue);
      }
    }
    
    // 判断URL是否需要修复
    function shouldFixUrl(url) {
      // 不处理完整URL、锚链接、数据URI、已经包含仓库名的链接
      return url && 
             typeof url === 'string' &&
             !url.match(/^(https?:\/\/|#|data:|blob:|mailto:|tel:|javascript:|\/the-book-of-x-test)/i);
    }
    
    // 修复URL
    function fixUrl(url) {
      // 处理相对路径和绝对路径
      if (url.startsWith('/')) {
        // 绝对路径，直接添加仓库名
        return repoName + url;
      } else {
        // 相对路径，需要基于当前路径处理
        // 获取当前路径（相对于仓库根目录）
        let currentPath = window.location.pathname;
        if (currentPath.startsWith(repoName)) {
          currentPath = currentPath.substring(repoName.length);
        }
        
        // 去掉文件名，只保留目录部分
        currentPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        
        // 处理相对路径（如 ../）
        if (url.startsWith('./')) {
          url = url.substring(2);
        }
        
        while (url.startsWith('../')) {
          url = url.substring(3);
          currentPath = currentPath.substring(0, currentPath.slice(0, -1).lastIndexOf('/') + 1);
        }
        
        return repoName + currentPath + url;
      }
    }
    
    // 处理JSON资源加载的情况
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (typeof url === 'string' && shouldFixUrl(url)) {
        return originalFetch(fixUrl(url), options);
      }
      return originalFetch(url, options);
    };
    
    // 处理动态加载的资源
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      if (typeof url === 'string' && shouldFixUrl(url)) {
        return originalXHROpen.call(this, method, fixUrl(url), ...rest);
      }
      return originalXHROpen.call(this, method, url, ...rest);
    };
    
    // 在页面加载和DOM变化时修复链接
    document.addEventListener('DOMContentLoaded', fixAllLinks);
    window.addEventListener('load', fixAllLinks);
    
    // 处理动态添加的元素
    const observer = new MutationObserver(mutations => {
      let shouldFix = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          shouldFix = true;
        }
      });
      
      if (shouldFix) {
        fixAllLinks();
      }
    });
    
    // 开始监听DOM变化
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // 立即执行一次修复（对于已加载的内容）
    if (document.readyState !== 'loading') {
      fixAllLinks();
    }
  }
})(); 