"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type Method = "equal" | "principal";

interface MonthRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

// 원리금균등 월 상환액
function equalMonthly(p: number, annualRate: number, months: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return p / months;
  return (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

// 월별 상환 스케줄 계산
function buildSchedule(p: number, annualRate: number, months: number, method: Method): MonthRow[] {
  const r = annualRate / 100 / 12;
  const monthlyFixed = method === "equal" ? equalMonthly(p, annualRate, months) : 0;
  const monthlyPrincipal = method === "principal" ? p / months : 0;
  let balance = p;
  const rows: MonthRow[] = [];

  for (let m = 1; m <= months; m++) {
    const interest  = balance * r;
    const principal = method === "equal" ? monthlyFixed - interest : monthlyPrincipal;
    const payment   = method === "equal" ? monthlyFixed : principal + interest;
    balance = Math.max(0, balance - principal);
    rows.push({ month: m, payment, interest, principal, balance });
  }
  return rows;
}

// 월별 → 연도별 집계 (최초 3년)
function toYearlyRows(rows: MonthRow[], maxYears: number) {
  const years: { year: number; principal: number; interest: number; payment: number; balance: number }[] = [];
  const totalYears = Math.min(maxYears, Math.ceil(rows.length / 12));

  for (let y = 1; y <= totalYears; y++) {
    const slice = rows.slice((y - 1) * 12, y * 12);
    const principal = slice.reduce((s, r) => s + r.principal, 0);
    const interest  = slice.reduce((s, r) => s + r.interest, 0);
    const payment   = slice.reduce((s, r) => s + r.payment, 0);
    const balance   = slice[slice.length - 1]?.balance ?? 0;
    years.push({ year: y, principal, interest, payment, balance });
  }
  return years;
}

const manwon = (n: number) => {
  if (n <= 0) return "0원";
  const eok = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man.toLocaleString()}만원`;
};

const wonShort = (n: number) => {
  const man = Math.round(n / 10_000);
  return `${man.toLocaleString()}만원`;
};

export default function ClientPage() {
  const [loanMan, setLoanMan]     = useState(30_000); // 만원
  const [rate, setRate]           = useState(3.5);
  const [years, setYears]         = useState(30);
  const [method, setMethod]       = useState<Method>("equal");

  const r = useMemo(() => {
    const principal = loanMan * 10_000;
    const months    = years * 12;
    const schedule  = buildSchedule(principal, rate, months, method);
    const yearRows  = toYearlyRows(schedule, 3);

    const firstMonthly  = schedule[0]?.payment ?? 0;
    const lastMonthly   = schedule[schedule.length - 1]?.payment ?? 0;
    const totalPayment  = schedule.reduce((s, r) => s + r.payment, 0);
    const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);

    return { principal, months, schedule, yearRows, firstMonthly, lastMonthly, totalPayment, totalInterest };
  }, [loanMan, rate, years, method]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">주택담보대출 계산기</h1>
      <p className="text-gray-600 mb-6">
        대출금액, 금리, 기간을 입력하면 상환 방식별 월 납입액과 총 이자를 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">대출 조건 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">대출금액 (만원)</label>
          <input
            type="number" min={100} value={loanMan}
            onChange={(e) => setLoanMan(Math.max(100, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-blue-600 mt-1">{manwon(loanMan * 10_000)}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">연 금리 (%)</label>
          <input
            type="number" min={0.1} max={30} step={0.1} value={rate}
            onChange={(e) => setRate(Math.max(0.1, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm text-gray-500 mb-1">대출 기간 (년)</label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={1} max={50} value={years}
              onChange={(e) => setYears(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="w-full border p-2 rounded"
            />
            <span className="text-sm text-gray-500 shrink-0">{years * 12}개월</span>
          </div>
        </div>

        {/* 상환 방식 */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">상환 방식</label>
          <div className="grid grid-cols-2 gap-2">
            {([["equal", "원리금균등"], ["principal", "원금균등"]] as [Method, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setMethod(key)}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  method === key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {method === "equal"
              ? "매월 동일한 금액 납부 — 초기 이자 비중이 높고 후반에 원금 비중 증가"
              : "매월 원금 균등 납부 — 초기 납입액이 높지만 시간이 지날수록 감소"}
          </p>
        </div>
      </section>

      {/* 결과 요약 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-5">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-xs text-gray-500 mb-1">
              {method === "equal" ? "월 납입액 (고정)" : "첫 달 납입액"}
            </p>
            <p className="text-xl font-bold text-blue-700">{wonShort(r.firstMonthly)}</p>
          </div>
          {method === "principal" && (
            <div className="bg-white rounded-lg border p-4">
              <p className="text-xs text-gray-500 mb-1">마지막 달 납입액</p>
              <p className="text-xl font-bold">{wonShort(r.lastMonthly)}</p>
            </div>
          )}
          {method === "equal" && (
            <div className="bg-white rounded-lg border p-4">
              <p className="text-xs text-gray-500 mb-1">대출 원금</p>
              <p className="text-xl font-bold">{manwon(r.principal)}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">대출 원금</span>
            <span className="font-medium">{manwon(r.principal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">총 이자</span>
            <span className="font-medium text-red-500">{manwon(r.totalInterest)}</span>
          </div>
          <hr className="border-gray-300" />
          <div className="flex justify-between font-bold">
            <span>총 상환액</span>
            <span className="text-blue-700">{manwon(r.totalPayment)}</span>
          </div>
        </div>
      </section>

      {/* 연도별 스케줄 */}
      <section className="mb-8">
        <h2 className="text-base font-bold mb-3">
          연도별 상환 스케줄
          <span className="ml-2 text-sm font-normal text-gray-400">(첫 3년)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-center p-3 border-b font-bold">연차</th>
                <th className="text-right p-3 border-b font-bold">납부 원금</th>
                <th className="text-right p-3 border-b font-bold">납부 이자</th>
                <th className="text-right p-3 border-b font-bold">연간 합계</th>
                <th className="text-right p-3 border-b font-bold">잔액</th>
              </tr>
            </thead>
            <tbody>
              {r.yearRows.map(({ year, principal, interest, payment, balance }) => (
                <tr key={year} className="border-b last:border-b-0">
                  <td className="text-center p-3">{year}년차</td>
                  <td className="text-right p-3">{wonShort(principal)}</td>
                  <td className="text-right p-3 text-red-500">{wonShort(interest)}</td>
                  <td className="text-right p-3 font-medium">{wonShort(payment)}</td>
                  <td className="text-right p-3 text-blue-600 font-medium">{manwon(balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {years > 3 && (
          <p className="text-xs text-gray-400 mt-2">* 전체 {years}년 스케줄 중 처음 3년만 표시됩니다.</p>
        )}
      </section>

      {/* 방식 비교 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">상환 방식 비교</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">구분</th>
                <th className="text-center p-3 border-b font-bold">원리금균등</th>
                <th className="text-center p-3 border-b font-bold">원금균등</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["월 납입액", "매월 동일", "초기 높고 점감"],
                ["총 이자 부담", "상대적으로 많음", "상대적으로 적음"],
                ["초기 부담", "낮음", "높음"],
                ["적합한 경우", "소득이 일정한 직장인", "초기 자금 여유 있는 경우"],
              ].map(([label, eq, pr]) => (
                <tr key={label} className="border-b last:border-b-0">
                  <td className="p-3 font-medium">{label}</td>
                  <td className="text-center p-3 text-gray-600">{eq}</td>
                  <td className="text-center p-3 text-gray-600">{pr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">주택담보대출 계산 방식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          원리금균등: 월 납입액 = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]<br />
          원금균등: 월 원금 = P/n, 월 이자 = 잔액 × r
        </div>
        <p className="mb-3">
          원리금균등은 매월 동일한 금액을 납부하므로 가계 예산 계획에 유리합니다.
          초기에는 이자 비중이 높고 시간이 지날수록 원금 비중이 늘어납니다.
        </p>
        <p>
          원금균등은 매월 동일한 원금을 갚으면서 이자는 점점 줄어드는 방식입니다.
          초기 납입액이 높지만 총 이자 부담이 원리금균등보다 적습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 주택담보대출 한도는 어떻게 결정되나요?</p>
          <p>LTV(담보인정비율)와 DSR(총부채원리금상환비율) 기준으로 결정됩니다. 규제지역 여부, 주택 가격, 소득에 따라 한도가 달라집니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 고정금리와 변동금리 중 어떤 게 유리한가요?</p>
          <p>금리 상승기에는 고정금리, 금리 하락기에는 변동금리가 유리합니다. 장기 대출일수록 금리 변동 리스크가 크므로 고정금리가 안정적입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 중도상환 시 수수료가 있나요?</p>
          <p>대출 실행 후 3년 이내 중도상환 시 중도상환수수료(보통 1~1.5%)가 발생합니다. 3년 이후에는 대부분 면제됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. DSR이란 무엇인가요?</p>
          <p>총부채원리금상환비율(DSR)은 연간 모든 대출의 원리금 상환액을 연소득으로 나눈 비율입니다. 현재 대부분 40% 규제가 적용됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 특례보금자리론·디딤돌대출은 어떻게 다른가요?</p>
          <p>디딤돌대출은 무주택 서민을 위한 저금리 정책 대출이고, 특례보금자리론은 일반 시중 대출보다 낮은 고정금리를 제공하는 정책 모기지 상품입니다. 소득·주택 가격 요건이 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 대출 기간이 길수록 유리한가요?</p>
          <p>기간이 길수록 월 납입액은 줄지만 총 이자는 크게 늘어납니다. 소득에 여유가 있다면 기간을 단축하거나 중도상환으로 이자를 줄이는 것이 유리합니다.</p>
        </div>
      </section>

      <RelatedCalculators />

      <div className="mt-10 text-center">
        <Link
          scroll={false}
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700"
        >
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
