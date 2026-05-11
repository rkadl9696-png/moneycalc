import ClientPage from "./ClientPage";

export const metadata = {
  title: "소멸시효 계산기 | 채권 종류별 시효 만료일 계산",
  description:
    "채권 종류와 기산일을 입력하면 소멸시효 만료일과 남은 일수를 자동으로 계산합니다. 일반채권·상사채권·임금채권·불법행위 지원.",
};

export default function Page() {
  return <ClientPage />;
}
