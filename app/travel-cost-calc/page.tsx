import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "여행 경비 계산기 | 계산기 모음",
  description: "여행 일수, 인원, 항공·숙박·식비·관광·기타 항목을 입력하면 여행 총 경비와 1인당 비용을 자동으로 계산합니다. 항목별 비중 분석으로 여행 예산을 효과적으로 계획하세요.",
};

export default function Page() {
  return <ClientPage />;
}
