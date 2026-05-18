import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "취득세 계산기 | 계산기 모음",
  description: "주택 취득가액, 주택 수, 취득 유형(매매/증여/상속)을 입력하면 취득세와 지방교육세, 농어촌특별세를 자동으로 계산합니다. 1주택부터 3주택 이상까지 정확한 취득세를 확인하세요.",
};

export default function Page() {
  return <ClientPage />;
}
