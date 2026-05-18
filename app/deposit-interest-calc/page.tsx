import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "보증금 이자 계산기 | 계산기 모음",
  description: "보증금액과 계약기간, 연이율을 입력하면 전월세 전환율 기준 월세 환산금액과 총 이자를 계산합니다. 전세·반전세·월세 전환 비교로 최적의 계약 조건을 선택하세요.",
};

export default function Page() {
  return <ClientPage />;
}
