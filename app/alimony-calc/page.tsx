import ClientPage from "./ClientPage";

export const metadata = {
  title: "위자료 계산기 | 한국 법원 기준 위자료 추정",
  description:
    "혼인 기간, 유책 사유, 자녀 수, 소득 차이 등을 입력하면 한국 법원 기준 위자료 추정액을 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
