/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // 确保静态资源路径正确
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  // 允许从public目录加载内容
  images: {
    domains: ['localhost'],
  },
  // 添加内容安全策略配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig; 