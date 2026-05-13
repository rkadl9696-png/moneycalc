import ClientPage from "./ClientPage";

export const metadata = {
  title: "아파트 관리비 계산기 | 항목별 관리비 예상액 계산",
  description:
    "전용면적과 공용면적, 항목별 단가를 입력하면 일반관리비·청소비·경비비 등 아파트 관리비 예상 합계를 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
