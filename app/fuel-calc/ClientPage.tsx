"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type FuelType = "gasoline" | "diesel" | "lpg" | "electric";

const fuelDefaults: Record<FuelType, { label: string; unit: string; defaultPrice: number; defaultEfficiency: number; icon: string }> = {
  gasoline: { label: "휘발유", unit: "L", defaultPrice: 1750, defaultEfficiency: 12, icon: "⛽" },
  diesel: { label: "경유", unit: "L", defaultPrice: 1600, defaultEfficiency: 14, icon: "⛽" },
  lpg: { label: "LPG", unit: "L", defaultPrice: 1000, defaultEfficiency: 9, icon: "⛽" },
  electric: { label: "전기", unit: "kWh", defaultPrice: 347, defaultEfficiency: 6, icon: "🔋" },
};

export default function ClientPage() {
  const [fuelType, setFuelType] = useState<FuelType>("gasoline");
  const [efficiency, setEfficiency] = useState(fuelDefaults.gasoline.defaultEfficiency); // km/L 또는 km/kWh
  const [distance, setDistance] = useState(100); // km
  const [price, setPrice] = useState(fuelDefaults.gasoline.defaultPrice);
  const [monthlyKm, setMonthlyKm] = useState(1500);

  const handleFuelChange = (type: FuelType) => {
    setFuelType(type);
    setEfficiency(fuelDefaults[type].defaultEfficiency);
    setPrice(fuelDefaults[type].defaultPrice);
  };

  const r = useMemo(() => {
    const fuelNeeded = efficiency > 0 ? distance / efficiency : 0;
    const cost = fuelNeeded * price;
    const costPerKm = distance > 0 ? cost / distance : 0;
    const monthlyCost = costPerKm * monthlyKm;
    const yearlyCost = monthlyCost * 12;

    // 비교 계산 (같은 거리 기준)
    const comparisons = (Object.keys(fuelDefaults) as FuelType[]).map((type) => {
      const def = fuelDefaults[type];
      const needed = def.defaultEfficiency > 0 ? distance / def.defaultEfficiency : 0;
      return {
        type,
        label: def.label,
        needed,
        cost: needed * def.defaultPrice,
      };
    });

    return { fuelNeeded, cost, costPerKm, monthlyCost, yearlyCost, comparisons };
  }, [fuelType, efficiency, distance, price, monthlyKm]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const fuelInfo = fuelDefaults[fuelType];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link scroll={false}
        href="/" className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors">← 계산기 목록</Link>
      <h1 className="text-2xl font-bold mb-2">⛽ 연료비 계산기</h1>
      <p className="text-gray-600 mb-6">연료 종류·연비·주행 거리를 입력하면 연료비, km당 비용, 월/년 환산액을 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">차량 정보 입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">연료 종류</label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(fuelDefaults) as FuelType[]).map((type) => (
              <button key={type} onClick={() => handleFuelChange(type)}
                className={`py-2 rounded border text-sm font-medium transition-colors ${fuelType === type ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                {fuelDefaults[type].label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              연비 (km/{fuelInfo.unit})
            </label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={100} step={0.1} value={efficiency}
                onChange={(e) => setEfficiency(Number(e.target.value))}
                onBlur={(e) => setEfficiency(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">km/{fuelInfo.unit}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              연료 가격 (원/{fuelInfo.unit})
            </label>
            <div className="flex items-center gap-2">
              <input type="number" min={100} max={5000} value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                onBlur={(e) => setPrice(Math.min(5000, Math.max(100, Number(e.target.value) || 1000)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">주행 거리 (km)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={100000} value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                onBlur={(e) => setDistance(Math.min(100000, Math.max(1, Number(e.target.value) || 100)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">km</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">월 주행 거리 (km)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={100} max={50000} value={monthlyKm}
                onChange={(e) => setMonthlyKm(Number(e.target.value))}
                onBlur={(e) => setMonthlyKm(Math.min(50000, Math.max(100, Number(e.target.value) || 1500)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">km</span>
            </div>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-base font-bold mb-4">연료비 계산 결과</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">필요 연료량 ({distance}km)</p>
            <p className="text-2xl font-bold text-blue-600">{r.fuelNeeded.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{fuelInfo.unit}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">연료비 ({distance}km)</p>
            <p className="text-2xl font-bold text-orange-500">{fmt(r.cost)}원</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">km당 비용</p>
            <p className="text-lg font-bold text-gray-800">{r.costPerKm.toFixed(1)}원</p>
          </div>
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">월 연료비</p>
            <p className="text-lg font-bold text-gray-800">{fmt(r.monthlyCost)}원</p>
          </div>
          <div className="bg-white rounded p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">연 연료비</p>
            <p className="text-lg font-bold text-gray-800">{fmt(r.yearlyCost)}원</p>
          </div>
        </div>
      </section>

      {/* 연료별 비교 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">연료별 비교 ({distance}km 기준, 기본 연비 적용)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b">연료</th>
                <th className="text-center p-3 border-b">기본 연비</th>
                <th className="text-center p-3 border-b">기본 단가</th>
                <th className="text-right p-3 border-b">연료비</th>
              </tr>
            </thead>
            <tbody>
              {r.comparisons.map((c) => (
                <tr key={c.type} className={`border-b last:border-b-0 ${c.type === fuelType ? "bg-blue-50 font-bold" : ""}`}>
                  <td className="p-3">{c.label}</td>
                  <td className="text-center p-3">{fuelDefaults[c.type].defaultEfficiency}km/{fuelDefaults[c.type].unit}</td>
                  <td className="text-center p-3">{fuelDefaults[c.type].defaultPrice.toLocaleString()}원</td>
                  <td className="text-right p-3 font-medium">{fmt(c.cost)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-1">* 기본 연비와 기본 단가 기준 비교입니다. 개인 입력값은 위 결과를 참고하세요.</p>
      </section>

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">연비와 연료비 계산법</h2>
        <p className="mb-3 text-gray-700">
          연비(燃費)는 연료 1리터(또는 1kWh)로 주행할 수 있는 거리를 말합니다. 연료비 계산 공식은 <strong>연료비 = 주행거리 / 연비 × 연료가격</strong>입니다. 예를 들어 연비 12km/L, 휘발유 1,750원/L인 차량이 100km를 주행하면 약 100/12 × 1,750 = 14,583원이 필요합니다.
        </p>
        <p className="text-gray-700">
          전기차의 경우 kWh당 km로 에너지 효율을 표시합니다. 전기차 연비 6km/kWh, 전기료 347원/kWh로 100km 주행 시 약 100/6 × 347 = 5,783원이며, 같은 거리 휘발유차 대비 약 40% 수준의 연료비가 듭니다. 단, 전기차 충전 방식(완속/급속)에 따라 단가가 다릅니다.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">연료별 장단점 비교</h2>
        <p className="mb-3 text-gray-700">
          휘발유차는 가장 보편적이며 주유소 접근성이 좋지만, 연료비가 상대적으로 높습니다. 경유(디젤)차는 연비가 좋고 연료비가 저렴하지만, 미세먼지 등 환경 문제로 규제가 강화되고 있습니다. LPG차는 연료비가 저렴하지만 연비가 낮고 충전소가 적다는 단점이 있습니다.
        </p>
        <p className="mb-3 text-gray-700">
          전기차는 연료비가 가장 저렴하고 친환경적이지만, 초기 차량 구매 비용이 높고 충전 인프라가 아직 부족합니다. 배터리 수명과 충전 시간도 고려해야 합니다. 하이브리드차는 전기차와 내연기관의 장점을 합쳐 연비를 크게 높였으며, 충전 인프라에 의존하지 않는다는 장점이 있습니다.
        </p>
        <p className="text-gray-700">
          연간 2만km를 주행한다면 휘발유차(12km/L, 1,750원)는 약 292만원, 경유차(14km/L, 1,600원)는 약 229만원, LPG차(9km/L, 1,000원)는 약 222만원, 전기차(6km/kWh, 347원)는 약 116만원의 연료비가 듭니다. 전기차는 연료비 측면에서 가장 유리하지만 충전 편의성과 초기 비용을 종합적으로 고려해야 합니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "실제 연비와 공인 연비가 다른 이유는?", a: "공인 연비는 표준화된 시험 조건에서 측정하지만, 실제 주행 시에는 교통 체증, 에어컨 사용, 급가속·급감속, 도로 상태, 날씨 등에 따라 공인 연비의 70~90% 수준이 일반적입니다. 겨울철에는 배터리 효율 저하로 전기차 연비가 더 낮아집니다." },
          { q: "연비를 높이는 방법은?", a: "급가속과 급감속을 자제하고 일정한 속도로 주행하는 에코 드라이빙이 가장 효과적입니다. 타이어 공기압을 적정 수준으로 유지하고, 불필요한 짐을 줄이며, 고속 주행보다 적정 속도(80~100km/h)를 유지하면 연비가 개선됩니다." },
          { q: "전기차 충전 비용은 어떻게 계산하나요?", a: "완속 충전(7kW)은 가정용 전기요금(kWh당 100~300원)이 적용되어 저렴하고, 급속 충전(50kW~)은 kWh당 250~400원 수준입니다. 이 계산기의 기본값 347원/kWh는 평균적인 공공 충전 요금을 참고한 값입니다." },
          { q: "LPG차는 일반인도 살 수 있나요?", a: "2019년 LPG차 사용 제한이 폐지되어 현재는 일반인도 LPG 승용차를 구입하고 운행할 수 있습니다. LPG 연료는 휘발유·경유보다 저렴하지만, 충전소가 상대적으로 적고 부피가 큰 연료 탱크가 트렁크 공간을 차지합니다." },
          { q: "하이브리드차와 전기차 중 어떤 것이 더 경제적인가요?", a: "도심 주행이 많다면 전기차가 연료비 면에서 유리합니다. 장거리 주행이 많거나 충전 인프라 접근성이 낮은 지역에서는 하이브리드차가 더 실용적일 수 있습니다. 총 비용(구입비 + 유지비)을 고려하면 5~7년 이상 운행 시 전기차가 경제적인 경우가 많습니다." },
          { q: "유가가 오르면 연료비가 얼마나 늘어나나요?", a: "휘발유 가격이 100원 오르면 연비 12km/L로 월 1,500km 주행 시 월 추가 비용은 1,500÷12×100 = 12,500원입니다. 연간으로는 15만원이 늘어납니다. 경유나 LPG는 상대적으로 가격 변동이 적어 유가 상승 시 더 유리할 수 있습니다." },
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
