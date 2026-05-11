import ClientPage from "./ClientPage";

export const metadata = {
  title: "전기차 충전 비용 계산기 | 충전 요금·시간·절약액 계산",
  description:
    "배터리 용량과 충전 방식을 입력하면 전기차 충전 비용, 충전 시간, 내연기관차 대비 절약액을 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
