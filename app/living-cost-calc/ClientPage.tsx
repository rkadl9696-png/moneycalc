"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const AVG_LIVING: Record<number, number> = {
  1: 1_650_000,
  2: 2_800_000,
  3: 3_800_000,
  4: 4_500_000,
  5: 5_000_000,
};

const ITEMS = [
  { key: "food", label: "식비", default: 600_000 },
  { key: "housing", label: "주거비 (월세·관리비)", default: 700_000 },
  { key: "transport", label: "교통비", default: 150_000 },
  { key: "medical", label: "의료비", default: 80_000 },
  { key: "education", label: "교육비", default: 200_000 },
  { key: "leisure", label: "여가·문화", default: 100_000 },
  { key: "clothing", label: "의류·미용", default: 80_000 },
  { key: "other", label: "기타", default: 100_000 },
];

export default function ClientPage() {
  const [members, setMembers] = useState(2);
  const [expenses, setExpenses] = useState<Record<string, number>>(
    Object.fromEntries(ITEMS.map((i) => [i.key, i.default]))
  );

  const r = useMemo(() => {
    const total = Object.values(expenses).reduce((a, b) => a + b, 0);
    const avg = AVG_LIVING[Math.min(members, 5)] ?? 5_000_000;
    const diff = total - avg;
    const items = ITEMS.map((item) => ({
      ...item,
      value: expenses[item.key],
      pct: total > 0 ? ((expenses[item.key] / total) * 100).toFixed(1) : "0",
    }));
    return { total, avg, diff, items };
  }, [expenses, members]);

  const setItem = (key: string, val: number) => setExpenses((prev) => ({ ...prev, [key]: val }));

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">생활비 계산기</h1>
      <p className="text-gray-600 mb-6">항목별 월 지출을 입력하면 총 생활비와 통계청 평균 대비 분석을 제공합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">가구원 수</label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setMembers(n)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${members === n ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {n === 5 ? "5인+" : `${n}인`}
              </button>
            ))}
          </div>
        </div>
        <h2 className="text-base font-bold mb-3">항목별 월 지출 (원)</h2>
        <div className="flex flex-col gap-3">
          {ITEMS.map((item) => (
            <div key={item.key} className="flex items-center gap-3">
              <label className="w-28 text-sm text-gray-600 shrink-0">{item.label}</label>
              <input type="number" min={0} step={10000} value={expenses[item.key]}
                onChange={(e) => setItem(item.key, Number(e.target.value))}
                className="flex-1 border p-2 rounded text-sm" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-4 text-blue-800">월 생활비 분석</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">월 총 생활비</p>
            <p className="text-2xl font-bold text-blue-600">{fmt(r.total)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">통계청 {members}인 가구 평균</p>
            <p className="text-2xl font-bold text-gray-700">{fmt(r.avg)}원</p>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${r.diff > 0 ? "bg-orange-50 border border-orange-200" : "bg-green-50 border border-green-200"}`}>
          <p className="text-sm font-bold">
            {r.diff > 0
              ? `평균보다 ${fmt(r.diff)}원 더 지출하고 있습니다.`
              : `평균보다 ${fmt(Math.abs(r.diff))}원 절약하고 있습니다.`}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">항목별 지출 비중</h2>
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
        <h2 className="text-xl font-bold mb-3">가구 규모별 평균 생활비 (통계청 기준)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-500">가구원 수</th>
                <th className="text-right py-2 text-gray-500">월 평균 생활비</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(AVG_LIVING).map(([n, amt]) => (
                <tr key={n} className={`border-b last:border-0 ${Number(n) === members ? "bg-blue-50" : ""}`}>
                  <td className="py-2 font-medium">{n}인 가구{Number(n) === 5 ? " 이상" : ""}</td>
                  <td className="py-2 text-right font-bold text-blue-600">{fmt(amt)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          위 수치는 통계청 가계동향조사 기준 근사값입니다. 지역, 소득 수준, 라이프스타일에 따라 실제 생활비는 크게 차이가 납니다.
          서울 등 대도시는 주거비가 높아 평균보다 20~30% 더 많이 지출하는 경향이 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "월 생활비를 줄이는 가장 효과적인 방법은?", a: "지출 규모가 가장 큰 식비와 주거비를 줄이는 것이 가장 효과적입니다. 식비는 밀 프렙, 식재료 계획 구매로, 주거비는 이사 또는 관리비 절감 방법을 찾아보세요." },
          { q: "가계부 작성이 필요한가요?", a: "가계부 작성은 지출 패턴을 파악하는 데 효과적입니다. 앱(뱅크샐러드, 토스 등)을 활용하면 카드·현금 지출을 자동으로 기록하고 분석할 수 있습니다." },
          { q: "50/30/20 법칙이란?", a: "세후 수입의 50%는 필수 지출(식비·주거·교통), 30%는 여가·취미 등 원하는 지출, 20%는 저축·투자·부채 상환에 쓰는 예산 관리 원칙입니다." },
          { q: "교통비를 줄이는 방법은?", a: "대중교통 정기권, 기후동행카드(서울), 광역알뜰교통카드 등을 활용하면 교통비를 20~30% 절감할 수 있습니다. 자가용 이용을 줄이면 유류비·주차비·차량 유지비도 함께 절약됩니다." },
          { q: "의료비를 절약하는 방법은?", a: "건강검진을 정기적으로 받아 조기 발견·예방에 집중하고, 가능하면 의원급 의료기관을 이용하세요. 실손보험을 적절히 활용하고, 만성질환은 건강보험 특례 항목을 확인하세요." },
          { q: "구독 서비스 지출을 관리하는 방법은?", a: "정기적으로 구독 서비스 목록을 점검하고 잘 사용하지 않는 구독을 해지하세요. 가족 공유 플랜을 활용하거나, 연간 결제 시 할인받을 수 있습니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/living-cost-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
