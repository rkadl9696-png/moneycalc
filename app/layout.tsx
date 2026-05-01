import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "전세 vs 월세 계산기 | 대출 계산기 | 금융 계산기 모음",
  description:
    "전세 vs 월세 비교, 대출 상환 계산, 연봉 실수령, 복리 계산, 카드 할인 계산 등 다양한 금융 계산기를 제공합니다.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}