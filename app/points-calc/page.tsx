import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "포인트 적립 계산기 | 계산기 모음",
  description: "구매금액과 적립률을 입력하면 적립 포인트, 잔여 포인트, 포인트 현금가치를 즉시 계산합니다. 신용카드·멤버십·쇼핑몰 포인트 관리에 유용한 무료 계산기입니다.",
};

export default function Page() {
  return <ClientPage />;
}
