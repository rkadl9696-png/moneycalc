import ClientPage from "./ClientPage";

export const metadata = {
  title: "실업급여 계산기 | 얼마나 받을 수 있을까?",
  description:
    "고용보험 가입기간, 평균임금, 나이를 입력해 실업급여 일일 수령액과 총 지급액을 바로 계산해보세요.",
};

export default function Page() {
  return <ClientPage />;
}
