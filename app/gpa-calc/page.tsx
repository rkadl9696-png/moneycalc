import ClientPage from "./ClientPage";

export const metadata = {
  title: "학점 계산기 | 평균 평점(GPA) 자동 계산",
  description:
    "과목별 학점수와 성적을 입력하면 4.5 만점, 4.3 만점 기준 평균 학점(GPA)을 자동으로 계산해드립니다.",
};

export default function Page() {
  return <ClientPage />;
}
