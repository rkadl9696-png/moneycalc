import Link from "next/link";

export const metadata = {
  title: "소개 | 계산기 모음",
  description: "계산기 모음 서비스를 소개합니다. 금융, 세금, 건강 등 생활에 필요한 모든 계산기를 한 곳에서 이용하세요.",
};

const categories = [
  {
    icon: "🏠",
    label: "부동산",
    items: ["전세 vs 월세 계산기", "전세대출 계산기", "대출 상환 계산기", "청약 가점 계산기", "양도소득세 계산기", "주택담보대출 계산기", "중도상환수수료 계산기"],
  },
  {
    icon: "💰",
    label: "급여·재테크",
    items: ["연봉 실수령 계산기", "복리 계산기", "이자 계산기", "적금 계산기", "환율 계산기", "주식 수익률 계산기", "퇴직금 계산기", "실업급여 계산기", "최저시급 계산기", "주휴수당 계산기", "4대보험 계산기", "육아휴직급여 계산기"],
  },
  {
    icon: "💸",
    label: "세금",
    items: ["증여세 계산기", "종합소득세 계산기"],
  },
  {
    icon: "🏃",
    label: "건강",
    items: ["BMI 계산기", "칼로리 계산기", "체지방률 계산기", "기초대사량 계산기", "임신 출산 예정일 계산기", "수면 시간 계산기", "적정 음수량 계산기", "눈 건강 휴식 계산기"],
  },
  {
    icon: "🛍️",
    label: "소비",
    items: ["카드 할인 계산기"],
  },
];

export default function Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors">
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">계산기 모음 소개</h1>
      <p className="text-gray-500 mb-8">금융, 세금, 건강까지 — 생활에 필요한 모든 계산을 한 번에</p>

      {/* 소개 */}
      <section className="mb-8">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-4">
          <p className="text-gray-700 leading-relaxed">
            <strong>계산기 모음</strong>은 복잡한 금융 계산, 세금 신고, 건강 관리에 필요한 다양한 계산기를
            누구나 쉽고 빠르게 이용할 수 있도록 만든 무료 웹 서비스입니다.
          </p>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>회원가입 없이 누구나 무료로 이용 가능</li>
          <li>모바일·PC 모두 최적화된 반응형 디자인</li>
          <li>한국 법령·기준에 맞는 정확한 계산 로직</li>
          <li>광고 없이 빠르고 가벼운 서비스</li>
        </ul>
      </section>

      {/* 계산기 목록 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">제공 계산기 목록</h2>
        <div className="flex flex-col gap-4">
          {categories.map((cat) => (
            <div key={cat.label} className="border rounded-lg p-4">
              <h3 className="font-bold text-gray-700 mb-2">
                {cat.icon} {cat.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span key={item} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 문의 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">문의</h2>
        <p className="text-gray-700 leading-relaxed">
          계산기 오류 제보, 새로운 계산기 요청, 기타 문의는 아래 이메일로 연락주세요.
          <br />
          <a href="mailto:rkadl96@gmail.com" className="text-blue-600 underline">
            rkadl96@gmail.com
          </a>
        </p>
      </section>

      <div className="text-center">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700"
        >
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
