import Link from "next/link";

const CATEGORIES: Record<string, { href: string; icon: string; title: string }[]> = {
  "부동산": [
    { href: "/jeonse-vs-rent", icon: "🏠", title: "전세 vs 월세 계산기" },
    { href: "/jeonse-loan-calc", icon: "🔑", title: "전세대출 계산기" },
    { href: "/loan-calc", icon: "💳", title: "대출 상환 계산기" },
    { href: "/cheongak-calc", icon: "🏢", title: "청약 가점 계산기" },
    { href: "/capital-gains-calc", icon: "🏡", title: "양도소득세 계산기" },
    { href: "/mortgage-calc", icon: "🏠", title: "주택담보대출 계산기" },
    { href: "/prepayment-calc", icon: "💰", title: "중도상환수수료 계산기" },
    { href: "/rent-yield-calc", icon: "🏘️", title: "월세 수익률 계산기" },
    { href: "/realestate-yield-calc", icon: "🏗️", title: "부동산 수익률 계산기" },
  ],
  "급여·재테크": [
    { href: "/salary-calc", icon: "💰", title: "연봉 실수령 계산기" },
    { href: "/compound", icon: "📈", title: "복리 계산기" },
    { href: "/interest-calc", icon: "🏦", title: "이자 계산기" },
    { href: "/savings-calc", icon: "🐷", title: "적금 계산기" },
    { href: "/exchange-calc", icon: "💱", title: "환율 계산기" },
    { href: "/stock-calc", icon: "📈", title: "주식 수익률 계산기" },
    { href: "/severance-calc", icon: "💼", title: "퇴직금 계산기" },
    { href: "/unemployment-calc", icon: "📋", title: "실업급여 계산기" },
    { href: "/mincalc", icon: "💵", title: "최저시급 계산기" },
    { href: "/weekly-holiday-calc", icon: "📅", title: "주휴수당 계산기" },
    { href: "/insurance-calc", icon: "🛡️", title: "4대보험 계산기" },
    { href: "/parental-leave-calc", icon: "👶", title: "육아휴직급여 계산기" },
    { href: "/pension-calc", icon: "🏦", title: "연금 계산기" },
    { href: "/installment-calc", icon: "💳", title: "할부 계산기" },
  ],
  "세금": [
    { href: "/gift-tax-calc", icon: "🎁", title: "증여세 계산기" },
    { href: "/income-tax-calc", icon: "📊", title: "종합소득세 계산기" },
  ],
  "건강": [
    { href: "/bmi-calc", icon: "⚖️", title: "BMI 계산기" },
    { href: "/calorie-calc", icon: "🔥", title: "칼로리 계산기" },
    { href: "/bodyfat-calc", icon: "📏", title: "체지방률 계산기" },
    { href: "/bmr-calc", icon: "🔋", title: "기초대사량 계산기" },
    { href: "/due-date-calc", icon: "🤰", title: "임신 출산 예정일 계산기" },
    { href: "/sleep-calc", icon: "😴", title: "수면 시간 계산기" },
    { href: "/water-calc", icon: "💧", title: "적정 음수량 계산기" },
    { href: "/eye-rest-calc", icon: "👁️", title: "눈 건강 휴식 계산기" },
    { href: "/blood-pressure-calc", icon: "❤️", title: "혈압 계산기" },
    { href: "/exercise-calc", icon: "🏃", title: "운동 소모 칼로리 계산기" },
    { href: "/period-calc", icon: "🌸", title: "생리 주기 계산기" },
    { href: "/quit-smoking-calc", icon: "🚭", title: "금연 계산기" },
    { href: "/alcohol-calc", icon: "🍺", title: "음주량 계산기" },
  ],
  "생활": [
    { href: "/age-calc", icon: "🎂", title: "나이 계산기" },
    { href: "/dday-calc", icon: "📅", title: "D-day 계산기" },
    { href: "/unit-calc", icon: "📐", title: "단위 변환 계산기" },
    { href: "/parcel-calc", icon: "📦", title: "택배 무게 계산기" },
    { href: "/difficulty-calc", icon: "🎯", title: "난이도 계산기" },
    { href: "/time-calc", icon: "⏱️", title: "시간 계산기" },
    { href: "/pet-age-calc", icon: "🐾", title: "반려동물 나이 계산기" },
    { href: "/lotto-calc", icon: "🎰", title: "로또 확률 계산기" },
  ],
  "소비": [
    { href: "/card-calc", icon: "🎫", title: "카드 할인 계산기" },
    { href: "/tip-calc", icon: "💵", title: "팁 계산기" },
    { href: "/fuel-calc", icon: "⛽", title: "연료비 계산기" },
    { href: "/electricity-calc", icon: "⚡", title: "전기요금 계산기" },
  ],
};

const HREF_TO_CATEGORY: Record<string, string> = {};
for (const [category, items] of Object.entries(CATEGORIES)) {
  for (const item of items) {
    HREF_TO_CATEGORY[item.href] = category;
  }
}

export default function RelatedCalculators({ current }: { current: string }) {
  const category = HREF_TO_CATEGORY[current];
  const items = category
    ? CATEGORIES[category].filter((c) => c.href !== current)
    : [];

  if (items.length === 0) return null;

  return (
    <div className="mt-10">
      <p className="font-bold text-gray-700 mb-3">함께 보면 좋은 계산기</p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-sm"
          >
            <span className="text-lg">{calc.icon}</span>
            <span className="text-gray-700 font-medium">{calc.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
