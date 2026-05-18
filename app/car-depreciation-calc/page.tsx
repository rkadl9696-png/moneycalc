import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "자동차 감가상각 계산기 | 계산기 모음",
  description: "구입가격, 구입연도, 현재연도, 감가상각 방식(정률/정액)을 입력하면 연도별 차량 잔존가치와 감가상각액을 자동으로 계산합니다. 중고차 매도 시 참고하세요.",
};

export default function Page() {
  return <ClientPage />;
}
