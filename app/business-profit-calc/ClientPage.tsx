"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [revenue, setRevenue] = useState(100000000);
  const [cogs, setCogs] = useState(60000000);
  const [sga, setSga] = useState(20000000);
  const [nonOpIncome, setNonOpIncome] = useState(0);
  const [nonOpExpense, setNonOpExpense] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const grossProfit = revenue - cogs;
    const operatingProfit = grossProfit - sga;
    const netProfit = operatingProfit + nonOpIncome - nonOpExpense;
    const grossMargin = revenue > 0 ? (grossProfit / revenue * 100).toFixed(1) : "0.0";
    const operatingMargin = revenue > 0 ? (operatingProfit / revenue * 100).toFixed(1) : "0.0";
    const netMargin = revenue > 0 ? (netProfit / revenue * 100).toFixed(1) : "0.0";
    return { grossProfit, operatingProfit, netProfit, grossMargin, operatingMargin, netMargin };
  }, [revenue, cogs, sga, nonOpIncome, nonOpExpense]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  const items = [
    { label: "매출액", value: revenue, color: "text-blue-700" },
    { label: "(-) 매출원가", value: -cogs, color: "text-red-600" },
    { label: "매출총이익", value: result.grossProfit, color: result.grossProfit >= 0 ? "text-green-700" : "text-red-600", bold: true, margin: result.grossMargin },
    { label: "(-) 판매관리비", value: -sga, color: "text-red-600" },
    { label: "영업이익", value: result.operatingProfit, color: result.operatingProfit >= 0 ? "text-green-700" : "text-red-600", bold: true, margin: result.operatingMargin },
    { label: "(+) 영업외수익", value: nonOpIncome, color: "text-blue-600" },
    { label: "(-) 영업외비용", value: -nonOpExpense, color: "text-red-600" },
    { label: "순이익", value: result.netProfit, color: result.netProfit >= 0 ? "text-green-700" : "text-red-600", bold: true, margin: result.netMargin },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">사업 수익성 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        매출액과 매출원가, 판매관리비, 영업외수익·비용을 입력하면 매출총이익·영업이익·순이익과 각 이익률을 자동으로 계산합니다.
        간이 손익계산서 형식으로 사업 재무 상태를 한눈에 파악하고, 수익성 개선 방향을 분석하는 데 활용하세요.
        소규모 사업자, 프리랜서, 스타트업의 재무 분석에 유용합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력 (월간 또는 연간 금액)</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매출액 (원)</label>
            <input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매출원가 (원)</label>
            <input type="number" value={cogs} onChange={(e) => setCogs(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">판매관리비 (원)</label>
            <input type="number" value={sga} onChange={(e) => setSga(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">영업외수익 (이자수익 등) (원)</label>
            <input type="number" value={nonOpIncome} onChange={(e) => setNonOpIncome(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={10000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">영업외비용 (이자비용 등) (원)</label>
            <input type="number" value={nonOpExpense} onChange={(e) => setNonOpExpense(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={10000} />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">손익계산서</h2>
        <div className="space-y-1">
          {items.map((item) => (
            <div key={item.label} className={`flex justify-between text-sm py-1 ${item.bold ? "border-t border-blue-200 pt-2 mt-1" : ""}`}>
              <span className={`${item.bold ? "font-bold text-gray-800" : "text-gray-600"}`}>{item.label}</span>
              <span className={`font-bold ${item.color}`}>
                {item.value >= 0 ? "" : "-"}{fmt(Math.abs(item.value))}원
                {"margin" in item ? ` (${item.margin}%)` : ""}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">수익성 지표 해석</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          매출총이익률(매출총이익 ÷ 매출액 × 100)은 제품·서비스 자체의 수익성을 나타냅니다. 일반적으로 20% 이상이면 양호하며, 업종마다 기준이 다릅니다.
          영업이익률은 실제 영업 활동의 효율성을 보여주는 핵심 지표로, 5~10%면 대부분의 업종에서 양호한 수준입니다.
          순이익률은 모든 비용과 수익을 반영한 최종 수익성으로, 사업의 전반적인 건전성을 나타냅니다.
          손익이 마이너스(적자)인 경우 원가 절감, 판관비 축소, 매출 확대 중 어느 방향으로 개선할지 판단하는 데 이 계산기를 활용할 수 있습니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">사업 수익성 개선 전략</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          수익성 개선의 핵심은 매출 증가, 원가 절감, 비용 효율화 세 가지입니다.
          매출원가율이 높다면 원재료 단가 협상, 생산 효율화, 불량률 감소를 통해 개선할 수 있습니다.
          판매관리비가 과다하다면 마케팅 ROI를 분석하여 효과 없는 지출을 줄이고, 업무 자동화로 인건비를 절감하는 방안을 검토하세요.
          영업외비용(이자비용)이 크다면 부채 상환 우선순위를 검토하고, 금리가 낮은 대출로 전환하는 것이 도움이 됩니다.
          손익 분석을 월별로 정기적으로 수행하면 계절성 파악과 예산 계획에 유용하며, 업종별 평균 이익률과 비교하여 경쟁력을 점검하세요.
          소규모 사업자도 간단한 가계부 방식으로 수입·지출을 기록하면 수익성 분석이 쉬워집니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "매출원가와 판매관리비의 차이는 무엇인가요?", a: "매출원가는 제품 생산이나 서비스 제공에 직접 투입되는 비용(재료비, 노무비, 제조경비)이며, 판매관리비(판관비)는 영업활동을 지원하는 간접비용(광고비, 임직원 급여, 임차료, 감가상각비 등)입니다." },
          { q: "영업이익이 마이너스인데 순이익이 플러스인 경우가 있나요?", a: "네, 가능합니다. 예를 들어 부동산 처분이익이나 투자 수익 등 영업외수익이 영업 손실을 상쇄하는 경우입니다. 다만 이는 일시적인 현상일 수 있으므로 영업이익 개선이 중요합니다." },
          { q: "업종별 평균 이익률은 어떻게 되나요?", a: "업종마다 크게 다릅니다. 도·소매업은 영업이익률이 1~3% 수준인 반면, IT 소프트웨어는 10~20%, 제약·바이오는 15% 이상도 가능합니다. 중소기업 평균 영업이익률은 약 3~5% 수준입니다." },
          { q: "세금 전 이익(EBT)과 세금 후 순이익의 차이는 무엇인가요?", a: "이 계산기의 순이익은 세금 차감 전 이익(EBT, 세전순이익)에 가깝습니다. 실제 세후 순이익은 법인세·소득세를 차감해야 합니다. 정확한 세후 순이익을 알려면 세금 비용도 입력하세요." },
          { q: "감가상각비는 어디에 포함되나요?", a: "감가상각비는 일반적으로 판매관리비(간접 감가상각) 또는 매출원가(직접 제조설비 감가상각)에 포함됩니다. 소규모 사업의 경우 대부분 판관비에 포함하여 처리합니다." },
          { q: "재고 관련 손실은 어떻게 반영하나요?", a: "재고 자산 평가손실(폐기, 파손, 재고 감모 등)은 매출원가에 포함하거나 영업외비용으로 처리합니다. 정확한 처리 방법은 회계 기준과 사업 특성에 따라 달라지므로 세무사와 상담하세요." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/business-profit-calc" />

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
