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