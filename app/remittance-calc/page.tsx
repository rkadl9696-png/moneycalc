import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "해외송금 수수료 계산기 | 계산기 모음",
  description: "송금액과 송금 방법을 입력하면 실수취액과 총 수수료를 계산하고 은행·핀테크·웨스턴유니온을 비교합니다. 가장 저렴한 해외송금 방법을 한눈에 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
