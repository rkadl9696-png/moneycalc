"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const AVG_2024 = 230_000_000;

const WEDDING_ITEMS = [
  { key: "appliances", label: "가전제품 (냉장고·세탁기·TV 등)", default: 10_000_000 },
  { key: "furniture", label: "가구 (침대·소파·식탁 등)", default: 8_000_000 },
  { key: "ceremony", label: "예식비용 (웨딩홀·음식·사진)", default: 20_000_000 },
  { key: "honeymoon", label: "신혼여행", default: 6_000_000 },
  { key: "ritual", label: "예단·예물", default: 10_000_000 },
  { key: "dress", label: "웨딩드레스·예복·메이크업", default: 5_000_000 },
  { key: "housing", label: "신혼집 (보증금·전세 비용 제외)", default: 0 },
  { key: "other", label: "기타 (청첩장·답례품 등)", default: 2_000_000 },
];

export default function ClientPage() {
  const [costs, setCosts] = useState<Record<string, number>>(
    Object.fromEntries(WEDDING_ITEMS.map((i) => [i.key, i.default]))
  );
  const [groomRatio, setGroomRatio] = useState(50);
  const [weddingMoney, setWeddingMoney] = useState(30_000_000);

  const r = useMemo(() => {
    const total = Object.values(costs).reduce((a, b) => a + b, 0);
    const groomShare = Math.round(total * (groomRatio / 100));
    const brideShare = total - groomShare;
    const netAfterGift = Math.max(0, total - weddingMoney);
    const diff = total - AVG_2024;
    const items = WEDDING_ITEMS.map((item) => ({
      ...item,
      value: costs[item.key],
      pct: total > 0 ? ((costs[item.key] / total) * 100).toFixed(1) : "0",
    }));
    return { total, groomShare, brideShare, netAfterGift, diff, items };
  }, [costs, groomRatio, weddingMoney]);

  const setItem = (key: string, val: number) => setCosts((prev) => ({ ...prev, [key]: val }));

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();
  const fmtB = (n: number) => n >= 100_000_000 ? `${(n / 100_000_000).toFixed(1)}억` : `${(n / 10_000).toFixed(0)}만원`;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">결혼 비용 계산기</h1>
      <p className="text-gray-600 mb-6">항목별 결혼 비용을 입력하면 총 비용과 분담 비율, 2024년 평균 대비 분석을 제공합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-3">항목별 비용 입력 (원)</h2>
        <div className="flex flex-col gap-3 mb-5">
          {WEDDING_ITEMS.map((item) => (
            <div key={item.key}>
              <label className="block text-xs text-gray-500 mb-1">{item.label}</label>
              <input type="number" min={0} step={500000} value={costs[item.key]}
                onChange={(e) => setItem(item.key, Number(e.target.value))}
                className="w-full border p-2 rounded" />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">축의금 예상액 (원)</label>
          <input type="number" min={0} step={1000000} value={weddingMoney}
            onChange={(e) => setWeddingMoney(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>

        <div className="mb-2">
          <label className="block text-sm text-gray-500 mb-1">신랑 분담 비율: {groomRatio}%</label>
          <input type="range" min={0} max={100} value={groomRatio}
            onChange={(e) => setGroomRatio(Number(e.target.value))}
            className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>신부 100%</span>
            <span>5:5</span>
            <span>신랑 100%</span>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-4 text-blue-800">결혼 비용 계산 결과</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">총 결혼 비용</p>
            <p className="text-2xl font-bold text-blue-600">{fmtB(r.total)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">축의금 차감 후 실부담</p>
            <p className="text-2xl font-bold text-gray-800">{fmtB(r.netAfterGift)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">신랑 부담 ({groomRatio}%)</p>
            <p className="text-xl font-bold text-gray-700">{fmtB(r.groomShare)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">신부 부담 ({100 - groomRatio}%)</p>
            <p className="text-xl font-bold text-gray-700">{fmtB(r.brideShare)}</p>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${r.diff > 0 ? "bg-orange-50 border border-orange-200" : "bg-green-50 border border-green-200"}`}>
          <p className="text-sm font-bold">
            2024년 평균({fmtB(AVG_2024)}) 대비 {r.diff > 0 ? `${fmtB(r.diff)} 초과` : `${fmtB(Math.abs(r.diff))} 절약`}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">항목별 비중</h2>
        <div className="flex flex-col gap-2">
          {r.items.filter((i) => i.value > 0).sort((a, b) => b.value - a.value).map((item) => (
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
        <h2 className="text-xl font-bold mb-3">결혼 비용 절약 팁</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          결혼 비용의 가장 큰 부분은 예식비용과 혼수입니다. 스몰웨딩이나 야외 결혼식을 선택하면 예식비용을 크게 줄일 수 있습니다.
          가전·가구는 브랜드에 너무 얽매이지 말고, 소비자 리뷰와 성능을 기준으로 합리적인 선택을 하세요.
          예식장은 주말보다 평일, 성수기보다 비성수기(1~2월, 7~8월)에 예약하면 20~30% 저렴합니다.
          신혼여행은 허니문 패키지보다 직접 예약(항공+숙박)이 저렴할 수 있으며, 근거리 여행도 충분히 의미 있습니다.
          예물과 예단은 쌍방이 솔직하게 대화하여 합리적인 수준에서 결정하세요. 요즘은 예물을 간소화하는 커플이 늘고 있습니다.
          결혼 준비 비용을 투명하게 공유하고, 양가 부모님과의 충분한 사전 논의로 불필요한 갈등을 예방하는 것이 중요합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "2024년 평균 결혼 비용은 얼마인가요?", a: "2024년 기준 평균 결혼 비용은 약 2억 3천만 원(신혼집 제외)으로 집계됩니다. 서울·수도권은 평균보다 높고, 지방은 낮은 경향이 있습니다." },
          { q: "신혼집 비용은 결혼 비용에 포함되나요?", a: "일반적으로 신혼집(전세·매매)은 결혼 비용과 별도로 계산합니다. 신혼집 마련 비용을 포함하면 총 비용은 훨씬 높아집니다." },
          { q: "결혼식 축의금은 평균 얼마나 받나요?", a: "축의금 규모는 하객 수, 관계, 결혼식 규모에 따라 다르지만 평균적으로 200~400명 하객 기준 2,000만~5,000만 원 정도 받는 경우가 많습니다." },
          { q: "스몰웨딩으로 비용을 얼마나 줄일 수 있나요?", a: "스몰웨딩은 하객을 50명 이내로 제한하고 간소하게 진행하여 예식 비용을 500만~1,000만 원 수준으로 줄일 수 있습니다. 일반 웨딩홀 대비 60~70% 절감이 가능합니다." },
          { q: "결혼 비용 대출이 가능한가요?", a: "일부 시중은행과 지자체에서 신혼부부 대상 결혼비용 지원 대출을 운영합니다. 서울시 신혼부부 전세자금 대출, 청년 주거지원 등을 확인해보세요." },
          { q: "결혼 준비 체크리스트가 있나요?", a: "결혼 준비는 D-12개월부터 시작하며, 예식장 예약(D-12개월), 스드메(D-9개월), 혼수 구입(D-3개월), 청첩장 발송(D-1개월) 등 단계별로 준비하는 것이 좋습니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/wedding-cost-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
