import ClientPage from "./ClientPage";

export const metadata = {
  title: "수면 시간 계산기 | 수면 사이클·권장 기상 시간 계산",
  description:
    "취침·기상 시간을 입력하면 총 수면 시간, 수면 사이클, 권장 기상 시간을 계산합니다.",
};

export default function Page() {
  return <ClientPage />;
}
