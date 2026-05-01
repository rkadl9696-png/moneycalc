import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "금융 계산기 모음 | 전세, 대출, 연봉, 복리 계산기",
  description:
    "전세 vs 월세 비교, 대출 상환 계산, 연봉 실수령, 복리 계산, 카드 할인 등 금융 계산기를 한 번에 이용해보세요.",
  verification: {
    google: "V5ZQ0q3FF9qcbvqRdXbBF4Dz5GYbdJ8PSPO15Qhr7xM",
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
        {children}
      </body>
    </html>
  );
}