import Link from "next/link";

const calculators = [
  {
    href: "/jeonse-vs-rent",
    icon: "🏠",
    title: "전세 vs 월세 계산기",
    desc: "전세와 월세 중 어떤 선택이 더 유리한지 바로 계산",
  },
  {
    href: "/loan-calc",
    icon: "💳",
    title: "대출 상환 계산기",
    desc: "원리금균등 vs 원금균등, 총 이자 차이 비교",
  },
  {
    href: "/salary-calc",
    icon: "💰",
    title: "연봉 실수령 계산기",
    desc: "세후 월급이 얼마인지 바로 확인",
  },
  {
    href: "/compound",
    icon: "📈",
    title: "복리 계산기",
    desc: "투자 수익이 얼마나 불어나는지 계산",
  },
  {
    href: "/card-calc",
    icon: "🎫",
    title: "카드 할인 계산기",
    desc: "할인 적용 후 실제 결제 금액 확인",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">💸 금융 계산기 모음</h1>
          <p className="text-gray-500 text-base">
            전세, 대출, 연봉, 복리, 카드 할인까지
            <br />
            내 돈과 관련된 모든 계산을 한 번에
          </p>
        </div>

        {/* 카드 목록 */}
        <div className="flex flex-col gap-4">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-400 transition-all"
            >
              <div className="text-3xl w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg shrink-0">
                {calc.icon}
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-800">{calc.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{calc.desc}</p>
              </div>
              <div className="ml-auto text-gray-300 text-xl">›</div>
            </Link>
          ))}
        </div>

        {/* 하단 설명 */}
        <p className="text-center text-xs text-gray-400 mt-10">
          계산 결과는 참고용이며 실제와 다를 수 있습니다.
        </p>

      </div>
    </div>
  );
}