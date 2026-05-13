"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const MIN_WAGE_2026 = 10030;

export default function ClientPage() {
  const [hourlyWage, setHourlyWage] = useState(MIN_WAGE_2026);
  const [dailyHours, setDailyHours] = useState(8);
  const [weeklyDays, setWeeklyDays] = useState(5);
  const [includeHoliday, setIncludeHoliday] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const weeklyHours = dailyHours * weeklyDays;

    // 주휴수당: 주 15시간 이상 시 발생, 1일치 임금 = 시급 × (주 소정근로시간/40) × 8
    const holidayPay = (includeHoliday && weeklyHours >= 15)
      ? hourlyWage * (weeklyHours / 40) * 8
      : 0;

    const dailyPay = hourlyWage * dailyHours;
    const weeklyPay = dailyPay * weeklyDays + holidayPay;
    const monthlyPay = Math.round(weeklyPay * 4.345);
    const annualPay = monthlyPay * 12;

    // 세후 (3.3% 원천징수)
    const afterTaxRate = 0.967;
    return {
      weeklyHours,
      holidayPay: Math.round(holidayPay),
      dailyPay: Math.round(dailyPay),
      weeklyPay: Math.round(weeklyPay),
      monthlyPay,
      annualPay,
      dailyPayAfter: Math.round(dailyPay * afterTaxRate),
      weeklyPayAfter: Math.round(weeklyPay * afterTaxRate),
      monthlyPayAfter: Math.round(monthlyPay * afterTaxRate),
      annualPayAfter: Math.round(annualPay * afterTaxRate),
      isHolidayEligible: weeklyHours >= 15,
    };
  }, [hourlyWage, dailyHours, weeklyDays, includeHoliday]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">시급 계산기</h1>
      <p className="text-gray-600 mb-6">
        시급과 근무 시간을 입력하면 일급·주급·월급·연봉을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">근무 정보 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">시급 (원)</label>
          <input
            type="number"
            value={hourlyWage}
            onChange={(e) => setHourlyWage(Number(e.target.value))}
            onBlur={(e) => setHourlyWage(Math.max(0, Number(e.target.value) || 0))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">2026년 최저시급: {MIN_WAGE_2026.toLocaleString()}원</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">하루 근무 시간</label>
            <input
              type="number"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              onBlur={(e) => setDailyHours(Math.min(24, Math.max(0, Number(e.target.value) || 0)))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">주 근무 일수</label>
            <input
              type="number"
              value={weeklyDays}
              onChange={(e) => setWeeklyDays(Number(e.target.value))}
              onBlur={(e) => setWeeklyDays(Math.min(7, Math.max(0, Number(e.target.value) || 0)))}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeHoliday}
              onChange={(e) => setIncludeHoliday(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">주휴수당 포함</span>
          </label>
          <p className="text-xs text-gray-400 mt-1">
            주 {result.weeklyHours}시간 근무 —{" "}
            {result.isHolidayEligible
              ? "주휴수당 발생 대상 (주 15시간 이상)"
              : "주휴수당 미발생 (주 15시간 미만)"}
          </p>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">계산 결과</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { label: "일급", before: result.dailyPay, after: result.dailyPayAfter },
            { label: "주급", before: result.weeklyPay, after: result.weeklyPayAfter },
            { label: "월급", before: result.monthlyPay, after: result.monthlyPayAfter },
            { label: "연봉", before: result.annualPay, after: result.annualPayAfter },
          ].map(({ label, before, after }) => (
            <div key={label} className="bg-white rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-lg font-bold text-blue-700">{before.toLocaleString()}원</p>
              <p className="text-xs text-gray-400">세후 {after.toLocaleString()}원</p>
            </div>
          ))}
        </div>
        {includeHoliday && result.isHolidayEligible && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-sm">
            <p className="font-bold text-yellow-700">주휴수당 포함</p>
            <p className="text-gray-600">주 {result.weeklyHours}시간 × 주휴수당: {result.holidayPay.toLocaleString()}원/주</p>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">시급과 주휴수당 이해하기</h2>
        <p className="mb-3">
          2026년 최저시급은 10,030원으로, 전년 대비 인상되었습니다. 최저임금은 업종과 나이에 무관하게 모든 근로자에게 적용됩니다. 수습 기간 3개월 이내 근로자에게는 최저시급의 90%까지 감액 지급이 가능하지만, 단순노무직은 감액 불가합니다.
        </p>
        <p className="mb-3">
          주휴수당은 주 15시간 이상 소정 근로 시간을 모두 채운 근로자에게 1일치 유급 휴일 수당을 지급하는 제도입니다. 주 40시간 기준 근무자는 시급 × 8시간이 주휴수당이며, 단시간 근로자는 (주 소정근로시간 ÷ 40) × 8 × 시급으로 계산합니다.
        </p>
        <p>
          월급은 주급 × 4.345주(연 52.14주 ÷ 12개월)로 계산합니다. 세후 금액은 3.3% 원천징수(소득세 3% + 지방소득세 0.3%) 기준이며, 프리랜서·일용직에 적용됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">최저임금 위반과 신고 방법</h2>
        <p className="mb-3">
          최저임금 미달 시 3년 이하 징역 또는 2천만원 이하 벌금이 부과됩니다. 최저임금은 현금성 임금만 포함하며, 상여금·복리후생비는 일정 비율 초과분만 산입됩니다. 최저임금 위반이 의심될 경우 고용노동부 고객상담센터(1350) 또는 국민신문고에 신고할 수 있습니다.
        </p>
        <p>
          근로계약서를 반드시 작성·교부받아야 하며, 임금 명세서도 매월 서면 또는 전자 교부가 의무입니다. 임금 체불 발생 시 진정서를 고용노동부에 제출하면 조사 후 사업주에게 지급 명령이 내려집니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 주 15시간 미만으로 일하면 주휴수당을 못 받나요?</p>
          <p>네, 주휴수당은 주 소정근로시간이 15시간 이상인 근로자에게 발생합니다. 15시간 미만은 단시간 근로자로 주휴수당이 없습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 아르바이트도 4대보험에 가입해야 하나요?</p>
          <p>월 60시간(주 15시간) 이상 근무하면 국민연금·건강보험 가입 의무가 생깁니다. 고용보험은 1개월 이상 근무 시, 3개월 이상 근무 시 모두 가입 대상입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 월급 계산 시 4.345주를 곱하는 이유는?</p>
          <p>1년은 52.14주(365일 ÷ 7일)이므로 1개월 평균 주수는 52.14 ÷ 12 = 4.345주입니다. 이 값으로 주급을 월급으로 환산합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 3.3% 원천징수는 누구에게 적용되나요?</p>
          <p>프리랜서, 일용직 근로자, 인적 용역 제공자에게 적용됩니다. 정규직 근로자는 간이세액표에 따라 원천징수하며 요율이 다릅니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 주휴수당을 포함한 최저 월급은 얼마인가요?</p>
          <p>주 40시간 근무 기준: 최저시급 10,030원 × (40 + 8)시간 × 4.345주 = 약 2,096,270원이 주휴수당 포함 최저 월급입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 연장·야간·휴일 근무 수당은 어떻게 계산하나요?</p>
          <p>연장근무(하루 8시간, 주 40시간 초과)는 통상시급의 1.5배, 야간(오후 10시~오전 6시)은 0.5배 추가, 휴일은 1.5배(8시간 이하)를 지급해야 합니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/hourly-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
