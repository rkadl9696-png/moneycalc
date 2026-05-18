"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [distance, setDistance] = useState(500);
  const [cabinClass, setCabinClass] = useState<"economy" | "business" | "first">("economy");
  const [accrualRate, setAccrualRate] = useState(100);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const classMultiplier = cabinClass === "first" ? 2.0 : cabinClass === "business" ? 1.5 : 1.0;
    const earned = Math.floor(distance * classMultiplier * accrualRate / 100);
    return { earned };
  }, [distance, cabinClass, accrualRate]);

  const redemptionTargets = [
    { label: "국내선 무료항공권", miles: 10000 },
    { label: "아시아 무료항공권", miles: 30000 },
    { label: "미주/유럽 무료항공권", miles: 70000 },
  ];

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">마일리지 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        항공편 거리와 탑승 클래스, 항공사 적립률을 입력하면 적립 마일리지를 계산합니다.
        이코노미는 기본 100%, 비즈니스는 150%, 퍼스트 클래스는 200%의 마일리지가 적립됩니다.
        무료항공권 교환 기준과 비교하여 목표 마일리지 달성 계획을 세워보세요.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">항공편 거리 (km)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">탑승 클래스</label>
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value as "economy" | "business" | "first")}
              className="w-full border rounded-lg p-2 text-sm"
            >
              <option value="economy">이코노미 (100%)</option>
              <option value="business">비즈니스 (150%)</option>
              <option value="first">퍼스트 (200%)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">항공사 적립률 (%)</label>
            <input
              type="number"
              value={accrualRate}
              onChange={(e) => setAccrualRate(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
              max={200}
            />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-600">적립 마일리지</span>
          <span className="font-bold text-blue-700 text-lg">{fmt(result.earned)} 마일</span>
        </div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">무료항공권 교환 기준 대비</h3>
        <div className="space-y-2">
          {redemptionTargets.map((t) => {
            const pct = Math.min(100, Math.round(result.earned / t.miles * 100));
            return (
              <div key={t.label}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{t.label} ({fmt(t.miles)}마일)</span>
                  <span>{pct}% 달성</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">항공 마일리지 적립 방법</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          항공 마일리지는 비행 거리를 기반으로 적립되며, 탑승 클래스에 따라 적립률이 달라집니다.
          이코노미석은 실제 비행 거리의 100%, 비즈니스석은 150%, 퍼스트 클래스는 200%가 적립되는 것이 일반적입니다.
          단, 항공사마다 운임 클래스별 적립률이 다르며 할인 운임일수록 적립률이 낮아지는 경우가 많습니다.
          마일리지는 항공권 구매 외에도 제휴 신용카드 사용, 호텔 숙박, 렌터카, 쇼핑 등 다양한 방법으로 적립할 수 있어
          생활 속에서 꾸준히 모으면 무료항공권을 교환할 수 있는 마일리지를 빠르게 달성할 수 있습니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">마일리지 활용 전략과 주의사항</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          마일리지를 가장 효율적으로 사용하는 방법은 항공권 교환입니다. 국내선은 약 1만 마일, 동남아·일본은 2~3만 마일, 미주·유럽은 7만 마일 이상이 필요합니다.
          성수기나 특별 노선은 교환 마일리지가 더 높아질 수 있으므로 비수기 교환이 유리합니다.
          마일리지도 포인트처럼 유효기간(보통 10년, 일부 항공사는 영구)이 있으므로 주기적으로 관리해야 합니다.
          마일리지 제휴 신용카드를 활용하면 일반 소비에서도 마일리지를 적립할 수 있으며, 항공사 멤버십 등급이 높을수록 보너스 적립과 좌석 업그레이드 기회가 늘어납니다.
          최근에는 마일리지를 현금성 포인트로 전환하거나 기부하는 옵션도 늘어나고 있어 활용도가 높아지고 있습니다.
          마일리지 사용 전 항공사 웹사이트에서 최신 교환 기준을 반드시 확인하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "항공 마일리지 유효기간은 얼마나 되나요?", a: "대한항공 스카이패스와 아시아나항공 아시아나클럽 마일리지는 적립 후 10년간 유효합니다. 단, 10년 이내에 마일리지 적립·사용 실적이 있으면 유효기간이 연장되지 않으므로 주의가 필요합니다." },
          { q: "이코노미석보다 비즈니스석 마일 적립이 왜 더 많나요?", a: "비즈니스·퍼스트 클래스는 이코노미보다 높은 운임을 지불하므로 더 많은 마일리지를 제공합니다. 또한 높은 등급의 멤버십 회원은 보너스 마일리지가 추가로 적립되기도 합니다." },
          { q: "마일리지로 항공권 교환 시 세금·수수료는 어떻게 되나요?", a: "마일리지로 교환한 항공권에도 유류할증료, 공항세, 수수료 등이 별도로 부과됩니다. 무료항공권이라도 이 비용은 현금으로 내야 하므로 총비용을 확인하세요." },
          { q: "마일리지를 가족에게 양도할 수 있나요?", a: "일부 항공사는 유료로 마일리지 양도를 허용하지만 수수료가 발생합니다. 가족 계정 합산(패밀리 마일리지) 프로그램을 활용하면 여러 명의 마일리지를 모아 함께 사용할 수 있습니다." },
          { q: "왕복 항공권 마일리지는 편도의 두 배인가요?", a: "네, 왕복 항공권의 마일리지는 각 구간 거리의 마일리지를 합산하므로 편도 대비 약 두 배가 적립됩니다. 경유지가 있을 경우 구간별 마일리지를 별도 계산합니다." },
          { q: "제휴 신용카드로 마일리지를 더 효율적으로 모을 수 있나요?", a: "항공사 제휴 신용카드는 소비금액의 일정 비율을 마일리지로 전환해줍니다. 보통 1,000~1,500원당 1마일이 적립되며, 카드 사용실적이 높을수록 연간 추가 마일리지 혜택이 제공되기도 합니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/mileage-calc" />

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
