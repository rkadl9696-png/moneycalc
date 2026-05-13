import ClientPage from "./ClientPage";

export const metadata = {
  title: "프리랜서 세금 계산기 | 종합소득세·환급액 계산",
  description:
    "프리랜서 연간 수입과 업종을 입력하면 단순경비율로 종합소득세와 3.3% 원천징수 후 추가납부 또는 환급액을 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
