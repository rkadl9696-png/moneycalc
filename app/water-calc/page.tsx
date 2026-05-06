import ClientPage from "./ClientPage";

export const metadata = {
  title: "적정 음수량 계산기 | 하루 물 섭취량 계산",
  description:
    "몸무게·활동 수준·날씨를 입력하면 하루 권장 음수량과 시간대별 음수 스케줄을 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
