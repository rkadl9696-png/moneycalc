"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [depositAmount, setDepositAmount] = useState(100000000);
  const [contractMonths, setContractMonths] = useState(24);
  const [annualRate, setAnnualRate] = useState(5.5);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const totalInterest = Math.floor(depositAmount * annualRate / 100 / 12 * contractMonths);
    const monthlyRent = Math.floor(depositAmount * annualRate / 100 / 12);
    const conversionRate = annualRate;

    const comparisons = [
      { label: "전세", deposit: depositAmount, monthly: 0 },
      { label: "반전세 (50%)", deposit: Math.floor(depositAmount * 0.5), monthly: Math.floor(depositAmount * 0.5 * annualRate / 100 / 12) },
      { label: "월세", deposit: 0, monthly: Math.floor(depositAmount * annualRate / 100 / 12) },
    ];

    return { totalInterest, monthlyRent, conversionRate, comparisons };
  }, [depositAmount, contractMonths, annualRate]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">보증금 이자 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        전월세 전환 시 보증금에 대한 이자를 계산합니다. 보증금액과 계약기간, 연이율을 입력하면 월세 환산금액과 총 이자를 자동으로 산출합니다.
        전세·반전세·월세 전환 비교표로 임대차 조건을 합리적으로 비교하고, 임차인·임대인 모두 최적의 계약 조건을 선택할 수 있도록 도와드립니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">보증금액 (원)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
              step={1000000}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">계약기간 (개월)</label>
            <input
              type="number"
              value={contractMonths}
              onChange={(e) => setContractMonths(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전월세 전환율 / 연이율 (%)</label>
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
              step={0.1}
            />
            <p className="text-xs text-gray-500 mt-1">법정 전환율 기준: 기준금리+2%. 현재 약 5~6% 수준</p>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">월세 환산금액</span>
            <span className="font-bold text-blue-700 text-lg">{fmt(result.monthlyRent)}원/월</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">계약기간 총 이자</span>
            <span className="font-bold">{fmt(result.totalInterest)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">적용 전환율</span>
            <span className="font-bold">{result.conversionRate}%</span>
          </div>
        </div>
        <h3 className="text-sm font-bold mb-2">전세 → 반전세 → 월세 전환 비교</h3>
        <table className="text-xs w-full">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-1 text-left">유형</th>
              <th className="p-1 text-right">보증금</th>
              <th className="p-1 text-right">월세</th>
            </tr>
          </thead>
          <tbody>
            {result.comparisons.map((c) => (
              <tr key={c.label} className="border-t">
                <td className="p-1 font-medium">{c.label}</td>
                <td className="p-1 text-right">{fmt(c.deposit)}원</td>
                <td className="p-1 text-right">{fmt(c.monthly)}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">전월세 전환율이란?</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          전월세 전환율은 전세보증금을 월세로 전환하거나 반대로 월세를 전세금으로 환산할 때 적용하는 이율입니다.
          주택임대차보호법에 따르면 법정 전월세 전환율은 한국은행 기준금리에 2%포인트를 더한 값으로 산정됩니다.
          기준금리가 3.5%라면 법정 전환율은 5.5%가 됩니다. 이 비율을 초과하여 월세를 요구할 경우 임차인은 초과분에 대해 반환을 청구할 수 있습니다.
          임대인 입장에서는 전세보다 월세가 안정적인 현금흐름을 제공하지만, 임차인은 보증금을 낮추면 매월 고정 지출이 발생합니다. 어느 방식이 유리한지는 보유 자금과 투자 수익률을 고려해 판단해야 합니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">보증금 이자 절약 전략</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          임차인 입장에서 보증금은 임대인에게 무이자로 제공하는 자금이지만, 그 기회비용을 고려하면 실질적인 비용이 발생합니다.
          보증금으로 묶이는 자금이 많을수록 투자 기회를 놓치게 됩니다. 예를 들어 1억 원의 보증금을 연 5.5% 수익률 상품에 투자하면 연 550만 원의 수익을 얻을 수 있습니다.
          따라서 전세로 살면서 보증금 이자(기회비용)를 절약하려면, 전세자금대출보다 낮은 이율로 보증금을 조달하거나, 여유 자금을 고수익 상품에 투자하는 것이 유리할 수 있습니다.
          반전세나 월세는 보증금이 낮은 대신 매월 지출이 발생하므로, 보증금 이 계산기로 월세 환산금액을 파악하고 전세 대출이자와 비교해 최적의 주거 방식을 선택하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "법정 전월세 전환율은 얼마인가요?", a: "주택임대차보호법 제7조의2에 따라 법정 전월세 전환율은 한국은행 기준금리 + 2%포인트입니다. 2024년 기준 기준금리 3.5% 기준으로 법정 전환율은 5.5%입니다. 기준금리 변동에 따라 달라집니다." },
          { q: "전월세 전환율을 초과하면 어떻게 되나요?", a: "법정 전환율을 초과하는 월세는 임차인이 초과분 반환을 청구할 수 있습니다. 법 위반으로 인한 불이익을 피하기 위해 임대인도 법정 전환율 이내에서 계약하는 것이 안전합니다." },
          { q: "보증금을 높이면 월세는 얼마나 줄어드나요?", a: "보증금 100만 원 증가 시 월세 감소액 = 100만 원 × 전환율 ÷ 12입니다. 전환율 5.5%라면 보증금 1,000만 원 증가 시 월세는 약 4,583원 감소합니다." },
          { q: "임차인이 중도에 전세를 월세로 전환을 요청할 수 있나요?", a: "임대인과 임차인 양방의 합의가 있어야 가능합니다. 일방적인 전환은 불가하며, 전환 시 법정 전환율을 초과하지 않도록 주의해야 합니다." },
          { q: "전세보증금 반환 지연 시 이자는 어떻게 되나요?", a: "계약 만료 후 임대인이 보증금을 반환하지 않으면 주택임대차보호법에 따라 연 12%(연체이자)를 청구할 수 있습니다. 전세 보증금 반환 계산기를 함께 활용하세요." },
          { q: "상가 임대의 전월세 전환율도 동일한가요?", a: "상가건물임대차보호법에도 전월세 전환율 규정이 있으며, 주택과 마찬가지로 기준금리+2%포인트를 초과하지 못하도록 규정되어 있습니다. 다만 당사자 합의가 있으면 달리 정할 수 있습니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/deposit-interest-calc" />

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
