"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const MIN_WAGE = 10320;            // 2026년 최저시급
const WEEKS_PER_MONTH = 365 / 12 / 7; // 4.3452...

const PENSION_RATE      = 0.045;
const HEALTH_RATE       = 0.03545;
const LONGTERM_RATE     = HEALTH_RATE * 0.1295; // 장기요양 = 건강보험료 × 12.95%
const EMPLOYMENT_RATE   = 0.009;
const TOTAL_DEDUCT_RATE = PENSION_RATE + HEALTH_RATE + LONGTERM_RATE + EMPLOYMENT_RATE;

const won = (n: number) => `${Math.round(n).toLocaleString()}원`;
const manwon = (n: number) => {
  const man = Math.floor(n / 10000);
  return man > 0 ? `${man.toLocaleString()}만원` : won(n);
};

export default function ClientPage() {
  const [dailyHours, setDailyHours] = useState(8);
  const [workDays, setWorkDays]     = useState(5);
  const [includeJuhyu, setIncludeJuhyu] = useState(true);

  const r = useMemo(() => {
    const weeklyHours = dailyHours * workDays;
    const juhyuEligible = weeklyHours >= 15;
    // 주휴시간 = (주당 근무시간 / 40) × 8, 최대 8시간
    const juhyuHours = juhyuEligible ? Math.min((weeklyHours / 40) * 8, 8) : 0;
    const effectiveJuhyu = includeJuhyu && juhyuEligible ? juhyuHours : 0;

    const hourly  = MIN_WAGE;
    const daily   = MIN_WAGE * dailyHours;
    const weekly  = MIN_WAGE * (weeklyHours + effectiveJuhyu);
    const monthly = MIN_WAGE * (weeklyHours + effectiveJuhyu) * WEEKS_PER_MONTH;

    const pension    = monthly * PENSION_RATE;
    const health     = monthly * HEALTH_RATE;
    const longterm   = health * 0.1295;
    const employment = monthly * EMPLOYMENT_RATE;
    const totalDeduct = pension + health + longterm + employment;

    const ratio = totalDeduct / monthly;

    return {
      weeklyHours, juhyuEligible, juhyuHours, effectiveJuhyu,
      hourly, daily, weekly, monthly,
      netHourly:  hourly  * (1 - ratio),
      netDaily:   daily   * (1 - ratio),
      netWeekly:  weekly  * (1 - ratio),
      netMonthly: monthly - totalDeduct,
      pension, health, longterm, employment, totalDeduct,
    };
  }, [dailyHours, workDays, includeJuhyu]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">최저시급 계산기</h1>
      <p className="text-gray-600 mb-1">
        2026년 최저시급 <span className="font-bold text-blue-600">10,320원</span> 기준
      </p>
      <p className="text-gray-600 mb-6">
        근무 조건을 입력하면 시급·일급·주급·월급을 세전·세후로 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">근무 조건 입력</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">하루 근무시간</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={12}
                value={dailyHours}
                onChange={(e) => setDailyHours(Math.min(12, Math.max(1, Number(e.target.value))))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">시간</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">주 근무일수</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={6}
                value={workDays}
                onChange={(e) => setWorkDays(Math.min(6, Math.max(1, Number(e.target.value))))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">일</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-blue-600 mb-4">
          주당 총 근무시간: <strong>{r.weeklyHours}시간</strong>
        </p>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeJuhyu}
            onChange={(e) => setIncludeJuhyu(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">주휴수당 포함</span>
          {!r.juhyuEligible && (
            <span className="text-xs text-orange-500">(주 15시간 미만 — 주휴수당 미발생)</span>
          )}
          {r.juhyuEligible && includeJuhyu && (
            <span className="text-xs text-gray-400">
              (주휴시간 {r.juhyuHours.toFixed(1)}시간)
            </span>
          )}
        </label>
      </section>

      {/* 결과 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-300">
                <th className="text-left pb-2 font-medium">구분</th>
                <th className="text-right pb-2 font-medium">세전</th>
                <th className="text-right pb-2 font-medium">세후 (4대보험 공제)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 font-medium">시급</td>
                <td className="py-3 text-right">{won(r.hourly)}</td>
                <td className="py-3 text-right text-blue-700 font-bold">{won(r.netHourly)}</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">일급 ({dailyHours}시간)</td>
                <td className="py-3 text-right">{won(r.daily)}</td>
                <td className="py-3 text-right text-blue-700 font-bold">{won(r.netDaily)}</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">
                  주급
                  {includeJuhyu && r.juhyuEligible && (
                    <span className="ml-1 text-xs text-gray-400">(주휴 포함)</span>
                  )}
                </td>
                <td className="py-3 text-right">{won(r.weekly)}</td>
                <td className="py-3 text-right text-blue-700 font-bold">{won(r.netWeekly)}</td>
              </tr>
              <tr className="bg-white rounded">
                <td className="py-3 font-bold text-base">
                  월급
                  {includeJuhyu && r.juhyuEligible && (
                    <span className="ml-1 text-xs font-normal text-gray-400">(주휴 포함)</span>
                  )}
                </td>
                <td className="py-3 text-right font-bold">{manwon(r.monthly)}</td>
                <td className="py-3 text-right font-bold text-blue-700 text-base">{manwon(r.netMonthly)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 공제 내역 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">월 4대보험 공제 내역</h2>
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">국민연금 (4.5%)</span>
            <span>{won(r.pension)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">건강보험 (3.545%)</span>
            <span>{won(r.health)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">장기요양보험 (건강보험료 × 12.95%)</span>
            <span>{won(r.longterm)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">고용보험 (0.9%)</span>
            <span>{won(r.employment)}</span>
          </div>
          <hr className="my-1 border-gray-200" />
          <div className="flex justify-between font-bold">
            <span>총 공제액</span>
            <span className="text-red-500">{won(r.totalDeduct)}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * 근로소득세는 최저시급 수준에서 소액 또는 0원으로 별도 반영하지 않았습니다.
        </p>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">최저시급 계산 방식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono">
          월급 = 최저시급 × (주당 근무시간 + 주휴시간) × 4.345주
        </div>
        <p className="mb-3">
          2026년 최저시급은 10,320원입니다. 주휴수당은 1주 15시간 이상 근무할 경우 발생하며,
          주당 근무시간이 40시간인 경우 8시간분의 시급이 추가됩니다.
        </p>
        <p>
          4대보험(국민연금·건강보험·장기요양·고용보험)은 근로자가 부담하는 비율 기준으로 공제되며,
          근로소득세는 최저시급 수준에서 거의 발생하지 않습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 2026년 최저시급은 얼마인가요?</p>
          <p>2026년 최저시급은 10,320원입니다. 2025년(10,030원) 대비 290원(약 2.9%) 인상됐습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 주휴수당이란 무엇인가요?</p>
          <p>1주일에 15시간 이상 근무하고 소정근로일을 개근하면 하루치 임금을 추가로 받을 수 있는 수당입니다. 주 40시간 근무 시 8시간분의 시급이 지급됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 아르바이트도 주휴수당을 받을 수 있나요?</p>
          <p>네, 근무 형태와 관계없이 주 15시간 이상 근무하고 결근 없이 개근하면 주휴수당이 발생합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 최저시급보다 낮게 받으면 어떻게 해야 하나요?</p>
          <p>고용노동부 고객상담센터(1350) 또는 노동청에 신고할 수 있습니다. 최저임금 위반 시 사용자는 3년 이하 징역 또는 2천만원 이하 벌금에 처해질 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 수습 기간에도 최저시급을 받아야 하나요?</p>
          <p>수습 시작 후 3개월 이내에는 최저시급의 90%(9,288원)까지 지급이 가능합니다. 단, 1년 미만 계약직이나 단순노무직은 감액 적용이 불가합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 세후 계산에 근로소득세는 왜 없나요?</p>
          <p>최저시급 기준의 월급 수준에서 근로소득세는 0원이거나 매우 소액이기 때문에 4대보험 공제만 반영했습니다.</p>
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
