"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const TRANSACTION_TAX = 0.0018; // 증권거래세 0.18%

const won = (n: number) => `${Math.round(Math.abs(n)).toLocaleString()}원`;
const pct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

export default function ClientPage() {
  const [buyPrice, setBuyPrice]     = useState(50_000);   // 매수가 (원)
  const [sellPrice, setSellPrice]   = useState(60_000);   // 매도가 (원)
  const [quantity, setQuantity]     = useState(100);      // 수량
  const [buyFeeRate, setBuyFeeRate]   = useState(0.015);  // 매수수수료율 %
  const [sellFeeRate, setSellFeeRate] = useState(0.015);  // 매도수수료율 %

  const r = useMemo(() => {
    // 매수
    const buyTotal  = buyPrice * quantity;
    const buyFee    = Math.round(buyTotal * buyFeeRate / 100);
    const buyTotal2 = buyTotal + buyFee; // 총 매수비용

    // 매도
    const sellTotal = sellPrice * quantity;
    const sellFee   = Math.round(sellTotal * sellFeeRate / 100);
    const txTax     = Math.round(sellTotal * TRANSACTION_TAX);
    const sellDeduct = sellFee + txTax; // 매도 시 공제 합계

    // 수익
    const totalFee  = buyFee + sellFee + txTax;
    const rawProfit = sellTotal - buyTotal;           // 매매차익 (수수료 제외)
    const netProfit = sellTotal - buyTotal2 - sellDeduct; // 순수익
    const returnRate = (netProfit / buyTotal2) * 100;

    // 손익분기점 = 총 매수비용 / (수량 × (1 - 매도수수료율 - 거래세율))
    const bep = buyTotal2 / (quantity * (1 - sellFeeRate / 100 - TRANSACTION_TAX));
    const bepGain = bep - buyPrice;
    const bepGainRate = (bepGain / buyPrice) * 100;

    const isProfit = netProfit >= 0;

    return {
      buyTotal, buyFee, buyTotal2,
      sellTotal, sellFee, txTax, sellDeduct,
      totalFee, rawProfit, netProfit, returnRate,
      bep, bepGain, bepGainRate, isProfit,
    };
  }, [buyPrice, sellPrice, quantity, buyFeeRate, sellFeeRate]);

  const profitColor = r.isProfit ? "text-red-500" : "text-blue-500";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">주식 수익률 계산기</h1>
      <p className="text-gray-600 mb-6">
        매수가·매도가·수량을 입력하면 수수료와 증권거래세를 반영한 순수익과 손익분기점을 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">거래 정보 입력</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">매수가 (원)</label>
            <input
              type="number" min={1} value={buyPrice}
              onChange={(e) => setBuyPrice(Math.max(1, Number(e.target.value)))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">매도가 (원)</label>
            <input
              type="number" min={1} value={sellPrice}
              onChange={(e) => setSellPrice(Math.max(1, Number(e.target.value)))}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">매수 수량 (주)</label>
          <input
            type="number" min={1} value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">매수 수수료율 (%)</label>
            <input
              type="number" min={0} max={1} step={0.001} value={buyFeeRate}
              onChange={(e) => setBuyFeeRate(Math.max(0, Number(e.target.value)))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">매도 수수료율 (%)</label>
            <input
              type="number" min={0} max={1} step={0.001} value={sellFeeRate}
              onChange={(e) => setSellFeeRate(Math.max(0, Number(e.target.value)))}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 text-sm">
          <span className="text-gray-500">증권거래세</span>
          <span className="font-bold text-gray-700">0.18% 자동 적용</span>
          <span className="text-xs text-gray-400">(매도금액 기준)</span>
        </div>
      </section>

      {/* 결과 요약 카드 */}
      <section className="mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-xl border-2 p-4 ${r.isProfit ? "border-red-400 bg-red-50" : "border-blue-400 bg-blue-50"}`}>
            <p className="text-xs text-gray-500 mb-1">순수익</p>
            <p className={`text-2xl font-bold ${profitColor}`}>
              {r.netProfit >= 0 ? "+" : "-"}{won(r.netProfit)}
            </p>
          </div>
          <div className={`rounded-xl border-2 p-4 ${r.isProfit ? "border-red-400 bg-red-50" : "border-blue-400 bg-blue-50"}`}>
            <p className="text-xs text-gray-500 mb-1">수익률</p>
            <p className={`text-2xl font-bold ${profitColor}`}>
              {pct(r.returnRate)}
            </p>
          </div>
        </div>
      </section>

      {/* 상세 내역 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-5">
        <h2 className="text-xl font-bold mb-4">상세 내역</h2>

        <div className="mb-4">
          <p className="text-xs font-bold text-gray-400 mb-2 tracking-wide">[ 매수 ]</p>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">총 매수금액 ({buyPrice.toLocaleString()}원 × {quantity.toLocaleString()}주)</span>
              <span className="font-medium">{won(r.buyTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">매수 수수료 ({buyFeeRate}%)</span>
              <span className="font-medium text-red-500">+ {won(r.buyFee)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-gray-300 pt-1.5 mt-0.5">
              <span>총 매수비용</span>
              <span>{won(r.buyTotal2)}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-bold text-gray-400 mb-2 tracking-wide">[ 매도 ]</p>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">총 매도금액 ({sellPrice.toLocaleString()}원 × {quantity.toLocaleString()}주)</span>
              <span className="font-medium">{won(r.sellTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">매도 수수료 ({sellFeeRate}%)</span>
              <span className="font-medium text-red-500">- {won(r.sellFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">증권거래세 (0.18%)</span>
              <span className="font-medium text-red-500">- {won(r.txTax)}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 mb-2 tracking-wide">[ 수익 ]</p>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">매매차익 (수수료·세금 제외)</span>
              <span className={`font-medium ${r.rawProfit >= 0 ? "text-red-500" : "text-blue-500"}`}>
                {r.rawProfit >= 0 ? "+" : "-"}{won(r.rawProfit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">총 수수료·세금</span>
              <span className="font-medium text-red-500">- {won(r.totalFee)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-gray-300 pt-1.5 mt-0.5 text-base">
              <span>순수익</span>
              <span className={profitColor}>
                {r.netProfit >= 0 ? "+" : "-"}{won(r.netProfit)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 손익분기점 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">손익분기점 (BEP)</h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">매수가</span>
            <span className="font-medium">{buyPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">손익분기점 매도가</span>
            <span className="font-bold text-blue-700">{Math.ceil(r.bep).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">매수가 대비 필요 상승폭</span>
            <span className="font-medium">
              +{Math.ceil(r.bepGain).toLocaleString()}원 (+{r.bepGainRate.toFixed(3)}%)
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          수수료와 거래세를 모두 감안해 이 가격 이상에서 매도해야 손해가 나지 않습니다.
        </p>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">주식 수익률 계산 방식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          총 매수비용 = 매수금액 + 매수수수료<br />
          순수익 = 매도금액 − 총 매수비용 − 매도수수료 − 증권거래세<br />
          수익률 = 순수익 ÷ 총 매수비용 × 100%
        </div>
        <p className="mb-3">
          증권거래세(0.18%)는 매도금액 기준으로 부과되며 매수 시에는 부과되지 않습니다.
          수수료율은 증권사마다 다르며, MTS 기준으로 0.015% 내외가 일반적입니다.
        </p>
        <p>
          손익분기점은 수수료와 거래세를 모두 반영한 실제 본전 가격으로,
          단순 매수가보다 높습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 증권거래세는 언제 부과되나요?</p>
          <p>매도 시에만 부과됩니다. 코스피·코스닥 모두 2024년 기준 0.18%가 적용됩니다 (코스피는 농특세 포함).</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 수수료율 0.015%가 맞나요?</p>
          <p>증권사 MTS 기준으로 0.015% 내외가 많습니다. 증권사마다 다르며 일부는 0.01% 이하 또는 월정액 상품도 있습니다. 해당 증권사 앱에서 확인하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 주식 양도소득세는 어떻게 되나요?</p>
          <p>일반 개인 투자자는 국내 주식 양도소득에 대해 별도 양도소득세가 없습니다. 단, 대주주 요건에 해당하거나 해외 주식은 양도소득세(22%)가 부과됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. ETF도 같은 수수료가 적용되나요?</p>
          <p>ETF는 주식과 동일하게 매매수수료와 증권거래세(단, 코스피 ETF는 거래세 면제)가 적용됩니다. 또한 연간 총보수(운용보수)가 별도로 발생합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 분할 매수·매도한 경우는 어떻게 계산하나요?</p>
          <p>분할 거래의 경우 평균 매수가를 산출한 후 이 계산기에 입력하면 됩니다. 각 거래별로 별도 계산 후 합산하는 방법도 있습니다.</p>
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
