import Link from "next/link";

const calculators = [
  { href: "/jeonse-vs-rent", icon: "🏠", title: "전세 vs 월세 계산기" },
  { href: "/loan-calc", icon: "💳", title: "대출 상환 계산기" },
  { href: "/salary-calc", icon: "💰", title: "연봉 실수령 계산기" },
  { href: "/compound", icon: "📈", title: "복리 계산기" },
  { href: "/card-calc", icon: "🎫", title: "카드 할인 계산기" },
  { href: "/interest-calc", icon: "🏦", title: "이자 계산기" },
  { href: "/savings-calc", icon: "🐷", title: "적금 계산기" },
  { href: "/jeonse-loan-calc", icon: "🔑", title: "전세대출 계산기" },
  { href: "/cheongak-calc", icon: "🏢", title: "청약 가점 계산기" },
  { href: "/severance-calc", icon: "💼", title: "퇴직금 계산기" },
  { href: "/unemployment-calc", icon: "📋", title: "실업급여 계산기" },
  { href: "/mincalc", icon: "💵", title: "최저시급 계산기" },
  { href: "/weekly-holiday-calc", icon: "📅", title: "주휴수당 계산기" },
  { href: "/insurance-calc", icon: "🛡️", title: "4대보험 계산기" },
  { href: "/gift-tax-calc", icon: "🎁", title: "증여세 계산기" },
  { href: "/capital-gains-calc", icon: "🏡", title: "양도소득세 계산기" },
  { href: "/income-tax-calc", icon: "📊", title: "종합소득세 계산기" },
  { href: "/mortgage-calc", icon: "🏠", title: "주택담보대출 계산기" },
  { href: "/prepayment-calc", icon: "💰", title: "중도상환수수료 계산기" },
  { href: "/parental-leave-calc", icon: "👶", title: "육아휴직급여 계산기" },
  { href: "/exchange-calc", icon: "💱", title: "환율 계산기" },
  { href: "/stock-calc", icon: "📈", title: "주식 수익률 계산기" },
  { href: "/bmi-calc", icon: "⚖️", title: "BMI 계산기" },
  { href: "/calorie-calc", icon: "🔥", title: "칼로리 계산기" },
  { href: "/bodyfat-calc", icon: "📏", title: "체지방률 계산기" },
  { href: "/bmr-calc", icon: "🔋", title: "기초대사량 계산기" },
];

export default function RelatedCalculators() {
  return (
    <div className="mt-10">
      <p className="font-bold text-gray-700 mb-3">함께 보면 좋은 계산기</p>
      <div className="grid grid-cols-2 gap-2">
        {calculators.map((calc) => (
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