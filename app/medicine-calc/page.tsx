import ClientPage from "./ClientPage";

export const metadata = {
  title: "약 용량 계산기 | 체중 기준 1회 복용량 계산",
  description:
    "체중과 약물 종류를 입력하면 mg/kg 기준 1회 복용량과 1일 최대 복용량을 계산합니다. 타이레놀, 이부프로펜, 어린이 약 용량 지원.",
};

export default function Page() {
  return <ClientPage />;
}
