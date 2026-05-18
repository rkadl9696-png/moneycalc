import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "연체이자 계산기 | 계산기 모음",
  description: "원금과 연체이자율, 연체일수를 입력하면 연체이자를 자동으로 계산합니다. 법정 최고금리(20%) 적용 여부와 연체일수별 이자 누적 테이블로 연체 부담을 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
