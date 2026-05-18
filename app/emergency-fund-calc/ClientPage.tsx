"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const BASE_MONTHS: Record<string, number> = { 고: 3, 중: 6, 저: 12 };

export default function ClientPage() {
  const [fixedExpense, setFixedExpense] = useState(1_500_000);
  const [varExpense, setVarExpense] = useState(500_000);
  const [jobStability, setJobStability] = useState("중");
  const [dependents, setDependents] = useState(1);
  const [currentFund, setCurrentFund] = useState(3_000_000);

  const r = useMemo(() => {
    const totalMonthly = fixedExpense + varExpense;
    const baseMonths = BASE_MONTHS[jobStability];
    const totalMonths = baseMonths + dependents;
    const recommended = totalMonthly * totalMonths;
    const gap = recommended - currentFund;
    return { totalMonthly, baseMonths, totalMonths, recommended, gap };
  }, [fixedExpense, varExpense, jobStability, dependents, currentFund]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">비상금 계산기</h1>
      <p className="text-gray-600 mb-6">월 지출과 직업 안정성을 입력하면 적정 비상금 규모와 현재 준비 상황을 알려드립니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">월 고정지출 (원) - 주거비, 보험, 통신비 등</label>
          <input type="number" min={0} step={100000} value={fixedExpense}
            onChange={(e) => setFixedExpense(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">월 변동지출 (원) - 식비, 교통비, 여가 등</label>
          <input type="number" min={0} step={100000} value={varExpense}
            onChange={(e) => setVarExpense(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">직업 안정성</label>
          <div className="flex gap-2">
            {[
              { key: "고", label: "높음 (공무원·대기업)" },
              { key: "중", label: "보통 (일반 직장)" },
              { key: "저", label: "낮음 (프리랜서·자영업)" },
            ].map((s) => (
              <button key={s.key} onClick={() => setJobStability(s.key)}
                className={`flex-1 px-3 py-2 rounded-lg border-2 text-xs font-bold transition-colors ${jobStability === s.key ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">안정성별 권장 기간: 높음 3개월, 보통 6개월, 낮음 12개월</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">부양가족 수 (본인 제외, 추가 +1개월/인)</label>
          <input type="number" min={0} max={10} value={dependents}
            onChange={(e) => setDependents(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">현재 보유 비상금 (원)</label>
          <input type="number" min={0} step={500000} value={currentFund}
            onChange={(e) => setCurrentFund(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
      </section>

      <section className={`border-2 rounded-xl p-5 mb-8 ${r.gap > 0 ? "bg-orange-50 border-orange-400" : "bg-green-50 border-green-400"}`}>
        <h2 className="text-base font-bold mb-4">{r.gap > 0 ? "비상금 부족" : "비상금 충분"}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">월 총 지출</p>
            <p className="text-xl font-bold text-gray-800">{fmt(r.totalMonthly)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">권장 비상금 기간</p>
            <p className="text-xl font-bold text-blue-600">{r.totalMonths}개월</p>
            <p className="text-xs text-gray-400">기본 {r.baseMonths}개월 + 부양가족 {dependents}개월</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">권장 비상금</p>
            <p className="text-xl font-bold text-gray-800">{fmt(r.recommended)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">현재 비상금</p>
            <p className={`text-xl font-bold ${r.gap > 0 ? "text-orange-600" : "text-green-600"}`}>{fmt(currentFund)}원</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-xs text-gray-500 mb-0.5">{r.gap > 0 ? "추가로 필요한 비상금" : "비상금 여유액"}</p>
          <p className={`text-3xl font-bold ${r.gap > 0 ? "text-orange-600" : "text-green-600"}`}>
            {fmt(Math.abs(r.gap))}원
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">비상금이란?</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          비상금은 예기치 않은 상황(갑작스러운 실직, 질병, 사고, 긴급 수리 등)에 대비하여 준비해두는 현금성 자산입니다.
          금융 전문가들은 일반적으로 3~12개월치 생활비를 비상금으로 보유할 것을 권장합니다.
          직업 안정성이 높은 공무원이나 대기업 직장인은 3개월, 일반 직장인은 6개월, 프리랜서나 자영업자는 12개월이 적당합니다.
          부양가족이 있다면 생활비 의존도가 높으므로 1인당 1개월분을 추가로 준비하는 것이 좋습니다.
          비상금은 언제든 인출 가능한 CMA, 파킹통장, 고금리 보통예금 등 유동성이 높은 계좌에 보관하세요.
          비상금은 투자용 자산과 분리하여 관리하고, 절대로 주식이나 펀드 등 변동성 높은 자산에 넣지 마세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "비상금은 어디에 보관하는 것이 좋나요?", a: "비상금은 CMA(종합자산관리계좌), 파킹통장, 고금리 수시입출금 통장에 보관하는 것이 좋습니다. 이자도 받으면서 언제든 인출할 수 있습니다." },
          { q: "비상금을 다 써버렸을 때 어떻게 해야 하나요?", a: "비상금을 사용하면 최대한 빨리 다시 채워야 합니다. 매월 저축의 우선순위를 비상금 복원에 두고, 목표 금액을 달성하면 다시 정상적인 재정 계획으로 돌아가세요." },
          { q: "비상금과 생활비 통장을 분리해야 하나요?", a: "가능하면 분리하는 것이 좋습니다. 별도 통장에 비상금을 관리하면 실수로 사용하는 것을 방지하고, 잔액을 명확히 파악할 수 있습니다." },
          { q: "신용카드 한도가 있으면 비상금이 필요 없을까요?", a: "신용카드는 비상금의 대체제가 아닙니다. 갑작스러운 실직 시 신용카드 대금을 갚을 수 없게 되고, 이자가 발생하여 재정 상황이 더 나빠질 수 있습니다." },
          { q: "비상금 모으는 가장 빠른 방법은?", a: "매월 수입이 들어오면 자동이체로 비상금 통장에 일정 금액을 먼저 이체하세요. '자동저축'으로 먼저 저축하고 나머지로 생활하는 습관이 가장 효과적입니다." },
          { q: "대출금이 있을 때도 비상금이 필요한가요?", a: "네, 대출금이 있어도 최소 2~3개월치 생활비는 비상금으로 보유해야 합니다. 비상 상황에서 대출을 추가로 받으면 이자 부담이 크게 늘어납니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/emergency-fund-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
