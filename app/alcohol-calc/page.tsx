import ClientPage from "./ClientPage";
export const metadata = {
  title: "음주량 계산기 - 순수 알코올 그램·위험도 판정",
  description: "음료 종류·용량·잔 수를 입력하면 순수 알코올량(g)과 WHO 기준 위험도, 알코올 분해 시간을 계산합니다.",
};
export default function Page() { return <ClientPage />; }
