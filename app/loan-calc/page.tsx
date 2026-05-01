import ClientPage from "./ClientPage";

export const metadata = {
  title: "대출 상환 계산기 | 원리금균등 vs 원금균등 비교",
  description:
    "대출 금액, 금리, 기간을 입력해 원리금균등과 원금균등 상환 방식의 총 상환액과 이자 차이를 비교해보세요.",
};

export default function Page() {
  return <ClientPage />;
}