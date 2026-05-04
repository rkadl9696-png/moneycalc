import ClientPage from "./ClientPage";

export const metadata = {
  title: "환율 계산기 | 원화↔외화 환전 금액 계산",
  description:
    "환율과 수수료율을 직접 입력해 원화↔외화 환전 금액을 수수료 포함/미포함으로 바로 계산해보세요.",
};

export default function Page() {
  return <ClientPage />;
}
