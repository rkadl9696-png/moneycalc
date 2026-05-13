"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const INDUSTRIES = [
  { label: "강의/컨설팅", rate: 0.615 },
  { label: "IT/개발", rate: 0.641 },
  { label: "디자인/영상", rate: 0.641 },
  { label: "작가/번역", rate: 0.615 },
  { label: "기타", rate: 0.60 },
];

function calcIncomeTax(taxBase: number): number {
  if (taxBase <= 0) return 0;
  if (taxBase <= 14_000_000) return taxBase * 0.06;
  if (taxBase <= 50_000_000) return 840_000 + (taxBase - 14_000_000) * 0.15;
  if (taxBase <= 88_000_000) return 6_240_000 + (taxBase - 50_000_000) * 0.24;
  if (taxBase <= 150_000_000) return 15_360_000 + (taxBase - 88_000_000) * 0.35;
  if (taxBase <= 300_000_000) return 37_060_000 + (taxBase - 150_000_000) * 0.38;
  if (taxBase <= 500_000_000) return 94_060_000 + (taxBase - 300_000_000) * 0.40;
  return 174_060_000 + (taxBase - 500_000_000) * 0.42;
}

export default function ClientPage() {
  const [annualIncome, setAnnualIncome] = useState(30_000_000);
  const [industryIdx, setIndustryIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const expenseRate = INDUSTRIES[industryIdx].rate;
    const expense = Math.round(annualIncome * expenseRate);
    const incomeAmount = annualIncome - expense;
    const basicDeduction = 1_500_000;
    const taxBase = Math.max(0, incomeAmount - basicDeduction);
    const incomeTax = calcIncomeTax(taxBase);
    const localTax = Math.round(incomeTax * 0.1);
    const totalTax = incomeTax + localTax;
    // 3.3% 원천징수 기납부액
    const withheld = Math.round(annualIncome * 0.033);
    const additionalTax = totalTax - withheld;

    return {
      expenseRate,
      expense,
      incomeAmount,
      basicDeduction,
      taxBase,
      incomeTax,
      localTax,
      totalTax,
      withheld,
      additionalTax,
    };
  }, [annualIncome, industryIdx]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">프리랜서 세금 계산기</h1>
      <p className="text-gray-600 mb-6">
        연간 수입과 업종을 입력하면 종합소득세 및 3.3% 기납부세액 공제 후 추가납부 또는 환급액을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">수입 정보 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">연간 수입금액 (원)</label>
          <input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            onBlur={(e) => setAnnualIncome(Math.max(0, Number(e.target.value) || 0))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">{annualIncome.toLocaleString()}원</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">업종</label>
          <select
            value={industryIdx}
            onChange={(e) => setIndustryIdx(Number(e.target.value))}
            className="w-full border p-2 rounded"
          >
            {INDUSTRIES.map((ind, i) => (
              <option key={i} value={i}>
                {ind.label} (단순경비율 {(ind.rate * 100).toFixed(1)}%)
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">세금 계산 결과</h2>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">연간 수입금액</span>
            <span className="font-bold">{annualIncome.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">필요경비 ({(result.expenseRate * 100).toFixed(1)}%)</span>
            <span className="font-bold text-green-700">- {result.expense.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between border-t border-blue-200 pt-2">
            <span className="text-gray-600">소득금액</span>
            <span className="font-bold">{result.incomeAmount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">종합소득공제 (기본)</span>
            <span className="font-bold text-green-700">- {result.basicDeduction.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between border-t border-blue-200 pt-2">
            <span className="text-gray-600">과세표준</span>
            <span className="font-bold">{result.taxBase.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">산출세액 (종합소득세)</span>
            <span className="font-bold">{result.incomeTax.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">지방소득세 (10%)</span>
            <span className="font-bold">{result.localTax.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between border-t border-blue-200 pt-2">
            <span className="text-gray-600">총 납부 세액</span>
            <span className="font-bold">{result.totalTax.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">3.3% 기납부세액</span>
            <span className="font-bold text-green-700">- {result.withheld.toLocaleString()}원</span>
          </div>
        </div>
        <div className="border-t border-blue-300 pt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-blue-800">
            {result.additionalTax >= 0 ? "추가 납부세액" : "환급액"}
          </span>
          <span className={`text-2xl font-bold ${result.additionalTax >= 0 ? "text-red-600" : "text-green-600"}`}>
            {result.additionalTax >= 0
              ? `${result.additionalTax.toLocaleString()}원`
              : `${Math.abs(result.additionalTax).toLocaleString()}원 환급`}
          </span>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">프리랜서 세금 구조 이해하기</h2>
        <p className="mb-3">
          프리랜서(인적용역 제공자)는 용역 대금을 받을 때 3.3%(소득세 3% + 지방소득세 0.3%)가 원천징수됩니다. 이 금액은 예납 성격이므로, 다음해 5월 종합소득세 신고 시 실제 세액과 비교해 환급받거나 추가 납부합니다.
        </p>
        <p className="mb-3">
          단순경비율은 수입에서 경비로 인정되는 비율로, 업종별로 60%~64.1%가 적용됩니다. 실제 지출 경비가 이보다 많다면 장부를 기장하여 실제 경비를 인정받는 기준경비율 방식이 더 유리할 수 있습니다.
        </p>
        <p>
          종합소득세 신고 기간은 매년 5월 1일~5월 31일입니다. 홈택스를 통해 직접 신고하거나, 세무대리인을 통해 신고할 수 있습니다. 성실신고 확인 대상자는 6월 말까지 신고 가능합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">프리랜서 절세 방법</h2>
        <p className="mb-3">
          국민연금, 건강보험 등 사회보험료 납부액은 전액 소득공제가 됩니다. 노란우산공제(소기업·소상공인 공제)에 가입하면 최대 500만원(사업 소득 4,000만원 이하)까지 소득공제를 받을 수 있습니다. 연금저축·IRP 납입액도 세액공제 대상입니다.
        </p>
        <p>
          장부 기장 시 장부 기장 세액공제(납부세액의 20%, 최대 100만원)를 받을 수 있습니다. 수입이 증가할수록 단순경비율보다 실제 지출 경비를 반영하는 것이 유리해집니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 3.3% 원천징수를 안 했을 때는 어떻게 하나요?</p>
          <p>원천징수를 누락한 경우 5월 종합소득세 신고 시 전액을 직접 납부해야 합니다. 원천징수는 의뢰인(지급자) 의무이므로 미징수 시 지급자가 가산세를 부담합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 프리랜서도 사업자 등록을 해야 하나요?</p>
          <p>인적 용역 제공자는 사업자 등록 없이도 활동할 수 있지만, 연 수입이 일정 규모 이상이거나 부가세 과세 대상이면 사업자 등록이 필요합니다. 등록 시 비용 처리와 세금계산서 발행이 가능해집니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 단순경비율과 기준경비율의 차이는?</p>
          <p>단순경비율은 수입의 일정 비율을 경비로 인정하는 간편한 방식이고, 기준경비율은 주요 경비(인건비·임차료·매입)는 실제 증빙 기준, 나머지는 기준율로 계산합니다. 일반적으로 수입이 클수록 기준경비율이 유리합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 5월에 종합소득세 신고를 안 하면 어떻게 되나요?</p>
          <p>무신고 가산세(납부세액의 20%)와 납부불성실 가산세(미납세액 × 연 9.125%)가 부과됩니다. 원천징수만으로 세금을 냈다고 신고를 생략하면 안 됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 강의료, 원고료도 3.3% 원천징수 대상인가요?</p>
          <p>네, 강의료(기타소득)와 원고료(기타소득 또는 사업소득)는 3.3% 원천징수 대상입니다. 단, 일시적·우발적 소득이면 기타소득으로 분리과세(8.8%)가 적용될 수도 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 프리랜서가 환급을 받으려면?</p>
          <p>5월 종합소득세 신고 시 결정세액이 기납부한 3.3%보다 작으면 환급됩니다. 신고 후 약 30일 이내에 등록한 계좌로 환급됩니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/freelance-tax-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
