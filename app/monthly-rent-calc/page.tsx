import ClientPage from "./ClientPage";

export const metadata = {
  title: "월세 계산기 | 전월세 전환율로 전세↔월세 환산",
  description:
    "전세금과 전월세전환율을 입력하면 적정 월세를 계산합니다. 보증금 조정 시 잔여 전세금 기준 월세도 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
