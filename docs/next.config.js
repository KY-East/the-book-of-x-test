/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 静态文件服务配置
  async rewrites() {
    return [
      // 确保能访问音乐文件
      {
        source: '/music/:file*',
        destination: '/music/:file*',
      },
      // JavaScript和CSS文件
      {
        source: '/:path*.js',
        destination: '/:path*.js',
      },
      {
        source: '/:path*.css',
        destination: '/:path*.css',
      },
      // 图片和其他媒体文件
      {
        source: '/:path*.png',
        destination: '/:path*.png',
      },
      {
        source: '/:path*.jpg',
        destination: '/:path*.jpg',
      },
      {
        source: '/:path*.gif',
        destination: '/:path*.gif',
      },
      {
        source: '/:path*.svg',
        destination: '/:path*.svg',
      },
      // 处理章节路由
      {
        source: '/preface/:slug',
        destination: '/preface/:slug',
      },
      {
        source: '/chapter:num/:slug',
        destination: '/chapter:num/:slug',
      }
    ];
  },
  // 全局HTTP响应头设置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; default-src 'self';"
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig; 