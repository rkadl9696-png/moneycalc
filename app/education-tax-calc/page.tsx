import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "교육비 세액공제 계산기 | 계산기 모음",
  description: "본인·자녀·취학전아동의 교육비를 입력하면 교육비 세액공제 금액과 환급 예상액을 자동으로 계산합니다. 15% 세액공제율 기준으로 절세 효과를 미리 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
