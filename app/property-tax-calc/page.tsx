import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "재산세 계산기 | 계산기 모음",
  description: "주택·토지·건물의 공시가격을 입력하면 재산세와 지방교육세, 도시지역분을 자동으로 계산합니다. 주택 공시가격 60% 기준 누진세율로 정확한 재산세를 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
