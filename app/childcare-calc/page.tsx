import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "육아비용 계산기 | 계산기 모음",
  description: "자녀 나이, 지역, 보육시설 유형을 선택하면 정부지원금을 반영한 실질 육아비용(월/년)을 자동으로 계산합니다. 보육료, 유아학비, 아이돌봄서비스 등 지원금을 한눈에 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
