"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [currentAmount, setCurrentAmount] = useState(10000000);
  const [inflationRate, setInflationRate] = useState(3);
  const [years, setYears] = useState(10);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const futureValue = currentAmount * Math.pow(1 + inflationRate / 100, years);
    const purchasingPowerLoss = ((futureValue - currentAmount) / futureValue * 100).toFixed(1);
    const realValueInFuture = (currentAmount / Math.pow(1 + inflationRate / 100, years)).toFixed(0);

    const tableRows = [];
    const step = Math.max(1, Math.floor(years / 10));
    for (let y = 0; y <= years; y += step) {
      const fv = currentAmount * Math.pow(1 + inflationRate / 100, y);
      const rv = currentAmount / Math.pow(1 + inflationRate / 100, y);
      tableRows.push({ year: y, futureValue: Math.round(fv), realValue: Math.round(rv) });
      if (tableRows.length >= 12) break;
    }
    if (!tableRows.find(r => r.year === years)) {
      const fv = currentAmount * Math.pow(1 + inflationRate / 100, years);
      const rv = currentAmount / Math.pow(1 + inflationRate / 100, years);
      tableRows.push({ year: years, futureValue: Math.round(fv), realValue: Math.round(rv) });
      tableRows.sort((a, b) => a.year - b.year);
    }

    return { futureValue: Math.round(futureValue), purchasingPowerLoss, realValueInFuture: Number(realValueInFuture), tableRows };
  }, [currentAmount, inflationRate, years]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">인플레이션 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        현재 금액과 연 인플레이션율, 기간을 입력하면 물가상승 후의 미래 가치와 현재 돈의 실질 구매력 감소율을 계산합니다.
        연도별 구매력 변화 테이블로 인플레이션이 자산과 저축에 미치는 장기적 영향을 시각적으로 확인하고, 노후 자금 계획이나 투자 수익률 목표 설정에 활용하세요.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">현재 금액 (원)</label>
            <input type="number" value={currentAmount} onChange={(e) => setCurrentAmount(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={1000000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연 인플레이션율 (%)</label>
            <input type="number" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={0.1} />
            <p className="text-xs text-gray-500 mt-1">한국 장기 평균 소비자물가 상승률: 약 2~3%</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">기간 (년)</label>
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={1} max={50} />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">{years}년 후 같은 물건의 가격</span>
            <span className="font-bold text-blue-700 text-lg">{fmt(result.futureValue)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">현재 {fmt(currentAmount)}원의 {years}년 후 실질가치</span>
            <span className="font-bold text-orange-600">{fmt(result.realValueInFuture)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">구매력 감소율</span>
            <span className="font-bold text-red-600">{result.purchasingPowerLoss}%</span>
          </div>
        </div>
        <h3 className="text-sm font-bold mb-2">연도별 구매력 변화</h3>
        <div className="overflow-x-auto">
          <table className="text-xs w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-1 text-right">경과년수</th>
                <th className="p-1 text-right">같은 물건 가격</th>
                <th className="p-1 text-right">현재돈의 실질가치</th>
              </tr>
            </thead>
            <tbody>
              {result.tableRows.map((row) => (
                <tr key={row.year} className={`border-t ${row.year === years ? "bg-yellow-50 font-bold" : ""}`}>
                  <td className="p-1 text-right">{row.year}년</td>
                  <td className="p-1 text-right">{fmt(row.futureValue)}원</td>
                  <td className={`p-1 text-right ${row.year > 0 ? "text-red-600" : ""}`}>{fmt(row.realValue)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">인플레이션이 자산에 미치는 영향</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          인플레이션은 화폐 가치를 서서히 감소시키는 경제 현상으로, 연 3% 인플레이션이면 약 24년 후 구매력이 절반으로 줄어듭니다(72의 법칙: 72 ÷ 인플레이션율 = 구매력 반감기간).
          예금 이자율이 인플레이션율보다 낮다면 실질적으로는 손해가 발생합니다. 예를 들어 예금 금리 2%, 인플레이션 3%라면 실질 금리는 -1%입니다.
          부동산, 주식, 금 등 실물자산은 역사적으로 인플레이션을 일부 방어하는 역할을 해왔습니다.
          노후 자금 계획 시 필요 생활비를 현재 금액으로만 계산하면 인플레이션으로 인한 부족분이 발생하므로, 반드시 인플레이션 효과를 반영해야 합니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">인플레이션 방어 자산 전략</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          인플레이션을 방어하려면 실질 수익률(명목 수익률 - 인플레이션율)이 플러스인 자산에 투자해야 합니다.
          주식은 장기적으로 인플레이션을 초과하는 수익률을 제공해온 대표적 인플레이션 헤지 자산입니다.
          물가연동국채(TIPS)는 원금과 이자가 물가 지수에 연동되어 인플레이션 방어에 직접적으로 활용됩니다.
          부동산은 임대료와 자산가치가 물가와 함께 오르는 경향이 있어 인플레이션 헤지 효과가 있습니다.
          금과 원자재도 전통적인 인플레이션 헤지 수단으로 사용되지만 변동성이 높습니다.
          예금과 채권은 인플레이션 기간에 실질 수익이 감소하므로, 전체 포트폴리오에서 적절한 비중을 유지하는 것이 중요합니다.
          이 계산기로 현재 저축이 인플레이션에 얼마나 취약한지 확인하고 투자 전략을 조정하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "한국의 평균 인플레이션율은 얼마인가요?", a: "한국의 장기 소비자물가 상승률은 연평균 2~3% 수준입니다. 2020년대 초 글로벌 인플레이션 급등 시에는 5~6%까지 올랐으나 이후 안정세를 찾아가고 있습니다. 한국은행 통계청 자료를 통해 최신 데이터를 확인하세요." },
          { q: "실질 금리란 무엇인가요?", a: "실질 금리는 명목 금리에서 인플레이션율을 뺀 값입니다. 예금 금리가 2%이고 인플레이션이 3%라면 실질 금리는 -1%로, 예금을 해도 구매력이 줄어드는 상황입니다. 투자 수익률 평가 시 반드시 실질 금리 기준으로 판단해야 합니다." },
          { q: "72의 법칙이란 무엇인가요?", a: "72의 법칙은 복리로 어떤 값이 두 배가 되는 시간을 빠르게 추정하는 공식입니다. 72 ÷ 연이율 = 두 배 도달 기간(년). 인플레이션 3%라면 72 ÷ 3 = 24년 후 물가가 두 배, 즉 현재 돈의 구매력이 절반이 됩니다." },
          { q: "인플레이션이 부채에도 영향을 미치나요?", a: "네, 인플레이션은 부채의 실질 가치를 줄입니다. 고정 금리로 1억 원을 빌렸다면 인플레이션으로 화폐 가치가 하락하면서 실질적인 상환 부담이 줄어듭니다. 이것이 인플레이션이 채권자보다 채무자에게 유리한 이유입니다." },
          { q: "노후 자금 계획 시 인플레이션을 어떻게 반영해야 하나요?", a: "현재 월 생활비 기준으로 계산하지 말고, 은퇴 시점까지의 인플레이션을 반영한 미래 생활비를 기준으로 필요 노후 자금을 계산하세요. 이 계산기로 30년 후 생활비를 먼저 구하고 노후자금 계산기와 함께 활용하면 정확한 계획을 세울 수 있습니다." },
          { q: "하이퍼인플레이션이란 무엇인가요?", a: "하이퍼인플레이션은 연 수백% 이상의 극단적인 물가 상승을 말합니다. 과거 짐바브웨, 베네수엘라 등에서 발생했으며, 화폐 가치가 급격히 붕괴되어 일상적인 경제 활동이 마비됩니다. 한국은 현재 하이퍼인플레이션 위험이 매우 낮습니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/inflation-calc" />

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
