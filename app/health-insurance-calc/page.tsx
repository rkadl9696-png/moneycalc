import ClientPage from "./ClientPage";

export const metadata = {
  title: "건강보험료 계산기 | 직장·지역가입자 보험료 계산",
  description:
    "직장가입자는 월 보수월액, 지역가입자는 재산·소득·자동차 점수를 입력해 건강보험료와 장기요양보험료를 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
