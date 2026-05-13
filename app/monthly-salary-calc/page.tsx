import ClientPage from "./ClientPage";

export const metadata = {
  title: "월급 계산기 | 4대보험·소득세 공제 후 실수령액",
  description:
    "연봉 또는 월급을 입력하면 4대보험, 소득세, 지방소득세 공제 후 실수령액을 항목별로 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
