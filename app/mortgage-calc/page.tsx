import ClientPage from "./ClientPage";

export const metadata = {
  title: "주택담보대출 계산기 | 월 상환액·총 이자 계산",
  description:
    "대출금액, 금리, 기간을 입력하면 원리금균등·원금균등 방식별 월 상환액과 총 이자를 바로 계산해보세요.",
};

export default function Page() {
  return <ClientPage />;
}
