"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

interface Investment {
  name: string;
  cost: number;
  revenue: number;
  years: number;
}

export default function ClientPage() {
  const [investments, setInvestments] = useState<Investment[]>([
    { name: "투자안 A", cost: 10000000, revenue: 15000000, years: 3 },
    { name: "투자안 B", cost: 5000000, revenue: 7000000, years: 2 },
    { name: "투자안 C", cost: 20000000, revenue: 25000000, years: 5 },
  ]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const results = useMemo(() => {
    return investments.map((inv) => {
      const profit = inv.revenue - inv.cost;
      const roi = inv.cost > 0 ? (profit / inv.cost * 100) : 0;
      const annualRoi = inv.years > 0 ? roi / inv.years : 0;
      const pbp = inv.cost > 0 && inv.revenue > inv.cost
        ? (inv.cost / ((inv.revenue - inv.cost) / inv.years)).toFixed(2)
        : "N/A";
      return { profit, roi: roi.toFixed(1), annualRoi: annualRoi.toFixed(1), pbp };
    });
  }, [investments]);

  const updateInvestment = (index: number, field: keyof Investment, value: string | number) => {
    setInvestments((prev) => prev.map((inv, i) => i === index ? { ...inv, [field]: value } : inv));
  };

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">ROI 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        초기 투자비용과 기대 수익, 투자 기간을 입력하면 ROI(투자수익률)·연평균 ROI·투자회수기간(PBP)을 자동으로 계산합니다.
        최대 3개 투자안을 동시에 비교하여 가장 효율적인 투자 결정을 내리세요.
        사업 투자, 설비 구입, 마케팅 예산, 부동산 투자 등 다양한 의사결정에 활용할 수 있습니다.
      </p>

      <div className="space-y-4 mb-5">
        {investments.map((inv, i) => (
          <section key={i} className="border rounded-lg p-4">
            <h2 className="text-base font-bold mb-3">{inv.name}</h2>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">투자비용 (원)</label>
                <input
                  type="number"
                  value={inv.cost}
                  onChange={(e) => updateInvestment(i, "cost", Number(e.target.value))}
                  className="w-full border rounded-lg p-2 text-sm"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">기대수익 (원)</label>
                <input
                  type="number"
                  value={inv.revenue}
                  onChange={(e) => updateInvestment(i, "revenue", Number(e.target.value))}
                  className="w-full border rounded-lg p-2 text-sm"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">기간 (년)</label>
                <input
                  type="number"
                  value={inv.years}
                  onChange={(e) => updateInvestment(i, "years", Number(e.target.value))}
                  className="w-full border rounded-lg p-2 text-sm"
                  min={0.1}
                  step={0.5}
                />
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">투자안 비교</h2>
        <div className="overflow-x-auto">
          <table className="text-sm w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2 text-left">투자안</th>
                <th className="p-2 text-right">순이익</th>
                <th className="p-2 text-right">ROI</th>
                <th className="p-2 text-right">연 ROI</th>
                <th className="p-2 text-right">회수기간</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv, i) => {
                const res = results[i];
                const best = results.reduce((b, r) => Number(r.annualRoi) > Number(b.annualRoi) ? r : b);
                const isBest = res === best;
                return (
                  <tr key={inv.name} className={`border-t ${isBest ? "bg-green-50" : ""}`}>
                    <td className="p-2 font-medium">{inv.name} {isBest ? "⭐" : ""}</td>
                    <td className={`p-2 text-right ${res.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {fmt(res.profit)}원
                    </td>
                    <td className="p-2 text-right font-bold">{res.roi}%</td>
                    <td className="p-2 text-right">{res.annualRoi}%/년</td>
                    <td className="p-2 text-right">{res.pbp}년</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">ROI(투자수익률)이란?</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          ROI(Return on Investment)는 투자 대비 수익의 비율을 나타내는 지표로, ROI = (수익 - 비용) ÷ 비용 × 100으로 계산합니다.
          ROI가 100%라면 투자금과 같은 금액의 순이익을 얻었다는 의미입니다.
          연평균 ROI는 투자 기간이 다른 여러 투자안을 공정하게 비교할 때 사용합니다.
          투자회수기간(PBP, Pay-Back Period)은 투자금 전액을 회수하는 데 걸리는 시간으로, PBP가 짧을수록 자금 회수가 빠릅니다.
          ROI는 단순 계산에서 시간가치를 반영하지 않으므로, 정밀한 투자 분석에는 NPV(순현재가치)나 IRR(내부수익률)도 함께 사용합니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">ROI 기반 투자 의사결정 전략</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          투자 결정 시 ROI만으로는 충분하지 않습니다. 위험(리스크), 유동성, 시간가치를 종합적으로 고려해야 합니다.
          일반적으로 ROI가 10% 이상이면 양호하고, 30% 이상이면 우수한 투자로 평가합니다. 단, 업종과 리스크 수준에 따라 다릅니다.
          여러 투자안 중 연 ROI가 높은 안을 우선하되, 회수기간도 짧은 것이 현금흐름 측면에서 유리합니다.
          마케팅 ROI의 경우 광고비 대비 매출 증가분을 수익으로 계산하며, 업종 평균 마케팅 ROI(보통 500~700% = 5~7배)와 비교하세요.
          설비 투자의 ROI는 장기간에 걸쳐 회수되므로, 감가상각과 유지보수 비용도 총비용에 포함해야 정확한 ROI를 산출할 수 있습니다.
          이 계산기로 여러 투자안을 신속하게 비교하고, 가장 효율적인 자원 배분을 결정하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "ROI와 IRR의 차이는 무엇인가요?", a: "ROI는 전체 기간의 총수익률을 단순 계산하는 방법이고, IRR(내부수익률)은 현금흐름의 시간가치를 반영한 복잡한 지표입니다. 장기 투자일수록 IRR이 더 정확한 비교 지표가 됩니다. ROI는 빠른 초기 비교에 유용합니다." },
          { q: "ROI가 마이너스이면 어떤 의미인가요?", a: "ROI가 마이너스라면 투자금보다 수익이 적어 손실이 발생했음을 의미합니다. 투자 기간 내 손실을 초래하는 투자안은 원칙적으로 투자하지 않는 것이 좋으며, 전략적 목적(시장 진입, 브랜드 구축 등)이 있는 경우는 예외일 수 있습니다." },
          { q: "소규모 자영업에도 ROI 분석이 필요한가요?", a: "네, 반드시 필요합니다. 인테리어 비용, 설비 구입, 마케팅 예산 등 각 지출 항목별 ROI를 분석하면 어느 항목에 투자를 늘리고 줄일지 데이터에 기반한 결정을 내릴 수 있습니다." },
          { q: "마케팅 비용의 ROI는 어떻게 계산하나요?", a: "마케팅 ROI = (마케팅 덕분에 증가한 매출 - 마케팅 비용) ÷ 마케팅 비용 × 100입니다. 증가한 매출을 정확히 측정하기 위해 A/B 테스트나 프로모션 코드 추적 등의 방법을 활용하세요." },
          { q: "투자회수기간(PBP)이 길어도 괜찮은 경우가 있나요?", a: "네, PBP가 길더라도 ROI가 매우 높거나 시장 선점 효과가 크다면 합리적인 투자일 수 있습니다. 부동산이나 인프라 투자처럼 장기 수익을 목표로 하는 경우 10년 이상 PBP도 수용 가능합니다." },
          { q: "ROI 계산에 세금 효과도 반영해야 하나요?", a: "정밀한 투자 분석에서는 세후 수익을 기준으로 ROI를 계산해야 합니다. 법인세·소득세를 차감한 세후 수익이 실질적인 투자 이익이며, 특히 세율이 높은 경우 세전·세후 ROI 차이가 크게 날 수 있습니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/roi-calc" />

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
