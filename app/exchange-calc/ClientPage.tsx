"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type Currency = "USD" | "EUR" | "JPY" | "CNY" | "GBP";
type Direction = "krw" | "foreign";

const DEFAULT_RATES: Record<Currency, number> = {
  USD: 1370,
  EUR: 1490,
  JPY: 9.10,
  CNY: 190,
  GBP: 1740,
};

const CURRENCY_INFO: Record<Currency, { symbol: string; name: string; unit: string }> = {
  USD: { symbol: "$",  name: "미국 달러",    unit: "달러" },
  EUR: { symbol: "€",  name: "유로",         unit: "유로" },
  JPY: { symbol: "¥",  name: "일본 엔",      unit: "엔" },
  CNY: { symbol: "¥",  name: "중국 위안",    unit: "위안" },
  GBP: { symbol: "£",  name: "영국 파운드",  unit: "파운드" },
};

const krwFmt  = (n: number) => `${Math.round(n).toLocaleString()}원`;
const fgnFmt  = (n: number, currency: Currency) => {
  const sym = CURRENCY_INFO[currency].symbol;
  if (currency === "JPY") return `${sym}${n.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}`;
  return `${sym}${n.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function ClientPage() {
  const [currency, setCurrency]     = useState<Currency>("USD");
  const [rate, setRate]             = useState<Record<Currency, number>>(DEFAULT_RATES);
  const [direction, setDirection]   = useState<Direction>("krw");
  const [amount, setAmount]         = useState(100_000); // 원화 기준 기본값
  const [feeRate, setFeeRate]       = useState(1.5);

  const currentRate = rate[currency];

  const r = useMemo(() => {
    const feeRatio = feeRate / 100;

    if (direction === "krw") {
      // 원화 → 외화
      const noFee  = amount / currentRate;
      const withFee = amount / (currentRate * (1 + feeRatio));
      const feeAmount = noFee - withFee; // 수수료로 잃는 외화
      const feeKrw = feeAmount * currentRate; // 원화 환산 수수료
      // 우대환율
      const fee50 = amount / (currentRate * (1 + feeRatio * 0.5));
      const fee90 = amount / (currentRate * (1 + feeRatio * 0.1));
      return { noFee, withFee, feeAmount, feeKrw, fee50, fee90, isKrw: true };
    } else {
      // 외화 → 원화
      const noFee   = amount * currentRate;
      const withFee = amount * currentRate * (1 - feeRatio);
      const feeKrw  = noFee - withFee;
      // 우대환율
      const fee50 = amount * currentRate * (1 - feeRatio * 0.5);
      const fee90 = amount * currentRate * (1 - feeRatio * 0.1);
      return { noFee, withFee, feeAmount: feeKrw / currentRate, feeKrw, fee50, fee90, isKrw: false };
    }
  }, [amount, currentRate, direction, feeRate]);

  const info = CURRENCY_INFO[currency];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">환율 계산기</h1>
      <p className="text-gray-600 mb-6">
        환율을 직접 입력해 원화↔외화 환전 금액을 수수료 포함/미포함으로 계산합니다.
      </p>

      {/* 통화 선택 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-3">통화 선택</h2>
        <div className="flex gap-2 flex-wrap mb-4">
          {(Object.keys(CURRENCY_INFO) as Currency[]).map((cur) => (
            <button
              key={cur}
              onClick={() => setCurrency(cur)}
              className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                currency === cur
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
              }`}
            >
              {cur}
            </button>
          ))}
        </div>

        {/* 환율 입력 */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            1{info.unit} = ? 원 (환율 직접 입력)
          </label>
          <input
            type="number"
            min={0.01}
            step={0.01}
            value={rate[currency]}
            onChange={(e) =>
              setRate((prev) => ({ ...prev, [currency]: Math.max(0.01, Number(e.target.value)) }))
            }
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">
            네이버·하나은행 등에서 실시간 환율 확인 후 입력하세요.
            현재 참고값: 1{info.unit} ≈ {DEFAULT_RATES[currency].toLocaleString()}원
          </p>
        </div>
      </section>

      {/* 방향 + 금액 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-3">환전 방향 및 금액</h2>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {([["krw", `원화 → ${currency}`], ["foreign", `${currency} → 원화`]] as [Direction, string][]).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setDirection(key);
                  setAmount(key === "krw" ? 100_000 : 100);
                }}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  direction === key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">
            {direction === "krw" ? "환전할 금액 (원)" : `환전할 금액 (${currency})`}
          </label>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">환전 수수료율 (%)</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={feeRate}
            onChange={(e) => setFeeRate(Math.max(0, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">
            은행 창구 기준 통상 1.5~2.0%, 인터넷뱅킹·환전소는 더 낮을 수 있음
          </p>
        </div>
      </section>

      {/* 결과 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-5">
        <h2 className="text-xl font-bold mb-4">환전 결과</h2>

        <div className="flex flex-col gap-3">
          {/* 수수료 미포함 */}
          <div className="bg-white rounded-lg border p-4">
            <p className="text-xs text-gray-500 mb-1">수수료 미포함 (고시환율 기준)</p>
            <p className="text-xl font-bold">
              {direction === "krw"
                ? fgnFmt(r.noFee, currency)
                : krwFmt(r.noFee)}
            </p>
          </div>

          {/* 수수료 포함 */}
          <div className="bg-blue-600 text-white rounded-lg p-4">
            <p className="text-xs text-blue-200 mb-1">수수료 {feeRate}% 포함 (실제 환전액)</p>
            <p className="text-xl font-bold">
              {direction === "krw"
                ? fgnFmt(r.withFee, currency)
                : krwFmt(r.withFee)}
            </p>
          </div>

          {/* 수수료액 */}
          <div className="bg-white rounded-lg border p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">수수료로 차감되는 금액</span>
              <span className="font-bold text-red-500">{krwFmt(r.feeKrw)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 우대환율 비교 */}
      <section className="mb-8">
        <h2 className="text-base font-bold mb-3">
          우대환율 적용 시 비교
          <span className="ml-2 text-sm font-normal text-gray-400">(은행별 50~90% 우대 가능)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">우대 조건</th>
                <th className="text-center p-3 border-b font-bold">실효 수수료율</th>
                <th className="text-right p-3 border-b font-bold">환전 결과</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "우대 없음", ratio: 1,   value: r.withFee },
                { label: "50% 우대", ratio: 0.5,  value: r.fee50 },
                { label: "90% 우대", ratio: 0.1,  value: r.fee90 },
                { label: "수수료 면제", ratio: 0, value: r.noFee },
              ].map(({ label, ratio, value }) => (
                <tr key={label} className="border-b last:border-b-0">
                  <td className="p-3 font-medium">{label}</td>
                  <td className="text-center p-3 text-gray-600">
                    {ratio === 0 ? "0%" : `${(feeRate * ratio).toFixed(2)}%`}
                  </td>
                  <td className="text-right p-3 font-bold text-blue-700">
                    {direction === "krw" ? fgnFmt(value, currency) : krwFmt(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">환전 수수료 절약하는 방법</h2>
        <div className="flex flex-col gap-3">
          {[
            { title: "인터넷·앱 환전 예약", desc: "은행 앱에서 환전 예약 시 수수료 70~90% 우대를 받을 수 있습니다." },
            { title: "외화 통장 활용", desc: "외화 통장에 입금 후 공항 수령 시 추가 우대 혜택을 제공하는 경우가 많습니다." },
            { title: "환전소 비교", desc: "명동·인사동 등 시내 사설 환전소는 은행보다 수수료가 낮을 수 있습니다." },
            { title: "체크·신용카드 활용", desc: "해외 결제 수수료(통상 1~1.5%)가 현금 환전보다 저렴할 수 있습니다." },
          ].map(({ title, desc }) => (
            <div key={title} className="flex gap-3 p-3 border rounded-lg">
              <span className="text-blue-500 font-bold shrink-0">✓</span>
              <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 고시환율과 실제 환전 환율의 차이는 무엇인가요?</p>
          <p>고시환율은 은행이 기준으로 삼는 환율이고, 실제 환전 시에는 수수료(마진)가 붙어 원화→외화 시 더 비싸게, 외화→원화 시 더 싸게 적용됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 우대환율은 어디서 받을 수 있나요?</p>
          <p>주거래 은행 앱·인터넷뱅킹 환전, 은행 VIP 고객, 공항 환전 사전 예약, 제휴 카드 혜택 등을 통해 50~90% 우대를 받을 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 엔화 환율이 다른 통화와 단위가 다른 이유는?</p>
          <p>엔화는 단위 가치가 낮아 1엔 = 약 9원 수준입니다. 은행 창구에서는 보통 100엔 기준으로 표시하지만, 이 계산기는 1엔 기준으로 계산합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 해외 결제 시 카드 수수료는 어떻게 계산되나요?</p>
          <p>카드사는 국제 브랜드 수수료(VISA·Master 약 1%) + 해외 서비스 수수료(약 0.25~0.5%)를 합산해 청구합니다. 카드에 따라 면제 혜택도 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 환율이 오르면 원화 가치는 어떻게 되나요?</p>
          <p>환율(원/달러)이 오르면 원화 가치가 하락한 것입니다. 같은 달러를 사려면 더 많은 원화가 필요하고, 수입 물가가 올라 물가 상승 압력이 생깁니다.</p>
        </div>
      </section>

      <RelatedCalculators />

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700"
        >
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
