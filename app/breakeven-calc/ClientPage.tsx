"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [fixedCost, setFixedCost] = useState(3000000);
  const [variableCost, setVariableCost] = useState(5000);
  const [sellingPrice, setSellingPrice] = useState(10000);
  const [targetProfit, setTargetProfit] = useState(1000000);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const contributionMargin = sellingPrice - variableCost;
    if (contributionMargin <= 0) return null;
    const bepQty = Math.ceil(fixedCost / contributionMargin);
    const bepRevenue = bepQty * sellingPrice;
    const targetQty = Math.ceil((fixedCost + targetProfit) / contributionMargin);
    const targetRevenue = targetQty * sellingPrice;
    const marginRatio = (contributionMargin / sellingPrice * 100).toFixed(1);

    const simRows = [];
    const step = Math.max(1, Math.floor(bepQty / 5));
    for (let qty = 0; qty <= bepQty * 2; qty += step) {
      const revenue = qty * sellingPrice;
      const totalCost = fixedCost + qty * variableCost;
      const profit = revenue - totalCost;
      simRows.push({ qty, revenue, totalCost, profit });
      if (simRows.length >= 8) break;
    }

    return { bepQty, bepRevenue, targetQty, targetRevenue, marginRatio, contributionMargin, simRows };
  }, [fixedCost, variableCost, sellingPrice, targetProfit]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">손익분기점 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        고정비용과 단위당 변동비용, 판매가격을 입력하면 BEP(손익분기점) 수량과 BEP 매출액을 계산합니다.
        목표 이익 달성에 필요한 판매량과 수량별 수익 시뮬레이션 테이블로 사업 계획의 타당성을 검토하세요.
        창업 전 사전 분석, 신규 제품 출시, 가격 전략 수립에 필수적인 도구입니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">월 고정비용 (원)</label>
            <input type="number" value={fixedCost} onChange={(e) => setFixedCost(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
            <p className="text-xs text-gray-500 mt-1">임대료, 인건비, 감가상각비 등</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">단위당 변동비용 (원)</label>
            <input type="number" value={variableCost} onChange={(e) => setVariableCost(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100} />
            <p className="text-xs text-gray-500 mt-1">재료비, 포장비, 수수료 등 판매량에 비례하는 비용</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">단위당 판매가격 (원)</label>
            <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">목표 이익 (원)</label>
            <input type="number" value={targetProfit} onChange={(e) => setTargetProfit(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
        </div>
      </section>

      {result === null ? (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-8 text-sm text-red-700">
          판매가격이 변동비용보다 높아야 BEP 계산이 가능합니다.
        </div>
      ) : (
        <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
          <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">단위 공헌이익</span>
              <span className="font-bold">{fmt(result.contributionMargin)}원 (공헌이익률 {result.marginRatio}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">BEP 수량</span>
              <span className="font-bold text-blue-700 text-lg">{fmt(result.bepQty)}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">BEP 매출액</span>
              <span className="font-bold text-blue-700">{fmt(result.bepRevenue)}원</span>
            </div>
            <hr className="border-blue-200" />
            <div className="flex justify-between">
              <span className="text-gray-600">목표이익 달성 필요 판매량</span>
              <span className="font-bold text-green-700">{fmt(result.targetQty)}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">목표이익 달성 필요 매출액</span>
              <span className="font-bold text-green-700">{fmt(result.targetRevenue)}원</span>
            </div>
          </div>
          <h3 className="text-sm font-bold mb-2">수량별 수익 시뮬레이션</h3>
          <div className="overflow-x-auto">
            <table className="text-xs w-full">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-1 text-right">판매량</th>
                  <th className="p-1 text-right">매출</th>
                  <th className="p-1 text-right">총비용</th>
                  <th className="p-1 text-right">이익(손실)</th>
                </tr>
              </thead>
              <tbody>
                {result.simRows.map((row) => (
                  <tr key={row.qty} className={`border-t ${row.qty === result.bepQty ? "bg-yellow-50 font-bold" : ""}`}>
                    <td className="p-1 text-right">{fmt(row.qty)}</td>
                    <td className="p-1 text-right">{fmt(row.revenue)}</td>
                    <td className="p-1 text-right">{fmt(row.totalCost)}</td>
                    <td className={`p-1 text-right ${row.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {row.profit >= 0 ? "+" : ""}{fmt(row.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">손익분기점(BEP)이란?</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          손익분기점(BEP, Break-Even Point)은 총수익과 총비용이 일치하여 이익도 손실도 없는 지점입니다.
          BEP 수량 = 고정비용 ÷ (판매가격 - 단위당 변동비용) 공식으로 계산합니다.
          여기서 판매가격 - 변동비용을 공헌이익이라 하며, 각 제품이 고정비 회수에 기여하는 금액을 의미합니다.
          BEP 분석은 창업 시 최소 필요 매출 규모 파악, 신제품 가격 책정, 비용 구조 최적화에 필수적인 도구입니다.
          고정비가 높은 사업(제조업)은 BEP를 넘기가 어렵지만 넘어서면 이익 증가 속도가 빠르고, 변동비 비중이 높은 사업(서비스업)은 상대적으로 BEP에 도달하기 쉽습니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">BEP 분석을 활용한 가격 전략</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          BEP 계산기는 가격 변화가 수익성에 미치는 영향을 빠르게 분석하는 데 매우 유용합니다.
          판매가격을 10% 인상하면 BEP 수량이 크게 줄어들어 더 적은 판매로도 이익이 발생합니다. 반대로 가격 경쟁을 위해 가격을 낮추면 BEP를 넘기 위해 훨씬 많은 수량을 팔아야 합니다.
          고정비 절감도 BEP를 낮추는 효과적인 방법입니다. 임대료 협상, 불필요한 인건비 정리, 설비 리스 전환 등을 검토하세요.
          변동비 절감(재료비·포장비 단가 협상)은 공헌이익을 높여 BEP를 낮추는 동시에 수익성도 개선합니다.
          매출이 BEP의 몇 배인지를 나타내는 안전한계율(마진 오브 세이프티)을 모니터링하면 사업 안정성을 평가할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "고정비와 변동비를 어떻게 구분하나요?", a: "고정비는 판매량에 관계없이 일정하게 발생하는 비용(임대료, 정직원 급여, 보험료, 감가상각비)이고, 변동비는 판매량에 비례하여 증가하는 비용(재료비, 포장비, 판매 수수료)입니다. 현실에서는 혼재된 준고정비도 있습니다." },
          { q: "BEP 분석이 창업 준비에 왜 중요한가요?", a: "BEP 분석을 통해 창업 후 생존에 필요한 최소 매출 규모를 파악할 수 있습니다. 이를 통해 목표 고객 수, 가격 책정, 비용 예산을 현실적으로 설계하고, 투자 회수 가능성을 미리 검토할 수 있습니다." },
          { q: "공헌이익률이 낮으면 어떻게 해야 하나요?", a: "공헌이익률이 낮다면 가격 인상, 변동비 절감, 고부가가치 제품 비중 확대를 검토하세요. 공헌이익률이 높을수록 BEP를 넘어선 추가 판매에서 더 많은 이익이 발생합니다." },
          { q: "복수 제품을 판매할 때 BEP 계산은 어떻게 하나요?", a: "복수 제품의 경우 각 제품의 판매 비율을 고려한 가중평균 공헌이익률을 계산하고, 이를 고정비로 나누어 가중 BEP를 구합니다. 제품 믹스(mix) 변화에 따라 BEP도 달라집니다." },
          { q: "BEP를 낮추는 가장 효과적인 방법은 무엇인가요?", a: "고정비 절감, 판매가격 인상, 변동비 절감 순으로 효과가 큽니다. 특히 고정비는 일정 규모 이상 판매 시 레버리지 효과가 생기므로, 초기에는 고정비를 최소화하고 매출이 BEP를 안정적으로 초과하면 설비 투자를 늘리는 전략이 유효합니다." },
          { q: "서비스업의 BEP는 어떻게 계산하나요?", a: "서비스업에서는 단위를 '건수', '시간', '프로젝트' 등으로 설정합니다. 예를 들어 컨설팅 업체라면 1건당 수수료를 판매가, 1건 수행에 필요한 인건비·외주비를 변동비로 설정하고 사무실 임대료 등을 고정비로 분류하면 BEP 계산이 가능합니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/breakeven-calc" />

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
