import ClientPage from "./ClientPage";

export const metadata = {
  title: "퇴직금 계산기 | 세전·세후 퇴직금 바로 계산",
  description:
    "입사일, 퇴사일, 평균임금을 입력해 퇴직금과 퇴직소득세를 바로 계산해보세요.",
};

export default function Page() {
  return <ClientPage />;
}
