import ClientPage from "./ClientPage";

export const metadata = {
  title: "대출 한도 계산기 | DSR 40% LTV 70% 기준 대출 가능액",
  description:
    "연소득, 기존 부채, 금리, 대출 기간을 입력하면 DSR 40% 기준 대출 가능 한도와 LTV 70% 기준 한도를 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
