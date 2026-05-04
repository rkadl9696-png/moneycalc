import ClientPage from "./ClientPage";

export const metadata = {
  title: "주식 수익률 계산기 | 수수료·세금 포함 순수익 계산",
  description:
    "매수가, 매도가, 수량을 입력하면 수수료·증권거래세 포함 순수익과 손익분기점을 바로 계산해보세요.",
};

export default function Page() {
  return <ClientPage />;
}
