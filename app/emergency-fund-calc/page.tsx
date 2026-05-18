import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "비상금 계산기 | 계산기 모음",
  description: "월 고정지출, 변동지출, 직업 안정성, 부양가족 수를 입력하면 적정 비상금 규모를 자동으로 계산합니다. 직업 안정성별 권장 비상금 기준으로 재정 안전망을 준비하세요.",
};

export default function Page() {
  return <ClientPage />;
}
