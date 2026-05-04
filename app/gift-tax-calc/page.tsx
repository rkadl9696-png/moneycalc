import ClientPage from "./ClientPage";

export const metadata = {
  title: "증여세 계산기 | 증여세 얼마나 나올까?",
  description:
    "증여 금액과 증여자 관계를 입력하면 공제 한도, 과세표준, 최종 납부세액을 바로 계산해보세요.",
};

export default function Page() {
  return <ClientPage />;
}
