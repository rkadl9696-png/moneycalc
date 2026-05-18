"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(5000000);
  const [monthlyProfit, setMonthlyProfit] = useState(1500000);
  const [businessYears, setBusinessYears] = useState(3);
  const [multiplier, setMultiplier] = useState(2);
  const [facilityPremium, setFacilityPremium] = useState(10000000);
  const [floorPremium, setFloorPremium] = useState(20000000);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const businessPremium = Math.floor(monthlyProfit * 12 * multiplier);
    const totalPremium = businessPremium + facilityPremium + floorPremium;
    const paybackMonths = monthlyProfit > 0 ? Math.ceil(totalPremium / monthlyProfit) : 0;
    const paybackYears = (paybackMonths / 12).toFixed(1);
    return { businessPremium, totalPremium, paybackMonths, paybackYears };
  }, [monthlyProfit, multiplier, facilityPremium, floorPremium, monthlyRevenue, businessYears]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">권리금 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        상가 권리금은 영업권리금·시설권리금·바닥권리금으로 구성됩니다. 월 매출과 순이익, 영업년수를 입력하고 각 권리금을 산출하면 총 권리금과 투자회수기간을 자동으로 계산합니다.
        창업이나 상가 인수 전 권리금의 적정성을 사전에 검토하여 합리적인 협상에 활용하세요.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">월 매출 (원)</label>
            <input type="number" value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">월 순이익 (원)</label>
            <input type="number" value={monthlyProfit} onChange={(e) => setMonthlyProfit(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">영업 년수</label>
            <input type="number" value={businessYears} onChange={(e) => setBusinessYears(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">권리금 배수 (1~3배)</label>
            <input type="number" value={multiplier} onChange={(e) => setMultiplier(Math.min(3, Math.max(1, Number(e.target.value))))} className="w-full border rounded-lg p-2 text-sm" min={1} max={3} step={0.5} />
            <p className="text-xs text-gray-500 mt-1">영업권리금 = 월 순이익 × 12 × 배수</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시설권리금 (원)</label>
            <input type="number" value={facilityPremium} onChange={(e) => setFacilityPremium(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={1000000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">바닥권리금 (원)</label>
            <input type="number" value={floorPremium} onChange={(e) => setFloorPremium(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={1000000} />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">영업권리금</span>
            <span className="font-bold">{fmt(result.businessPremium)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">시설권리금</span>
            <span className="font-bold">{fmt(facilityPremium)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">바닥권리금</span>
            <span className="font-bold">{fmt(floorPremium)}원</span>
          </div>
          <hr className="border-blue-200" />
          <div className="flex justify-between text-base">
            <span className="font-bold text-gray-800">총 권리금</span>
            <span className="font-bold text-blue-700 text-xl">{fmt(result.totalPremium)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">투자회수기간</span>
            <span className="font-bold text-orange-600">{result.paybackYears}년 ({result.paybackMonths}개월)</span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">권리금의 종류와 개념</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          권리금은 상가 임차인이 다음 임차인에게 받는 대가로, 세 가지로 구성됩니다. 영업권리금은 기존 사업의 매출·이익·브랜드 가치에 대한 대가로, 월 순이익에 12개월을 곱하고 배수(1~3배)를 적용해 산출합니다.
          시설권리금은 인테리어·설비 등 물리적 시설의 잔존가치입니다. 바닥권리금은 상권과 위치 자체의 가치로, 유동인구가 많은 목이나 번화가일수록 높습니다.
          상가건물임대차보호법에 따라 임대인은 정당한 사유 없이 권리금 회수를 방해할 수 없으며, 방해 시 손해배상 청구가 가능합니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">권리금 협상 전략</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          권리금은 법적 기준이 없어 협상에 의해 결정됩니다. 매도자(전 임차인)는 최대한 높게 요구하고, 매수자(신규 임차인)는 낮추려는 협상이 발생합니다.
          합리적인 권리금 산정을 위해 매출과 순이익의 실증 자료(장부, 카드 매출 내역 등)를 요구하고, 인근 상가의 권리금 시세를 조사하세요.
          투자회수기간이 2년 이내면 합리적, 3년 이상이면 신중한 검토가 필요합니다. 상권 변화, 임대 계약 잔여 기간, 재계약 보장 여부도 중요한 협상 요소입니다.
          권리금 계약서는 반드시 서면으로 작성하고, 지급 조건·방법·책임 범위를 명확히 기재해야 법적 분쟁 시 보호받을 수 있습니다.
          전문 공인중개사나 법무사의 도움을 받아 계약을 진행하는 것이 안전합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "권리금은 법적으로 보호받나요?", a: "상가건물임대차보호법 제10조의4에 따라 임대인은 임차인의 권리금 회수를 방해할 수 없습니다. 임대 계약 종료 3개월 전부터 계약 종료 시까지 임대인이 신규 임차인과의 계약을 거절하거나 과도한 조건을 요구하면 손해배상 책임이 생깁니다." },
          { q: "임대인이 권리금을 주지 않아도 되는 경우가 있나요?", a: "임대 건물이 재건축되거나, 임차인이 계약 기간 중 의무를 위반한 경우, 임대인이 직접 영업을 하기 위한 경우 등 예외적인 상황에서는 권리금 보호가 제한될 수 있습니다." },
          { q: "권리금 배수(1~3배)는 어떻게 결정하나요?", a: "영업 안정성, 브랜드 인지도, 상권 성장성, 계약 잔여 기간 등을 고려하여 결정됩니다. 매출이 안정적이고 상권이 성장하는 경우 높은 배수가 적용되고, 불확실성이 높으면 낮은 배수가 적용됩니다." },
          { q: "시설권리금은 어떻게 산정하나요?", a: "시설권리금은 인테리어·설비의 원가에서 감가상각을 반영한 잔존가치로 산정합니다. 일반적으로 인테리어 공사비의 50~70%(5년 기준)가 현재 가치로 인정되며, 상태에 따라 달라집니다." },
          { q: "권리금 없이 상가를 인수하는 방법이 있나요?", a: "신규 분양 상가, 권리금이 없는 임대 공고 상가, 경매·공매로 낙찰받은 상가 등에서 권리금 없이 입점할 수 있습니다. 단, 기존 영업 기반이 없어 처음부터 매출을 만들어야 하는 리스크가 있습니다." },
          { q: "권리금 회수가 불가능해진 경우 세금 처리는 어떻게 하나요?", a: "권리금을 받지 못한 경우 세법상 권리금 손실로 인정받기 어려운 경우도 있습니다. 임대인의 방해로 회수 불가 시에는 손해배상 소송을 통해 배상을 받고, 세무사와 상담하여 적절한 세금 처리 방법을 결정하세요." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/premium-calc" />

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
