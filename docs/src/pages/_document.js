import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* 这里我们完全禁用CSP */}
        <meta
          httpEquiv="Content-Security-Policy"
          content=""
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 