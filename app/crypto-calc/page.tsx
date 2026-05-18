import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "가상화폐 수익 계산기 | 계산기 모음",
  description: "매수가격·매수수량·현재가격을 입력하면 투자원금·현재가치·수익률을 계산합니다. 목표가와 손절가 설정, 수수료 포함 순수익도 계산하여 암호화폐 투자 전략을 세우세요.",
};

export default function Page() {
  return <ClientPage />;
}
