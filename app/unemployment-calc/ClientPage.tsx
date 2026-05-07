"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const DAILY_UPPER = 66000;            // 상한액 66,000원/일
const MIN_WAGE_HOURLY = 10030;        // 2025년 최저임금
const DAILY_LOWER = Math.floor(MIN_WAGE_HOURLY * 0.8 * 8); // 하한액 64,192원/일

// 소정급여일수 (가입기간 단위: 년)
function getBenefitDays(totalMonths: number, isOlderOrDisabled: boolean): number {
  if (totalMonths < 12) return 120;
  if (totalMonths < 36) return isOlderOrDisabled ? 180 : 150;
  if (totalMonths < 60) return isOlderOrDisabled ? 210 : 180;
  if (totalMonths < 120) return isOlderOrDisabled ? 240 : 210;
  return isOlderOrDisabled ? 270 : 240;
}

const formatWon = (won: number) => `${Math.round(won).toLocaleString()}원`;

const formatMoney = (won: number) => {
  if (won <= 0) return "0원";
  const eok = Math.floor(won / 100000000);
  const man = Math.floor((won % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man.toLocaleString()}만원`;
};

export default function ClientPage() {
  const [insuredYears, setInsuredYears] = useState(3);
  const [insuredMonths, setInsuredMonths] = useState(0);
  const [avgMonthlyWage, setAvgMonthlyWage] = useState(300); // 만원
  const [isOlderOrDisabled, setIsOlderOrDisabled] = useState(false);

  const result = useMemo(() => {
    const totalMonths = insuredYears * 12 + insuredMonths;
    if (totalMonths < 6) return { ineligible: true } as const;

    const dailyWage = (avgMonthlyWage * 10000) / 30;
    const rawDaily = dailyWage * 0.6;
    const dailyBenefit = Math.min(Math.max(rawDaily, DAILY_LOWER), DAILY_UPPER);
    const benefitDays = getBenefitDays(totalMonths, isOlderOrDisabled);
    const totalBenefit = dailyBenefit * benefitDays;

    return {
      ineligible: false,
      dailyBenefit,
      benefitDays,
      totalBenefit,
      isUpperCapped: rawDaily > DAILY_UPPER,
      isLowerCapped: rawDaily < DAILY_LOWER,
    } as const;
  }, [insuredYears, insuredMonths, avgMonthlyWage, isOlderOrDisabled]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        scroll={false}
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">실업급여 계산기</h1>
      <p className="text-gray-600 mb-6">
        고용보험 가입기간, 평균임금, 나이를 입력하면 실업급여 수령액을 바로 계산합니다.
      </p>

      {/* 고용보험 가입기간 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">1. 고용보험 가입기간</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">년</label>
            <input
              type="number"
              min={0}
              max={40}
              value={insuredYears}
              onChange={(e) => setInsuredYears(Math.max(0, Number(e.target.value)))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">개월</label>
            <input
              type="number"
              min={0}
              max={11}
              value={insuredMonths}
              onChange={(e) => setInsuredMonths(Math.min(11, Math.max(0, Number(e.target.value))))}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          이직일 이전 18개월 내 피보험단위기간 합산 기준 (최소 180일 이상)
        </p>
      </section>

      {/* 평균임금 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-2">2. 퇴직 전 3개월 월 평균임금 (만원)</h2>
        <input
          type="number"
          min={1}
          value={avgMonthlyWage}
          onChange={(e) => setAvgMonthlyWage(Math.max(1, Number(e.target.value)))}
          className="w-full border p-2 rounded"
        />
        <p className="text-xs text-gray-400 mt-1">
          기본급 + 수당 포함 월 지급 총액 기준
        </p>
      </section>

      {/* 나이 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-3">3. 나이 및 장애 여부</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="age"
              checked={!isOlderOrDisabled}
              onChange={() => setIsOlderOrDisabled(false)}
              className="w-4 h-4"
            />
            <span className="text-sm">50세 미만 (비장애인)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="age"
              checked={isOlderOrDisabled}
              onChange={() => setIsOlderOrDisabled(true)}
              className="w-4 h-4"
            />
            <span className="text-sm">50세 이상 또는 장애인</span>
          </label>
        </div>
      </section>

      {/* 가입기간 부족 */}
      {result.ineligible && (
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-8">
          <p className="font-bold text-yellow-700">⚠️ 고용보험 가입기간 부족</p>
          <p className="text-sm text-yellow-600 mt-1">
            실업급여 수급 요건은 이직일 이전 18개월 내 피보험단위기간 합산 180일 이상입니다.
            가입기간을 6개월 이상으로 입력해주세요.
          </p>
        </section>
      )}

      {/* 결과 */}
      {!result.ineligible && (
        <section className="bg-gray-100 rounded-lg p-5 mb-8">
          <h2 className="text-xl font-bold mb-4">계산 결과</h2>

          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">일일 수령액</span>
              <div className="text-right">
                <span className="font-bold">{formatWon(result.dailyBenefit)}</span>
                {result.isUpperCapped && (
                  <span className="ml-2 text-xs text-orange-500">(상한액 적용)</span>
                )}
                {result.isLowerCapped && (
                  <span className="ml-2 text-xs text-blue-500">(하한액 적용)</span>
                )}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">지급 기간</span>
              <span className="font-bold">{result.benefitDays}일 (약 {Math.round(result.benefitDays / 30)}개월)</span>
            </div>
            <hr className="my-1 border-gray-300" />
          </div>

          <div className="p-4 bg-white rounded border">
            <p className="text-sm text-gray-500 mb-1">총 예상 수령액</p>
            <p className="text-2xl font-bold text-blue-700">{formatMoney(result.totalBenefit)}</p>
            <p className="text-xs text-gray-400 mt-1">
              {formatWon(result.dailyBenefit)} × {result.benefitDays}일
            </p>
          </div>
        </section>
      )}

      {/* 지급기간 기준표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">소정급여일수 기준표</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">가입기간</th>
                <th className="text-center p-3 border-b font-bold">50세 미만</th>
                <th className="text-center p-3 border-b font-bold">50세 이상·장애인</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1년 미만", "120일", "120일"],
                ["1년 이상 ~ 3년 미만", "150일", "180일"],
                ["3년 이상 ~ 5년 미만", "180일", "210일"],
                ["5년 이상 ~ 10년 미만", "210일", "240일"],
                ["10년 이상", "240일", "270일"],
              ].map(([period, young, old]) => (
                <tr key={period} className="border-b last:border-b-0">
                  <td className="p-3 text-gray-700">{period}</td>
                  <td className="text-center p-3 font-medium">{young}</td>
                  <td className="text-center p-3 font-medium">{old}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 계산 방식 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">실업급여 계산 방식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono">
          일일 수령액 = 일평균임금 × 60%<br />
          (상한 66,000원 / 하한 {DAILY_LOWER.toLocaleString()}원)
        </div>
        <p className="mb-3">
          일평균임금은 퇴직 전 3개월 월 평균임금을 30으로 나눈 금액입니다.
          여기에 60%를 곱한 값이 일일 수령액이 되며, 상한액(66,000원)과 하한액({DAILY_LOWER.toLocaleString()}원)이 적용됩니다.
        </p>
        <p>
          하한액은 최저임금(시급 {MIN_WAGE_HOURLY.toLocaleString()}원)의 80% × 8시간 기준으로 산정됩니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 실업급여 수급 조건은 무엇인가요?</p>
          <p>이직일 이전 18개월 내 피보험단위기간 합산 180일 이상, 비자발적 이직(권고사직·계약만료 등), 적극적인 재취업 활동이 필요합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 자발적으로 퇴사하면 실업급여를 못 받나요?</p>
          <p>원칙적으로 자발적 퇴사는 수급 불가합니다. 단, 임금 체불·근로조건 위반·직장 내 괴롭힘 등 정당한 사유가 있으면 예외적으로 인정될 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 실업급여는 언제부터 받을 수 있나요?</p>
          <p>퇴직 후 고용센터에 실업신고를 하고 7일의 대기기간이 지난 다음날부터 수급이 시작됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 재취업하면 실업급여는 어떻게 되나요?</p>
          <p>취업한 날부터 수급이 중단됩니다. 단, 남은 수급기간이 30일 이상이면 조기재취업수당으로 남은 급여의 일부를 받을 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 실업급여 수급 중 아르바이트를 해도 되나요?</p>
          <p>신고 의무가 있습니다. 신고 없이 취업 상태에서 수급하면 부정수급으로 전액 반환 및 추가 징수 처분을 받을 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 계약직·아르바이트도 실업급여를 받을 수 있나요?</p>
          <p>고용보험에 가입된 상태로 180일 이상 근무했다면 계약만료 시 수급 가능합니다.</p>
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
