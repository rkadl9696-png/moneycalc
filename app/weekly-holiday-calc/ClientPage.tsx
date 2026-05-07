"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const MIN_WAGE = 10320;          // 2026년 최저시급
const WEEKS_PER_MONTH = 365 / 12 / 7; // 4.345...

const won = (n: number) => `${Math.round(n).toLocaleString()}원`;
const manwon = (n: number) => {
  const man = Math.floor(n / 10000);
  const rem = Math.round(n % 10000);
  if (man > 0 && rem > 0) return `${man.toLocaleString()}만 ${rem.toLocaleString()}원`;
  if (man > 0) return `${man.toLocaleString()}만원`;
  return won(n);
};

export default function ClientPage() {
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [workDays, setWorkDays]       = useState(5);
  const [hourlyWage, setHourlyWage]   = useState(MIN_WAGE);

  const r = useMemo(() => {
    const eligible = weeklyHours >= 15;
    // 1일 소정근로시간 (최대 8시간)
    const dailyHours = workDays > 0 ? Math.min(weeklyHours / workDays, 8) : 0;
    // 주휴수당 = 1일 소정근로시간 × 시급
    const weekly  = eligible ? dailyHours * hourlyWage : 0;
    const monthly = weekly * WEEKS_PER_MONTH;
    const belowMinWage = hourlyWage < MIN_WAGE;

    return { eligible, dailyHours, weekly, monthly, belowMinWage };
  }, [weeklyHours, workDays, hourlyWage]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        scroll={false}
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">주휴수당 계산기</h1>
      <p className="text-gray-600 mb-6">
        2026년 최저시급 <span className="font-bold text-blue-600">10,320원</span> 기준 ·
        주당 근로시간과 시급을 입력하면 주·월 주휴수당을 자동 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">근무 조건 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">1주 소정근로시간</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={52}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Math.max(1, Number(e.target.value)))}
              className="w-full border p-2 rounded"
            />
            <span className="text-sm text-gray-500 shrink-0">시간/주</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">주당 근무일수</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={6}
              value={workDays}
              onChange={(e) => setWorkDays(Math.min(6, Math.max(1, Number(e.target.value))))}
              className="w-full border p-2 rounded"
            />
            <span className="text-sm text-gray-500 shrink-0">일/주</span>
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm text-gray-500 mb-1">시급 (원)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={hourlyWage}
              onChange={(e) => setHourlyWage(Math.max(1, Number(e.target.value)))}
              className="w-full border p-2 rounded"
            />
            <span className="text-sm text-gray-500 shrink-0">원/시간</span>
          </div>
        </div>
        {r.belowMinWage && (
          <p className="text-xs text-red-500 mt-1">
            ⚠️ 입력한 시급이 2026년 최저시급(10,320원)보다 낮습니다.
          </p>
        )}

        <div className="mt-4 bg-blue-50 rounded-lg p-3 text-sm">
          <span className="text-gray-600">1일 소정근로시간: </span>
          <span className="font-bold text-blue-700">{r.dailyHours.toFixed(1)}시간</span>
          <span className="text-gray-400 ml-1">(주당 {weeklyHours}시간 ÷ {workDays}일, 최대 8시간)</span>
        </div>
      </section>

      {/* 주 15시간 미만 경고 */}
      {!r.eligible && (
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-8">
          <p className="font-bold text-yellow-700">⚠️ 주휴수당 미발생</p>
          <p className="text-sm text-yellow-600 mt-1">
            1주 소정근로시간이 15시간 미만이면 주휴수당이 발생하지 않습니다.
            현재 입력: <strong>{weeklyHours}시간</strong>
          </p>
        </section>
      )}

      {/* 결과 */}
      {r.eligible && (
        <section className="bg-gray-100 rounded-lg p-5 mb-8">
          <h2 className="text-xl font-bold mb-4">계산 결과</h2>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 bg-white rounded border text-sm">
              <div>
                <p className="font-medium">주 주휴수당</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {r.dailyHours.toFixed(1)}시간 × {hourlyWage.toLocaleString()}원
                </p>
              </div>
              <span className="font-bold text-lg">{won(r.weekly)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white rounded border">
              <div>
                <p className="font-bold text-base">월 주휴수당</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {won(r.weekly)} × 4.345주
                </p>
              </div>
              <span className="font-bold text-xl text-blue-700">{manwon(r.monthly)}</span>
            </div>
          </div>
        </section>
      )}

      {/* 주휴수당 기준표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">주당 근로시간별 주휴수당 (시급 10,320원 기준)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">주당 근로시간</th>
                <th className="text-center p-3 border-b font-bold">1일 소정근로시간</th>
                <th className="text-right p-3 border-b font-bold">주 주휴수당</th>
                <th className="text-right p-3 border-b font-bold">월 주휴수당</th>
              </tr>
            </thead>
            <tbody>
              {[
                { weekly: 15, days: 5, daily: 3 },
                { weekly: 20, days: 5, daily: 4 },
                { weekly: 30, days: 5, daily: 6 },
                { weekly: 40, days: 5, daily: 8 },
              ].map(({ weekly, days, daily }) => {
                const weeklyPay = daily * MIN_WAGE;
                const monthlyPay = weeklyPay * WEEKS_PER_MONTH;
                return (
                  <tr key={weekly} className="border-b last:border-b-0">
                    <td className="p-3">{weekly}시간 ({days}일)</td>
                    <td className="text-center p-3">{daily}시간</td>
                    <td className="text-right p-3">{won(weeklyPay)}</td>
                    <td className="text-right p-3 font-medium">{manwon(monthlyPay)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">주휴수당이란?</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono">
          주휴수당 = 1일 소정근로시간 × 시급
        </div>
        <p className="mb-3">
          주휴수당은 1주일에 소정근로일을 개근한 근로자에게 지급하는 유급 휴일 수당입니다.
          1주 15시간 이상 근무하면 발생하며, 아르바이트·계약직·정규직 모두 동일하게 적용됩니다.
        </p>
        <p>
          1일 소정근로시간은 주당 근로시간을 근무일수로 나눈 값이며, 최대 8시간까지 인정됩니다.
          시급에 1일 소정근로시간을 곱한 금액이 매주 추가로 지급됩니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 주 15시간 미만이면 정말 주휴수당이 없나요?</p>
          <p>네, 근로기준법상 1주 소정근로시간이 15시간 미만이면 주휴일 규정이 적용되지 않습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 결근하면 주휴수당이 없어지나요?</p>
          <p>소정근로일에 결근하면 해당 주의 주휴수당은 발생하지 않습니다. 단, 조퇴·지각은 결근이 아니므로 주휴수당에 영향을 주지 않습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 주휴수당을 안 주면 어떻게 되나요?</p>
          <p>주휴수당을 지급하지 않으면 임금 체불에 해당합니다. 고용노동부(1350)에 신고하거나 관할 노동청에 진정을 제기할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 월급제는 주휴수당이 이미 포함되어 있나요?</p>
          <p>일반적인 월급제는 주휴수당이 포함된 금액으로 지급됩니다. 월급을 시간으로 환산할 때 209시간(주 40시간 기준)을 나누는 것도 주휴시간 8시간/주가 포함된 이유입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 주 6일 근무하면 주휴시간이 더 많아지나요?</p>
          <p>아닙니다. 주휴수당은 1일 소정근로시간(= 주당 근로시간 ÷ 근무일수) 기준이며 최대 8시간까지입니다. 주 40시간 이상이어도 주휴 기준시간은 8시간으로 동일합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 2026년 최저시급 기준 주휴수당은 얼마인가요?</p>
          <p>주 40시간(하루 8시간, 5일) 근무 기준 주 주휴수당은 82,560원, 월 주휴수당은 약 358,000원입니다.</p>
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
