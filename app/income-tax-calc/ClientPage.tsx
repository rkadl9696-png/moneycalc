"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type IncomeType = "work" | "business" | "other";

const BASIC_DEDUCTION = 1_500_000; // 기본공제 150만원

// 근로소득공제 (한도 2,000만원)
function getWorkDeduction(salary: number): number {
  let d: number;
  if (salary <= 5_000_000)        d = salary * 0.70;
  else if (salary <= 15_000_000)  d = 3_500_000  + (salary - 5_000_000)  * 0.40;
  else if (salary <= 45_000_000)  d = 7_500_000  + (salary - 15_000_000) * 0.15;
  else if (salary <= 100_000_000) d = 12_000_000 + (salary - 45_000_000) * 0.05;
  else                            d = 14_750_000;
  return Math.min(d, 20_000_000);
}

// 종합소득세 (누진공제 방식)
function calcIncomeTax(base: number): number {
  if (base <= 0)                  return 0;
  if (base <= 14_000_000)         return base * 0.06;
  if (base <= 50_000_000)         return base * 0.15 -  1_260_000;
  if (base <= 88_000_000)         return base * 0.24 -  5_760_000;
  if (base <= 150_000_000)        return base * 0.35 - 15_440_000;
  if (base <= 300_000_000)        return base * 0.38 - 19_940_000;
  if (base <= 500_000_000)        return base * 0.40 - 25_940_000;
  if (base <= 1_000_000_000)      return base * 0.42 - 35_940_000;
  return                                 base * 0.45 - 65_940_000;
}

function getRateLabel(base: number): string {
  if (base <= 14_000_000)         return "6%";
  if (base <= 50_000_000)         return "15%";
  if (base <= 88_000_000)         return "24%";
  if (base <= 150_000_000)        return "35%";
  if (base <= 300_000_000)        return "38%";
  if (base <= 500_000_000)        return "40%";
  if (base <= 1_000_000_000)      return "42%";
  return "45%";
}

const manwon = (n: number) => {
  if (n <= 0) return "0원";
  const eok = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man.toLocaleString()}만원`;
};

const won = (n: number) => `${Math.round(n).toLocaleString()}원`;

const TYPE_INFO: Record<IncomeType, { label: string; inputLabel: string; desc: string }> = {
  work:     { label: "근로소득", inputLabel: "총 급여액",            desc: "근로소득공제 자동 적용" },
  business: { label: "사업소득", inputLabel: "사업소득금액 (순소득)", desc: "필요경비 제외 후 순수 소득액 입력" },
  other:    { label: "기타소득", inputLabel: "기타소득 총 수입금액",  desc: "필요경비 60% 자동 공제" },
};

export default function ClientPage() {
  const [incomeMan, setIncomeMan] = useState(5000); // 만원
  const [type, setType]           = useState<IncomeType>("work");

  const r = useMemo(() => {
    const income = incomeMan * 10_000;

    let incomeDeduction = 0;
    let incomeDeductionLabel = "";
    let netIncome = income;

    if (type === "work") {
      incomeDeduction = getWorkDeduction(income);
      incomeDeductionLabel = "근로소득공제";
      netIncome = income - incomeDeduction;
    } else if (type === "other") {
      incomeDeduction = income * 0.60;
      incomeDeductionLabel = "필요경비 (60%)";
      netIncome = income - incomeDeduction;
    }
    // 사업소득은 순소득 직접 입력이므로 공제 없음

    const taxBase   = Math.max(0, netIncome - BASIC_DEDUCTION);
    const incomeTax = Math.floor(calcIncomeTax(taxBase));
    const localTax  = Math.floor(incomeTax * 0.1);
    const totalTax  = incomeTax + localTax;
    const rateLabel = getRateLabel(taxBase);
    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
    const monthlyTax = totalTax / 12;

    return {
      income, incomeDeduction, incomeDeductionLabel, netIncome,
      taxBase, incomeTax, localTax, totalTax,
      rateLabel, effectiveRate, monthlyTax,
    };
  }, [incomeMan, type]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">종합소득세 계산기</h1>
      <p className="text-gray-600 mb-6">
        연간 소득과 소득 종류를 입력하면 종합소득세와 지방소득세를 바로 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">소득 정보 입력</h2>

        {/* 소득 종류 */}
        <div className="mb-5">
          <label className="block text-sm text-gray-500 mb-2">소득 종류</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(TYPE_INFO) as IncomeType[]).map((key) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  type === key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                }`}
              >
                {TYPE_INFO[key].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">{TYPE_INFO[type].desc}</p>
        </div>

        {/* 소득 입력 */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            {TYPE_INFO[type].inputLabel} (만원)
          </label>
          <input
            type="number"
            min={1}
            value={incomeMan}
            onChange={(e) => setIncomeMan(Math.max(1, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-blue-600 mt-1">{manwon(incomeMan * 10_000)}</p>
        </div>
      </section>

      {/* 결과 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>

        <div className="flex flex-col gap-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">{TYPE_INFO[type].inputLabel}</span>
            <span className="font-medium">{manwon(r.income)}</span>
          </div>

          {r.incomeDeduction > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">{r.incomeDeductionLabel}</span>
              <span className="font-medium text-blue-600">- {manwon(r.incomeDeduction)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">소득금액</span>
            <span className="font-medium">{manwon(r.netIncome)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">기본공제 (본인)</span>
            <span className="font-medium text-blue-600">- 150만원</span>
          </div>

          <div className="flex justify-between border-t border-gray-300 pt-2 mt-1">
            <span className="text-gray-600">과세표준</span>
            <span className="font-bold">{manwon(r.taxBase)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">적용 세율</span>
            <span className="font-medium">{r.rateLabel}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">종합소득세 산출세액</span>
            <span className="font-medium">{manwon(r.incomeTax)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">지방소득세 (10%)</span>
            <span className="font-medium">{manwon(r.localTax)}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded border">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500">최종 납부세액</p>
            <p className="text-xs text-gray-400">실효세율 {r.effectiveRate.toFixed(2)}%</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{manwon(r.totalTax)}</p>
          <p className="text-sm text-gray-400 mt-1">
            월 환산 약 {manwon(r.monthlyTax)}
          </p>
        </div>
      </section>

      {/* 세율 구간표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">종합소득세 세율 구간</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">과세표준</th>
                <th className="text-center p-3 border-b font-bold">세율</th>
                <th className="text-right p-3 border-b font-bold">누진공제</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1,400만원 이하",        "6%",  "–"],
                ["5,000만원 이하",        "15%", "126만원"],
                ["8,800만원 이하",        "24%", "576만원"],
                ["1억 5,000만원 이하",    "35%", "1,544만원"],
                ["3억원 이하",            "38%", "1,994만원"],
                ["5억원 이하",            "40%", "2,594만원"],
                ["10억원 이하",           "42%", "3,594만원"],
                ["10억원 초과",           "45%", "6,594만원"],
              ].map(([range, rate, deduction]) => (
                <tr key={range} className="border-b last:border-b-0">
                  <td className="p-3">{range}</td>
                  <td className="text-center p-3 font-bold text-blue-600">{rate}</td>
                  <td className="text-right p-3 text-gray-600">{deduction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">* 지방소득세(산출세액 × 10%) 별도</p>
      </section>

      {/* 소득 종류별 공제 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">소득 종류별 공제 방식</h2>
        <div className="flex flex-col gap-3">
          {[
            {
              title: "근로소득",
              desc: "총급여에서 근로소득공제(최대 2,000만원)를 차감한 후 기본공제를 적용합니다.",
              detail: "500만원 이하 70% / 1,500만원 이하 40% / 4,500만원 이하 15% / 1억원 이하 5%",
            },
            {
              title: "사업소득",
              desc: "장부 또는 추계에 의한 필요경비를 차감한 순소득을 직접 입력합니다.",
              detail: "업종별 단순경비율·기준경비율이 다르므로 순소득 금액으로 입력하세요.",
            },
            {
              title: "기타소득",
              desc: "원고료·강연료 등 필요경비 60%를 자동 차감합니다. 기타소득금액 = 수입 × 40%",
              detail: "기타소득금액 300만원 이하는 원천징수로 분리과세 선택 가능합니다.",
            },
          ].map(({ title, desc, detail }) => (
            <div key={title} className="border rounded-lg p-4">
              <p className="font-bold mb-1">{title}</p>
              <p className="text-sm text-gray-600 mb-1">{desc}</p>
              <p className="text-xs text-gray-400">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">종합소득세란?</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          과세표준 = 소득금액 − 소득공제 − 기본공제<br />
          산출세액 = 과세표준 × 세율 − 누진공제<br />
          납부세액 = 산출세액 + 지방소득세(10%)
        </div>
        <p className="mb-3">
          종합소득세는 근로·사업·이자·배당·연금·기타소득 등 여러 소득을 합산해 1년에 한 번
          신고·납부하는 세금입니다. 매년 5월(성실신고확인 대상은 6월)이 신고 기간입니다.
        </p>
        <p>
          이 계산기는 본인 기본공제(150만원)만 반영한 단순 계산입니다.
          부양가족 공제, 의료비·교육비·기부금 공제, 연금보험료 공제 등을 추가 적용하면
          실제 납부세액이 더 줄어들 수 있습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 종합소득세 신고는 언제 해야 하나요?</p>
          <p>매년 5월 1일부터 5월 31일까지 신고·납부해야 합니다. 성실신고확인 대상 사업자는 6월 30일까지입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 직장인도 종합소득세 신고를 해야 하나요?</p>
          <p>근로소득만 있는 경우 연말정산으로 종료됩니다. 단, 근로소득 외 다른 소득(사업·이자·배당 등)이 있으면 종합소득세 신고가 필요합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 기본공제 외에 더 받을 수 있는 공제는 무엇이 있나요?</p>
          <p>부양가족 공제(1인당 150만원), 의료비·교육비·기부금·신용카드 소득공제, 연금보험료·주택자금 공제 등 다양한 공제 항목이 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 프리랜서는 어떻게 신고하나요?</p>
          <p>사업소득자(프리랜서)는 매년 5월 종합소득세를 신고해야 합니다. 장부를 작성하거나, 국세청이 제공하는 단순·기준경비율로 추계 신고할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 중간예납이란 무엇인가요?</p>
          <p>전년도 종합소득세가 일정 금액 이상이면 11월에 세금의 절반을 미리 납부하는 제도입니다. 5월에 최종 정산 시 중간예납액을 차감합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 이 계산기 결과와 실제 납부세액이 다를 수 있나요?</p>
          <p>네, 세액공제(근로소득세액공제, 자녀세액공제 등)와 추가 소득공제를 반영하지 않아 실제 납부세액이 더 낮을 수 있습니다. 정확한 금액은 국세청 홈택스 또는 세무사에게 문의하세요.</p>
        </div>
      </section>

      <RelatedCalculators current="/income-tax-calc" />

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
