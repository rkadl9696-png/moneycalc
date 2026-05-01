import ClientPage from "./ClientPage";

export const metadata = {
  title: "이자 계산기 | 예금 이자 계산",
  description: "예금액, 금리, 기간을 입력하면 단리/복리 이자와 세후 수령액을 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}