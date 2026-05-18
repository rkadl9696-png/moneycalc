import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "생활비 계산기 | 계산기 모음",
  description: "가구원 수와 항목별 지출(식비·주거비·교통·의료·교육·여가 등)을 입력하면 월 총 생활비와 통계청 평균 대비 분석을 제공합니다. 생활비 절약 포인트도 함께 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
