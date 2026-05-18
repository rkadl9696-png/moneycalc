import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "결혼 비용 계산기 | 계산기 모음",
  description: "혼수(가전·가구), 예식비용, 신혼여행, 예단·예물, 기타 비용을 입력하면 총 결혼 비용과 2024년 평균 결혼 비용(약 2.3억) 대비 분석을 제공합니다. 항목별 절약 팁도 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
