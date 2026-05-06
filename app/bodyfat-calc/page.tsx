import ClientPage from "./ClientPage";

export const metadata = {
  title: "체지방률 계산기 | 미해군 공식으로 체지방 측정",
  description:
    "키·몸무게·허리·목·엉덩이 둘레를 입력하면 미해군 공식으로 체지방률을 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
