import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "노후자금 계산기 | 계산기 모음",
  description: "현재 나이, 은퇴 나이, 기대수명, 월 생활비, 저축 정보를 입력하면 은퇴 후 필요한 총 노후자금과 현재 부족액을 자동으로 계산합니다. 물가상승률 2%를 반영한 현실적인 노후 계획을 세우세요.",
};

export default function Page() {
  return <ClientPage />;
}
