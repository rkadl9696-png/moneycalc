"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type InsuranceType = "employee" | "local";

// 지역가입자 재산 점수 구간 (원)
const PROPERTY_TIERS = [
  { label: "450만원 이하", score: 22 },
  { label: "450~900만원", score: 44 },
  { label: "900~1,350만원", score: 66 },
  { label: "1,350~1,800만원", score: 88 },
  { label: "1,800~2,700만원", score: 110 },
  { label: "2,700~3,600만원", score: 140 },
  { label: "3,600~4,500만원", score: 170 },
  { label: "4,500~6,000만원", score: 200 },
  { label: "6,000~9,000만원", score: 250 },
  { label: "9,000만원 초과", score: 300 },
];

// 2024년 기준 지역가입자 점수당 금액
const SCORE_PER_WON = 208.4;

export default function ClientPage() {
  const [insuranceType, setInsuranceType] = useState<InsuranceType>("employee");
  // 직장가입자
  const [monthlyWage, setMonthlyWage] = useState(3_000_000);
  // 지역가입자
  const [propertyTierIdx, setPropertyTierIdx] = useState(4);
  const [annualIncomeLocal, setAnnualIncomeLocal] = useState(30_000_000);
  const [vehicleValue, setVehicleValue] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    if (insuranceType === "employee") {
      const healthPremium = Math.round(monthlyWage * 0.03545);
      const ltcPremium = Math.round(healthPremium * 0.1295);
      const employeeShare = healthPremium + ltcPremium;
      const employerShare = healthPremium + ltcPremium;
      return {
        type: "employee" as const,
        healthPremium,
        ltcPremium,
        employeeShare,
        employerShare,
        totalPremium: employeeShare + employerShare,
      };
    } else {
      const propertyScore = PROPERTY_TIERS[propertyTierIdx].score;
      const incomeScore = Math.round(annualIncomeLocal / 1_000_000 * 0.5);
      const vehicleScore = vehicleValue > 4_000_000 ? Math.round(vehicleValue / 1_000_000 * 0.3) : 0;
      const totalScore = propertyScore + incomeScore + vehicleScore;
      const healthPremium = Math.round(totalScore * SCORE_PER_WON);
      const ltcPremium = Math.round(healthPremium * 0.1295);
      const totalPremium = healthPremium + ltcPremium;
      return {
        type: "local" as const,
        propertyScore,
        incomeScore,
        vehicleScore,
        totalScore,
        healthPremium,
        ltcPremium,
        totalPremium,
      };
    }
  }, [insuranceType, monthlyWage, propertyTierIdx, annualIncomeLocal, vehicleValue]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">건강보험료 계산기</h1>
      <p className="text-gray-600 mb-6">
        직장가입자와 지역가입자 건강보험료를 각각 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">가입 유형 선택</h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInsuranceType("employee")}
            className={`flex-1 py-2 rounded border text-sm font-bold ${insuranceType === "employee" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
          >
            직장가입자
          </button>
          <button
            onClick={() => setInsuranceType("local")}
            className={`flex-1 py-2 rounded border text-sm font-bold ${insuranceType === "local" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
          >
            지역가입자
          </button>
        </div>

        {insuranceType === "employee" ? (
          <div>
            <label className="block text-sm text-gray-500 mb-1">월 보수월액 (원)</label>
            <input
              type="number"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(Number(e.target.value))}
              onBlur={(e) => setMonthlyWage(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded"
            />
            <p className="text-xs text-gray-400 mt-1">{monthlyWage.toLocaleString()}원</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">재산 과표 구간</label>
              <select
                value={propertyTierIdx}
                onChange={(e) => setPropertyTierIdx(Number(e.target.value))}
                className="w-full border p-2 rounded"
              >
                {PROPERTY_TIERS.map((tier, i) => (
                  <option key={i} value={i}>{tier.label} ({tier.score}점)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">연간 소득 (원)</label>
              <input
                type="number"
                value={annualIncomeLocal}
                onChange={(e) => setAnnualIncomeLocal(Number(e.target.value))}
                onBlur={(e) => setAnnualIncomeLocal(Math.max(0, Number(e.target.value) || 0))}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">자동차 가액 (원, 4백만원 이하 제외)</label>
              <input
                type="number"
                value={vehicleValue}
                onChange={(e) => setVehicleValue(Number(e.target.value))}
                onBlur={(e) => setVehicleValue(Math.max(0, Number(e.target.value) || 0))}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        )}
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">보험료 계산 결과</h2>
        {result.type === "employee" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-gray-500 mb-1">건강보험료</p>
                <p className="text-lg font-bold text-blue-700">{result.healthPremium.toLocaleString()}원</p>
                <p className="text-xs text-gray-400">(3.545%)</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-gray-500 mb-1">장기요양보험료</p>
                <p className="text-lg font-bold text-blue-700">{result.ltcPremium.toLocaleString()}원</p>
                <p className="text-xs text-gray-400">(건강보험료 × 12.95%)</p>
              </div>
            </div>
            <div className="border-t border-blue-200 pt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">근로자 부담 (50%)</p>
                <p className="text-xl font-bold text-blue-700">{result.employeeShare.toLocaleString()}원</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">사업주 부담 (50%)</p>
                <p className="text-xl font-bold text-gray-600">{result.employerShare.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">재산 점수</span>
              <span className="font-bold">{result.propertyScore}점</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">소득 점수</span>
              <span className="font-bold">{result.incomeScore}점</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">자동차 점수</span>
              <span className="font-bold">{result.vehicleScore}점</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2">
              <span className="text-gray-600">총 점수 × {SCORE_PER_WON}원</span>
              <span className="font-bold">{result.totalScore}점</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">건강보험료</span>
              <span className="font-bold">{result.healthPremium.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">장기요양보험료</span>
              <span className="font-bold">{result.ltcPremium.toLocaleString()}원</span>
            </div>
            <div className="border-t border-blue-300 pt-2 flex justify-between">
              <span className="text-lg font-bold text-blue-800">월 납부 보험료</span>
              <span className="text-2xl font-bold text-blue-700">{result.totalPremium.toLocaleString()}원</span>
            </div>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">건강보험 제도 안내</h2>
        <p className="mb-3">
          건강보험은 직장가입자와 지역가입자로 나뉩니다. 직장가입자는 월 보수월액의 3.545%를 건강보험료로 납부하며, 근로자와 사업주가 각각 50%씩 부담합니다. 장기요양보험료는 건강보험료의 12.95%를 추가 납부합니다.
        </p>
        <p className="mb-3">
          지역가입자는 소득, 재산(토지·건물·전월세), 자동차에 점수를 부여하고 점수당 금액(2024년 208.4원)을 곱해 보험료를 산정합니다. 직장이 없거나 직장을 잃은 경우 지역가입자로 전환됩니다.
        </p>
        <p>
          직장가입자 피부양자(배우자·자녀·부모 등)는 별도 보험료 없이 가족의 건강보험 혜택을 받을 수 있으나, 소득이나 재산이 일정 기준 이상이면 피부양자 자격을 잃고 지역가입자가 됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">피부양자 자격과 보험료 경감</h2>
        <p className="mb-3">
          피부양자 자격을 유지하려면 연간 소득이 2,000만원 이하(금융·사업소득 포함)이며 재산세 과세표준이 5억4천만원 이하여야 합니다. 이 기준을 초과하면 직장가입자 피부양자에서 탈락해 지역가입자 보험료를 내야 합니다.
        </p>
        <p>
          보험료 경감 제도로는 농어촌 지역 경감, 65세 이상·장애인 경감, 저소득층 보험료 지원 등이 있습니다. 실직·폐업·재난 등으로 소득이 감소한 경우 조정 신청을 통해 보험료를 줄일 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 직장을 그만두면 건강보험은 어떻게 되나요?</p>
          <p>퇴직 후 지역가입자로 전환되며, 이전 직장 건강보험을 최대 3년간 임의계속가입으로 유지할 수도 있습니다. 임의계속가입 시 사업주 부담분도 본인이 내야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 건강보험료 상한액이 있나요?</p>
          <p>네, 2024년 기준 직장가입자 건강보험료 상한은 월 보수월액 119,625,000원 기준 약 423,950원(근로자분)입니다. 고액 연봉자도 일정 한도 이상은 추가 납부하지 않습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 부모님을 피부양자로 등록하면 보험료를 절약할 수 있나요?</p>
          <p>네, 소득·재산 기준을 충족하는 부모님을 피부양자로 등록하면 보험료 없이 건강보험 혜택을 받을 수 있습니다. 건강보험공단(1577-1000)에 문의하거나 온라인 신청이 가능합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 프리랜서는 직장가입자인가요, 지역가입자인가요?</p>
          <p>사업자 등록 여부에 따라 다르지만, 일반적으로 프리랜서는 지역가입자입니다. 단, 고용된 근로자 신분으로 활동하면 직장가입자가 됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 지역가입자 보험료가 너무 높으면 어떻게 하나요?</p>
          <p>소득·재산 변동 시 건강보험공단에 보험료 조정 신청을 할 수 있습니다. 실제 소득 감소가 있었다면 그 해 11월 이전 신청 시 소급 적용도 가능합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 장기요양보험료는 따로 내나요?</p>
          <p>장기요양보험료는 건강보험료와 함께 고지되며, 별도로 납부하지 않습니다. 65세 이상 또는 노인성 질환자의 요양·돌봄 서비스에 사용됩니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/health-insurance-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
