import ClientPage from "./ClientPage";

export const metadata = {
  title: "복리 계산기 | 투자 수익률 시뮬레이션",
  description:
    "초기 투자금, 매월 투자금, 수익률, 투자 기간을 입력해 복리 기준 예상 최종 금액을 계산해보세요.",
};

export default function Page() {
  return <ClientPage />;
}