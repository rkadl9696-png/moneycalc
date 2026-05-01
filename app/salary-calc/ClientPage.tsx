"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const formatMoney = (manwon: number) => {
  const eok = Math.floor(manwon / 10000);
  const rest = Math.round(manwon % 10000);

  if (eok > 0 && rest > 0) return `${eok}억 ${rest.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${rest.toLocaleString()}만원`;
};

const formatMonthlyMoney = (manwon: number) => {
  const rounded = Math.round(manwon * 10) / 10;
  const man = Math.floor(rounded);
  const thousand = Math.round((rounded - man) * 10);

  if (thousand > 0) return `${man.toLocaleString()}만 ${thousand}천원`;
  return `${man.toLocaleString()}만원`;
};

export default function Page() {
  const [salary, setSalary] = useState(4000);

  // 단순 예상 공제율
  const incomeTaxRate = 0.06;
  const localTaxRate = 0.006;
  const pensionRate = 0.045;
  const healthRate = 0.03545;
  const careRate = 0.00459;
  const employmentRate = 0.009;

  const incomeTax = salary * incomeTaxRate;
  const localTax = salary * localTaxRate;
  const pension = salary * pensionRate;
  const health = salary * healthRate;
  const care = salary * careRate;
  const employment = salary * employmentRate;

  const totalDeduction =
    incomeTax + localTax + pension + health + care + employment;

  const netYearly = salary - totalDeduction;
  const netMonthly = netYearly / 12;
  const deductionMonthly = totalDeduction / 12;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">연봉 실수령 계산기</h1>

      <p className="text-gray-600 mb-6">
        연봉을 입력하면 예상 세후 연봉, 월 실수령액, 공제 금액을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-xl font-bold mb-4">1. 연봉 입력</h2>

        <label className="block mb-2">연봉 (만원)</label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />

        <p className="text-sm text-gray-600 mt-1">
          입력한 연봉: {formatMoney(salary)}
        </p>
      </section>

      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>

        <p>예상 세전 연봉: {formatMoney(salary)}</p>
        <p>예상 세후 연봉: {formatMoney(netYearly)}</p>
        <p>월 실수령액: {formatMonthlyMoney(netMonthly)}</p>
        <p>월 공제액: {formatMonthlyMoney(deductionMonthly)}</p>

        <div className="mt-5 p-4 bg-white rounded border">
          <p className="text-lg font-bold">
            👉 예상 월 실수령액은 약 {formatMonthlyMoney(netMonthly)}입니다.
          </p>

          <p className="mt-2 text-gray-700">
            입력한 연봉에서 소득세, 지방소득세, 국민연금, 건강보험,
            장기요양보험, 고용보험 등을 단순 추정하여 계산했습니다.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">공제 항목 예상</h2>

        <p>소득세: {formatMoney(incomeTax)}</p>
        <p>지방소득세: {formatMoney(localTax)}</p>
        <p>국민연금: {formatMoney(pension)}</p>
        <p>건강보험: {formatMoney(health)}</p>
        <p>장기요양보험: {formatMoney(care)}</p>
        <p>고용보험: {formatMoney(employment)}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">연봉 실수령액은 왜 다를 수 있나요?</h2>

        <p className="mb-3">
          실제 실수령액은 회사의 급여 체계, 비과세 식대, 부양가족 수,
          성과급, 상여금, 4대보험 적용 기준에 따라 달라질 수 있습니다.
        </p>

        <p>
          이 계산기는 대략적인 실수령액을 빠르게 확인하기 위한 참고용 계산기입니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">
          연봉보다 월 실수령액이 중요한 이유
        </h2>

        <p className="mb-3">
          연봉은 세전 금액이기 때문에 실제로 매달 통장에 들어오는 금액과 차이가 있습니다.
          소득세, 지방소득세, 국민연금, 건강보험, 고용보험 등 여러 공제 항목이 반영되기 때문입니다.
        </p>

        <p className="mb-3">
          생활비, 저축, 대출 상환 계획을 세울 때는 세전 연봉보다 월 실수령액을 기준으로 보는 것이 더 현실적입니다.
        </p>

        <p>
          이 계산기는 입력한 연봉을 기준으로 예상 세후 연봉과 월 실수령액을 빠르게 확인할 수 있도록 도와줍니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 연봉 실수령액은 정확한 금액인가요?</p>
          <p>
            정확한 급여명세서 금액과는 차이가 있을 수 있습니다.
            회사별 공제 기준과 비과세 항목에 따라 달라집니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 월 실수령액은 어떻게 계산하나요?</p>
          <p>
            연봉에서 예상 공제액을 제외한 뒤 12개월로 나누어 계산합니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 4대보험도 포함되나요?</p>
          <p>
            국민연금, 건강보험, 장기요양보험, 고용보험을 단순 비율로 반영했습니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 상여금이나 성과급도 포함되나요?</p>
          <p>
            현재 계산은 입력한 연봉 전체를 기준으로 단순 계산합니다.
            별도 성과급이나 비정기 상여금은 실제와 차이가 날 수 있습니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 세후 연봉과 월 실수령액은 왜 중요한가요?</p>
          <p>
            실제 생활비, 저축, 대출 가능 금액은 세전 연봉보다 세후 월 실수령액 기준으로 보는 것이 현실적입니다.
          </p>
        </div>
        </section>

        <RelatedCalculators />
        
        <div className="mt-10 text-center">
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