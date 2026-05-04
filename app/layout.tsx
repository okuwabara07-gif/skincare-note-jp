import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'スキンケアノート',
  description: 'スキンケア・美肌情報',
  keywords: 'スキンケアノート,スキンケア・美肌情報',
  openGraph: {
    title: 'スキンケアノート',
    description: 'スキンケア・美肌情報',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'スキンケアノート',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'スキンケアノート',
    description: 'スキンケア・美肌情報',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3460729726810386" crossOrigin="anonymous"></script>
        <meta name="google-site-verification" content="8c64b1447c588760" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SVQXY5C3PW"></script>
        <script dangerouslySetInnerHTML={{__html:`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-SVQXY5C3PW');`}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:`{"@context": "https://schema.org", "@type": "WebSite", "name": "スキンケアノート", "description": "スキンケア・美肌情報", "url": "https://skincare-note-jp.vercel.app", "publisher": {"@type": "Organization", "name": "AOKAE合同会社", "url": "https://colorpass-web.vercel.app"}, "potentialAction": {"@type": "SearchAction", "target": "https://skincare-note-jp.vercel.app/blog/{search_term_string}", "query-input": "required name=search_term_string"}}`}} />
      </head>
      <body>{children}
      <footer style={{textAlign:'center',padding:'2rem 1rem',marginTop:'3rem',borderTop:'1px solid #e8d4ff',fontSize:'0.7rem',color:'#888'}}>
        <a href="https://beauty-portal-jp.vercel.app" style={{color:'#9333ea',textDecoration:'none',fontWeight:600}}>
          Beauty Portal Japan
        </a>
        <span style={{margin:'0 8px'}}>|</span>
        <span>© 2026 AOKAE合同会社</span>
        <p style={{marginTop:'4px'}}>本サイトはアフィリエイト広告を含みます</p>
      </footer>
      </body>
    </html>
  )
}
