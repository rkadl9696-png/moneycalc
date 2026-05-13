import ClientPage from "./ClientPage";

export const metadata = {
  title: "국민연금 계산기 | 월 납부액 예상 연금 수령액",
  description:
    "월 소득과 가입 기간을 입력하면 국민연금 월 납부액(근로자·사업주 분담)과 예상 연금 수령액을 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
