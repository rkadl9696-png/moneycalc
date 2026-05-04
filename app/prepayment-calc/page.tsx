import ClientPage from "./ClientPage";

export const metadata = {
  title: "중도상환수수료 계산기 | 대출 조기 상환 비용 계산",
  description:
    "대출 실행일, 중도상환일, 수수료율을 입력하면 중도상환수수료를 바로 계산해보세요. 3년 경과 면제 여부도 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
