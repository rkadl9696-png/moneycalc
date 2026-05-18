import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "ROI 계산기 | 계산기 모음",
  description: "초기 투자비용과 기대 수익, 투자 기간을 입력하면 ROI·연평균 ROI·투자회수기간(PBP)을 계산합니다. 최대 3개 투자안을 동시에 비교하여 최적의 투자 결정을 내리세요.",
};

export default function Page() {
  return <ClientPage />;
}
