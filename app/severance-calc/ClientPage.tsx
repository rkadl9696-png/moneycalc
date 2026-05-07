"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const formatMoney = (won: number) => {
  if (won <= 0) return "0원";
  const eok = Math.floor(won / 100000000);
  const man = Math.floor((won % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man.toLocaleString()}만원`;
};

// 근속연수공제 (원 단위)
function getWorkYearsDeduction(years: number): number {
  if (years <= 5) return 300000 * years;
  if (years <= 10) return 1500000 + 500000 * (years - 5);
  if (years <= 20) return 4000000 + 800000 * (years - 10);
  return 12000000 + 1200000 * (years - 20);
}

// 환산급여공제 (원 단위)
function getConvertedWageDeduction(wage: number): number {
  if (wage <= 8000000) return wage;
  if (wage <= 70000000) return 8000000 + (wage - 8000000) * 0.6;
  if (wage <= 100000000) return 45200000 + (wage - 70000000) * 0.55;
  if (wage <= 300000000) return 61700000 + (wage - 100000000) * 0.45;
  return 151700000 + (wage - 300000000) * 0.35;
}

// 종합소득세율 적용
function getIncomeTax(base: number): number {
  if (base <= 14000000) return base * 0.06;
  if (base <= 50000000) return 840000 + (base - 14000000) * 0.15;
  if (base <= 88000000) return 6240000 + (base - 50000000) * 0.24;
  if (base <= 150000000) return 15360000 + (base - 88000000) * 0.35;
  if (base <= 300000000) return 37060000 + (base - 150000000) * 0.38;
  if (base <= 500000000) return 94060000 + (base - 300000000) * 0.40;
  if (base <= 1000000000) return 174060000 + (base - 500000000) * 0.42;
  return 384060000 + (base - 1000000000) * 0.45;
}

function calcResult(startDate: string, endDate: string, avgMonthlyWage: number) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return null;

  const workDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const years = Math.floor(workDays / 365);
  const months = Math.floor((workDays % 365) / 30);

  if (workDays < 365) return { workDays, years, months, tooShort: true } as const;

  const dailyWage = (avgMonthlyWage * 10000) / 30;
  const severancePay = dailyWage * 30 * (workDays / 365);

  const taxWorkYears = Math.ceil(workDays / 365);
  const workYearsDeduction = getWorkYearsDeduction(taxWorkYears);
  const convertedWage = Math.max(0, (severancePay - workYearsDeduction) * 12 / taxWorkYears);
  const convertedWageDeduction = getConvertedWageDeduction(convertedWage);
  const taxBase = Math.max(0, convertedWage - convertedWageDeduction);
  const retirementTax = getIncomeTax(taxBase) * taxWorkYears / 12;
  const localTax = retirementTax * 0.1;
  const totalTax = retirementTax + localTax;

  return {
    workDays, years, months, tooShort: false,
    severancePay,
    retirementTax,
    localTax,
    totalTax,
    netSeverancePay: severancePay - totalTax,
  };
}

export default function ClientPage() {
  const today = new Date().toISOString().split("T")[0];
  const fiveYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 5))
    .toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(fiveYearsAgo);
  const [endDate, setEndDate] = useState(today);
  const [avgMonthlyWage, setAvgMonthlyWage] = useState(300);

  const result = useMemo(
    () => calcResult(startDate, endDate, avgMonthlyWage),
    [startDate, endDate, avgMonthlyWage]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">퇴직금 계산기</h1>
      <p className="text-gray-600 mb-6">
        입사일·퇴사일·평균임금을 입력하면 세전·세후 퇴직금을 바로 계산합니다.
      </p>

      {/* 근무 기간 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">1. 근무 기간</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">입사일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">퇴사일</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        {result && (
          <p className="text-sm mt-3 font-medium text-blue-600">
            {result.tooShort
              ? `📅 근속기간: ${result.workDays}일 (1년 미만 — 퇴직금 미발생)`
              : `📅 근속기간: ${result.years}년 ${result.months}개월 (${result.workDays.toLocaleString()}일)`}
          </p>
        )}
      </section>

      {/* 평균 임금 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-2">2. 최근 3개월 월 평균임금 (만원)</h2>
        <input
          type="number"
          min={1}
          value={avgMonthlyWage}
          onChange={(e) => setAvgMonthlyWage(Math.max(1, Number(e.target.value)))}
          className="w-full border p-2 rounded"
        />
        <p className="text-xs text-gray-400 mt-1">
          기본급 + 수당 포함 월 지급 총액 기준 (상여금은 연간 지급액 ÷ 12 반영)
        </p>
      </section>

      {/* 1년 미만 경고 */}
      {result?.tooShort && (
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-8">
          <p className="font-bold text-yellow-700">⚠️ 근속기간 1년 미만</p>
          <p className="text-sm text-yellow-600 mt-1">
            근로기준법상 퇴직금은 계속 근로기간이 1년 이상이어야 발생합니다.
          </p>
        </section>
      )}

      {/* 결과 */}
      {result && !result.tooShort && (
        <section className="bg-gray-100 rounded-lg p-5 mb-8">
          <h2 className="text-xl font-bold mb-4">계산 결과</h2>

          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">세전 퇴직금</span>
              <span className="font-bold">{formatMoney(result.severancePay)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">퇴직소득세</span>
              <span className="font-bold text-red-500">− {formatMoney(result.retirementTax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">지방소득세 (퇴직소득세의 10%)</span>
              <span className="font-bold text-red-500">− {formatMoney(result.localTax)}</span>
            </div>
            <hr className="my-1 border-gray-300" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">총 공제 세금</span>
              <span className="font-bold text-red-500">− {formatMoney(result.totalTax)}</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded border">
            <p className="text-sm text-gray-500 mb-1">세후 실수령 퇴직금</p>
            <p className="text-2xl font-bold text-blue-700">{formatMoney(result.netSeverancePay)}</p>
          </div>
        </section>
      )}

      {/* 계산 방식 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">퇴직금 계산 방식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono">
          퇴직금 = 일평균임금 × 30일 × (근속일수 ÷ 365)
        </div>
        <p className="mb-3">
          일평균임금은 퇴직 전 3개월간 지급된 임금 총액을 해당 기간의 총 역일 수로 나눈 금액입니다.
          기본급뿐 아니라 각종 수당·상여금도 포함됩니다.
        </p>
        <p>
          세금은 퇴직소득세(근속연수공제 + 환산급여공제 적용)와 지방소득세(퇴직소득세의 10%)로 구성됩니다.
          근속기간이 길수록 공제액이 커져 실제 세 부담이 줄어듭니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 퇴직금은 언제 받을 수 있나요?</p>
          <p>계속 근로기간 1년 이상이어야 하며, 퇴직일로부터 14일 이내에 지급해야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 계약직·아르바이트도 퇴직금을 받을 수 있나요?</p>
          <p>1년 이상, 주 15시간 이상 근무했다면 고용형태 관계없이 퇴직금이 발생합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 상여금도 평균임금에 포함되나요?</p>
          <p>네, 연간 상여금을 12로 나눈 금액을 월 평균임금에 포함해야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 퇴직소득세를 줄이는 방법이 있나요?</p>
          <p>IRP(개인형 퇴직연금) 계좌로 수령하면 세금 납부를 55세 이후로 미룰 수 있고, 연금 방식으로 받으면 퇴직소득세의 30~40%가 감면됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 실제 퇴직금과 계산기 결과가 다를 수 있나요?</p>
          <p>비과세 항목, 중간정산 이력, 상여금 구조에 따라 차이가 날 수 있습니다. 정확한 금액은 회사 HR이나 세무사에게 문의하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 퇴직금을 못 받으면 어떻게 해야 하나요?</p>
          <p>고용노동부 고객상담센터(1350)에 신고하거나 관할 지방노동관서에 진정을 제기할 수 있습니다.</p>
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
