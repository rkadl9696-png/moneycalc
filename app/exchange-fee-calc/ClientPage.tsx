"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type Currency = "USD" | "EUR" | "JPY" | "CNY";
type Method = "bank" | "exchange" | "atm";

const CURRENCY_NAMES: Record<Currency, string> = {
  USD: "미국 달러 (USD)",
  EUR: "유로 (EUR)",
  JPY: "일본 엔 (JPY)",
  CNY: "중국 위안 (CNY)",
};

const METHOD_NAMES: Record<Method, string> = {
  bank: "은행 (우대 70%)",
  exchange: "환전소 (우대 50%)",
  atm: "ATM (우대 0%)",
};

const FEE_SPREAD: Record<Method, number> = {
  bank: 0.018,
  exchange: 0.03,
  atm: 0.05,
};

export default function ClientPage() {
  const [amount, setAmount] = useState(1000000);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [method, setMethod] = useState<Method>("bank");
  const [baseRate, setBaseRate] = useState(1350);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const spread = FEE_SPREAD[method];
    const appliedRate = baseRate * (1 + spread);
    const foreignAmount = amount / appliedRate;
    const feeAmount = Math.round(amount - foreignAmount * baseRate);
    const effectiveRate = amount > 0 ? (amount / foreignAmount).toFixed(2) : "0";
    const results = (Object.keys(METHOD_NAMES) as Method[]).map((m) => {
      const s = FEE_SPREAD[m];
      const r = baseRate * (1 + s);
      const fa = amount / r;
      const fee = Math.round(amount - fa * baseRate);
      return { method: m, foreignAmount: fa.toFixed(2), fee, effectiveRate: (amount / fa).toFixed(2) };
    });
    return { foreignAmount: foreignAmount.toFixed(2), feeAmount, effectiveRate, results };
  }, [amount, currency, method, baseRate]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">환전 수수료 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        환전 금액과 통화, 환전 방법을 선택하면 실제 수령액과 수수료 금액, 실효 환율을 계산합니다.
        은행(우대율 70%)·환전소(우대율 50%)·ATM(우대율 0%) 세 가지 방법의 수수료를 동시에 비교하여 가장 유리한 환전 방법을 선택하세요.
        기준 환율을 직접 입력하여 실시간 조건으로 계산할 수 있습니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">환전 금액 (원)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">통화 선택</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="w-full border rounded-lg p-2 text-sm">
              {(Object.entries(CURRENCY_NAMES) as [Currency, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">기준 환율 (원/{currency})</label>
            <input type="number" value={baseRate} onChange={(e) => setBaseRate(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={1} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">환전 방법</label>
            <select value={method} onChange={(e) => setMethod(e.target.value as Method)} className="w-full border rounded-lg p-2 text-sm">
              {(Object.entries(METHOD_NAMES) as [Method, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">실제 수령액</span>
            <span className="font-bold text-blue-700 text-lg">{result.foreignAmount} {currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">수수료 (스프레드)</span>
            <span className="font-bold text-red-600">{fmt(result.feeAmount)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">실효 환율</span>
            <span className="font-bold">{result.effectiveRate}원/{currency}</span>
          </div>
        </div>
        <h3 className="text-sm font-bold mb-2">환전 방법별 비교</h3>
        <table className="text-xs w-full">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-1 text-left">방법</th>
              <th className="p-1 text-right">수령액</th>
              <th className="p-1 text-right">수수료</th>
              <th className="p-1 text-right">실효환율</th>
            </tr>
          </thead>
          <tbody>
            {result.results.map((r) => (
              <tr key={r.method} className={`border-t ${r.method === method ? "bg-green-50 font-bold" : ""}`}>
                <td className="p-1">{METHOD_NAMES[r.method as Method].split(" ")[0]}</td>
                <td className="p-1 text-right">{r.foreignAmount} {currency}</td>
                <td className="p-1 text-right text-red-600">{fmt(r.fee)}원</td>
                <td className="p-1 text-right">{r.effectiveRate}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">환전 수수료 구조</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          환전 수수료는 매매기준율과 실제 환전 적용 환율의 차이(스프레드)로 발생합니다. 은행은 보통 스프레드의 30%를 수수료로 부과하는 방식으로 우대율 70%를 적용합니다.
          환전소는 우대율 50%, ATM은 우대율 없이 전체 스프레드를 부담합니다. 은행 앱이나 인터넷 뱅킹을 통한 환전 예약 서비스는 우대율 90%까지 제공하기도 합니다.
          통화마다 스프레드 폭이 다르며 달러·엔화·유로화 등 주요 통화는 스프레드가 낮고, 동남아 등 비주요 통화는 스프레드가 높습니다.
          최근에는 토스·카카오페이 등 핀테크를 통해 우대율 95% 이상의 유리한 조건으로 환전할 수 있는 서비스도 늘어나고 있습니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">가장 저렴하게 환전하는 방법</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          환전 비용을 최소화하려면 먼저 은행 앱(KB, 신한, 하나 등)의 환전 우대 이벤트를 확인하세요. 특정 통화·시기에 최대 90% 우대율 쿠폰을 제공하기도 합니다.
          토스·카카오페이의 환전 서비스는 95% 우대율로 은행보다 저렴한 경우가 많으며, 여행 출발 전 미리 환전할 수 있습니다.
          공항 환전소는 접근성은 좋지만 우대율이 낮아 비용이 더 많이 발생합니다. 부득이하게 공항에서 환전해야 한다면 여행지 도착 후 현지 ATM을 이용하는 것도 방법입니다.
          해외 카드 결제 시 Visa/Mastercard 국제 수수료(약 1%)와 카드사 해외 이용 수수료를 확인하고, 해외 결제 수수료 없는 카드를 활용하세요.
          환전 금액이 클수록 우대율 협상이 가능한 경우도 있으니, 대규모 환전 시 은행 창구에서 직접 상담하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "매매기준율과 환전 적용 환율의 차이는 무엇인가요?", a: "매매기준율은 은행들이 외환 거래를 위해 고시하는 기준 환율입니다. 실제 환전 시에는 이 기준율에 은행의 마진(스프레드)이 더해진 매도율(살 때)이 적용됩니다. 우대율 70%란 스프레드의 70%를 깎아준다는 의미입니다." },
          { q: "달러·엔화·유로화 중 어느 통화가 환전 수수료가 가장 낮나요?", a: "미국 달러(USD)가 거래량이 가장 많아 스프레드가 가장 낮습니다. 유로화, 일본 엔화 순으로 낮으며, 동남아시아 통화는 거래량이 적어 스프레드가 상대적으로 높습니다." },
          { q: "환전한 외화를 다시 원화로 바꿀 때도 수수료가 드나요?", a: "네, 재환전(외화→원화)에도 스프레드가 적용됩니다. 원화 매수 환율이 매도 환율보다 낮으므로 두 번의 환전 거래에서 수수료가 발생합니다. 불필요한 재환전을 줄이는 것이 비용 절감에 도움이 됩니다." },
          { q: "해외에서 카드로 결제할 때 환전 수수료는 어떻게 되나요?", a: "카드 결제 시 Visa/Mastercard 네트워크에서 매매기준율 근처의 환율로 자동 환전되며, 여기에 카드사 해외 이용 수수료(약 0.5~1.5%)가 추가됩니다. 해외 수수료 없는 카드(트래블월렛, 트레블로그 등)를 사용하면 수수료를 크게 줄일 수 있습니다." },
          { q: "인터넷 뱅킹으로 환전 예약을 하면 더 저렴한가요?", a: "대부분의 은행이 인터넷·앱 환전 예약 서비스에서 창구 대비 높은 우대율(최대 90%)을 제공합니다. 또한 환전 예약 후 지정 기간 내 영업점 수령이나 배달 서비스를 이용할 수 있어 편리합니다." },
          { q: "달러를 엔화로 직접 환전할 수 있나요?", a: "외화 간 직접 환전(크로스 환전)도 가능하지만 수수료가 두 번 발생할 수 있습니다. 달러→원화→엔화 방식으로 처리되거나, 일부 은행에서 직접 크로스 환전을 제공합니다. 어느 방법이 유리한지 비교 후 결정하세요." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/exchange-fee-calc" />

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
