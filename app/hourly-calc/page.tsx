import ClientPage from "./ClientPage";

export const metadata = {
  title: "시급 계산기 | 2026년 최저시급 일급 월급 계산",
  description:
    "시급, 하루 근무 시간, 주 근무 일수를 입력하면 일급·주급·월급·연봉을 계산합니다. 주휴수당 포함 여부도 선택 가능합니다.",
};

export default function Page() {
  return <ClientPage />;
}
