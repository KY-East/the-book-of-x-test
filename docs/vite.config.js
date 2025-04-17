import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
import fs from 'fs';
import { 
  staticResourcesPlugin, 
  pathRewritePlugin, 
  enhancedHtmlPlugin,
  clientPathResolverPlugin
} from './scripts/vite-custom-plugins';

// 获取public目录下的所有HTML文件作为入口
function getHtmlEntries() {
  const entries = {};
  const baseDir = 'public';
  
  // 递归查找所有HTML文件
  function findHtmlFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = `${dir}/${file}`;
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findHtmlFiles(filePath);
      } else if (file.endsWith('.html') && !file.endsWith('.bak.html') && !file.includes('.backup')) {
        // 使用相对路径作为入口名，排除备份文件
        const entryName = filePath.replace('public/', '').replace('.html', '');
        entries[entryName] = resolve(__dirname, filePath);
      }
    });
  }
  
  // 添加根目录的index.html
  if (fs.existsSync('index.html')) {
    entries['index'] = resolve(__dirname, 'index.html');
  }
  
  findHtmlFiles(baseDir);
  return entries;
}

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const isGitHubPages = process.env.DEPLOY_TARGET === 'github';
  
  // 根据部署目标设置不同的基础路径
  const base = isGitHubPages ? '/the-book-of-x-test/' : '/';
  
  // 复制XiVisualEffects到public目录
  if (!fs.existsSync('./public/XiVisualEffects') && fs.existsSync('./XiVisualEffects')) {
    fs.mkdirSync('./public/XiVisualEffects', { recursive: true });
    const xiFiles = fs.readdirSync('./XiVisualEffects');
    xiFiles.forEach(file => {
      fs.copyFileSync(`./XiVisualEffects/${file}`, `./public/XiVisualEffects/${file}`);
    });
    console.log('XiVisualEffects已复制到public目录');
  }
  
  return {
    base,
    
    // 关键修改：禁用默认public目录处理，我们自己控制资源复制
    publicDir: false,
    
    // 定义路径别名
    resolve: {
      alias: {
        '@scripts': resolve(__dirname, 'scripts'),
        '@styles': resolve(__dirname, 'styles'),
        '@assets': resolve(__dirname, 'assets'),
        '@public': resolve(__dirname, 'public'),
        '@music': resolve(__dirname, 'music'),
        // 添加XiVisualEffects别名
        '@effects': resolve(__dirname, 'XiVisualEffects')
      }
    },
    
    // 插件配置
    plugins: [
      // 增强型HTML处理插件 - 处理特殊组件引用
      enhancedHtmlPlugin({ base }),
      
      // 路径重写插件 - 处理一般路径
      pathRewritePlugin({ base }),
      
      // 客户端路径解析器 - 在浏览器中解决动态路径问题
      clientPathResolverPlugin({ base }),
      
      // 静态资源复制插件
      staticResourcesPlugin(),
      
      // 专门处理XiVisualEffects的插件
      {
        name: 'vite-plugin-xi-effects',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // 处理XiVisualEffects目录的请求
            if (req.url && (req.url.includes('/XiVisualEffects/') || req.url.includes('/public/XiVisualEffects/'))) {
              const originalUrl = req.url;
              let filePath;
              
              // 统一路径格式为/public/XiVisualEffects/...
              if (req.url.startsWith('/XiVisualEffects/')) {
                req.url = `/public${req.url}`;
              }
              
              console.log(`[视觉效果系统] 请求: ${originalUrl} -> ${req.url}`);
            }
            next();
          });
        }
      },
      
      // 处理public目录的自定义中间件插件
      {
        name: 'handle-public-dir',
        configureServer(server) {
          // 为开发服务器配置自定义中间件
          server.middlewares.use((req, res, next) => {
            // 处理资源路径重写
            const originalUrl = req.url;
            let newUrl = originalUrl;
            
            // 如果是根路径的index.html请求
            if (newUrl === '/' || newUrl === '/index.html') {
              next();
              return;
            }
            
            // 确保public目录下的资源能被正确访问
            if (!newUrl.startsWith('/public/') && 
                !newUrl.startsWith('/assets/') && 
                !newUrl.startsWith('/music/') && 
                !newUrl.startsWith('/scripts/') && 
                !newUrl.startsWith('/styles/') &&
                !newUrl.startsWith('/XiVisualEffects/')) {
              
              // 检查是否是资源文件
              if (newUrl.match(/\.(html|js|css|mp3|jpg|png|svg|gif|webp|woff|woff2|ttf|eot)$/)) {
                // 确定正确的路径前缀
                if (newUrl.includes('/chapter') || newUrl.includes('/preface') || newUrl.includes('/hidden')) {
                  newUrl = `/public${newUrl}`;
                } else if (newUrl.match(/\.(jpg|png|svg|gif|webp)$/)) {
                  newUrl = `/assets${newUrl}`;
                } else if (newUrl.match(/\.(mp3)$/)) {
                  newUrl = `/music${newUrl}`;
                } else if (newUrl.match(/\.(js)$/) && !newUrl.includes('xi-visual-effects')) {
                  newUrl = `/scripts${newUrl}`;
                } else if (newUrl.match(/\.(css)$/)) {
                  newUrl = `/styles${newUrl}`;
                }
                
                if (originalUrl !== newUrl) {
                  console.log(`[开发服务器] 重写路径: ${originalUrl} -> ${newUrl}`);
                  req.url = newUrl;
                }
              }
            }
            
            // 专门处理XiVisualEffects路径
            if (req.url && req.url.includes('/XiVisualEffects/')) {
              // 无需重写，直接从根目录访问
              console.log(`[开发服务器] 保留XiVisualEffects路径: ${req.url}`);
            }
            
            next();
          });
        }
      },
      
      // 支持旧浏览器
      legacy({
        targets: ['defaults', 'not IE 11']
      }),
      
      // 构建分析
      isProd && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'stats.html'
      })
    ].filter(Boolean),
    
    // 指定构建输出目录
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // 资源处理
      assetsInlineLimit: 4096,
      // 资源目录
      assetsDir: 'assets',
      // 源码映射
      sourcemap: !isProd,
      // 分块策略
      rollupOptions: {
        input: getHtmlEntries(),
        output: {
          // 资源文件名格式
          assetFileNames: (assetInfo) => {
            // 保持原始目录结构
            const info = assetInfo.name.split('/');
            const name = info[info.length - 1];
            const ext = name.split('.')[1];
            
            if (/\.(mp3|wav|ogg)$/i.test(name)) {
              return `music/${name}`;
            }
            
            if (/\.(png|jpe?g|gif|svg|webp)$/i.test(name)) {
              return `assets/images/${name}`;
            }
            
            if (/\.(css)$/i.test(name)) {
              return `styles/${name}`;
            }
            
            if (/\.(js)$/i.test(name) && !name.includes('chunk-')) {
              return `scripts/${name}`;
            }
            
            return `assets/${ext || 'misc'}/${name}`;
          },
          // JS入口文件名格式
          entryFileNames: (chunkInfo) => {
            const name = chunkInfo.name;
            
            // 主页特殊处理
            if (name === 'index') {
              return `[name].[hash].js`;
            }
            
            // 保持public目录结构
            if (name.includes('/')) {
              return `public/${name}.[hash].js`;
            }
            
            return `scripts/${name}.[hash].js`;
          },
          // 代码分割
          chunkFileNames: 'scripts/[name].[hash].js',
          // 手动分块
          manualChunks: {
            'xi-core': [
              './scripts/xi-player.js',
              './scripts/xi-player-ui.js',
              './scripts/xi-visual-effects.js'
            ],
            'vendor': [
              './scripts/signature.js',
              './scripts/music-player.js'
            ]
          }
        }
      }
    },
    
    // 开发服务器配置
    server: {
      port: 5173,
      open: true,
      strictPort: false,
      cors: true,
      // 禁用错误覆盖层
      hmr: {
        overlay: false
      },
      // 允许服务器访问上级目录
      fs: {
        allow: ['.']
      }
    }
  };
}); 