"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const CY = new Date().getFullYear();
const USEFUL_LIFE = 5;
const SALVAGE_RATIO = 0.1;
const DECLINING_RATE = 0.451;

function calcDepreciation(price: number, buyYear: number, method: string) {
  const salvage = price * SALVAGE_RATIO;
  const annual = (price - salvage) / USEFUL_LIFE;
  const rows: { year: number; depreciation: number; bookValue: number }[] = [];

  let bookValue = price;
  for (let i = 0; i <= USEFUL_LIFE; i++) {
    const year = buyYear + i;
    if (i === 0) {
      rows.push({ year, depreciation: 0, bookValue: price });
      continue;
    }
    let dep: number;
    if (method === "정액") {
      dep = Math.min(annual, bookValue - salvage);
    } else {
      dep = Math.round(bookValue * DECLINING_RATE);
      dep = Math.min(dep, bookValue - salvage);
    }
    bookValue = Math.max(Math.round(bookValue - dep), salvage);
    rows.push({ year, depreciation: Math.round(dep), bookValue });
  }
  return rows;
}

export default function ClientPage() {
  const [price, setPrice] = useState(30_000_000);
  const [buyYear, setBuyYear] = useState(CY - 2);
  const [method, setMethod] = useState("정액");

  const rows = useMemo(() => calcDepreciation(price, buyYear, method), [price, buyYear, method]);
  const currentRow = rows.find((r) => r.year === CY) ?? rows[rows.length - 1];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();
  const pct = (v: number) => ((v / price) * 100).toFixed(1);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">자동차 감가상각 계산기</h1>
      <p className="text-gray-600 mb-6">구입가격과 연도를 입력하면 정액법·정률법에 따른 연도별 차량 잔존가치를 계산합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">구입 가격 (원)</label>
          <input type="number" min={1000000} step={1000000} value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">구입 연도</label>
          <input type="number" min={2000} max={CY} value={buyYear}
            onChange={(e) => setBuyYear(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">감가상각 방식</label>
          <div className="flex gap-2">
            {["정액", "정률"].map((m) => (
              <button key={m} onClick={() => setMethod(m)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${method === m ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {m}법
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">정액법: 매년 균등 상각 | 정률법: 잔존가치 × 45.1% (5년 기준)</p>
        </div>
      </section>

      {currentRow && (
        <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold mb-4 text-blue-800">{CY}년 현재 추정 가치</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">현재 잔존가치</p>
              <p className="text-2xl font-bold text-blue-600">{fmt(currentRow.bookValue)}원</p>
              <p className="text-xs text-gray-400">(구입가 대비 {pct(currentRow.bookValue)}%)</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">총 감가상각액</p>
              <p className="text-2xl font-bold text-red-500">{fmt(price - currentRow.bookValue)}원</p>
              <p className="text-xs text-gray-400">(구입가 대비 {pct(price - currentRow.bookValue)}%)</p>
            </div>
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">연도별 잔존가치</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-2 px-3 text-gray-500">연도</th>
                <th className="text-right py-2 px-3 text-gray-500">당해 감가액</th>
                <th className="text-right py-2 px-3 text-gray-500">잔존가치</th>
                <th className="text-right py-2 px-3 text-gray-500">잔가율</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.year} className={`border-b last:border-0 ${row.year === CY ? "bg-blue-50" : ""}`}>
                  <td className="py-2 px-3 font-medium">{row.year}{row.year === CY ? " ★" : ""}</td>
                  <td className="py-2 px-3 text-right text-red-500">{row.depreciation > 0 ? `-${fmt(row.depreciation)}` : "-"}</td>
                  <td className="py-2 px-3 text-right font-bold text-gray-800">{fmt(row.bookValue)}</td>
                  <td className="py-2 px-3 text-right text-gray-500">{pct(row.bookValue)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자동차 감가상각이란?</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          자동차 감가상각은 차량의 가치가 시간이 지남에 따라 줄어드는 현상을 수치화한 것입니다.
          일반적으로 신차는 출고 후 1년 만에 10~20% 가치가 하락하며, 5년 후에는 구매 가격의 30~50% 수준까지 떨어지는 경우가 많습니다.
          정액법은 매년 균등한 금액으로 감가상각하는 방법이며, 정률법은 잔존가치에 일정 비율(45.1%)을 곱해 감가상각합니다.
          정률법은 초기에 감가상각이 크고 후기로 갈수록 줄어드는 특징이 있습니다.
          실제 중고차 시장에서는 브랜드, 인기 모델 여부, 주행거리, 관리 상태 등에 따라 시장가격이 크게 달라질 수 있습니다.
          이 계산기는 회계적 감가상각을 기준으로 하며, 실제 시장 가치와는 차이가 있을 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "자동차 감가상각률이 가장 큰 시기는 언제인가요?", a: "일반적으로 신차 출고 후 1~3년 사이에 감가상각이 가장 크게 발생합니다. 특히 출고 직후 주행거리가 생기는 순간부터 중고차로 분류되어 가치가 급락합니다." },
          { q: "정액법과 정률법의 차이는 무엇인가요?", a: "정액법은 매년 동일한 금액을 감가상각하고, 정률법은 잔존가치에 일정 비율을 적용하여 초기에는 많이, 후기에는 적게 감가상각합니다. 실제 중고차 시장은 정률법에 더 가깝습니다." },
          { q: "어떤 차종이 감가상각이 적은가요?", a: "일반적으로 인기 모델(현대 팰리세이드, 기아 카니발 등), 수입 럭셔리 브랜드 일부, 하이브리드·전기차 등은 상대적으로 감가상각이 적은 편입니다." },
          { q: "중고차 매도 시 적정 가격은 어떻게 산정하나요?", a: "중고차 시장 가격은 캐롯, KB차차차, 엔카 등 중고차 플랫폼의 시세를 참고하세요. 주행거리, 사고 이력, 정비 이력, 옵션 등에 따라 가격이 크게 달라집니다." },
          { q: "렌터카나 법인차의 감가상각은 어떻게 처리하나요?", a: "법인 차량의 경우 세법에서 정한 감가상각 방법(주로 5년 정률 또는 정액)에 따라 비용으로 처리할 수 있습니다. 업무용 승용차는 연간 800만 원 한도로 손금 인정됩니다." },
          { q: "전기차의 감가상각은 일반 차와 다른가요?", a: "전기차는 배터리 기술 발전과 정부 보조금 변화로 인해 감가상각 양상이 일반차와 다를 수 있습니다. 초기에는 감가상각이 크지만, 배터리 상태에 따라 중고 가격 편차가 큰 편입니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/car-depreciation-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
