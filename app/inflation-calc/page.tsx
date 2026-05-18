import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "인플레이션 계산기 | 계산기 모음",
  description: "현재 금액과 연 인플레이션율, 기간을 입력하면 미래 가치와 실질 구매력 감소율을 계산합니다. 연도별 구매력 변화 테이블로 물가상승이 자산에 미치는 영향을 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
