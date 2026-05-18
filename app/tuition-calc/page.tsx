import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "대학 등록금 계산기 | 계산기 모음",
  description: "대학 유형(국공립/사립)과 학과 계열을 선택하면 학기별·4년 총 등록금을 자동으로 계산합니다. 입학금을 포함한 국공립·사립 평균 등록금을 비교하고 학비를 계획하세요.",
};

export default function Page() {
  return <ClientPage />;
}
