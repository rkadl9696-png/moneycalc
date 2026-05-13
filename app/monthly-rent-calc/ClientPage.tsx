"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type CalcMode = "jeonse_to_rent" | "rent_to_jeonse";

export default function ClientPage() {
  const [mode, setMode] = useState<CalcMode>("jeonse_to_rent");
  const [jeonse, setJeonse] = useState(200_000_000);
  const [monthlyRent, setMonthlyRent] = useState(500_000);
  const [conversionRate, setConversionRate] = useState(5.5);
  const [deposit, setDeposit] = useState(10_000_000);
  const [useDeposit, setUseDeposit] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const rate = conversionRate / 100;
    if (mode === "jeonse_to_rent") {
      const baseJeonse = useDeposit ? Math.max(0, jeonse - deposit) : jeonse;
      const calcMonthly = Math.round(baseJeonse * rate / 12);
      return { calcMonthly, calcJeonse: null, baseJeonse };
    } else {
      const baseJeonse = useDeposit ? Math.max(0, jeonse - deposit) : jeonse;
      const calcJeonse = Math.round(monthlyRent * 12 / rate);
      return { calcMonthly: null, calcJeonse, baseJeonse };
    }
  }, [mode, jeonse, monthlyRent, conversionRate, deposit, useDeposit]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">월세 계산기</h1>
      <p className="text-gray-600 mb-6">
        전월세전환율을 기준으로 전세금과 월세를 서로 환산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">계산 방향 선택</h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("jeonse_to_rent")}
            className={`flex-1 py-2 rounded border text-sm font-bold ${mode === "jeonse_to_rent" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
          >
            전세 → 월세
          </button>
          <button
            onClick={() => setMode("rent_to_jeonse")}
            className={`flex-1 py-2 rounded border text-sm font-bold ${mode === "rent_to_jeonse" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
          >
            월세 → 전세
          </button>
        </div>

        {mode === "jeonse_to_rent" ? (
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">전세금 (원)</label>
            <input
              type="number"
              value={jeonse}
              onChange={(e) => setJeonse(Number(e.target.value))}
              onBlur={(e) => setJeonse(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded"
            />
            <p className="text-xs text-gray-400 mt-1">{jeonse.toLocaleString()}원</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">월세 (원/월)</label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                onBlur={(e) => setMonthlyRent(Math.max(0, Number(e.target.value) || 0))}
                className="w-full border p-2 rounded"
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">전월세전환율 (%)</label>
          <input
            type="number"
            value={conversionRate}
            onChange={(e) => setConversionRate(Number(e.target.value))}
            onBlur={(e) => setConversionRate(Math.max(0.1, Math.min(20, Number(e.target.value) || 5.5)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">법정 최고 전환율: 연 10% (기준금리 + 2%)</p>
        </div>

        <div className="mb-2">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={useDeposit}
              onChange={(e) => setUseDeposit(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">보증금 포함 (보증부 월세)</span>
          </label>
          {useDeposit && (
            <div>
              <label className="block text-sm text-gray-500 mb-1">보증금 (원)</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                onBlur={(e) => setDeposit(Math.max(0, Number(e.target.value) || 0))}
                className="w-full border p-2 rounded"
              />
            </div>
          )}
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">계산 결과</h2>
        {mode === "jeonse_to_rent" ? (
          <div className="space-y-3">
            {useDeposit && (
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">전세금</span>
                  <span>{jeonse.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">- 보증금</span>
                  <span>{deposit.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2">
                  <span className="text-gray-600">환산 기준금액</span>
                  <span className="font-bold">{result.baseJeonse.toLocaleString()}원</span>
                </div>
              </div>
            )}
            <div className="border-t border-blue-300 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-blue-800">적정 월세</span>
              <span className="text-2xl font-bold text-blue-700">{(result.calcMonthly ?? 0).toLocaleString()}원/월</span>
            </div>
            <p className="text-xs text-gray-500">= {result.baseJeonse.toLocaleString()} × {conversionRate}% ÷ 12</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="border-t border-blue-300 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-blue-800">환산 전세금</span>
              <span className="text-2xl font-bold text-blue-700">{(result.calcJeonse ?? 0).toLocaleString()}원</span>
            </div>
            <p className="text-xs text-gray-500">= {monthlyRent.toLocaleString()} × 12 ÷ {conversionRate}%</p>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">전월세전환율이란?</h2>
        <p className="mb-3">
          전월세전환율은 전세금을 월세로 전환할 때 적용하는 연간 이율입니다. 예를 들어 전월세전환율이 5.5%라면 전세금 1억원은 월 458,333원(= 1억 × 5.5% ÷ 12)의 월세에 해당합니다.
        </p>
        <p className="mb-3">
          주택임대차보호법에 따라 법정 최고 전환율은 한국은행 기준금리 + 2%포인트로 제한됩니다. 2024년 기준 기준금리가 3.5%라면 법정 최고 전환율은 5.5%입니다. 이를 초과하는 전환율은 무효입니다.
        </p>
        <p>
          보증부 월세의 경우 보증금을 전세금에서 차감한 잔여금액에 대해 전환율을 적용합니다. 예를 들어 전세금 1억원에서 보증금 1천만원을 뺀 9천만원을 기준으로 월세를 계산합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">전세와 월세, 어느 쪽이 유리한가?</h2>
        <p className="mb-3">
          전세는 목돈이 필요하지만 매월 지출이 없습니다. 월세는 목돈 부담이 적지만 매월 고정 지출이 발생합니다. 전세금의 기회비용(예금 이자율)과 월세를 비교했을 때 예금 이자가 월세보다 크면 전세가, 작으면 월세가 유리합니다.
        </p>
        <p>
          예금 금리가 4%이고 전월세전환율이 5.5%라면 월세 부담이 예금 이자보다 크므로 전세가 유리합니다. 반대로 금리가 낮을수록 월세가 상대적으로 유리해집니다. 개인 자금 상황과 시장 금리를 함께 고려해야 합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 집주인이 전월세전환율을 마음대로 정해도 되나요?</p>
          <p>아니요. 주택임대차보호법에 의해 법정 최고 전환율(기준금리 + 2%)을 초과할 수 없습니다. 초과 부분은 무효이며, 임차인은 반환 청구가 가능합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전세를 월세로 전환할 때 임차인 동의가 필요한가요?</p>
          <p>네, 기존 전세 계약을 월세로 전환하려면 임차인의 동의가 반드시 필요합니다. 일방적으로 전환할 수 없으며, 합의된 경우에도 법정 최고 전환율 이하여야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 상가·오피스텔의 전월세전환율은?</p>
          <p>상가·오피스텔은 주택임대차보호법이 아닌 상가건물임대차보호법 또는 별도 계약이 적용됩니다. 전환율 규제가 주택보다 덜 엄격하며, 시장 금리에 따라 다양하게 형성됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전세금 대신 월세를 낼 때 월세 세액공제는 받을 수 있나요?</p>
          <p>네, 무주택자 임차인이 월세를 납부하면 연 최대 750만원 한도로 17%(총 급여 5,500만원 이하) 또는 15% 세액공제를 받을 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 반전세란 무엇인가요?</p>
          <p>반전세는 보증금과 월세를 혼합한 형태로, 전세금의 일부를 보증금으로 내고 나머지는 월세로 납부하는 방식입니다. 보증부 월세와 같은 개념입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전세금을 올려받을 경우 월세에 어떤 영향이 있나요?</p>
          <p>전세금이 올라가면 같은 전환율 기준에서 월세가 올라갑니다. 반대로 전세금이 낮아지면 월세도 낮아집니다. 임대인은 두 방식 중 자신에게 유리한 쪽을 선택하려는 경향이 있습니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/monthly-rent-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
