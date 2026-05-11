import ClientPage from "./ClientPage";

export const metadata = {
  title: "내신 등급 계산기 | 석차등급 및 환산 점수 계산",
  description:
    "석차와 전체 인원을 입력하면 내신 등급(1~9등급)과 환산 점수를 계산합니다. 여러 과목 평균 내신도 계산 가능합니다.",
};

export default function Page() {
  return <ClientPage />;
}
