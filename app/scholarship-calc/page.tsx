import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "장학금 계산기 | 계산기 모음",
  description: "소득분위, 성적, 대학 유형을 입력하면 국가장학금 I유형 수혜 금액과 자부담 등록금을 자동으로 계산합니다. 장학금 수혜 가능 여부와 금액을 미리 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
