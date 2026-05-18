import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "분할납부 계산기 | 계산기 모음",
  description: "구매금액과 할부개월, 할부수수료율을 입력하면 월 납부액과 총 납부액, 총 이자를 계산합니다. 개월별 납부 스케줄 테이블로 할부 부담을 한눈에 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
