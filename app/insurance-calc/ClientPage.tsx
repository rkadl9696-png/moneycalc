"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

// 2026년 기준 요율
const RATES = {
  pension:  { emp: 0.045,   co: 0.045   },  // 국민연금
  health:   { emp: 0.03545, co: 0.03545 },  // 건강보험
  longterm: { rate: 0.1295 },               // 장기요양 = 건강보험료 × 12.95%
  employ:   { emp: 0.009,   co: 0.0115  },  // 고용보험 (사업주: 150인 미만 기준)
};

const PENSION_UPPER = 6_170_000; // 국민연금 기준소득월액 상한 (원)

const won = (n: number) => `${Math.round(n).toLocaleString()}원`;
const manwon = (n: number) => {
  const man = Math.floor(n / 10000);
  const rem = Math.round(n % 10000);
  if (man > 0 && rem > 0) return `${man.toLocaleString()}만 ${rem.toLocaleString()}원`;
  if (man > 0) return `${man.toLocaleString()}만원`;
  return won(n);
};

export default function ClientPage() {
  const [monthlyWage, setMonthlyWage] = useState(300); // 만원

  const r = useMemo(() => {
    const salary = monthlyWage * 10000;

    // 국민연금 (기준소득월액 상한 적용)
    const pensionBase = Math.min(salary, PENSION_UPPER);
    const pension = {
      emp: pensionBase * RATES.pension.emp,
      co:  pensionBase * RATES.pension.co,
    };

    // 건강보험
    const health = {
      emp: salary * RATES.health.emp,
      co:  salary * RATES.health.co,
    };

    // 장기요양보험 (건강보험료 × 12.95%)
    const longterm = {
      emp: health.emp * RATES.longterm.rate,
      co:  health.co  * RATES.longterm.rate,
    };

    // 고용보험
    const employ = {
      emp: salary * RATES.employ.emp,
      co:  salary * RATES.employ.co,
    };

    const totalEmp = pension.emp + health.emp + longterm.emp + employ.emp;
    const totalCo  = pension.co  + health.co  + longterm.co  + employ.co;

    return {
      salary,
      pension, health, longterm, employ,
      totalEmp, totalCo,
      totalAll: totalEmp + totalCo,
      netSalary: salary - totalEmp,
      pensionCapped: salary > PENSION_UPPER,
    };
  }, [monthlyWage]);

  const rows = [
    {
      label: "국민연금",
      rate: "각 4.5%",
      emp: r.pension.emp,
      co: r.pension.co,
      note: r.pensionCapped ? `상한 ${(PENSION_UPPER / 10000).toLocaleString()}만원 적용` : undefined,
    },
    {
      label: "건강보험",
      rate: "각 3.545%",
      emp: r.health.emp,
      co: r.health.co,
    },
    {
      label: "장기요양보험",
      rate: "건강보험료 × 12.95%",
      emp: r.longterm.emp,
      co: r.longterm.co,
    },
    {
      label: "고용보험",
      rate: "근로자 0.9% / 사업주 1.15%",
      emp: r.employ.emp,
      co: r.employ.co,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        scroll={false}
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">4대보험 계산기</h1>
      <p className="text-gray-600 mb-6">
        2026년 기준 요율로 국민연금·건강보험·장기요양·고용보험 공제액을
        근로자와 사업주 부담분으로 나눠 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-2">월 급여 입력 (만원)</h2>
        <input
          type="number"
          min={1}
          value={monthlyWage}
          onChange={(e) => setMonthlyWage(Math.max(1, Number(e.target.value)))}
          className="w-full border p-2 rounded"
        />
        <p className="text-xs text-gray-400 mt-1">
          기본급 + 수당 포함 총 급여 기준 (비과세 항목 제외 후 입력 권장)
        </p>
      </section>

      {/* 결과 테이블 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-5">
        <h2 className="text-xl font-bold mb-4">공제액 내역</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-300 text-xs">
                <th className="text-left pb-2 font-medium">항목</th>
                <th className="text-right pb-2 font-medium">요율</th>
                <th className="text-right pb-2 font-medium">근로자</th>
                <th className="text-right pb-2 font-medium">사업주</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="py-3">
                    <p className="font-medium">{row.label}</p>
                    {row.note && (
                      <p className="text-xs text-orange-500 mt-0.5">{row.note}</p>
                    )}
                  </td>
                  <td className="py-3 text-right text-gray-500 text-xs">{row.rate}</td>
                  <td className="py-3 text-right">{won(row.emp)}</td>
                  <td className="py-3 text-right">{won(row.co)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-400 font-bold">
                <td className="pt-3">합계</td>
                <td />
                <td className="pt-3 text-right text-red-600">{won(r.totalEmp)}</td>
                <td className="pt-3 text-right text-gray-700">{won(r.totalCo)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* 실수령액 */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">월 급여 (세전)</p>
            <p className="text-lg font-bold">{manwon(r.salary)}</p>
          </div>
          <div className="bg-blue-600 text-white rounded-lg p-4">
            <p className="text-xs text-blue-200 mb-1">실수령액 (4대보험 공제 후)</p>
            <p className="text-lg font-bold">{manwon(r.netSalary)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          * 근로소득세·지방소득세는 별도 적용됩니다 (소득에 따라 다름)
        </p>
      </section>

      {/* 사업주 총 인건비 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">사업주 입장 — 실제 인건비</h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">근로자 월 급여</span>
            <span>{manwon(r.salary)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">사업주 4대보험 부담금</span>
            <span>+ {won(r.totalCo)}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between font-bold">
            <span>총 인건비</span>
            <span className="text-blue-700">{manwon(r.salary + r.totalCo)}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * 산재보험(업종별 상이)은 포함되지 않았습니다.
        </p>
      </section>

      {/* 요율표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">2026년 4대보험 요율표</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">항목</th>
                <th className="text-center p-3 border-b font-bold">근로자</th>
                <th className="text-center p-3 border-b font-bold">사업주</th>
                <th className="text-center p-3 border-b font-bold">합계</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["국민연금", "4.5%", "4.5%", "9.0%"],
                ["건강보험", "3.545%", "3.545%", "7.09%"],
                ["장기요양보험", "건강보험료×6.475%", "건강보험료×6.475%", "건강보험료×12.95%"],
                ["고용보험", "0.9%", "1.15%~", "2.05%~"],
              ].map(([name, emp, co, total]) => (
                <tr key={name} className="border-b last:border-b-0">
                  <td className="p-3 font-medium">{name}</td>
                  <td className="text-center p-3">{emp}</td>
                  <td className="text-center p-3">{co}</td>
                  <td className="text-center p-3 font-medium text-blue-600">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * 고용보험 사업주 부담: 150인 미만 0.25%, 150인 이상(우선지원) 0.45%, 150~1000인 0.65%, 1000인 이상 0.85% 추가 (실업급여분 0.9% 별도)
        </p>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">4대보험이란?</h2>
        <p className="mb-3">
          4대보험은 국민연금·건강보험·고용보험·산재보험을 말합니다.
          근로자는 매월 급여에서 일정 비율이 공제되며, 사업주도 동일하거나 더 높은 비율로 함께 부담합니다.
        </p>
        <p>
          산재보험은 사업주만 전액 부담하며, 업종에 따라 요율이 다르기 때문에 이 계산기에서는 제외됩니다.
          국민연금은 기준소득월액 상한({(PENSION_UPPER / 10000).toLocaleString()}만원)이 적용돼
          급여가 높아도 공제액이 일정 금액 이상 늘어나지 않습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 4대보험은 언제부터 가입해야 하나요?</p>
          <p>근로계약 체결 후 입사 첫날부터 의무 가입입니다. 1개월 미만 일용직, 주 15시간 미만 초단시간 근로자는 일부 항목이 제외될 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 국민연금 상한액이란 무엇인가요?</p>
          <p>기준소득월액 상한({(PENSION_UPPER / 10000).toLocaleString()}만원)을 초과하는 급여에 대해서는 국민연금이 부과되지 않습니다. 상한액은 매년 7월 기준으로 조정됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 장기요양보험료는 어떻게 계산되나요?</p>
          <p>건강보험료에 12.95%를 곱해 산정됩니다. 근로자와 사업주가 각각 6.475%씩 부담합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 고용보험 사업주 부담이 더 많은 이유는 무엇인가요?</p>
          <p>사업주는 실업급여(0.9%)에 더해 고용안정·직업능력개발사업 분담금을 추가로 부담하기 때문입니다. 사업장 규모에 따라 0.25~0.85%가 추가됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 산재보험은 왜 계산에 포함되지 않나요?</p>
          <p>산재보험은 사업주만 전액 부담하며, 업종마다 요율이 다르기 때문에 이 계산기에서는 별도로 안내하고 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 4대보험 납부 확인은 어디서 하나요?</p>
          <p>국민건강보험공단 홈페이지 또는 4대사회보험 정보연계센터(4insure.or.kr)에서 가입 내역과 납부 내역을 확인할 수 있습니다.</p>
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
