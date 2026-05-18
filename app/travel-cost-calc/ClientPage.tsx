"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const COST_ITEMS = [
  { key: "flight", label: "항공/교통비" },
  { key: "accommodation", label: "숙박비" },
  { key: "food", label: "식비" },
  { key: "sightseeing", label: "관광/입장료" },
  { key: "shopping", label: "쇼핑" },
  { key: "other", label: "기타" },
];

const DOMESTIC_DEFAULTS: Record<string, number> = {
  flight: 150_000, accommodation: 100_000, food: 60_000, sightseeing: 50_000, shopping: 80_000, other: 30_000,
};
const OVERSEAS_DEFAULTS: Record<string, number> = {
  flight: 600_000, accommodation: 150_000, food: 100_000, sightseeing: 80_000, shopping: 200_000, other: 50_000,
};

export default function ClientPage() {
  const [destination, setDestination] = useState("해외");
  const [days, setDays] = useState(5);
  const [people, setPeople] = useState(2);
  const [costs, setCosts] = useState(OVERSEAS_DEFAULTS);
  const [budget, setBudget] = useState(3_000_000);

  useEffect(() => {
    setCosts(destination === "국내" ? DOMESTIC_DEFAULTS : OVERSEAS_DEFAULTS);
  }, [destination]);

  const r = useMemo(() => {
    const total = Object.values(costs).reduce((a, b) => a + b, 0) * days;
    const perPerson = people > 0 ? Math.round(total / people) : total;
    const items = COST_ITEMS.map((item) => ({
      ...item,
      value: costs[item.key] * days,
      pct: total > 0 ? ((costs[item.key] * days / total) * 100).toFixed(1) : "0",
    }));
    const budgetDiff = budget - total;
    return { total, perPerson, items, budgetDiff };
  }, [costs, days, people, budget]);

  const setItem = (key: string, val: number) => setCosts((prev) => ({ ...prev, [key]: val }));

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">여행 경비 계산기</h1>
      <p className="text-gray-600 mb-6">여행 일정과 항목별 비용을 입력하면 총 경비와 1인당 비용을 계산합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">기본 정보</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">여행지</label>
          <div className="flex gap-2">
            {["국내", "해외"].map((d) => (
              <button key={d} onClick={() => setDestination(d)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${destination === d ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">여행 일수</label>
            <input type="number" min={1} max={365} value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">인원 수</label>
            <input type="number" min={1} max={50} value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full border p-2 rounded" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">총 예산 (원)</label>
          <input type="number" min={0} step={100000} value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>

        <h2 className="text-base font-bold mb-3">1일 평균 비용 입력 (원)</h2>
        <div className="flex flex-col gap-3">
          {COST_ITEMS.map((item) => (
            <div key={item.key} className="flex items-center gap-3">
              <label className="w-24 text-sm text-gray-600 shrink-0">{item.label}</label>
              <input type="number" min={0} step={10000} value={costs[item.key]}
                onChange={(e) => setItem(item.key, Number(e.target.value))}
                className="flex-1 border p-2 rounded text-sm" />
              <span className="text-xs text-gray-400 shrink-0">×{days}일</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-4 text-blue-800">여행 경비 계산 결과</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">총 여행 경비</p>
            <p className="text-2xl font-bold text-blue-600">{fmt(r.total)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">1인당 비용</p>
            <p className="text-2xl font-bold text-gray-800">{fmt(r.perPerson)}원</p>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${r.budgetDiff >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <p className="text-sm font-bold">
            {r.budgetDiff >= 0
              ? `예산 내 여행 가능! 여유액 ${fmt(r.budgetDiff)}원`
              : `예산 초과! ${fmt(Math.abs(r.budgetDiff))}원 부족`}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">항목별 비중</h2>
        <div className="flex flex-col gap-2">
          {r.items.sort((a, b) => b.value - a.value).map((item) => (
            <div key={item.key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">{fmt(item.value)}원 ({item.pct}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 bg-gray-50 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">여행 경비 절약 팁</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          여행 경비를 줄이는 가장 좋은 방법은 항공권을 일찍 예약하는 것입니다.
          일반적으로 출발 3~6개월 전에 예약하면 최대 30~50% 저렴하게 구입할 수 있습니다.
          숙박비는 에어비앤비, 호스텔, 민박 등 다양한 선택지를 비교하고, 도심보다 외곽에 숙박하면 비용을 크게 줄일 수 있습니다.
          식비는 현지 마트나 재래시장을 활용하고, 점심에 레스토랑을 이용하는 것이 저녁보다 저렴한 경우가 많습니다.
          교통은 현지 대중교통이나 교통패스를 활용하면 택시나 렌터카보다 훨씬 경제적입니다.
          관광지 입장료는 사전에 온라인으로 구매하거나 패스 상품을 이용하면 할인받을 수 있습니다.
          트래블 카드(트래블로그, 하나 트래블로그 등)를 사용하면 해외 결제 시 환율 우대와 ATM 수수료 면제 혜택을 받을 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "여행 경비는 얼마나 준비해야 하나요?", a: "동남아 5일 여행 기준 1인당 80~150만 원, 일본 5일 여행은 100~200만 원, 유럽 10일 여행은 300~500만 원 수준이 일반적입니다. 여행 스타일에 따라 크게 달라집니다." },
          { q: "해외여행 시 현금과 카드 비율은?", a: "현지 화폐 현금(전체의 30~40%)과 카드(60~70%)를 병행하는 것이 안전합니다. 현금은 소규모 상점·시장·팁용으로, 카드는 큰 금액 결제에 사용하세요." },
          { q: "여행자 보험은 꼭 필요한가요?", a: "해외여행 시 여행자 보험 가입을 강력히 권장합니다. 의료비·여행 취소·분실·지연 등을 커버하며, 출발 전에 가입해야 혜택을 받을 수 있습니다. 연간 여행자보험도 고려해보세요." },
          { q: "환전은 어디서 하는 것이 유리한가요?", a: "주거래 은행 앱에서 미리 환전 신청(90% 우대) 후 공항에서 수령하거나, 인터넷 환전(95~100% 우대)을 이용하는 것이 유리합니다. 공항 환전소는 수수료가 높습니다." },
          { q: "국내 여행 vs 해외 여행 경비 차이는?", a: "국내 여행은 2박 3일 기준 1인당 30~80만 원, 해외 근거리(일본·동남아)는 4박 5일 기준 100~200만 원이 일반적입니다. 항공비가 가장 큰 차이를 만듭니다." },
          { q: "단체 여행이 개인 여행보다 저렴한가요?", a: "단체 패키지여행은 항공·숙박·가이드가 포함되어 처음 여행자에게 편리하지만, 자유여행보다 저렴하지 않을 수 있습니다. 시간 효율성과 비용을 비교해서 선택하세요." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/travel-cost-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
