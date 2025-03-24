/**
 * GitHub Pages路径修复脚本 - 全局版
 * 自动修复资源路径、链接和引用
 */
(function() {
  // 判断是否在GitHub Pages环境
  if (window.location.hostname.includes('github.io')) {
    console.log('[GitHub Pages Fix] 检测到GitHub Pages环境，正在修复资源路径...');
    
    // 仓库名称（用于构建GitHub Pages中的正确路径）
    const repoName = '/the-book-of-x-test';
    
    /**
     * 修复元素的资源路径属性
     */
    function fixElementAttribute(element, attributeName) {
      if (!element.hasAttribute(attributeName)) return;
      
      const value = element.getAttribute(attributeName);
      if (!value) return;
      
      // 只处理以斜杠开头但不是//开头且不已经包含仓库名的URL
      if (value.startsWith('/') && 
          !value.startsWith('//') && 
          !value.startsWith(repoName + '/') &&
          !value.startsWith('#')) {
        const newValue = repoName + value;
        element.setAttribute(attributeName, newValue);
        console.log(`[GitHub Pages Fix] 修复${attributeName}: ${value} → ${newValue}`);
      }
    }
    
    /**
     * 修复所有资源引用
     */
    function fixAllPaths() {
      // 1. 修复所有链接
      document.querySelectorAll('a').forEach(a => {
        fixElementAttribute(a, 'href');
      });
      
      // 2. 修复所有图片
      document.querySelectorAll('img').forEach(img => {
        fixElementAttribute(img, 'src');
      });
      
      // 3. 修复所有脚本
      document.querySelectorAll('script').forEach(script => {
        fixElementAttribute(script, 'src');
      });
      
      // 4. 修复所有样式表
      document.querySelectorAll('link').forEach(link => {
        fixElementAttribute(link, 'href');
      });
      
      // 5. 修复所有音频文件
      document.querySelectorAll('audio, source').forEach(audio => {
        fixElementAttribute(audio, 'src');
      });
      
      // 6. 修复所有视频文件
      document.querySelectorAll('video, source').forEach(video => {
        fixElementAttribute(video, 'src');
      });
      
      // 7. 修复所有iframe
      document.querySelectorAll('iframe').forEach(iframe => {
        fixElementAttribute(iframe, 'src');
      });
      
      // 8. 修复背景图片样式
      document.querySelectorAll('[style*="background-image"]').forEach(el => {
        const style = el.getAttribute('style');
        if (!style || !style.includes('url(')) return;
        
        const newStyle = style.replace(/url\(['"]?\/([^'"\)]+)['"]?\)/g, function(match, path) {
          // 避免重复添加仓库名
          if (path.startsWith(repoName.substring(1) + '/')) return match;
          return `url("${repoName}/${path}")`;
        });
        
        if (style !== newStyle) {
          el.setAttribute('style', newStyle);
          console.log('[GitHub Pages Fix] 修复背景图片: ' + style + ' → ' + newStyle);
        }
      });
      
      // 9. 修复内联样式表中的URL
      document.querySelectorAll('style').forEach(styleEl => {
        if (!styleEl.textContent || !styleEl.textContent.includes('url(')) return;
        
        const newContent = styleEl.textContent.replace(/url\(['"]?\/([^'"\)]+)['"]?\)/g, function(match, path) {
          // 避免重复添加仓库名
          if (path.startsWith(repoName.substring(1) + '/')) return match;
          return `url("${repoName}/${path}")`;
        });
        
        if (styleEl.textContent !== newContent) {
          styleEl.textContent = newContent;
          console.log('[GitHub Pages Fix] 修复样式表URL');
        }
      });
      
      // 10. 特殊处理：修复导航栏和翻页按钮
      const navLinks = document.querySelectorAll('.pagination a, .navigation a, #continue-link, .nav-prev, .nav-next');
      navLinks.forEach(link => {
        fixElementAttribute(link, 'href');
      });
      
      // 11. 修复侧边栏链接
      const sidebarLinks = document.querySelectorAll('.sidebar a, .sidebar-content a');
      sidebarLinks.forEach(link => {
        fixElementAttribute(link, 'href');
      });
      
      // 12. 修复音乐播放列表中的路径
      fixMusicPlaylists();
      
      console.log('[GitHub Pages Fix] 所有资源路径修复完成');
    }
    
    /**
     * 修复音乐播放列表中的路径
     * 搜索页面中的所有JS对象，查找可能包含音乐列表的部分
     */
    function fixMusicPlaylists() {
      // 查找所有内联脚本
      const scripts = document.querySelectorAll('script:not([src])');
      
      scripts.forEach(script => {
        if (!script.textContent) return;
        
        // 查找可能包含音乐播放列表的脚本
        if (script.textContent.includes('playlist') && script.textContent.includes('.mp3')) {
          // 使用正则表达式查找并替换音乐路径
          const updatedContent = script.textContent.replace(
            /(["'])\/music\/([^"']+\.mp3)(["'])/g, 
            `$1${repoName}/music/$2$3`
          );
          
          // 还要处理不以斜杠开头的音乐路径
          const furtherUpdated = updatedContent.replace(
            /(["'])music\/([^"']+\.mp3)(["'])/g, 
            function(match, prefix, path, suffix) {
              // 避免重复添加仓库名
              if (path.includes(repoName)) return match;
              return `${prefix}${repoName}/music/${path}${suffix}`;
            }
          );
          
          if (script.textContent !== furtherUpdated) {
            script.textContent = furtherUpdated;
            console.log('[GitHub Pages Fix] 修复音乐播放列表路径');
          }
        }
      });
      
      // 尝试直接修改已加载的JS变量（如果被暴露在全局作用域）
      if (window.playlist && Array.isArray(window.playlist)) {
        window.playlist.forEach(item => {
          if (item.url && typeof item.url === 'string') {
            // 只处理以/music开头但不包含仓库名的路径
            if (item.url.startsWith('/music/') && !item.url.includes(repoName)) {
              item.url = repoName + item.url;
              console.log(`[GitHub Pages Fix] 修复全局播放列表项: ${item.title}`);
            }
            // 处理不以斜杠开头的音乐路径
            else if (item.url.startsWith('music/') && !item.url.includes(repoName)) {
              item.url = repoName + '/' + item.url;
              console.log(`[GitHub Pages Fix] 修复全局播放列表项: ${item.title}`);
            }
          }
        });
      }
      
      // 尝试在各种可能的音频播放器对象中寻找播放列表
      const potentialPlayerObjects = [
        'musicPlayer', 'audioPlayer', 'player', 'xiPlayer', 'xiMusicPlayer'
      ];
      
      potentialPlayerObjects.forEach(objName => {
        if (window[objName] && window[objName].playlist && Array.isArray(window[objName].playlist)) {
          window[objName].playlist.forEach(item => {
            if (item.url && typeof item.url === 'string') {
              // 处理以/music开头的路径
              if (item.url.startsWith('/music/') && !item.url.includes(repoName)) {
                item.url = repoName + item.url;
                console.log(`[GitHub Pages Fix] 修复${objName}播放列表项: ${item.title}`);
              }
              // 处理不以斜杠开头的音乐路径
              else if (item.url.startsWith('music/') && !item.url.includes(repoName)) {
                item.url = repoName + '/' + item.url;
                console.log(`[GitHub Pages Fix] 修复${objName}播放列表项: ${item.title}`);
              }
            }
          });
        }
      });
    }
    
    /**
     * 修复fetch和XHR请求
     */
    function fixAjaxRequests() {
      // 修复fetch请求
      const originalFetch = window.fetch;
      window.fetch = function(url, options) {
        if (typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') && !url.startsWith(repoName)) {
          console.log(`[GitHub Pages Fix] 修复fetch请求: ${url} → ${repoName + url}`);
          return originalFetch.call(this, repoName + url, options);
        }
        return originalFetch.call(this, url, options);
      };
      
      // 修复XMLHttpRequest
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') && !url.startsWith(repoName)) {
          console.log(`[GitHub Pages Fix] 修复XHR请求: ${url} → ${repoName + url}`);
          return originalOpen.call(this, method, repoName + url, ...args);
        }
        return originalOpen.call(this, method, url, ...args);
      };
    }
    
    /**
     * 监听DOM变化，修复动态添加的元素
     */
    function setupMutationObserver() {
      const observer = new MutationObserver(function(mutations) {
        let shouldFix = false;
        
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1) { // 元素节点
                shouldFix = true;
              }
            });
          }
        });
        
        if (shouldFix) {
          console.log('[GitHub Pages Fix] 检测到DOM变化，修复新增元素');
          fixAllPaths();
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('[GitHub Pages Fix] DOM变化监听已启动');
    }
    
    // 修复音频播放器特殊处理
    function fixAudioPlayer() {
      // 等待音频播放器初始化
      setTimeout(function() {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
          // 如果src属性已被修复但内部source未修复
          const sources = audio.querySelectorAll('source');
          sources.forEach(source => {
            fixElementAttribute(source, 'src');
          });
          
          // 重新加载音频以应用新的源
          if (sources.length > 0) {
            audio.load();
          }
        });
        
        // 特殊处理音乐播放器的初始加载
        fixMusicPlaylists();
        
        // 可能需要重新触发音频加载
        setTimeout(function() {
          const dynamicAudioPlayers = document.querySelectorAll('.xi-music-player audio, .music-player audio');
          dynamicAudioPlayers.forEach(player => {
            try {
              if (player.load) {
                player.load();
                console.log('[GitHub Pages Fix] 重新加载音频播放器');
              }
            } catch (e) {
              console.warn('[GitHub Pages Fix] 重新加载音频播放器失败:', e);
            }
          });
        }, 500);
        
        console.log('[GitHub Pages Fix] 音频播放器修复完成');
      }, 1000);
    }
    
    // 支持的音乐文件列表
    const knownMusicFiles = [
      'ambient1.mp3', 'ambient2.mp3', 'postrock1.mp3', 
      'Budapest (Cover) (Remastered).mp3', '《Metaphysics》 (Remastered).mp3',
      'Moonfall.mp3', '燃烧.mp3', 'Das Pferd von Turin (Remastered).mp3',
      '裂隙.mp3', 'Moth (Remastered).mp3', 'The Maze.mp3', 'The World in Words.mp3'
    ];
    
    /**
     * 修复音乐文件引用
     * 此函数用于专门处理音乐播放器的引用问题
     */
    function fixMusicReferences() {
      // 获取页面中的所有脚本
      const scripts = document.querySelectorAll('script');
      
      // 检查每个脚本内容
      scripts.forEach(script => {
        if (!script.textContent) return;
        
        // 对于支持的每个音乐文件检查脚本中的引用
        knownMusicFiles.forEach(musicFile => {
          // 构建正则表达式以匹配音乐文件引用
          const musicFileRegex = new RegExp(`["'](/music/${musicFile}|music/${musicFile})["']`, 'g');
          
          // 替换为正确的路径
          script.textContent = script.textContent.replace(
            musicFileRegex, 
            `"${repoName}/music/${musicFile}"`
          );
        });
      });
      
      console.log('[GitHub Pages Fix] 音乐文件引用修复完成');
    }
    
    // 主函数：初始化所有修复
    function init() {
      // 首先修复音乐引用
      fixMusicReferences();
      
      // 修复所有路径
      fixAllPaths();
      
      // 修复Ajax请求
      fixAjaxRequests();
      
      // 设置DOM监听
      setupMutationObserver();
      
      // 修复音频播放器
      fixAudioPlayer();
      
      console.log('[GitHub Pages Fix] 初始化完成');
    }
    
    // 在DOMContentLoaded时执行修复
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      // 已经加载完成，立即执行
      init();
    }
    
    // 在load事件后再次修复（确保所有资源都加载完成）
    window.addEventListener('load', function() {
      fixAllPaths();
      fixMusicPlaylists();
      fixAudioPlayer();
    });
  }
})(); 