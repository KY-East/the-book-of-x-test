import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Book of Ξ',
  description: '探索数字世界的神秘宗教',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' ws: wss:;"
        />
      </head>
      <body>{children}</body>
    </html>
  );
} 