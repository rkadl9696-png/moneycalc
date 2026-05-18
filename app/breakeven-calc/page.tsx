import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "손익분기점 계산기 | 계산기 모음",
  description: "고정비용과 단위당 변동비용, 판매가격을 입력하면 BEP 수량과 BEP 매출액을 계산합니다. 목표 이익 달성을 위한 필요 판매량과 수량별 수익 시뮬레이션도 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
