import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "종합부동산세 계산기 | 계산기 모음",
  description: "공시가격, 주택 수, 1주택자 여부를 입력하면 종합부동산세와 농어촌특별세를 자동으로 계산합니다. 공정시장가액비율 60%, 기본공제 9억(1주택 12억) 기준으로 정확한 세액을 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
