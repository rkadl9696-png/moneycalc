"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type ChargeType = "완속" | "급속" | "초급속";

const CHARGE_TYPES: { type: ChargeType; power: number; rate: number; label: string }[] = [
  { type: "완속", power: 7, rate: 100, label: "완속 (가정용, 7kW, 100원/kWh)" },
  { type: "급속", power: 50, rate: 350, label: "급속 (공공, 50kW, 350원/kWh)" },
  { type: "초급속", power: 150, rate: 450, label: "초급속 (150kW, 450원/kWh)" },
];

const GAS_PRICE = 1700; // 원/L
const GAS_EFFICIENCY = 12; // km/L

export default function ClientPage() {
  const [batteryCapacity, setBatteryCapacity] = useState(77); // kWh
  const [currentPct, setCurrentPct] = useState(20); // %
  const [targetPct, setTargetPct] = useState(80); // %
  const [chargeTypeIdx, setChargeTypeIdx] = useState(0);
  const [evRange, setEvRange] = useState(450); // 완전 충전 시 주행 가능 거리 km

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const ct = CHARGE_TYPES[chargeTypeIdx];
    const chargePct = Math.max(0, targetPct - currentPct);
    const chargeKwh = batteryCapacity * (chargePct / 100);
    const chargeCost = chargeKwh * ct.rate;
    const chargeHours = chargeKwh / ct.power;
    const chargeMinutes = Math.round(chargeHours * 60);

    // 주행 가능 거리 (충전한 만큼)
    const rangeKm = evRange * (chargePct / 100);

    // 같은 거리 내연기관차 연료비
    const gasLiters = rangeKm / GAS_EFFICIENCY;
    const gasCost = gasLiters * GAS_PRICE;
    const savings = gasCost - chargeCost;

    return {
      chargePct,
      chargeKwh,
      chargeCost,
      chargeHours,
      chargeMinutes,
      rangeKm,
      gasCost,
      savings,
      ct,
    };
  }, [batteryCapacity, currentPct, targetPct, chargeTypeIdx, evRange]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">전기차 충전 비용 계산기</h1>
      <p className="text-gray-600 mb-6">
        배터리 용량, 현재·목표 배터리%, 충전 방식을 입력하면 충전 비용·시간과 내연기관차 대비 절약액을 계산합니다.
      </p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">차량 및 충전 정보</h2>
        <div className="flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">배터리 용량 (kWh)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={batteryCapacity}
                  onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                  onBlur={(e) => setBatteryCapacity(Math.min(200, Math.max(10, Number(e.target.value) || 10)))}
                  className="w-full border p-2 rounded"
                />
                <span className="text-sm text-gray-500 shrink-0">kWh</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">완충 시 주행거리 (km)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={evRange}
                  onChange={(e) => setEvRange(Number(e.target.value))}
                  onBlur={(e) => setEvRange(Math.min(1000, Math.max(50, Number(e.target.value) || 50)))}
                  className="w-full border p-2 rounded"
                />
                <span className="text-sm text-gray-500 shrink-0">km</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">현재 배터리 (%)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={currentPct}
                  onChange={(e) => setCurrentPct(Number(e.target.value))}
                  onBlur={(e) => setCurrentPct(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                  className="w-full border p-2 rounded"
                />
                <span className="text-sm text-gray-500 shrink-0">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">목표 배터리 (%)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={targetPct}
                  onChange={(e) => setTargetPct(Number(e.target.value))}
                  onBlur={(e) => setTargetPct(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                  className="w-full border p-2 rounded"
                />
                <span className="text-sm text-gray-500 shrink-0">%</span>
              </div>
            </div>
          </div>

          {/* 배터리 바 */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>0%</span>
              <span>충전량: {result.chargePct}%</span>
              <span>100%</span>
            </div>
            <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gray-300 rounded-full"
                style={{ width: `${currentPct}%` }}
              />
              <div
                className="absolute h-full bg-green-400 rounded-full"
                style={{ left: `${currentPct}%`, width: `${Math.max(0, result.chargePct)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500">현재 {currentPct}%</span>
              <span className="text-green-600 font-bold">목표 {targetPct}%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">충전 방식</label>
            <div className="flex flex-col gap-2">
              {CHARGE_TYPES.map((ct, idx) => (
                <button
                  key={ct.type}
                  onClick={() => setChargeTypeIdx(idx)}
                  className={`py-2 px-3 rounded text-sm font-bold border text-left transition-colors ${chargeTypeIdx === idx ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"}`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">충전량</p>
            <p className="text-xl font-bold text-blue-600">{result.chargeKwh.toFixed(1)}</p>
            <p className="text-xs text-gray-400">kWh</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">충전 비용</p>
            <p className="text-xl font-bold text-blue-600">{Math.round(result.chargeCost).toLocaleString()}</p>
            <p className="text-xs text-gray-400">원</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">충전 시간</p>
            <p className="text-xl font-bold text-blue-600">
              {result.chargeMinutes >= 60
                ? `${Math.floor(result.chargeMinutes / 60)}h ${result.chargeMinutes % 60}m`
                : `${result.chargeMinutes}분`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <p className="text-sm font-bold mb-3 text-gray-700">내연기관차 비교 ({result.rangeKm.toFixed(0)}km 기준)</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">전기차 충전 비용</span>
              <span className="font-bold text-blue-600">{Math.round(result.chargeCost).toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">휘발유차 연료비 (12km/L, 1,700원)</span>
              <span className="font-bold text-gray-600">{Math.round(result.gasCost).toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-gray-700 font-bold">절약액</span>
              <span className={`font-bold ${result.savings >= 0 ? "text-green-600" : "text-red-500"}`}>
                {result.savings >= 0 ? "+" : ""}{Math.round(result.savings).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 개념 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">전기차 충전 비용 이해하기</h2>
        <p className="mb-3">
          전기차 충전 비용은 충전 방식(완속/급속/초급속)에 따라 크게 다릅니다. 가정용 완속 충전은
          약 100원/kWh로 가장 저렴하지만 충전 시간이 길고(7kW 기준), 공공 급속 충전은 350원/kWh,
          초급속은 450원/kWh 수준입니다. 전기요금은 계절과 시간대에 따라 변동될 수 있습니다.
        </p>
        <p className="mb-3">
          내연기관차와 비교하면 동일한 거리를 주행할 때 전기차가 연료비를 크게 절약할 수 있습니다.
          휘발유 1,700원/L, 연비 12km/L 기준으로 계산하면, 완속 충전 시 3~5배 이상 저렴한 경우가 많습니다.
          단, 차량 구매 가격과 충전 인프라 비용도 함께 고려해야 합니다.
        </p>
        <p>
          배터리를 매번 100%까지 충전하면 배터리 수명이 줄어들 수 있습니다.
          일반적으로 80~90%까지만 충전하고, 장거리 여행 시에만 100%로 충전하는 것이
          배터리 관리에 좋습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 가정용 충전기 설치 비용은 얼마나 드나요?</p>
          <p>완속 충전기(7kW) 설치 비용은 아파트 기준 50~150만원 수준이나, 환경부 보조금(최대 50만원)이 있어 개인 부담이 줄어들 수 있습니다. 아파트의 경우 입주자 대표회의 승인이 필요할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전기차 배터리는 얼마나 오래 사용할 수 있나요?</p>
          <p>일반적으로 10~15년 또는 20만km 이상 사용 가능합니다. 국내 판매 전기차는 배터리에 대해 8년/16만km 이상 보증을 제공합니다. 급속 충전 과다 사용, 고온 환경, 과충전·과방전은 배터리 수명을 단축시킵니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 아파트 거주자도 전기차를 충전할 수 있나요?</p>
          <p>아파트 공용 주차장에 전기차 충전기가 있다면 이용 가능합니다. 없다면 환경부, 지자체 보조금을 활용해 개인 충전기를 설치할 수 있습니다. 최근 아파트 전기차 충전기 설치 의무화가 강화되고 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 겨울에 전기차 주행거리가 줄어드는 이유는?</p>
          <p>리튬이온 배터리는 저온에서 성능이 저하됩니다. 또한 히터 사용으로 전력 소비가 늘어 실제 주행거리가 여름 대비 20~40% 감소할 수 있습니다. 배터리 예열 기능과 시트 히터 활용을 권장합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전기차 충전 요금 계산 시 주의사항은?</p>
          <p>공공 충전기 요금은 사업자마다 다르며, 이 계산기는 평균 기준입니다. 환경부 충전소, 민간 사업자, 카드 할인 등에 따라 실제 비용이 달라질 수 있습니다. 충전 효율(약 90%)도 고려하면 실제 비용이 약간 높을 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 초급속 충전과 급속 충전의 차이는?</p>
          <p>급속 충전은 50kW급, 초급속(하이퍼 급속)은 100~350kW급입니다. 초급속 충전기는 10~30분 내에 상당한 양을 충전할 수 있어 장거리 이동 시 유리합니다. 다만 배터리 보호를 위해 차량 자체에서 충전 속도를 제한하는 경우도 있습니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/ev-charge-calc" />

      <div className="mt-10 text-center">
        <Link
          scroll={false}
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700"
        >
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
