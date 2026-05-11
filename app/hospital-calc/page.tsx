import ClientPage from "./ClientPage";

export const metadata = {
  title: "병원비 계산기 | 건강보험 본인부담금 계산",
  description:
    "의료기관 종류와 진료 유형을 선택하고 총 진료비를 입력하면 건강보험 적용 후 실제 납부액을 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
