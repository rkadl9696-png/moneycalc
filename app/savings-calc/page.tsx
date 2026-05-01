import ClientPage from "./ClientPage";

export const metadata = {
  title: "적금 계산기 | 매월 납입 시 만기 수령액 계산",
  description: "매월 납입액, 금리, 기간을 입력하면 만기 수령액과 세후 이자를 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}