"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const MIN_BASE = 370_000;   // 최저 기준소득월액
const MAX_BASE = 6_170_000; // 최고 기준소득월액

export default function ClientPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(3_000_000);
  const [joinYears, setJoinYears] = useState(20);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    // 기준소득월액 상·하한 적용
    const baseIncome = Math.min(MAX_BASE, Math.max(MIN_BASE, monthlyIncome));
    const totalRate = 0.09;
    const employeeRate = 0.045;
    const monthlyTotal = Math.round(baseIncome * totalRate);
    const monthlyEmployee = Math.round(baseIncome * employeeRate);
    const monthlyEmployer = monthlyTotal - monthlyEmployee;
    const annualEmployee = monthlyEmployee * 12;
    const annualTotal = monthlyTotal * 12;

    // 예상 연금: 기준소득 × 가입기간 × 1.2% / 12 (간이 추정)
    const estimatedMonthly = Math.round(baseIncome * (joinYears / 100) * 1.2 / 12);

    return {
      baseIncome,
      monthlyTotal,
      monthlyEmployee,
      monthlyEmployer,
      annualEmployee,
      annualTotal,
      estimatedMonthly,
    };
  }, [monthlyIncome, joinYears]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">국민연금 계산기</h1>
      <p className="text-gray-600 mb-6">
        월 소득과 예상 가입 기간으로 국민연금 납부액과 예상 연금을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">정보 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">월 소득 (원)</label>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            onBlur={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value) || 0))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">
            기준소득월액: {result.baseIncome.toLocaleString()}원
            {monthlyIncome < MIN_BASE && " (최저 37만원 적용)"}
            {monthlyIncome > MAX_BASE && " (최고 617만원 적용)"}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">예상 가입 기간 (년)</label>
          <input
            type="number"
            value={joinYears}
            onChange={(e) => setJoinYears(Number(e.target.value))}
            onBlur={(e) => setJoinYears(Math.min(40, Math.max(0, Number(e.target.value) || 0)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">최소 가입 기간 10년 이상 시 연금 수령 가능</p>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">국민연금 계산 결과</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-500 mb-1">근로자 월 납부액 (4.5%)</p>
            <p className="text-xl font-bold text-blue-700">{result.monthlyEmployee.toLocaleString()}원</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-500 mb-1">사업주 월 납부액 (4.5%)</p>
            <p className="text-xl font-bold text-gray-600">{result.monthlyEmployer.toLocaleString()}원</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-500 mb-1">근로자 연간 납부액</p>
            <p className="text-lg font-bold text-blue-700">{result.annualEmployee.toLocaleString()}원</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-500 mb-1">합산 연간 납부액</p>
            <p className="text-lg font-bold text-gray-600">{result.annualTotal.toLocaleString()}원</p>
          </div>
        </div>
        <div className="border-t border-blue-300 pt-3">
          <p className="text-sm text-gray-600 mb-1">예상 월 연금 수령액 ({joinYears}년 가입 기준)</p>
          <p className="text-2xl font-bold text-blue-700">{result.estimatedMonthly.toLocaleString()}원</p>
          <p className="text-xs text-gray-400 mt-1">* 간이 추정값 (실제 수령액은 가입 이력·소득 변화 반영)</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">국민연금 제도 이해하기</h2>
        <p className="mb-3">
          국민연금은 노령, 장애, 사망 시 본인 또는 유족에게 연금을 지급하는 사회보험입니다. 보험료율은 기준소득월액의 9%이며, 직장가입자는 근로자와 사업주가 각 4.5%씩 부담합니다. 지역가입자(자영업자 등)는 9% 전액을 본인이 납부합니다.
        </p>
        <p className="mb-3">
          기준소득월액은 최저 37만원에서 최고 617만원(2024년 기준) 사이에서 결정됩니다. 실제 소득이 이 범위 밖이더라도 상·하한 기준이 적용됩니다.
        </p>
        <p>
          노령연금은 만 63세(점차 65세로 상향)부터 수령 가능하며, 최소 10년 이상 가입해야 합니다. 가입 기간이 길고 소득이 높을수록 수령액이 많아집니다. 국민연금공단 홈페이지에서 실제 예상 연금액을 조회할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">국민연금 반환일시금과 추납</h2>
        <p className="mb-3">
          국적 상실, 60세 도달 전 사망 등 특정 사유 발생 시 그동안 납부한 보험료에 이자를 더해 반환일시금으로 받을 수 있습니다. 다만 일시금보다 연금 수령이 장기적으로 유리한 경우가 많습니다.
        </p>
        <p>
          납부 예외 기간(실직, 육아 등)이 있다면 추후납부(추납) 제도를 통해 해당 기간의 보험료를 소급하여 납부하고 가입 기간을 늘릴 수 있습니다. 추납은 연금 수령액 증가에 효과적입니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 국민연금 수령 나이는 몇 세인가요?</p>
          <p>출생 연도에 따라 다르며, 1969년 이후 출생자는 만 65세부터 노령연금을 받습니다. 조기 수령(최대 5년)은 가능하지만 연 6%씩 감액됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 국민연금은 세금을 내나요?</p>
          <p>네, 국민연금 수령 시 연금소득으로 소득세가 부과됩니다. 단, 본인이 낸 기여금 중 공제받은 금액에 해당하는 부분만 과세하며, 연간 일정액 이하는 실질적 세 부담이 적습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 직장을 그만두면 국민연금은 어떻게 되나요?</p>
          <p>퇴직 후 지역가입자로 전환되며 보험료 9% 전액을 본인이 납부합니다. 소득 없는 기간에는 납부 예외 신청이 가능하지만 그 기간은 가입 기간에 포함되지 않습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 국민연금 보험료는 소득공제가 되나요?</p>
          <p>네, 납부한 국민연금 보험료 전액이 소득공제됩니다. 연말정산 또는 종합소득세 신고 시 자동 반영됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 가입 기간이 10년 미만이면 어떻게 되나요?</p>
          <p>가입 기간 10년 미만이면 노령연금을 받을 수 없고, 만 60세 도달 시 반환일시금으로 받거나 임의계속가입으로 기간을 연장할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 국민연금 예상 수령액을 정확하게 확인하려면?</p>
          <p>국민연금공단 홈페이지(nps.or.kr) 내 '내연금 알아보기' 메뉴 또는 공단 앱에서 실제 가입 이력 기반 예상 연금액을 확인할 수 있습니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/pension-contrib-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
