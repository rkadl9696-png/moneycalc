import ClientPage from "./ClientPage";

export const metadata = {
  title: "BMI 계산기 | 내 체질량지수와 정상 체중 확인",
  description:
    "키와 몸무게를 입력하면 BMI(체질량지수)와 정상 체중 범위를 바로 계산해보세요.",
};

export default function Page() {
  return <ClientPage />;
}
