"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const carriers = ["CJ대한통운", "한진택배", "롯데택배"];

const priceTable = [
  { maxKg: 1, price: 4000 },
  { maxKg: 2, price: 4500 },
  { maxKg: 5, price: 5500 },
  { maxKg: 10, price: 7000 },
  { maxKg: 20, price: 10000 },
  { maxKg: 30, price: 15000 },
];

function getBasePrice(kg: number): number {
  for (const row of priceTable) {
    if (kg <= row.maxKg) return row.price;
  }
  return 20000;
}

export default function ClientPage() {
  const [realWeight, setRealWeight] = useState(2); // kg
  const [width, setWidth] = useState(30); // cm
  const [height, setHeight] = useState(20); // cm
  const [depth, setDepth] = useState(15); // cm
  const [carrier, setCarrier] = useState(0);
  const [isRemote, setIsRemote] = useState(false);

  const r = useMemo(() => {
    const volumeWeight = (width * height * depth) / 6000;
    const appliedWeight = Math.max(realWeight, volumeWeight);
    const basePrice = getBasePrice(appliedWeight);
    const remoteExtra = isRemote ? 3000 : 0;
    const totalPrice = basePrice + remoteExtra;
    return { volumeWeight, appliedWeight, basePrice, remoteExtra, totalPrice };
  }, [realWeight, width, height, depth, isRemote]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">📦 택배 무게 계산기</h1>
      <p className="text-gray-600 mb-6">실제 무게와 박스 크기를 입력하면 부피무게를 계산하고 예상 택배 요금을 안내합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">택배 정보 입력</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">실제 무게 (kg)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={0.1} max={30} step={0.1} value={realWeight}
                onChange={(e) => setRealWeight(Number(e.target.value))}
                onBlur={(e) => setRealWeight(Math.min(30, Math.max(0.1, Number(e.target.value) || 1)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">kg</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">가로 (cm)</label>
            <input type="number" min={1} max={300} value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              onBlur={(e) => setWidth(Math.min(300, Math.max(1, Number(e.target.value) || 30)))}
              className="w-full border rounded p-2 text-right" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">세로 (cm)</label>
            <input type="number" min={1} max={300} value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              onBlur={(e) => setHeight(Math.min(300, Math.max(1, Number(e.target.value) || 20)))}
              className="w-full border rounded p-2 text-right" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">높이 (cm)</label>
            <input type="number" min={1} max={300} value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              onBlur={(e) => setDepth(Math.min(300, Math.max(1, Number(e.target.value) || 15)))}
              className="w-full border rounded p-2 text-right" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">택배사</label>
          <div className="flex gap-2">
            {carriers.map((c, i) => (
              <button key={c} onClick={() => setCarrier(i)}
                className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${carrier === i ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="remote" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)}
            className="w-4 h-4" />
          <label htmlFor="remote" className="text-sm text-gray-700">제주/도서산간 지역 (+3,000원)</label>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-base font-bold mb-4">계산 결과</h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">실제 무게</p>
            <p className="text-xl font-bold text-gray-800">{realWeight.toFixed(1)}<span className="text-sm font-normal">kg</span></p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">부피 무게</p>
            <p className="text-xl font-bold text-purple-600">{r.volumeWeight.toFixed(2)}<span className="text-sm font-normal">kg</span></p>
          </div>
          <div className={`rounded-lg p-3 text-center border-2 ${r.appliedWeight === r.volumeWeight ? "bg-purple-50 border-purple-400" : "bg-blue-50 border-blue-400"}`}>
            <p className="text-xs text-gray-500 mb-1">적용 무게</p>
            <p className={`text-xl font-bold ${r.appliedWeight === r.volumeWeight ? "text-purple-600" : "text-blue-600"}`}>
              {r.appliedWeight.toFixed(2)}<span className="text-sm font-normal">kg</span>
            </p>
            <p className="text-xs text-gray-400">{r.appliedWeight === r.volumeWeight ? "부피무게 적용" : "실제무게 적용"}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">{carriers[carrier]} 예상 요금</p>
          <p className="text-4xl font-bold text-blue-600">{r.totalPrice.toLocaleString()}원</p>
          {isRemote && <p className="text-xs text-gray-500 mt-1">기본 {r.basePrice.toLocaleString()}원 + 도서산간 {r.remoteExtra.toLocaleString()}원</p>}
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">* 요금은 참고용이며 실제 요금은 택배사 사정에 따라 다를 수 있습니다.</p>
      </section>

      {/* 요금표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">택배 요금 기준표 (참고용)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b">무게</th>
                <th className="text-center p-3 border-b">기본 요금</th>
                <th className="text-center p-3 border-b">도서산간 추가</th>
              </tr>
            </thead>
            <tbody>
              {priceTable.map((row) => (
                <tr key={row.maxKg} className={`border-b last:border-b-0 ${r.appliedWeight <= row.maxKg && (row.maxKg === 1 || r.appliedWeight > priceTable[priceTable.indexOf(row) - 1]?.maxKg) ? "bg-blue-50 font-bold" : ""}`}>
                  <td className="p-3">{row.maxKg}kg 이하</td>
                  <td className="text-center p-3">{row.price.toLocaleString()}원</td>
                  <td className="text-center p-3">+3,000원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">부피무게란?</h2>
        <p className="mb-3 text-gray-700">
          부피무게(Dimensional Weight)는 상품의 실제 무게보다 부피가 클 경우, 부피를 기준으로 산정하는 무게입니다. 계산 공식은 <strong>가로(cm) × 세로(cm) × 높이(cm) ÷ 6,000</strong>입니다. 예를 들어 가로 50cm × 세로 40cm × 높이 30cm 박스의 부피무게는 50×40×30÷6,000 = 10kg입니다.
        </p>
        <p className="text-gray-700">
          택배사는 실제 무게와 부피무게 중 더 큰 값을 요금 산정의 기준으로 삼습니다. 솜이불, 쿠션, 의류 등 가볍지만 부피가 큰 상품은 부피무게가 적용되어 예상보다 높은 요금이 부과될 수 있습니다. 반대로 작고 무거운 상품(전자제품, 공구 등)은 실제 무게가 적용됩니다.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">택배 절약하는 팁</h2>
        <p className="mb-3 text-gray-700">
          택배 비용을 절약하려면 상품에 딱 맞는 크기의 박스를 선택하는 것이 중요합니다. 너무 큰 박스는 부피무게를 높여 요금 상승의 원인이 됩니다. 쇼핑몰이나 마트에서 받은 박스를 재활용하거나, 우체국이나 편의점 택배를 이용하면 포장재 비용을 줄일 수 있습니다.
        </p>
        <p className="mb-3 text-gray-700">
          여러 물건을 한 번에 보낼 경우, 각각 보내는 것보다 하나의 박스에 모아 보내는 것이 더 저렴할 수 있습니다. 단, 합산 무게나 부피가 상위 구간에 걸리면 오히려 더 비쌀 수 있으니 계산해보세요. 할인 쿠폰을 제공하는 앱(CJ 온택트, 한진택배 앱 등)을 활용하거나 편의점 택배를 이용하면 10~20% 할인을 받을 수 있습니다.
        </p>
        <p className="text-gray-700">
          해외 배송의 경우 부피무게 계산 기준이 다를 수 있습니다. 항공은 6,000, 해상은 1,000을 나누는 경우가 많습니다. EMS(국제특급우편)의 경우 5,000으로 나눕니다. 해외 직구 반품이나 해외 배송을 할 때는 각 운송사의 기준을 꼭 확인하세요.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "부피무게가 실제 무게보다 크면 어떻게 되나요?", a: "부피무게가 실제 무게보다 크면 부피무게를 기준으로 요금이 책정됩니다. 이를 과금 무게(Chargeable Weight) 또는 적용 무게라고 합니다. 예를 들어 실제 무게 1kg이지만 부피무게 5kg이면 5kg 요금이 부과됩니다." },
          { q: "최대 보낼 수 있는 무게와 크기 제한이 있나요?", a: "일반적으로 국내 택배는 30kg까지 가능하며, 가로+세로+높이의 합이 160cm 이내, 최장 변이 100cm 이내여야 합니다. 이를 초과하면 대형 화물로 분류되어 별도 요금이 부과됩니다." },
          { q: "편의점 택배가 더 저렴한가요?", a: "CU, GS25 등 편의점 택배는 CJ대한통운, 한진택배와 제휴하여 할인된 요금으로 이용 가능합니다. 특히 소형(2kg 이내) 상품은 편의점 택배가 더 저렴한 경우가 많습니다. 모바일 앱 할인 쿠폰을 함께 사용하면 더 절약됩니다." },
          { q: "파손 위험 상품은 어떻게 포장해야 하나요?", a: "유리, 도자기, 전자제품 등 파손 위험 상품은 에어캡(버블랩)으로 여러 겹 감싸고, 박스 내부에 완충재를 충분히 넣어야 합니다. '취급주의' 스티커를 붙이고 측면에 화살표로 상하 방향을 표시하세요. 파손보험 가입도 고려하세요." },
          { q: "당일 배송이나 새벽 배송은 요금이 다른가요?", a: "당일 배송과 새벽 배송 서비스는 일반 택배보다 1,000~3,000원 정도 비싸지만, 배송 속도를 보장합니다. 쿠팡 로켓배송, 마켓컬리 새벽배송, GS프레시 등이 대표적이며, 서비스 가능 지역이 제한됩니다." },
          { q: "택배 분실 또는 파손 시 어떻게 보상받나요?", a: "택배 분실이나 파손 시 택배사에 접수하면 기본적으로 50만원까지 보상됩니다. 고가품은 운송장에 품명과 가격을 정확히 기재하거나 추가 보험에 가입해야 전액 보상이 가능합니다. 보상 청구는 배송 완료 후 30일 이내에 해야 합니다." },
        ].map((item) => (
          <div key={item.q} className="mb-4 border-b pb-4 last:border-b-0">
            <p className="font-bold text-gray-800 mb-1">Q. {item.q}</p>
            <p className="text-gray-600 text-sm">{item.a}</p>
          </div>
        ))}
      </section>

      <RelatedCalculators current="/parcel-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false}
          href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">계산기 목록으로 돌아가기</Link>
      </div>
    </div>
  );
}
