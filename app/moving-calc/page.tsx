import ClientPage from "./ClientPage";

export const metadata = {
  title: "이사 비용 계산기 | 이사 유형별 예상 비용 계산",
  description:
    "이사 유형, 이동 거리, 짐 규모, 날짜 조건을 입력하면 예상 이사 비용 범위와 할증 정보를 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
