"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const LOWER = 700_000; // 하한 70만원

interface MonthRow {
  month: number;
  rate: string;
  upper: number;
  benefit: number;       // 계산 급여
  immediate: number;     // 즉시지급 75%
  deferred: number;      // 사후지급 25%
}

function calcBenefit(month: number, wage: number): { benefit: number; rate: string; upper: number } {
  if (month <= 3) {
    const benefit = Math.min(Math.max(wage, LOWER), 2_500_000);
    return { benefit, rate: "100%", upper: 2_500_000 };
  }
  if (month <= 6) {
    const benefit = Math.min(Math.max(wage, LOWER), 2_000_000);
    return { benefit, rate: "100%", upper: 2_000_000 };
  }
  const benefit = Math.min(Math.max(wage * 0.8, LOWER), 1_500_000);
  return { benefit, rate: "80%", upper: 1_500_000 };
}

const won = (n: number) => `${Math.round(n).toLocaleString()}원`;
const manwon = (n: number) => {
  if (n <= 0) return "0원";
  const eok = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man.toLocaleString()}만원`;
};

export default function ClientPage() {
  const [wageMan, setWageMan]     = useState(300);  // 만원
  const [months, setMonths]       = useState(12);

  const r = useMemo(() => {
    const wage = wageMan * 10_000;
    const rows: MonthRow[] = [];

    for (let m = 1; m <= months; m++) {
      const { benefit, rate, upper } = calcBenefit(m, wage);
      const immediate = Math.floor(benefit * 0.75);
      const deferred  = benefit - immediate;
      rows.push({ month: m, rate, upper, benefit, immediate, deferred });
    }

    const totalBenefit   = rows.reduce((s, r) => s + r.benefit, 0);
    const totalImmediate = rows.reduce((s, r) => s + r.immediate, 0);
    const totalDeferred  = rows.reduce((s, r) => s + r.deferred, 0);

    return { rows, totalBenefit, totalImmediate, totalDeferred };
  }, [wageMan, months]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        scroll={false}
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">육아휴직급여 계산기</h1>
      <p className="text-gray-600 mb-6">
        통상임금과 육아휴직 기간을 입력하면 구간별 월 수령액과 사후지급금을 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">육아휴직 정보 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">월 통상임금 (만원)</label>
          <input
            type="number" min={1} value={wageMan}
            onChange={(e) => setWageMan(Math.max(1, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-blue-600 mt-1">{manwon(wageMan * 10_000)}</p>
          <p className="text-xs text-gray-400 mt-0.5">기본급 + 고정수당 포함한 월 통상임금 기준</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">육아휴직 기간 (개월)</label>
          <div className="flex items-center gap-3">
            <input
              type="range" min={1} max={12} value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-base font-bold text-blue-700 w-16 text-right">
              {months}개월
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1개월</span>
            <span>12개월</span>
          </div>
        </div>
      </section>

      {/* 요약 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-5">
        <h2 className="text-xl font-bold mb-4">수령액 요약</h2>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg border p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">총 급여액</p>
            <p className="text-base font-bold text-gray-800">{manwon(r.totalBenefit)}</p>
          </div>
          <div className="bg-blue-600 text-white rounded-lg p-3 text-center">
            <p className="text-xs text-blue-200 mb-1">즉시 수령액 (75%)</p>
            <p className="text-base font-bold">{manwon(r.totalImmediate)}</p>
          </div>
          <div className="bg-white rounded-lg border p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">사후지급금 (25%)</p>
            <p className="text-base font-bold text-orange-600">{manwon(r.totalDeferred)}</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
          <p className="font-bold text-orange-700">📌 사후지급금 안내</p>
          <p className="text-orange-600 mt-1">
            사후지급금 <strong>{manwon(r.totalDeferred)}</strong>은
            복직 후 6개월간 계속 근무 시 지급됩니다.
          </p>
        </div>
      </section>

      {/* 월별 상세 */}
      <section className="mb-8">
        <h2 className="text-base font-bold mb-3">월별 수령액 상세</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-center p-2.5 border-b font-bold">월</th>
                <th className="text-center p-2.5 border-b font-bold">지급율</th>
                <th className="text-right p-2.5 border-b font-bold">계산 급여</th>
                <th className="text-right p-2.5 border-b font-bold">즉시지급 (75%)</th>
                <th className="text-right p-2.5 border-b font-bold">사후지급 (25%)</th>
              </tr>
            </thead>
            <tbody>
              {r.rows.map(({ month, rate, benefit, immediate, deferred }) => (
                <tr
                  key={month}
                  className={`border-b last:border-b-0 ${
                    month <= 3 ? "bg-blue-50/30" :
                    month <= 6 ? "bg-green-50/30" : ""
                  }`}
                >
                  <td className="text-center p-2.5 font-medium">{month}월</td>
                  <td className="text-center p-2.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      month <= 6 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {rate}
                    </span>
                  </td>
                  <td className="text-right p-2.5">{won(benefit)}</td>
                  <td className="text-right p-2.5 font-medium text-blue-700">{won(immediate)}</td>
                  <td className="text-right p-2.5 text-orange-600">{won(deferred)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-bold border-t-2 border-gray-300">
              <tr>
                <td colSpan={2} className="p-2.5">합계</td>
                <td className="text-right p-2.5">{manwon(r.totalBenefit)}</td>
                <td className="text-right p-2.5 text-blue-700">{manwon(r.totalImmediate)}</td>
                <td className="text-right p-2.5 text-orange-600">{manwon(r.totalDeferred)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* 지급 구간 기준표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">육아휴직급여 구간 기준표</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">기간</th>
                <th className="text-center p-3 border-b font-bold">지급율</th>
                <th className="text-center p-3 border-b font-bold">상한액</th>
                <th className="text-center p-3 border-b font-bold">하한액</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1~3개월", "100%", "250만원", "70만원"],
                ["4~6개월", "100%", "200만원", "70만원"],
                ["7개월 이후", "80%", "150만원", "70만원"],
              ].map(([period, rate, upper, lower]) => (
                <tr key={period} className="border-b last:border-b-0">
                  <td className="p-3 font-medium">{period}</td>
                  <td className="text-center p-3 font-bold text-blue-600">{rate}</td>
                  <td className="text-center p-3">{upper}</td>
                  <td className="text-center p-3">{lower}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">육아휴직급여란?</h2>
        <p className="mb-3">
          고용보험에 가입된 근로자가 만 8세 이하(또는 초등학교 2학년 이하) 자녀를 위해
          육아휴직을 신청하면 고용보험에서 육아휴직급여를 지급합니다.
          육아휴직 기간은 자녀 1인당 최대 1년입니다.
        </p>
        <p className="mb-3">
          지급액의 <strong>75%는 매월 즉시 지급</strong>되며,
          나머지 <strong>25%는 복직 후 6개월 이상 계속 근무한 경우 사후에 일괄 지급</strong>됩니다.
          이를 사후지급금 제도라고 합니다.
        </p>
        <p>
          통상임금은 기본급과 고정 수당을 포함한 금액으로, 상여금 등 불규칙 지급액은 제외됩니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 육아휴직급여 수급 조건은 무엇인가요?</p>
          <p>고용보험 피보험단위기간이 180일 이상이어야 하며, 만 8세 이하 또는 초등학교 2학년 이하 자녀가 있어야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 사후지급금을 못 받는 경우가 있나요?</p>
          <p>복직 후 6개월 이내에 퇴직하거나 해고되면 사후지급금을 받을 수 없습니다. 단, 사업장 폐업·도산 등 부득이한 경우는 예외입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 부모 모두 육아휴직이 가능한가요?</p>
          <p>네, 같은 자녀에 대해 부모 각각 최대 1년씩 육아휴직을 사용할 수 있습니다. 동시에 사용하거나 순차적으로 사용하는 것 모두 가능합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 육아휴직 중 다른 소득이 있으면 급여가 줄어드나요?</p>
          <p>육아휴직 기간 중 취업한 경우 해당 기간의 급여는 지급되지 않습니다. 단, 소정 시간 이내의 일부 부업은 신고 조건부로 허용될 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 육아휴직 신청은 어디에 해야 하나요?</p>
          <p>근로자가 사업주에게 육아휴직을 신청하고, 사업주가 확인서를 발급하면 고용센터(고용보험 포털)에 급여를 신청할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 계약직·파견직도 육아휴직급여를 받을 수 있나요?</p>
          <p>고용보험에 180일 이상 가입되어 있고 사업주가 육아휴직을 허용하면 받을 수 있습니다. 단, 계약 만료가 육아휴직 기간 내에 도래하면 계약 만료일까지만 지급됩니다.</p>
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
