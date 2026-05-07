"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const TIP_PRESETS = [5, 10, 15, 18, 20, 25];

export default function ClientPage() {
  const [bill, setBill] = useState(50000);
  const [tipRate, setTipRate] = useState(10);
  const [people, setPeople] = useState(2);
  const [customTip, setCustomTip] = useState(false);

  const r = useMemo(() => {
    const tipAmount = Math.round(bill * (tipRate / 100));
    const total = bill + tipAmount;
    const perPerson = people > 0 ? Math.round(total / people) : total;
    const tipPerPerson = people > 0 ? Math.round(tipAmount / people) : tipAmount;
    return { tipAmount, total, perPerson, tipPerPerson };
  }, [bill, tipRate, people]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">팁 계산기</h1>
      <p className="text-gray-600 mb-6">
        청구 금액·팁 비율·인원을 입력하면 팁 금액과 1인당 부담액을 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">금액 입력</h2>

        {/* 청구 금액 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">청구 금액</label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={0} value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              onBlur={(e) => setBill(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded"
            />
            <span className="text-sm text-gray-500 shrink-0">원</span>
          </div>
        </div>

        {/* 팁 비율 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">팁 비율</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {TIP_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => { setTipRate(p); setCustomTip(false); }}
                className={`px-3 py-1.5 rounded-lg border-2 text-sm font-bold transition-colors ${
                  tipRate === p && !customTip
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {p}%
              </button>
            ))}
            <button
              onClick={() => setCustomTip(true)}
              className={`px-3 py-1.5 rounded-lg border-2 text-sm font-bold transition-colors ${
                customTip
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              직접 입력
            </button>
          </div>
          {customTip && (
            <div className="flex items-center gap-2">
              <input
                type="number" min={0} max={100} value={tipRate}
                onChange={(e) => setTipRate(Number(e.target.value))}
                onBlur={(e) => setTipRate(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border p-2 rounded"
                autoFocus
              />
              <span className="text-sm text-gray-500 shrink-0">%</span>
            </div>
          )}
        </div>

        {/* 인원 */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">인원 수 (더치페이)</label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={1} max={100} value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              onBlur={(e) => setPeople(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
              className="w-full border p-2 rounded"
            />
            <span className="text-sm text-gray-500 shrink-0">명</span>
          </div>
        </div>
      </section>

      {/* 결과 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">팁 금액</p>
            <p className="text-2xl font-bold text-blue-600">{r.tipAmount.toLocaleString()}원</p>
            <p className="text-xs text-gray-400">{tipRate}% 적용</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">총 합계</p>
            <p className="text-2xl font-bold text-gray-800">{r.total.toLocaleString()}원</p>
            <p className="text-xs text-gray-400">청구액 + 팁</p>
          </div>
        </div>

        {people > 1 && (
          <div className="border-t border-blue-200 pt-4">
            <p className="text-xs text-gray-500 mb-2">1인당 ({people}명 더치페이)</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-blue-700">{r.perPerson.toLocaleString()}원</p>
                <p className="text-xs text-gray-400">팁 포함 1인 부담액</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>청구액 {Math.round(bill / people).toLocaleString()}원</p>
                <p>팁 {r.tipPerPerson.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 팁 가이드 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">팁 비율 가이드</h2>
        <div className="flex flex-col gap-2 text-sm">
          {[
            { rate: "10%", desc: "기본 서비스" },
            { rate: "15%", desc: "양호한 서비스" },
            { rate: "18~20%", desc: "우수한 서비스" },
            { rate: "25%+", desc: "매우 훌륭한 서비스" },
          ].map((g) => (
            <div key={g.rate} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-bold text-blue-600">{g.rate}</span>
              <span className="text-gray-600">{g.desc}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          * 팁 문화는 나라마다 다릅니다. 한국에서는 팁 문화가 일반적이지 않으나 미국 등에서는 15~20%가 통상적입니다.
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
