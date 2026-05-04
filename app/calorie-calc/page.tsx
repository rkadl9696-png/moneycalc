import ClientPage from "./ClientPage";

export const metadata = {
  title: "칼로리 계산기 | 기초대사량·일일 권장 칼로리 계산",
  description:
    "성별·나이·키·몸무게·활동 수준을 입력하면 기초대사량(BMR)과 일일 권장 칼로리를 바로 계산해보세요.",
};

export default function Page() {
  return <ClientPage />;
}
