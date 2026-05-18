import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "권리금 계산기 | 계산기 모음",
  description: "월 매출과 순이익, 영업년수를 입력하면 영업권리금·시설권리금·바닥권리금을 산출하고 총 권리금과 투자회수기간을 계산합니다. 상가 창업 전 권리금 적정성을 검토하세요.",
};

export default function Page() {
  return <ClientPage />;
}
