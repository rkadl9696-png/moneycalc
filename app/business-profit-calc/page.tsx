import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "사업 수익성 계산기 | 계산기 모음",
  description: "매출액과 매출원가, 판매관리비, 영업외수익·비용을 입력하면 매출총이익·영업이익·순이익과 각 이익률을 계산합니다. 사업 재무 건전성을 빠르게 분석하세요.",
};

export default function Page() {
  return <ClientPage />;
}
