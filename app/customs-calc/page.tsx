import ClientPage from "./ClientPage";

export const metadata = {
  title: "관세 계산기 | 해외 직구 관세·부가세 계산",
  description:
    "물품 가격(USD), 환율, 관세율을 입력하면 관세와 부가세, 총 납부세액을 계산합니다. 면세 한도도 자동 확인합니다.",
};

export default function Page() {
  return <ClientPage />;
}
