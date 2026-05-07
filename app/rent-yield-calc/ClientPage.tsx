"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [buyPrice, setBuyPrice] = useState(30000); // 만원
  const [deposit, setDeposit] = useState(5000); // 만원
  const [monthlyRent, setMonthlyRent] = useState(80); // 만원
  const [extraCost, setExtraCost] = useState(500); // 만원 (취득 부대비용)

  const r = useMemo(() => {
    const realInvestment = buyPrice - deposit + extraCost;
    const annualRent = monthlyRent * 12;
    const totalYield = buyPrice > 0 ? (annualRent / buyPrice) * 100 : 0;
    const realYield = realInvestment > 0 ? (annualRent / realInvestment) * 100 : 0;
    const conversionRate = deposit > 0 ? (annualRent / deposit) * 100 : 0;
    return { realInvestment, annualRent, totalYield, realYield, conversionRate };
  }, [buyPrice, deposit, monthlyRent, extraCost]);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link scroll={false}
        href="/" className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors">← 계산기 목록</Link>
      <h1 className="text-2xl font-bold mb-2">🏘️ 월세 수익률 계산기</h1>
      <p className="text-gray-600 mb-6">매매가·보증금·월세를 입력하면 총 수익률, 실투자금 수익률, 전월세 전환율을 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">부동산 정보 입력</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">매매가</label>
            <div className="flex items-center gap-2">
              <input type="number" min={100} max={1000000} value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                onBlur={(e) => setBuyPrice(Math.min(1000000, Math.max(100, Number(e.target.value) || 30000)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">만원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">보증금</label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={1000000} value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                onBlur={(e) => setDeposit(Math.min(1000000, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">만원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">월세</label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={10000} value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                onBlur={(e) => setMonthlyRent(Math.min(10000, Math.max(1, Number(e.target.value) || 80)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">만원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">취득 부대비용</label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={100000} value={extraCost}
                onChange={(e) => setExtraCost(Number(e.target.value))}
                onBlur={(e) => setExtraCost(Math.min(100000, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">만원</span>
            </div>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-base font-bold mb-4">수익률 계산 결과</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">총 수익률</p>
            <p className="text-3xl font-bold text-blue-600">{r.totalYield.toFixed(2)}%</p>
            <p className="text-xs text-gray-400 mt-1">연간 월세 / 매매가</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">실투자금 수익률</p>
            <p className="text-3xl font-bold text-green-600">{r.realYield.toFixed(2)}%</p>
            <p className="text-xs text-gray-400 mt-1">연간 월세 / 실투자금</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">실투자금</p>
            <p className="text-base font-bold text-gray-800">{fmt(r.realInvestment)}만원</p>
          </div>
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">연간 월세 수입</p>
            <p className="text-base font-bold text-gray-800">{fmt(r.annualRent)}만원</p>
          </div>
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">전월세 전환율</p>
            <p className="text-base font-bold text-orange-600">{r.conversionRate.toFixed(2)}%</p>
          </div>
        </div>
        <div className="mt-3 bg-blue-50 border border-blue-100 rounded p-3 text-xs text-blue-700">
          실투자금 = 매매가({fmt(buyPrice)}만원) - 보증금({fmt(deposit)}만원) + 부대비용({fmt(extraCost)}만원) = {fmt(r.realInvestment)}만원
        </div>
      </section>

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">수익률 지표 설명</h2>
        <p className="mb-3 text-gray-700">
          총 수익률은 연간 월세 수입을 매매가로 나눈 비율로, 투자한 총 금액 대비 수익을 나타냅니다. 실투자금 수익률(수익형 부동산의 레버리지 효과)은 보증금을 제외하고 실제 내 돈이 얼마나 들어갔는지를 기준으로 계산합니다. 보증금을 높이면 실투자금이 줄어들어 수익률이 높아지는 레버리지 효과가 생깁니다.
        </p>
        <p className="text-gray-700">
          전월세 전환율은 보증금을 월세로 전환할 때 적용하는 이율로, 현재 법정 전환율 상한은 연 2.0%(한국은행 기준금리 + 대통령령 이율)입니다. 전환율이 높을수록 임차인에게 불리하며, 낮을수록 임차인에게 유리합니다.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">수익형 부동산 투자 시 고려 사항</h2>
        <p className="mb-3 text-gray-700">
          수익형 부동산 투자에서 단순 수익률 외에도 공실률(세입자가 없는 기간), 관리비용, 수선유지비, 재산세, 종합부동산세, 임대소득세 등을 고려해야 합니다. 실제 순수익률은 겉으로 보이는 수익률보다 낮아질 수 있습니다. 특히 노후 건물은 수선비가 많이 들 수 있습니다.
        </p>
        <p className="mb-3 text-gray-700">
          임대소득세는 연간 임대수입이 2,000만원 이하이면 분리과세(14%, 필요경비 50% 인정) 또는 종합과세 중 선택할 수 있습니다. 2,000만원 초과 시 종합소득으로 합산됩니다. 주택 임대사업자로 등록하면 각종 세제 혜택을 받을 수 있으나, 의무 임대 기간 및 임대료 증액 제한 등의 조건이 있습니다.
        </p>
        <p className="text-gray-700">
          수익형 부동산의 좋은 수익률 기준은 일반적으로 3~5% 이상이지만, 지역과 유형에 따라 다릅니다. 상권이 발달한 도심 오피스텔은 3~4%, 지방 소형 아파트는 5~7%, 상가는 4~6% 수준이 일반적입니다. 금리 상승 시기에는 수익률이 금리보다 높아야 투자 가치가 있습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "전월세 전환율 법정 상한이 있나요?", a: "네, 주택임대차보호법에 따라 전월세 전환율 상한은 '한국은행 기준금리 + 대통령령으로 정하는 이율(현재 연 2%)'입니다. 기준금리가 3.5%라면 상한은 5.5%입니다. 이를 초과하는 전환은 무효입니다." },
          { q: "임대수익률이 몇 %면 좋은 투자인가요?", a: "일반적으로 시중 금리보다 1~2%p 이상 높은 수익률이 권장됩니다. 2024년 기준 예금금리가 3~4%라면 5~6% 이상의 수익률을 목표로 하는 것이 합리적입니다. 리스크와 관리 부담을 감안하면 더 높은 수익률이 필요합니다." },
          { q: "보증금 없는 순수 월세와 보증부 월세의 차이는?", a: "보증부 월세는 보증금을 받고 낮은 월세를 받는 방식이며, 보증금이 없는 순수 월세는 더 높은 월세를 받습니다. 임대인 입장에서는 공실 위험을 줄이고 안정적인 임대 관계를 유지하기 위해 보증금을 받는 경우가 많습니다." },
          { q: "취득세와 중개수수료는 어떻게 계산하나요?", a: "주택 취득세는 매매가의 1~3%(주택 수와 가격에 따라 다름)이며, 부동산 중개수수료는 0.4~0.9%입니다. 부대비용 항목에 이러한 비용을 포함하면 더 정확한 실투자금을 계산할 수 있습니다." },
          { q: "공실이 발생하면 수익률에 어떤 영향을 미치나요?", a: "공실률 10%는 수익률을 약 0.1~0.5%p 낮춥니다. 월세 80만원을 받는 경우 1개월 공실이 발생하면 연 수입이 80만원 감소하며, 수익률에 직접 영향을 미칩니다. 투자 결정 시 보수적으로 공실률을 5~10%로 가정하는 것이 좋습니다." },
          { q: "임대소득세 신고는 언제 해야 하나요?", a: "임대소득이 있으면 매년 5월에 종합소득세를 신고해야 합니다. 연간 임대수입 2,000만원 이하는 분리과세(14%)와 종합과세 중 유리한 것을 선택할 수 있습니다. 세무사나 국세청 홈택스를 통해 신고하세요." },
        ].map((item) => (
          <div key={item.q} className="mb-4 border-b pb-4 last:border-b-0">
            <p className="font-bold text-gray-800 mb-1">Q. {item.q}</p>
            <p className="text-gray-600 text-sm">{item.a}</p>
          </div>
        ))}
      </section>

      <RelatedCalculators />

      <div className="mt-10 text-center">
        <Link scroll={false}
          href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">계산기 목록으로 돌아가기</Link>
      </div>
    </div>
  );
}
