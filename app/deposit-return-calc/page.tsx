import ClientPage from "./ClientPage";

export const metadata = {
  title: "전세 보증금 반환 계산기 | 지연이자 청구액 계산",
  description:
    "전세 계약 만료 후 보증금 반환이 지연될 때 주택임대차보호법 연 12% 기준 지연이자와 총 청구액을 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
