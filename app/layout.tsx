import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import ScrollRestorer from "./components/ScrollRestorer";
import ScrollToTop from "./components/ScrollToTop";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "계산기 모음 | 금융·건강·세금 계산기",
  description:
    "금융, 세금, 건강 등 다양한 계산기를 한 번에 이용해보세요.",
  verification: {
    google: "V5ZQ0q3FF9qcbvqRdXbBF4Dz5GYbdJ8PSPO15Qhr7xM",
  },
  other: {
    "google-adsense-account": "ca-pub-4871652811117499",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4871652811117499"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RDRPWLLGVY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RDRPWLLGVY');
          `}
        </Script>
        <ScrollRestorer />
        <ScrollToTop />
        <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-6 py-3">
            <Link href="/" scroll={false} className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
              🧮 계산기 모음
            </Link>
          </div>
        </header>
        {children}
        <footer className="mt-16 border-t border-gray-100 py-6 text-center text-xs text-gray-400">
          <p>
            © 2026 계산기 모음
            <span className="mx-2">|</span>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">개인정보처리방침</Link>
            <span className="mx-2">|</span>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">이용약관</Link>
            <span className="mx-2">|</span>
            <Link href="/about" className="hover:text-gray-600 transition-colors">소개</Link>
          </p>
          <p className="mt-1 text-gray-300">계산 결과는 참고용이며 실제와 다를 수 있습니다.</p>
        </footer>
      </body>
    </html>
  );
}