"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const EXEMPTION_DAYS = 3 * 365; // 3년 = 1,095일

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function formatPeriod(days: number): string {
  if (days <= 0) return "0일";
  const y = Math.floor(days / 365);
  const m = Math.floor((days % 365) / 30);
  const d = days % 30;
  const parts: string[] = [];
  if (y > 0) parts.push(`${y}년`);
  if (m > 0) parts.push(`${m}개월`);
  if (d > 0) parts.push(`${d}일`);
  return parts.join(" ");
}

const won = (n: number) => `${Math.round(n).toLocaleString()}원`;
const manwon = (n: number) => {
  if (n <= 0) return "0원";
  const man = Math.floor(n / 10_000);
  const rem = Math.round(n % 10_000);
  if (man > 0 && rem > 0) return `${man.toLocaleString()}만 ${rem.toLocaleString()}원`;
  if (man > 0) return `${man.toLocaleString()}만원`;
  return won(n);
};

// 오늘 기준 기본값
const todayStr = new Date().toISOString().split("T")[0];
const twoYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 2))
  .toISOString().split("T")[0];

export default function ClientPage() {
  const [loanStartDate, setLoanStartDate]   = useState(twoYearsAgo);
  const [loanYears, setLoanYears]           = useState(30);
  const [prepayDate, setPrepayDate]         = useState(todayStr);
  const [prepayAmountMan, setPrepayAmountMan] = useState(5_000); // 만원
  const [feeRate, setFeeRate]               = useState(1.2); // %

  const r = useMemo(() => {
    const start   = new Date(loanStartDate);
    const repay   = new Date(prepayDate);
    const maturity = new Date(loanStartDate);
    maturity.setFullYear(maturity.getFullYear() + loanYears);

    if (isNaN(start.getTime()) || isNaN(repay.getTime())) return null;
    if (repay <= start) return { error: "중도상환일이 대출 실행일보다 이릅니다." };
    if (repay >= maturity) return { error: "중도상환일이 대출 만기일 이후입니다." };

    const elapsedDays   = daysBetween(start, repay);
    const remainingDays = daysBetween(repay, maturity);
    const totalDays     = daysBetween(start, maturity);
    const prepayAmount  = prepayAmountMan * 10_000;
    const exempt        = elapsedDays >= EXEMPTION_DAYS;

    // 중도상환수수료 = 중도상환금액 × 수수료율 × (잔여기간/대출기간)
    const fee = exempt ? 0 : prepayAmount * (feeRate / 100) * (remainingDays / totalDays);

    return {
      error: null,
      maturity,
      elapsedDays,
      remainingDays,
      totalDays,
      prepayAmount,
      exempt,
      fee,
      remainingRatio: ((remainingDays / totalDays) * 100).toFixed(1),
    };
  }, [loanStartDate, loanYears, prepayDate, prepayAmountMan, feeRate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">중도상환수수료 계산기</h1>
      <p className="text-gray-600 mb-6">
        대출 실행일과 중도상환일을 입력하면 수수료를 바로 계산합니다.
        대출 실행 후 3년이 지났는지도 자동으로 확인합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">대출 정보 입력</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">대출 실행일</label>
            <input
              type="date" value={loanStartDate}
              onChange={(e) => setLoanStartDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">대출 기간 (년)</label>
            <input
              type="number" min={1} max={50} value={loanYears}
              onChange={(e) => setLoanYears(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {r && !r.error && (
          <p className="text-xs text-blue-600 mb-4">
            만기일: {r.maturity?.toLocaleDateString("ko-KR")}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">중도상환일</label>
          <input
            type="date" value={prepayDate}
            onChange={(e) => setPrepayDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">중도상환 금액 (만원)</label>
          <input
            type="number" min={1} value={prepayAmountMan}
            onChange={(e) => setPrepayAmountMan(Math.max(1, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
          {r && !r.error && (
            <p className="text-xs text-blue-600 mt-1">{r.prepayAmount != null ? manwon(r.prepayAmount) : ""}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">중도상환수수료율 (%)</label>
          <input
            type="number" min={0} max={5} step={0.1} value={feeRate}
            onChange={(e) => setFeeRate(Math.max(0, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">
            은행별·상품별로 다름. 주택담보대출 통상 1.2~1.5%, 신용대출 0.6~0.8%
          </p>
        </div>
      </section>

      {/* 에러 */}
      {r?.error && (
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="font-bold text-yellow-700">⚠️ 날짜 확인 필요</p>
          <p className="text-sm text-yellow-600 mt-1">{r.error}</p>
        </section>
      )}

      {/* 기간 현황 */}
      {r && !r.error && (
        <>
          <section className="border rounded-lg p-4 mb-5">
            <h2 className="text-base font-bold mb-3">기간 현황</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">경과기간 (실행일 → 상환일)</span>
                <span className="font-medium">{formatPeriod(r.elapsedDays ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">잔여기간 (상환일 → 만기일)</span>
                <span className="font-medium">{formatPeriod(r.remainingDays ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">전체 대출기간</span>
                <span className="font-medium">{formatPeriod(r.totalDays ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">잔여기간 비율</span>
                <span className="font-medium">{r.remainingRatio}%</span>
              </div>
            </div>

            {/* 진행 바 */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>실행일</span>
                <span>중도상환일</span>
                <span>만기일</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${100 - Number(r.remainingRatio)}%` }}
                />
              </div>
            </div>
          </section>

          {/* 결과 */}
          {r.exempt ? (
            <section className="bg-green-50 border border-green-200 rounded-lg p-5 mb-8">
              <p className="font-bold text-green-700 text-lg">✅ 중도상환수수료 면제</p>
              <p className="text-sm text-green-600 mt-2">
                대출 실행 후 <strong>{formatPeriod(r.elapsedDays ?? 0)}</strong> 경과로
                3년 면제 기준을 충족합니다.
              </p>
              <p className="text-xs text-green-500 mt-2">
                * 금융사 약관에 따라 면제 기준이 다를 수 있으니 반드시 해당 금융사에 확인하세요.
              </p>
            </section>
          ) : (
            <section className="bg-gray-100 rounded-lg p-5 mb-8">
              <h2 className="text-xl font-bold mb-4">계산 결과</h2>

              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">중도상환 금액</span>
                  <span className="font-medium">{manwon(r.prepayAmount ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">수수료율</span>
                  <span className="font-medium">{feeRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">잔여기간 비율</span>
                  <span className="font-medium">{r.remainingRatio}%</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded border">
                <p className="text-sm text-gray-500 mb-1">중도상환수수료</p>
                <p className="text-2xl font-bold text-blue-700">{won(r.fee ?? 0)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {manwon(r.prepayAmount ?? 0)} × {feeRate}% × {r.remainingRatio}%
                </p>
              </div>

              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded text-sm">
                <p className="font-medium text-orange-700">
                  3년 면제까지 {formatPeriod(EXEMPTION_DAYS - (r.elapsedDays ?? 0))} 남았습니다.
                </p>
                <p className="text-xs text-orange-500 mt-0.5">
                  {new Date(new Date(loanStartDate).setFullYear(new Date(loanStartDate).getFullYear() + 3))
                    .toLocaleDateString("ko-KR")} 이후 중도상환 시 수수료 면제
                </p>
              </div>
            </section>
          )}
        </>
      )}

      {/* 계산 방식 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">중도상환수수료 계산 방식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono">
          수수료 = 중도상환금액 × 수수료율 × (잔여기간 ÷ 대출기간)
        </div>
        <p className="mb-3">
          잔여기간이 길수록 수수료가 높아집니다. 대출 후 3년이 지나면 대부분의 금융사에서 중도상환수수료를 면제해줍니다.
        </p>
        <p>
          수수료율은 금융사·상품에 따라 다릅니다. 주택담보대출은 통상 1.2~1.5%, 신용대출은 0.6~0.8% 수준이며 반드시 해당 금융사에 확인하세요.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 중도상환수수료 면제 기간은 항상 3년인가요?</p>
          <p>금융사와 대출 상품에 따라 다릅니다. 일반적으로 주택담보대출은 3년, 신용대출은 1~3년이며 정책 금융 상품(디딤돌·보금자리론)은 별도 기준이 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 일부 중도상환도 수수료가 붙나요?</p>
          <p>네, 전액이든 일부든 중도상환금액에 비례해 수수료가 부과됩니다. 중도상환금액이 클수록 수수료도 커집니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 대환대출(갈아타기)도 중도상환에 해당하나요?</p>
          <p>네, 기존 대출을 다른 금융사 대출로 갈아타는 경우 기존 대출 상환에 해당해 중도상환수수료가 발생할 수 있습니다. 갈아타기 전 수수료와 금리 절감 효과를 비교해보세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 수수료가 아깝다면 언제 갚는 게 좋을까요?</p>
          <p>3년 경과 후 상환하면 수수료 없이 원금을 줄일 수 있습니다. 단, 수수료보다 이자 절감액이 훨씬 크다면 수수료를 내더라도 조기 상환이 유리할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 중도상환수수료 환급이 가능한 경우가 있나요?</p>
          <p>2023년부터 금융소비자 보호 강화로 일부 조건에서 환급 청구권이 생겼습니다. 금융사 귀책사유로 금리가 인상된 경우 등이 해당될 수 있습니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/prepayment-calc" />

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
