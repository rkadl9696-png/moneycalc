import ClientPage from "./ClientPage";

export const metadata = {
  title: "기초대사량 계산기 | BMR·일일 권장 칼로리 계산",
  description:
    "성별·나이·키·몸무게를 입력하면 Mifflin-St Jeor 공식으로 기초대사량(BMR)과 활동 수준별 일일 권장 칼로리를 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
