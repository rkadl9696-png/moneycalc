import ClientPage from "./ClientPage";

export const metadata = {
  title: "수능 등급 계산기 | 과목별 원점수 등급 확인",
  description:
    "수능 국어, 수학, 영어, 탐구 원점수를 입력하면 과목별 등급과 환산 점수를 자동으로 계산해드립니다.",
};

export default function Page() {
  return <ClientPage />;
}
