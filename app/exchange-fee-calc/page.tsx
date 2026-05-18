import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "환전 수수료 계산기 | 계산기 모음",
  description: "환전 금액과 통화, 환전 방법을 입력하면 실제 수령액과 수수료 금액, 실효 환율을 계산합니다. 은행·환전소·ATM별 우대율 비교로 가장 유리한 환전 방법을 선택하세요.",
};

export default function Page() {
  return <ClientPage />;
}
