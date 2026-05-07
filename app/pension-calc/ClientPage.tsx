"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(30); // 만원
  const [annualRate, setAnnualRate] = useState(5); // %
  const [receiveYears, setReceiveYears] = useState(20); // 년

  const r = useMemo(() => {
    const savingYears = Math.max(0, retireAge - currentAge);
    const n = savingYears * 12; // 납입 개월수
    const r = annualRate / 100 / 12; // 월 수익률
    const pmt = monthlyPayment * 10000; // 원 단위

    let totalSavings = 0;
    if (r === 0) {
      totalSavings = pmt * n;
    } else {
      totalSavings = pmt * ((Math.pow(1 + r, n) - 1) / r);
    }

    const totalPaid = pmt * n;
    const interest = totalSavings - totalPaid;
    const monthlyReceive = totalSavings / (receiveYears * 12);

    return { savingYears, totalSavings, totalPaid, interest, monthlyReceive };
  }, [currentAge, retireAge, monthlyPayment, annualRate, receiveYears]);

  const fmt = (n: number) => Math.round(n).toLocaleString();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">🏦 연금 계산기</h1>
      <p className="text-gray-600 mb-6">월 납입액과 예상 수익률을 입력하면 복리 공식으로 은퇴 시 총 적립액과 월 수령액을 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">연금 정보 입력</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">현재 나이</label>
            <div className="flex items-center gap-2">
              <input type="number" min={18} max={80} value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                onBlur={(e) => setCurrentAge(Math.min(80, Math.max(18, Number(e.target.value) || 30)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">세</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">은퇴 목표 나이</label>
            <div className="flex items-center gap-2">
              <input type="number" min={30} max={90} value={retireAge}
                onChange={(e) => setRetireAge(Number(e.target.value))}
                onBlur={(e) => setRetireAge(Math.min(90, Math.max(30, Number(e.target.value) || 60)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">세</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">월 납입액</label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={1000} value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                onBlur={(e) => setMonthlyPayment(Math.min(1000, Math.max(1, Number(e.target.value) || 30)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">만원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">예상 연 수익률</label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={30} step={0.1} value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                onBlur={(e) => setAnnualRate(Math.min(30, Math.max(0, Number(e.target.value) || 5)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">은퇴 후 수령 기간</label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={50} value={receiveYears}
                onChange={(e) => setReceiveYears(Number(e.target.value))}
                onBlur={(e) => setReceiveYears(Math.min(50, Math.max(1, Number(e.target.value) || 20)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">년</span>
            </div>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-base font-bold mb-4">계산 결과</h2>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500 mb-1">총 적립액</p>
          <p className="text-4xl font-bold text-blue-600">{fmt(r.totalSavings / 10000)}만원</p>
          <p className="text-sm text-gray-400 mt-1">({r.savingYears}년 납입)</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">총 납입액</p>
            <p className="text-lg font-bold text-gray-800">{fmt(r.totalPaid / 10000)}<span className="text-sm font-normal">만원</span></p>
          </div>
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">이자 수익</p>
            <p className="text-lg font-bold text-green-600">{fmt(r.interest / 10000)}<span className="text-sm font-normal">만원</span></p>
          </div>
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">월 수령액</p>
            <p className="text-lg font-bold text-purple-600">{fmt(r.monthlyReceive / 10000)}<span className="text-sm font-normal">만원</span></p>
          </div>
        </div>
        <div className="bg-white rounded p-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">납입 원금</span>
            <span className="font-medium">{((r.totalPaid / r.totalSavings) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(r.totalPaid / r.totalSavings) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>납입 원금 {fmt(r.totalPaid / 10000)}만원</span>
            <span>이자 {fmt(r.interest / 10000)}만원</span>
          </div>
        </div>
      </section>

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">복리 계산 공식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded p-3 mb-3 text-sm font-mono">
          FV = PMT × ((1 + r)^n - 1) / r<br />
          r = 월 수익률 = 연 수익률 ÷ 12<br />
          n = 납입 개월수 = 납입 기간(년) × 12
        </div>
        <p className="mb-3 text-gray-700">
          복리(複利)는 원금뿐 아니라 발생한 이자에도 이자가 붙는 방식입니다. 시간이 길어질수록 복리 효과는 기하급수적으로 커집니다. 예를 들어 월 30만원을 연 5% 수익률로 30년 납입하면 총 납입액의 2배 이상을 이자 수익으로 얻을 수 있습니다. 아인슈타인이 '세계 8대 불가사의'라고 불렀을 만큼 강력한 효과입니다.
        </p>
        <p className="text-gray-700">
          이 계산기는 납입 기간 동안 매월 동일한 금액을 납입하는 정액 적립식(PMT, Annuity)을 기준으로 계산합니다. 수익률은 세전 기준이며, 실제 수익에는 이자소득세(15.4%)가 적용될 수 있습니다.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">노후 준비를 위한 연금 종류</h2>
        <p className="mb-3 text-gray-700">
          한국의 노후 연금은 크게 국민연금(1층), 퇴직연금(2층), 개인연금(3층)으로 구성됩니다. 국민연금은 의무 가입이며, 보험료의 일부를 국가가 지원합니다. 퇴직연금(DB/DC/IRP)은 직장인의 퇴직금을 연금 형태로 운용하며, 개인연금(연금저축펀드, 연금저축보험)은 세액공제 혜택을 받을 수 있는 자발적 연금입니다.
        </p>
        <p className="mb-3 text-gray-700">
          연금저축계좌와 IRP(개인형 퇴직연금)를 합산하여 연간 900만원(연금저축 600만원 + IRP 300만원)까지 세액공제를 받을 수 있습니다. 총 급여 5,500만원 이하는 16.5%, 초과는 13.2%의 세액공제율이 적용됩니다. 연간 900만원을 납입하면 최대 148.5만원의 세금을 환급받을 수 있습니다.
        </p>
        <p className="text-gray-700">
          노후 준비는 빠를수록 유리합니다. 30세에 시작한 사람이 60세에 시작한 사람보다 같은 금액을 납입해도 훨씬 많은 자산을 만들 수 있습니다. 현재 소비를 줄이더라도 젊을 때부터 꾸준히 저축하는 습관이 노후의 재정 자유를 만드는 가장 확실한 방법입니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "국민연금과 개인연금을 동시에 가입해야 하나요?", a: "국민연금은 의무 가입이지만, 국민연금만으로 노후 생활비를 충당하기 어렵습니다. 국민연금 소득 대체율은 약 40%이므로, 퇴직연금과 개인연금을 추가로 준비하는 것이 권장됩니다." },
          { q: "연금저축과 IRP의 차이는?", a: "연금저축은 은행·보험·증권사에서 가입 가능하며, IRP는 퇴직연금을 개인이 운용하는 계좌입니다. 두 가지를 합산하여 세액공제를 최대로 받으려면 연금저축 최대 600만원 + IRP 300만원 = 900만원을 납입하는 것이 효율적입니다." },
          { q: "연금 수령 시 세금이 부과되나요?", a: "연금 수령 시 연금소득세(3.3~5.5%)가 부과됩니다. 연간 연금 수령액이 1,200만원을 초과하면 종합소득으로 합산하거나 16.5% 분리과세를 선택할 수 있습니다. 납입 시 세액공제를 받은 금액과 운용 수익에 세금이 붙습니다." },
          { q: "연금 수령 나이는 언제부터인가요?", a: "연금저축·IRP는 55세 이후부터 수령 가능하며, 최소 10년 이상 분할 수령해야 연금소득세 혜택을 받습니다. 국민연금은 출생연도에 따라 62~65세부터 수령이 가능합니다." },
          { q: "중도 해지하면 불이익이 있나요?", a: "연금저축·IRP를 55세 이전 해지하면 기타소득세 16.5%(지방세 포함)가 부과되며, 받은 세액공제 혜택도 반환해야 합니다. 부득이한 경우(사망, 해외 이민, 파산 등)에는 예외가 인정됩니다." },
          { q: "목표 은퇴 자산은 얼마 정도가 적당한가요?", a: "일반적으로 은퇴 후 월 생활비의 300배 이상을 목표로 합니다. 월 300만원이 필요하다면 약 9억원이 목표입니다. '4% 룰'에 따르면 자산의 4%를 매년 인출하면 30년 이상 자산이 유지될 수 있습니다." },
        ].map((item) => (
          <div key={item.q} className="mb-4 border-b pb-4 last:border-b-0">
            <p className="font-bold text-gray-800 mb-1">Q. {item.q}</p>
            <p className="text-gray-600 text-sm">{item.a}</p>
          </div>
        ))}
      </section>

      <RelatedCalculators current="/pension-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false}
          href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">계산기 목록으로 돌아가기</Link>
      </div>
    </div>
  );
}
