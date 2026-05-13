"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

// 원리금균등상환 월 납부액으로부터 대출 원금 역산
function calcLoanFromPayment(monthlyPayment: number, annualRate: number, years: number): number {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return monthlyPayment * n;
  return monthlyPayment * (1 - Math.pow(1 + r, -n)) / r;
}

export default function ClientPage() {
  const [annualIncome, setAnnualIncome] = useState(50_000_000);
  const [existingDebt, setExistingDebt] = useState(0);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanYears, setLoanYears] = useState(30);
  const [collateralValue, setCollateralValue] = useState(0);
  const [useLtv, setUseLtv] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const monthlyIncome = annualIncome / 12;
    const dsrLimit = monthlyIncome * 0.4;
    const availablePayment = Math.max(0, dsrLimit - existingDebt);
    const dsrLoanLimit = Math.round(calcLoanFromPayment(availablePayment, interestRate, loanYears));
    const ltvLoanLimit = useLtv ? Math.round(collateralValue * 0.7) : null;
    const finalLimit = ltvLoanLimit !== null ? Math.min(dsrLoanLimit, ltvLoanLimit) : dsrLoanLimit;

    return {
      monthlyIncome,
      dsrLimit,
      availablePayment,
      dsrLoanLimit,
      ltvLoanLimit,
      finalLimit,
    };
  }, [annualIncome, existingDebt, interestRate, loanYears, collateralValue, useLtv]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">대출 한도 계산기</h1>
      <p className="text-gray-600 mb-6">
        DSR 40% 기준과 LTV 70% 기준으로 대출 가능 한도를 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">대출 정보 입력</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">연소득 (원)</label>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              onBlur={(e) => setAnnualIncome(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">기존 월 부채 상환액 (원)</label>
            <input
              type="number"
              value={existingDebt}
              onChange={(e) => setExistingDebt(Number(e.target.value))}
              onBlur={(e) => setExistingDebt(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">금리 (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              onBlur={(e) => setInterestRate(Math.max(0, Math.min(30, Number(e.target.value) || 4.5)))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">대출 기간 (년)</label>
            <input
              type="number"
              value={loanYears}
              onChange={(e) => setLoanYears(Number(e.target.value))}
              onBlur={(e) => setLoanYears(Math.min(50, Math.max(1, Number(e.target.value) || 30)))}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={useLtv}
              onChange={(e) => setUseLtv(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">LTV 계산 포함 (담보 가치 입력)</span>
          </label>
          {useLtv && (
            <div>
              <label className="block text-sm text-gray-500 mb-1">담보 가치 (원)</label>
              <input
                type="number"
                value={collateralValue}
                onChange={(e) => setCollateralValue(Number(e.target.value))}
                onBlur={(e) => setCollateralValue(Math.max(0, Number(e.target.value) || 0))}
                className="w-full border p-2 rounded"
              />
              <p className="text-xs text-gray-400 mt-1">{collateralValue.toLocaleString()}원</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">대출 한도 계산 결과</h2>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">월 소득</span>
            <span className="font-bold">{Math.round(result.monthlyIncome).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">DSR 40% 월 상환 가능액</span>
            <span className="font-bold">{Math.round(result.dsrLimit).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">기존 부채 차감 후</span>
            <span className="font-bold">{Math.round(result.availablePayment).toLocaleString()}원/월</span>
          </div>
          <div className="flex justify-between border-t border-blue-200 pt-2">
            <span className="text-gray-600">DSR 기준 대출 한도</span>
            <span className="font-bold text-blue-700">{result.dsrLoanLimit.toLocaleString()}원</span>
          </div>
          {result.ltvLoanLimit !== null && (
            <div className="flex justify-between">
              <span className="text-gray-600">LTV 70% 기준 한도</span>
              <span className="font-bold text-blue-700">{result.ltvLoanLimit.toLocaleString()}원</span>
            </div>
          )}
        </div>
        <div className="border-t border-blue-300 pt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-blue-800">최종 대출 가능 한도</span>
          <span className="text-2xl font-bold text-blue-700">{result.finalLimit.toLocaleString()}원</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">* 금융기관 실제 심사 기준과 다를 수 있습니다</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">DSR과 LTV 이해하기</h2>
        <p className="mb-3">
          DSR(총부채원리금상환비율)은 연 소득 대비 모든 대출의 원리금 상환액 비율입니다. 금융위원회 규제에 따라 총 DSR 40%(은행권 기준)를 초과할 수 없습니다. 즉, 연 소득의 40% 이상을 대출 원리금으로 갚아야 하면 추가 대출이 어렵습니다.
        </p>
        <p className="mb-3">
          LTV(담보인정비율)는 담보 가치 대비 대출 가능 금액의 비율입니다. 주택 담보 대출은 지역·주택 유형에 따라 LTV 40~70%가 적용됩니다. 투기지역은 40%, 조정대상지역은 50~60%, 비규제지역은 70%가 일반적입니다.
        </p>
        <p>
          DSR 한도와 LTV 한도 중 더 낮은 값이 실제 대출 한도가 됩니다. 기존에 주택담보대출, 신용대출 등이 있다면 그 원리금도 DSR에 포함되어 신규 대출 한도가 줄어듭니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">대출 한도 늘리는 방법</h2>
        <p className="mb-3">
          소득 증빙을 강화하면 DSR 한도를 늘릴 수 있습니다. 부부 합산 소득으로 대출을 받거나, 근로소득 외 사업소득·임대소득을 추가로 인정받으면 한도가 올라갑니다. 기존 부채를 상환하면 남은 DSR 여력이 늘어납니다.
        </p>
        <p>
          대출 기간을 늘리면 월 상환액이 줄어들어 같은 DSR 범위에서 더 많은 원금을 빌릴 수 있습니다. 단, 총 이자 부담은 커집니다. 정책 모기지(보금자리론·디딤돌대출 등)는 DSR 산정 방식이 다를 수 있으므로 별도 확인이 필요합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. DSR 40%는 모든 금융기관에 동일하게 적용되나요?</p>
          <p>은행권(1금융권)은 DSR 40%, 저축은행·카드사 등 2금융권은 DSR 50%가 적용됩니다. 정책 금융상품은 별도 규정이 적용됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전세자금대출도 DSR에 포함되나요?</p>
          <p>전세자금대출은 2023년부터 DSR 산정에 포함됩니다. 다만 가계부채 관리 정책에 따라 적용 범위가 달라질 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 신용점수와 대출 한도는 어떤 관계인가요?</p>
          <p>신용점수(KCB·NICE)가 낮으면 대출 금리가 올라가거나 한도가 줄어들 수 있습니다. DSR 계산은 소득 기반이지만 금융사마다 신용 위험을 반영해 한도를 조정합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 자영업자는 소득을 어떻게 인정받나요?</p>
          <p>자영업자는 직전 2년 평균 사업소득이 인정됩니다. 근로소득보다 소득 인정 기준이 까다롭고 한도가 낮을 수 있습니다. 성실신고 확인서 제출 시 유리할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 보금자리론이나 디딤돌대출의 한도는?</p>
          <p>보금자리론은 최대 3.6억원(LTV 70%), 디딤돌대출은 최대 2.5억원(LTV 70%)까지 가능합니다. 소득 기준, 주택 가격 기준 등 별도 조건이 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. LTV 70%와 40%는 어떻게 다른가요?</p>
          <p>LTV는 지역·주택 유형·대출 목적에 따라 다릅니다. 규제지역(투기·과열) 주택담보대출은 40~50%가 적용되고, 비규제지역은 최대 70%까지 가능합니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/loan-limit-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
