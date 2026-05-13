"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type InputMode = "annual" | "monthly";

// 간이세액표 근사값 (월 과세소득 기준, 부양가족 1인 기준)
function calcIncomeTax(monthlyTaxableIncome: number): number {
  if (monthlyTaxableIncome <= 1_060_000) return 0;
  if (monthlyTaxableIncome <= 1_500_000) return Math.round((monthlyTaxableIncome - 1_060_000) * 0.06);
  if (monthlyTaxableIncome <= 3_000_000) return Math.round(26_400 + (monthlyTaxableIncome - 1_500_000) * 0.15);
  if (monthlyTaxableIncome <= 4_500_000) return Math.round(251_400 + (monthlyTaxableIncome - 3_000_000) * 0.24);
  if (monthlyTaxableIncome <= 7_000_000) return Math.round(611_400 + (monthlyTaxableIncome - 4_500_000) * 0.35);
  if (monthlyTaxableIncome <= 8_500_000) return Math.round(1_486_400 + (monthlyTaxableIncome - 7_000_000) * 0.38);
  return Math.round(2_056_400 + (monthlyTaxableIncome - 8_500_000) * 0.40);
}

export default function ClientPage() {
  const [inputMode, setInputMode] = useState<InputMode>("annual");
  const [annualSalary, setAnnualSalary] = useState(40_000_000);
  const [monthlySalary, setMonthlySalary] = useState(3_333_333);
  const [mealAllowance, setMealAllowance] = useState(200_000);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const monthlyGross = inputMode === "annual"
      ? Math.round(annualSalary / 12)
      : monthlySalary;

    // 비과세 식대
    const nonTaxable = Math.min(mealAllowance, 200_000);
    const taxableBase = Math.max(0, monthlyGross - nonTaxable);

    // 4대보험 (월 보수월액 기준)
    const nationalPension = Math.round(monthlyGross * 0.045);
    const healthInsurance = Math.round(monthlyGross * 0.03545);
    const longTermCare = Math.round(healthInsurance * 0.004591 * 100) / 100 * 100;
    // 장기요양: 건강보험료 × 12.95%
    const longTermCareActual = Math.round(healthInsurance * 0.1295);
    const employmentInsurance = Math.round(monthlyGross * 0.009);

    const totalInsurance = nationalPension + healthInsurance + longTermCareActual + employmentInsurance;

    // 소득세 (간이세액표 근사)
    const incomeTax = calcIncomeTax(taxableBase);
    const localTax = Math.round(incomeTax * 0.1);

    const totalDeduction = totalInsurance + incomeTax + localTax;
    const netSalary = monthlyGross - totalDeduction;

    return {
      monthlyGross,
      nonTaxable,
      taxableBase,
      nationalPension,
      healthInsurance,
      longTermCare: longTermCareActual,
      employmentInsurance,
      totalInsurance,
      incomeTax,
      localTax,
      totalDeduction,
      netSalary,
    };
  }, [inputMode, annualSalary, monthlySalary, mealAllowance]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">월급 계산기</h1>
      <p className="text-gray-600 mb-6">
        연봉 또는 월급을 입력하면 4대보험, 소득세 공제 후 실수령액을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">급여 정보 입력</h2>

        <div className="mb-4">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setInputMode("annual")}
              className={`flex-1 py-2 rounded border text-sm font-bold ${inputMode === "annual" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
            >
              연봉 입력
            </button>
            <button
              onClick={() => setInputMode("monthly")}
              className={`flex-1 py-2 rounded border text-sm font-bold ${inputMode === "monthly" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
            >
              월급 입력
            </button>
          </div>

          {inputMode === "annual" ? (
            <div>
              <label className="block text-sm text-gray-500 mb-1">연봉 (원)</label>
              <input
                type="number"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(Number(e.target.value))}
                onBlur={(e) => setAnnualSalary(Math.max(0, Number(e.target.value) || 0))}
                className="w-full border p-2 rounded"
              />
              <p className="text-xs text-gray-400 mt-1">{annualSalary.toLocaleString()}원 → 월 {Math.round(annualSalary / 12).toLocaleString()}원</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm text-gray-500 mb-1">월급 (원)</label>
              <input
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                onBlur={(e) => setMonthlySalary(Math.max(0, Number(e.target.value) || 0))}
                className="w-full border p-2 rounded"
              />
              <p className="text-xs text-gray-400 mt-1">{monthlySalary.toLocaleString()}원</p>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">비과세 식대 (원/월, 최대 20만원)</label>
          <input
            type="number"
            value={mealAllowance}
            onChange={(e) => setMealAllowance(Number(e.target.value))}
            onBlur={(e) => setMealAllowance(Math.min(200_000, Math.max(0, Number(e.target.value) || 0)))}
            className="w-full border p-2 rounded"
          />
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">공제 내역</h2>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">세전 월급</span>
            <span className="font-bold">{result.monthlyGross.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>└ 비과세 식대</span>
            <span>{result.nonTaxable.toLocaleString()}원</span>
          </div>
          <div className="border-t border-blue-200 pt-2">
            <p className="text-xs font-bold text-gray-500 mb-2">4대보험</p>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">국민연금 (4.5%)</span>
            <span>{result.nationalPension.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">건강보험 (3.545%)</span>
            <span>{result.healthInsurance.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">장기요양보험</span>
            <span>{result.longTermCare.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">고용보험 (0.9%)</span>
            <span>{result.employmentInsurance.toLocaleString()}원</span>
          </div>
          <div className="border-t border-blue-200 pt-2">
            <p className="text-xs font-bold text-gray-500 mb-2">소득세</p>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">소득세 (간이세액)</span>
            <span>{result.incomeTax.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">지방소득세 (10%)</span>
            <span>{result.localTax.toLocaleString()}원</span>
          </div>
          <div className="border-t border-blue-200 pt-2 flex justify-between font-bold">
            <span>총 공제액</span>
            <span className="text-red-600">- {result.totalDeduction.toLocaleString()}원</span>
          </div>
        </div>
        <div className="border-t border-blue-300 pt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-blue-800">실수령액</span>
          <span className="text-2xl font-bold text-blue-700">{result.netSalary.toLocaleString()}원</span>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">4대보험이란?</h2>
        <p className="mb-3">
          4대보험은 국민연금, 건강보험, 고용보험, 산재보험으로 구성됩니다. 근로자와 사업주가 각각 일정 비율을 부담하며, 이 계산기는 근로자 부담분을 계산합니다. 국민연금은 월 소득의 4.5%(사업주 동일), 건강보험은 3.545%(사업주 동일), 장기요양보험은 건강보험료의 12.95%, 고용보험은 0.9%(사업주 1.05~1.65%)를 부담합니다.
        </p>
        <p>
          소득세는 국세청 간이세액표를 기준으로 부양가족 수에 따라 달라집니다. 이 계산기는 본인 1인 기준 간이세액을 근사 계산합니다. 연말정산을 통해 과납된 세금은 환급받거나 부족분을 추가 납부합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">비과세 항목과 절세 방법</h2>
        <p className="mb-3">
          식대(월 20만원), 자가운전보조금(월 20만원), 출산·보육수당(월 20만원), 연구보조비(월 20만원) 등은 비과세 항목으로 4대보험료와 소득세 계산 시 제외됩니다. 비과세 항목을 최대한 활용하면 실수령액을 높일 수 있습니다.
        </p>
        <p>
          연봉 협상 시 복리후생비, 비과세 항목을 포함한 총보상(Total Compensation)을 함께 고려하는 것이 중요합니다. 특히 중소기업 취업자 소득세 감면(최대 90%), 청년 지원금 등을 활용하면 세 부담을 줄일 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 연봉 4000만원의 실수령액은 얼마인가요?</p>
          <p>연봉 4,000만원 기준 월 실수령액은 약 290만원 내외(식대 20만원 기준)입니다. 부양가족 수, 비과세 항목에 따라 달라집니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 식대 비과세 20만원은 어떻게 적용되나요?</p>
          <p>회사에서 식사를 제공하지 않고 식대를 별도 지급하는 경우 월 20만원까지 비과세입니다. 급여 명세서에 식대로 명시되어 있어야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 4대보험 요율은 매년 바뀌나요?</p>
          <p>네, 매년 고용부·보건복지부 고시에 따라 소폭 변동됩니다. 건강보험료는 2024년 기준 3.545%, 장기요양보험료는 건강보험료의 12.95%입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 소득세가 0원으로 나오는데 맞나요?</p>
          <p>월 과세소득이 약 106만원 이하인 경우 소득세가 0원일 수 있습니다. 이는 근로소득공제와 인적공제를 반영한 간이세액표 기준입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 계산기에 산재보험이 없는 이유는?</p>
          <p>산재보험은 사업주가 100% 부담하므로 근로자 급여에서 공제되지 않습니다. 따라서 실수령액 계산에 포함되지 않습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 연말정산에서 환급받는 금액은 어떻게 예측하나요?</p>
          <p>매월 원천징수한 세금의 합산액과 연간 실제 세액 차이가 환급 또는 추가 납부 금액입니다. 의료비, 교육비, 기부금 등 공제 항목이 많을수록 환급액이 커집니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/monthly-salary-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
