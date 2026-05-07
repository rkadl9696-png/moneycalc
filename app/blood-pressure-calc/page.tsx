import ClientPage from "./ClientPage";
export const metadata = {
  title: "혈압 계산기 - 대한고혈압학회 기준 판정",
  description: "수축기·이완기 혈압을 입력하면 대한고혈압학회 기준으로 정상·주의·고혈압 전단계·고혈압 1기·2기를 판정하고 맥압과 평균동맥압을 계산합니다.",
};
export default function Page() { return <ClientPage />; }
