import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "상가 임대료 계산기 | 계산기 모음",
  description: "보증금·월임대료·면적을 입력하면 환산보증금과 3.3㎡(평)당 임대료를 계산합니다. 전월세 전환율 기반 적정 임대료 산출과 권리금 투자회수기간도 함께 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
