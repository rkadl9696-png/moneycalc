import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "자동차세 계산기 | 계산기 모음",
  description: "배기량(cc), 차종, 차량 연식을 입력하면 자동차세를 자동으로 계산합니다. 승용·승합·화물 차종별, 연식별 감면율이 반영된 정확한 자동차세를 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
