"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const MONTH_PRESETS = [3, 6, 12, 24, 36, 48, 60];

export default function ClientPage() {
  const [price, setPrice] = useState(1000000);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(5.9); // 연이자율 %

  const r = useMemo(() => {
    if (months <= 0 || price <= 0) return null;

    if (rate === 0) {
      const monthly = Math.round(price / months);
      return { monthly, total: monthly * months, interest: 0, interestRate: 0 };
    }

    const monthlyRate = rate / 100 / 12;
    const monthly = Math.round(
      (price * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
    );
    const total = monthly * months;
    const interest = total - price;
    const interestRate = (interest / price) * 100;

    const schedule = Array.from({ length: months }, (_, i) => {
      const remainingBefore = price * Math.pow(1 + monthlyRate, i + 1) - monthly * ((Math.pow(1 + monthlyRate, i + 1) - 1) / monthlyRate);
      const interestPart = Math.round(
        (price * Math.pow(1 + monthlyRate, i) - monthly * ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate)) * monthlyRate
      );
      const principalPart = monthly - interestPart;
      const remaining = Math.max(0, Math.round(remainingBefore));
      return { month: i + 1, monthly, interestPart, principalPart, remaining };
    });

    return { monthly, total, interest, interestRate, schedule };
  }, [price, months, rate]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">할부 계산기</h1>
      <p className="text-gray-600 mb-6">
        구매 금액·할부 개월·이자율을 입력하면 월 할부금과 총 지불 금액을 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">할부 정보 입력</h2>

        {/* 구매 금액 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">구매 금액</label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={0} value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              onBlur={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded"
            />
            <span className="text-sm text-gray-500 shrink-0">원</span>
          </div>
        </div>

        {/* 할부 개월 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">할부 개월</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {MONTH_PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => setMonths(m)}
                className={`px-3 py-1.5 rounded-lg border-2 text-sm font-bold transition-colors ${
                  months === m
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {m}개월
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number" min={1} max={120} value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              onBlur={(e) => setMonths(Math.min(120, Math.max(1, Number(e.target.value) || 1)))}
              className="w-full border p-2 rounded"
            />
            <span className="text-sm text-gray-500 shrink-0">개월</span>
          </div>
        </div>

        {/* 연이자율 */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            연 이자율 <span className="text-xs">(무이자 할부는 0% 입력)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={0} max={50} step={0.1} value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              onBlur={(e) => setRate(Math.min(50, Math.max(0, Number(e.target.value) || 0)))}
              className="w-full border p-2 rounded"
            />
            <span className="text-sm text-gray-500 shrink-0">%</span>
          </div>
        </div>
      </section>

      {/* 결과 */}
      {r && (
        <>
          <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
            <p className="text-sm text-gray-500 mb-1">월 할부금</p>
            <p className="text-4xl font-bold text-blue-600 mb-4">
              {r.monthly.toLocaleString()}원
            </p>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">구매 금액</span>
                <span className="font-medium">{price.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">총 이자</span>
                <span className={`font-medium ${r.interest > 0 ? "text-red-500" : "text-green-600"}`}>
                  {r.interest > 0 ? `+${r.interest.toLocaleString()}원` : "0원 (무이자)"}
                </span>
              </div>
              {r.interest > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">이자 비율</span>
                  <span className="font-medium text-red-500">{r.interestRate?.toFixed(1)}%</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t border-blue-200 pt-2 mt-1">
                <span>총 납부 금액</span>
                <span className="text-blue-600">{r.total.toLocaleString()}원</span>
              </div>
            </div>
          </section>

          {/* 상환 스케줄 (이자 있을 때만) */}
          {r.interest > 0 && r.schedule && (
            <section className="border rounded-lg p-4 mb-8">
              <h2 className="text-base font-bold mb-3">월별 상환 내역</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2 border-b">회차</th>
                      <th className="text-right p-2 border-b">납부액</th>
                      <th className="text-right p-2 border-b">원금</th>
                      <th className="text-right p-2 border-b">이자</th>
                      <th className="text-right p-2 border-b">잔액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.schedule.slice(0, 24).map((s) => (
                      <tr key={s.month} className="border-b last:border-b-0">
                        <td className="p-2">{s.month}회</td>
                        <td className="text-right p-2">{s.monthly.toLocaleString()}</td>
                        <td className="text-right p-2 text-blue-600">{s.principalPart.toLocaleString()}</td>
                        <td className="text-right p-2 text-red-500">{s.interestPart.toLocaleString()}</td>
                        <td className="text-right p-2 text-gray-500">{s.remaining.toLocaleString()}</td>
                      </tr>
                    ))}
                    {r.schedule.length > 24 && (
                      <tr>
                        <td colSpan={5} className="text-center p-2 text-gray-400 text-xs">
                          … {r.schedule.length - 24}회 생략
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">할부 이자 계산 방법</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          월 이자율 = 연 이자율 ÷ 12<br />
          월 할부금 = 원금 × 월이자율 × (1+월이자율)^n ÷ ((1+월이자율)^n - 1)
        </div>
        <p className="mb-3">
          할부 계산은 원리금균등 방식을 사용합니다. 매달 같은 금액을 납부하지만 초기에는 이자 비중이 크고,
          후반에는 원금 비중이 커집니다.
        </p>
        <p>
          카드사 무이자 할부는 이자율 0%로 계산하세요. 단, 무이자 할부도 일시불 청구 후 분할되는 방식이라
          실제 혜택은 카드사마다 다를 수 있습니다.
        </p>
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
