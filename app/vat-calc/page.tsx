import ClientPage from "./ClientPage";

export const metadata = {
  title: "부가가치세 계산기 | 공급가액 VAT 포함가 계산",
  description:
    "공급가액에서 VAT 포함가를 계산하거나, VAT 포함가에서 공급가액과 부가세를 역산합니다. 간이과세 부가율도 지원합니다.",
};

export default function Page() {
  return <ClientPage />;
}
