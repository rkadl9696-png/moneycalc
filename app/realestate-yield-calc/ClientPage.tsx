"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [buyPrice, setBuyPrice] = useState(30000); // 만원
  const [sellPrice, setSellPrice] = useState(40000); // 만원
  const [holdingYears, setHoldingYears] = useState(5); // 년
  const [buyCost, setBuyCost] = useState(900); // 만원 (취득 비용)
  const [sellCost, setSellCost] = useState(400); // 만원 (매도 비용)

  const r = useMemo(() => {
    const totalInvestment = buyPrice + buyCost;
    const netSellAmount = sellPrice - sellCost;
    const profit = netSellAmount - totalInvestment;
    const totalYield = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
    const annualYield = holdingYears > 0
      ? (Math.pow(1 + totalYield / 100, 1 / holdingYears) - 1) * 100
      : 0;
    return { totalInvestment, netSellAmount, profit, totalYield, annualYield };
  }, [buyPrice, sellPrice, holdingYears, buyCost, sellCost]);

  const fmt = (n: number) => Math.round(n).toLocaleString();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/" className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors">← 계산기 목록</Link>
      <h1 className="text-2xl font-bold mb-2">🏗️ 부동산 수익률 계산기</h1>
      <p className="text-gray-600 mb-6">매수가·매도가·보유기간을 입력하면 매매차익, 총 수익률, 연평균 수익률을 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">부동산 매매 정보 입력</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">매수가</label>
            <div className="flex items-center gap-2">
              <input type="number" min={100} max={10000000} value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                onBlur={(e) => setBuyPrice(Math.min(10000000, Math.max(100, Number(e.target.value) || 30000)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">만원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">매도가</label>
            <div className="flex items-center gap-2">
              <input type="number" min={100} max={10000000} value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                onBlur={(e) => setSellPrice(Math.min(10000000, Math.max(100, Number(e.target.value) || 40000)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">만원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">보유 기간</label>
            <div className="flex items-center gap-2">
              <input type="number" min={0.1} max={50} step={0.5} value={holdingYears}
                onChange={(e) => setHoldingYears(Number(e.target.value))}
                onBlur={(e) => setHoldingYears(Math.min(50, Math.max(0.1, Number(e.target.value) || 5)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">년</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">취득 비용 (취득세 등)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={100000} value={buyCost}
                onChange={(e) => setBuyCost(Number(e.target.value))}
                onBlur={(e) => setBuyCost(Math.min(100000, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">만원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">매도 비용 (중개수수료 등)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={100000} value={sellCost}
                onChange={(e) => setSellCost(Number(e.target.value))}
                onBlur={(e) => setSellCost(Math.min(100000, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">만원</span>
            </div>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className={`rounded-lg p-5 mb-8 ${r.profit >= 0 ? "bg-green-50" : "bg-red-50"}`}>
        <h2 className="text-base font-bold mb-4">수익률 계산 결과</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">매매차익</p>
            <p className={`text-3xl font-bold ${r.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {r.profit >= 0 ? "+" : ""}{fmt(r.profit)}만원
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">총 수익률</p>
            <p className={`text-3xl font-bold ${r.totalYield >= 0 ? "text-green-600" : "text-red-600"}`}>
              {r.totalYield >= 0 ? "+" : ""}{r.totalYield.toFixed(2)}%
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">총 투자비용</p>
            <p className="text-base font-bold text-gray-800">{fmt(r.totalInvestment)}만원</p>
          </div>
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">실수령액</p>
            <p className="text-base font-bold text-gray-800">{fmt(r.netSellAmount)}만원</p>
          </div>
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">연평균 수익률</p>
            <p className={`text-base font-bold ${r.annualYield >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {r.annualYield >= 0 ? "+" : ""}{r.annualYield.toFixed(2)}%
            </p>
          </div>
        </div>
      </section>

      {/* 계산 과정 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">계산 과정</h2>
        <div className="bg-gray-50 rounded-lg p-4 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">매수가</span>
            <span className="font-medium">{fmt(buyPrice)}만원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">+ 취득 비용</span>
            <span className="font-medium">+{fmt(buyCost)}만원</span>
          </div>
          <div className="flex justify-between py-2 border-b font-bold">
            <span>= 총 투자비용</span>
            <span>{fmt(r.totalInvestment)}만원</span>
          </div>
          <div className="flex justify-between py-2 border-b mt-2">
            <span className="text-gray-600">매도가</span>
            <span className="font-medium">{fmt(sellPrice)}만원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">- 매도 비용</span>
            <span className="font-medium">-{fmt(sellCost)}만원</span>
          </div>
          <div className="flex justify-between py-2 border-b font-bold">
            <span>= 실수령액</span>
            <span>{fmt(r.netSellAmount)}만원</span>
          </div>
          <div className={`flex justify-between py-2 font-bold text-lg mt-2 ${r.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
            <span>매매차익</span>
            <span>{r.profit >= 0 ? "+" : ""}{fmt(r.profit)}만원</span>
          </div>
        </div>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">부동산 수익률 분석 방법</h2>
        <p className="mb-3 text-gray-700">
          부동산 투자 수익률을 정확하게 계산하려면 단순 매매차익뿐 아니라 취득 과정에서 발생하는 모든 비용(취득세, 법무사 비용, 중개수수료, 인테리어 비용 등)과 매도 과정의 비용(중개수수료, 양도소득세)을 모두 포함해야 합니다. 보유 기간 중 재산세, 종합부동산세, 관리비 등도 고려하면 실질 수익률이 낮아질 수 있습니다.
        </p>
        <p className="mb-3 text-gray-700">
          연평균 수익률(CAGR, Compound Annual Growth Rate)은 투자 기간 전체의 성과를 연 단위로 환산한 값입니다. 단순 총 수익률을 보유 기간으로 나누는 것이 아니라, 복리 효과를 고려하여 계산합니다. CAGR = (최종가치/초기가치)^(1/기간) - 1 공식을 사용합니다.
        </p>
        <p className="text-gray-700">
          부동산 투자 시 레버리지(대출)를 활용하면 수익률이 크게 달라집니다. 예를 들어 3억원짜리 집을 1억원 자기자본으로 구매했을 때 집값이 3억 3천만원으로 올랐다면 자기자본 수익률은 30%(3천만원/1억원)입니다. 그러나 대출 이자를 차감한 실질 수익률로 계산해야 정확합니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "취득세는 얼마로 계산해야 하나요?", a: "주택 취득세는 1주택자 기준 6억원 이하 1%, 6억~9억원 1~3%, 9억원 초과 3%입니다. 2주택자는 8%, 3주택자 이상은 12%입니다(조정대상지역 기준). 취득세 외에 지방교육세, 농어촌특별세가 추가됩니다." },
          { q: "중개수수료는 얼마인가요?", a: "부동산 중개수수료는 거래금액에 따라 0.4~0.9%가 최대 한도이며, 협의로 낮출 수 있습니다. 9억원 이상 매매는 0.9% 이내, 6억~9억원은 0.5% 이내입니다. 부가가치세(10%)가 추가됩니다." },
          { q: "양도소득세는 어떻게 계산하나요?", a: "양도소득세는 매도차익에서 장기보유특별공제(보유기간·거주기간 따라 최대 80%)를 적용 후 과세표준에 6~45% 세율을 적용합니다. 1세대 1주택으로 2년 이상 보유·거주하면 9억원(12억원 기준 변경 검토 중)까지 비과세됩니다." },
          { q: "인플레이션을 고려한 실질 수익률은 어떻게 계산하나요?", a: "실질 수익률 = (1 + 명목수익률) / (1 + 인플레이션율) - 1입니다. 연 10% 수익률이어도 인플레이션이 3%라면 실질 수익률은 약 6.8%입니다. 부동산은 인플레이션 헤지 자산으로 평가되기도 합니다." },
          { q: "대출을 끼고 샀을 때 수익률은 어떻게 계산하나요?", a: "레버리지 수익률 = 매매차익 / 자기자본(= 매수가 - 대출금)으로 계산합니다. 단, 보유 기간 중 이자 비용을 차익에서 뺀 후 계산해야 합니다. 이자 비용 = 대출금 × 금리 × 보유 기간." },
          { q: "부동산 투자와 주식 투자를 어떻게 비교하나요?", a: "같은 금액 투자 시 수익률과 리스크를 비교할 때 연평균 수익률(CAGR)을 기준으로 비교합니다. 부동산은 레버리지 효과, 임대 수익, 세금 혜택이 있고, 주식은 유동성이 높고 소액 투자가 가능합니다. 각자의 상황과 리스크 허용 범위를 고려해 분산 투자하는 것이 권장됩니다." },
        ].map((item) => (
          <div key={item.q} className="mb-4 border-b pb-4 last:border-b-0">
            <p className="font-bold text-gray-800 mb-1">Q. {item.q}</p>
            <p className="text-gray-600 text-sm">{item.a}</p>
          </div>
        ))}
      </section>

      <RelatedCalculators />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">계산기 목록으로 돌아가기</Link>
      </div>
    </div>
  );
}
