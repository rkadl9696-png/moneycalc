"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type Category = "length" | "weight" | "temperature" | "area" | "speed";

const categories: { key: Category; label: string }[] = [
  { key: "length", label: "길이" },
  { key: "weight", label: "무게" },
  { key: "temperature", label: "온도" },
  { key: "area", label: "면적" },
  { key: "speed", label: "속도" },
];

const units: Record<Category, { key: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { key: "km", label: "킬로미터 (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: "m", label: "미터 (m)", toBase: (v) => v, fromBase: (v) => v },
    { key: "cm", label: "센티미터 (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { key: "mm", label: "밀리미터 (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "inch", label: "인치 (inch)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { key: "ft", label: "피트 (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { key: "mile", label: "마일 (mile)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { key: "yard", label: "야드 (yard)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
  ],
  weight: [
    { key: "kg", label: "킬로그램 (kg)", toBase: (v) => v, fromBase: (v) => v },
    { key: "g", label: "그램 (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: "mg", label: "밀리그램 (mg)", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { key: "lb", label: "파운드 (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { key: "oz", label: "온스 (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { key: "geun", label: "근 (600g)", toBase: (v) => v * 0.6, fromBase: (v) => v / 0.6 },
    { key: "don", label: "돈 (3.75g)", toBase: (v) => v * 0.00375, fromBase: (v) => v / 0.00375 },
  ],
  temperature: [
    { key: "c", label: "섭씨 (℃)", toBase: (v) => v, fromBase: (v) => v },
    { key: "f", label: "화씨 (℉)", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { key: "k", label: "켈빈 (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  area: [
    { key: "m2", label: "제곱미터 (m²)", toBase: (v) => v, fromBase: (v) => v },
    { key: "km2", label: "제곱킬로미터 (km²)", toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    { key: "pyeong", label: "평 (3.3058m²)", toBase: (v) => v * 3.305785, fromBase: (v) => v / 3.305785 },
    { key: "hectare", label: "헥타르 (ha)", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { key: "ft2", label: "제곱피트 (ft²)", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
  ],
  speed: [
    { key: "kmh", label: "킬로미터/시 (km/h)", toBase: (v) => v, fromBase: (v) => v },
    { key: "ms", label: "미터/초 (m/s)", toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
    { key: "mph", label: "마일/시 (mph)", toBase: (v) => v * 1.60934, fromBase: (v) => v / 1.60934 },
    { key: "knot", label: "노트 (knot)", toBase: (v) => v * 1.852, fromBase: (v) => v / 1.852 },
  ],
};

function formatNum(n: number): string {
  if (Math.abs(n) >= 1e10 || (Math.abs(n) < 0.0001 && n !== 0)) {
    return n.toExponential(4);
  }
  const str = n.toPrecision(7);
  return parseFloat(str).toString();
}

export default function ClientPage() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [inputValue, setInputValue] = useState(1);

  const currentUnits = units[category];

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setFromUnit(units[cat][0].key);
    setInputValue(1);
  };

  const results = useMemo(() => {
    const src = currentUnits.find((u) => u.key === fromUnit);
    if (!src) return [];
    const baseValue = src.toBase(inputValue);
    return currentUnits.map((u) => ({
      ...u,
      result: u.fromBase(baseValue),
    }));
  }, [category, fromUnit, inputValue, currentUnits]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">📐 단위 변환 계산기</h1>
      <p className="text-gray-600 mb-6">길이, 무게, 온도, 면적, 속도 단위를 입력하면 모든 단위로 자동 변환합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-3">카테고리 선택</h2>
        <div className="flex gap-2 flex-wrap mb-4">
          {categories.map((cat) => (
            <button key={cat.key} onClick={() => handleCategoryChange(cat.key)}
              className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${category === cat.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
              {cat.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">변환할 단위</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
              className="w-full border rounded p-2">
              {currentUnits.map((u) => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">값 입력</label>
            <input type="number" value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              onBlur={(e) => setInputValue(Number(e.target.value) || 0)}
              className="w-full border rounded p-2 text-right" />
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-base font-bold mb-3">변환 결과</h2>
        <div className="flex flex-col gap-2">
          {results.map((u) => (
            <div key={u.key} className={`flex items-center justify-between p-3 rounded-lg ${u.key === fromUnit ? "bg-blue-50 border border-blue-200" : "bg-white border border-gray-100"}`}>
              <span className={`text-sm font-medium ${u.key === fromUnit ? "text-blue-600" : "text-gray-600"}`}>{u.label}</span>
              <span className={`text-lg font-bold ${u.key === fromUnit ? "text-blue-600" : "text-gray-800"}`}>{formatNum(u.result)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">단위 변환이 필요한 이유</h2>
        <p className="mb-3 text-gray-700">
          일상에서 단위 변환이 필요한 상황은 다양합니다. 해외 직구 시 인치와 cm, 파운드와 kg 변환, 해외 여행 시 화씨와 섭씨 온도 변환, 부동산 계약 시 평과 제곱미터 변환, 요리 레시피에서 컵과 ml 변환 등이 대표적입니다. 단위를 잘못 이해하면 실수가 생기기 쉬우므로 정확한 변환이 중요합니다.
        </p>
        <p className="text-gray-700">
          국제단위계(SI)가 세계 표준이지만, 미국은 아직도 인치·파운드·화씨 등 영국식 단위를 주로 사용합니다. 한국에서도 '평'이나 '근', '돈' 같은 전통 단위가 일상에서 쓰입니다. 이 계산기로 다양한 단위를 빠르게 변환해보세요.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 쓰이는 단위 변환 정리</h2>
        <p className="mb-3 text-gray-700">
          길이 변환: 1인치=2.54cm, 1피트=30.48cm, 1마일=1.609km. 의류 사이즈, TV/모니터 화면 크기, 미국 도로 표지판 등에서 인치와 마일이 사용됩니다. 야구에서 투구 거리(60.5피트 = 18.44m)나 100야드 대시(91.44m)도 변환이 필요한 경우입니다.
        </p>
        <p className="mb-3 text-gray-700">
          온도 변환: 섭씨(℃) = (화씨 - 32) × 5/9, 켈빈(K) = 섭씨 + 273.15. 미국과 일부 국가에서 기상 예보에 화씨를 사용하며, 절대온도(켈빈)는 과학 분야에서 사용됩니다. 물의 어는점은 0℃(32℉, 273.15K), 끓는점은 100℃(212℉, 373.15K)입니다.
        </p>
        <p className="text-gray-700">
          면적 변환: 1평=3.3058m², 1평=약 35.58제곱피트. 부동산에서 아파트 면적을 평으로 표시하는 경우가 많으며, 공식 문서에는 m²를 사용합니다. 1헥타르=10,000m²=약 3,025평으로 농지나 대지 면적 표현에 사용됩니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "30평 아파트는 몇 제곱미터인가요?", a: "30평 × 3.3058m² = 약 99.17m²입니다. 아파트 분양 시 공급 면적과 전용 면적의 차이도 있으니 계약서를 확인하세요. 전용 면적은 실제 거주 공간이며, 공급 면적은 공용 면적을 포함합니다." },
          { q: "체온 98.6°F는 몇 도인가요?", a: "98.6°F는 정확히 37.0℃입니다. 공식: (98.6 - 32) × 5/9 = 37.0. 미국에서 발열 기준은 100.4°F(38.0℃) 이상입니다." },
          { q: "1근은 몇 kg인가요?", a: "한국에서 1근은 600g(0.6kg)입니다. 고기를 살 때 '1근에 얼마'라고 하면 600g 기준입니다. 단, 한방에서 한약 재료를 잴 때 1근은 160돈(약 600g)으로 동일합니다." },
          { q: "1돈은 몇 그램인가요?", a: "1돈은 3.75g입니다. 금이나 은 등 귀금속을 거래할 때 사용하는 단위입니다. 금 1돈은 3.75g이며, 금반지 1개가 보통 1~2돈 정도입니다." },
          { q: "노트(knot)는 어떤 단위인가요?", a: "노트(knot)는 항해 및 항공에서 사용하는 속도 단위로, 1노트 = 시속 1해리(1.852km)입니다. 항공기의 순항 속도가 약 450~500노트(830~925km/h), 선박은 약 15~25노트(28~46km/h) 수준입니다." },
          { q: "미국에서 내 체중이 얼마인지 말하려면?", a: "kg를 파운드(lb)로 변환하려면 kg × 2.2046을 하면 됩니다. 예를 들어 70kg = 약 154파운드입니다. 미국에서는 체중을 파운드로 표현합니다." },
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
