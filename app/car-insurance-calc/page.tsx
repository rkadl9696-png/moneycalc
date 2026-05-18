import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "자동차 보험료 계산기 | 계산기 모음",
  description: "차량가액, 운전자 나이, 보험 가입 경력, 사고 이력을 입력하면 예상 자동차 보험료를 자동으로 계산합니다. 나이별 할증, 가입경력 할인, 무사고 할인이 모두 반영됩니다.",
};

export default function Page() {
  return <ClientPage />;
}
