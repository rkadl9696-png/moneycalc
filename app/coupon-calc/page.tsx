import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "쿠폰 할인 계산기 | 계산기 모음",
  description: "정가와 할인쿠폰(금액·%), 추가할인을 입력하면 최종 결제금액과 총 할인금액, 할인율을 계산합니다. 복수 쿠폰 중복 적용 시뮬레이션과 최소주문금액 충족 여부도 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
