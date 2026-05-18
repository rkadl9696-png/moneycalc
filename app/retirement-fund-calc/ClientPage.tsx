"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const INFLATION = 0.02;

function fv(monthly: number, years: number, rate: number) {
  if (rate === 0) return monthly * 12 * years;
  const r = rate / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

export default function ClientPage() {
  const [currentAge, setCurrentAge] = useState(35);
  const [retireAge, setRetireAge] = useState(60);
  const [lifeExp, setLifeExp] = useState(90);
  const [monthlyLiving, setMonthlyLiving] = useState(2_500_000);
  const [currentSaving, setCurrentSaving] = useState(50_000_000);
  const [monthlySaving, setMonthlySaving] = useState(500_000);
  const [returnRate, setReturnRate] = useState(5);

  const r = useMemo(() => {
    const yearsToRetire = Math.max(0, retireAge - currentAge);
    const retirementYears = Math.max(0, lifeExp - retireAge);
    const annualRate = returnRate / 100;

    const inflatedMonthly = monthlyLiving * Math.pow(1 + INFLATION, yearsToRetire);
    const totalNeeded = inflatedMonthly * 12 * retirementYears;

    const currentSavingFV = currentSaving * Math.pow(1 + annualRate, yearsToRetire);
    const monthlySavingFV = fv(monthlySaving, yearsToRetire, annualRate);
    const totalFV = currentSavingFV + monthlySavingFV;

    const gap = totalNeeded - totalFV;

    return {
      yearsToRetire,
      retirementYears,
      inflatedMonthly: Math.round(inflatedMonthly),
      totalNeeded: Math.round(totalNeeded),
      currentSavingFV: Math.round(currentSavingFV),
      monthlySavingFV: Math.round(monthlySavingFV),
      totalFV: Math.round(totalFV),
      gap: Math.round(gap),
    };
  }, [currentAge, retireAge, lifeExp, monthlyLiving, currentSaving, monthlySaving, returnRate]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();
  const fmtB = (n: number) => (n / 100_000_000).toFixed(2) + "억";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">노후자금 계산기</h1>
      <p className="text-gray-600 mb-6">현재 나이, 은퇴 계획, 저축 정보를 입력하면 은퇴 후 필요한 노후자금과 준비 상황을 분석합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">기본 정보</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">현재 나이</label>
            <input type="number" min={20} max={80} value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">은퇴 나이</label>
            <input type="number" min={40} max={80} value={retireAge}
              onChange={(e) => setRetireAge(Number(e.target.value))}
              className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">기대 수명</label>
            <input type="number" min={60} max={120} value={lifeExp}
              onChange={(e) => setLifeExp(Number(e.target.value))}
              className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">예상 수익률 (%)</label>
            <input type="number" min={0} max={20} step={0.5} value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
              className="w-full border p-2 rounded" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">은퇴 후 월 생활비 (현재가치, 원)</label>
          <input type="number" min={0} step={100000} value={monthlyLiving}
            onChange={(e) => setMonthlyLiving(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">현재 저축액 (원)</label>
          <input type="number" min={0} step={1000000} value={currentSaving}
            onChange={(e) => setCurrentSaving(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">월 저축액 (원)</label>
          <input type="number" min={0} step={100000} value={monthlySaving}
            onChange={(e) => setMonthlySaving(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
      </section>

      <section className={`border-2 rounded-xl p-5 mb-8 ${r.gap > 0 ? "bg-red-50 border-red-400" : "bg-green-50 border-green-400"}`}>
        <h2 className="text-base font-bold mb-4">{r.gap > 0 ? "노후자금 부족 예상" : "노후자금 충분 예상"}</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">은퇴 시 월 생활비 (물가반영)</p>
            <p className="text-lg font-bold text-gray-800">{fmt(r.inflatedMonthly)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">필요 총 노후자금</p>
            <p className="text-lg font-bold text-gray-800">{fmtB(r.totalNeeded)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">예상 은퇴 자산 합계</p>
            <p className="text-lg font-bold text-blue-600">{fmtB(r.totalFV)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{r.gap > 0 ? "부족액" : "여유액"}</p>
            <p className={`text-lg font-bold ${r.gap > 0 ? "text-red-600" : "text-green-600"}`}>
              {fmtB(Math.abs(r.gap))}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500">은퇴까지 {r.yearsToRetire}년, 은퇴 후 {r.retirementYears}년 | 물가상승률 2% 반영</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">노후 자금 준비 전략</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          노후 자금 준비의 핵심은 '얼마나 일찍 시작하느냐'입니다.
          복리 효과로 인해 30대에 시작한 저축은 40대에 시작한 것보다 2배 이상 효과가 있습니다.
          국민연금은 기본 노후 소득원으로 최대한 늦게(최대 70세) 받으면 수령액이 월 7.2%씩 증가합니다.
          개인형 퇴직연금(IRP)과 연금저축은 세액공제 혜택(연간 최대 900만 원 한도, 16.5% 공제)이 있어 절세와 노후 준비를 동시에 할 수 있습니다.
          주식·부동산·채권 등 다양한 자산에 분산 투자하여 리스크를 관리하는 것이 중요합니다.
          은퇴 시점에 가까울수록 안전자산 비중을 높이는 생애주기 투자 전략을 활용하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "노후 자금으로 얼마나 준비해야 하나요?", a: "은퇴 후 월 250만 원의 생활비를 25년 동안 쓴다면 약 7억 5천만 원이 필요합니다. 물가상승률(2%)을 고려하면 실제 필요 금액은 더 많아집니다." },
          { q: "국민연금만으로 노후가 가능한가요?", a: "국민연금 평균 수령액은 월 55만~65만 원 수준으로 노후 생활비를 충당하기 어렵습니다. 퇴직연금, 개인연금, 저축 등으로 보완이 필요합니다." },
          { q: "IRP(개인형 퇴직연금)와 연금저축의 차이는?", a: "IRP는 근로자·자영업자 누구나 가입 가능하며 연간 900만 원까지 세액공제됩니다. 연금저축은 ISA 만기금 전환 한도 등 별도 혜택이 있습니다. 두 계좌의 합산 세액공제 한도는 연 900만 원입니다." },
          { q: "은퇴 후 생활비는 얼마로 잡아야 하나요?", a: "노후 최소 생활비는 부부 기준 월 220만~270만 원, 여유 생활비는 350만~450만 원 수준이 필요한 것으로 조사됩니다. 개인 생활 방식에 따라 달라집니다." },
          { q: "물가상승률은 왜 중요한가요?", a: "물가상승률 2%가 30년간 지속되면 현재의 1억 원은 약 5,500만 원의 구매력밖에 안 됩니다. 노후 준비 시 물가상승을 반영한 실질 구매력 기준으로 계획해야 합니다." },
          { q: "조기 은퇴(FIRE)를 목표로 한다면?", a: "FIRE(Financial Independence, Retire Early)는 연간 생활비의 25배를 모으는 것을 목표로 합니다. 안전인출률 4%를 기준으로, 월 250만 원 생활비라면 약 7억 5천만 원이 필요합니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/retirement-fund-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
