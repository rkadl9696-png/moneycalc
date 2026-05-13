import ClientPage from "./ClientPage";

export const metadata = {
  title: "상속세 계산기 | 상속 재산 납부세액 계산",
  description:
    "상속 재산 총액과 상속인 구성을 입력하면 기초공제·배우자공제 후 상속세 납부세액을 바로 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
