import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "마일리지 계산기 | 계산기 모음",
  description: "항공편 거리와 탑승 클래스를 입력하면 적립 마일리지를 계산하고 무료항공권 교환 기준과 비교할 수 있습니다. 국내선·아시아·미주·유럽 노선 마일리지 계획에 활용하세요.",
};

export default function Page() {
  return <ClientPage />;
}
