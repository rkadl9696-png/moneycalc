"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [exclusiveArea, setExclusiveArea] = useState(84);
  const [commonArea, setCommonArea] = useState(30);
  // 단가 (원/㎡)
  const [generalMgmt, setGeneralMgmt] = useState(300);
  const [cleaning, setCleaning] = useState(200);
  const [security, setSecurity] = useState(400);
  const [disinfection, setDisinfection] = useState(30);
  const [elevator, setElevator] = useState(100);
  const [homenet, setHomenet] = useState(50);
  // 사용량 기반
  const [heatingMcal, setHeatingMcal] = useState(0);
  const [heatingUnitCost, setHeatingUnitCost] = useState(80);
  const [hotWater, setHotWater] = useState(0);
  const [water, setWater] = useState(0);
  const [electricity, setElectricity] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const totalArea = exclusiveArea + commonArea;
    const generalMgmtFee = Math.round(totalArea * generalMgmt);
    const cleaningFee = Math.round(totalArea * cleaning);
    const securityFee = Math.round(totalArea * security);
    const disinfectionFee = Math.round(totalArea * disinfection);
    const elevatorFee = Math.round(totalArea * elevator);
    const homenetFee = Math.round(totalArea * homenet);
    const heatingFee = Math.round(heatingMcal * heatingUnitCost);
    const hotWaterFee = hotWater;
    const waterFee = water;
    const electricityFee = electricity;

    const total = generalMgmtFee + cleaningFee + securityFee + disinfectionFee + elevatorFee + homenetFee + heatingFee + hotWaterFee + waterFee + electricityFee;

    return {
      generalMgmtFee, cleaningFee, securityFee, disinfectionFee,
      elevatorFee, homenetFee, heatingFee, hotWaterFee, waterFee, electricityFee, total,
    };
  }, [exclusiveArea, commonArea, generalMgmt, cleaning, security, disinfection, elevator, homenet, heatingMcal, heatingUnitCost, hotWater, water, electricity]);

  const items = [
    { label: "일반관리비", value: result.generalMgmtFee },
    { label: "청소비", value: result.cleaningFee },
    { label: "경비비", value: result.securityFee },
    { label: "소독비", value: result.disinfectionFee },
    { label: "승강기유지비", value: result.elevatorFee },
    { label: "지능형홈네트워크", value: result.homenetFee },
    { label: "난방비", value: result.heatingFee },
    { label: "급탕비", value: result.hotWaterFee },
    { label: "수도료", value: result.waterFee },
    { label: "전기료", value: result.electricityFee },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">아파트 관리비 계산기</h1>
      <p className="text-gray-600 mb-6">
        면적과 항목별 단가를 입력하면 월 관리비 예상 합계를 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">면적 입력</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">전용면적 (㎡)</label>
            <input
              type="number"
              value={exclusiveArea}
              onChange={(e) => setExclusiveArea(Number(e.target.value))}
              onBlur={(e) => setExclusiveArea(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">공용면적 (㎡)</label>
            <input
              type="number"
              value={commonArea}
              onChange={(e) => setCommonArea(Number(e.target.value))}
              onBlur={(e) => setCommonArea(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <h2 className="text-base font-bold mb-4">항목별 단가 (원/㎡)</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "일반관리비", val: generalMgmt, set: setGeneralMgmt },
            { label: "청소비", val: cleaning, set: setCleaning },
            { label: "경비비", val: security, set: setSecurity },
            { label: "소독비", val: disinfection, set: setDisinfection },
            { label: "승강기유지비", val: elevator, set: setElevator },
            { label: "홈네트워크", val: homenet, set: setHomenet },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className="block text-xs text-gray-500 mb-1">{label}</label>
              <input
                type="number"
                value={val}
                onChange={(e) => set(Number(e.target.value))}
                onBlur={(e) => set(Math.max(0, Number(e.target.value) || 0))}
                className="w-full border p-2 rounded text-sm"
              />
            </div>
          ))}
        </div>

        <h2 className="text-base font-bold mb-4">사용량 기반 항목</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">난방 사용량 (Mcal)</label>
            <input
              type="number"
              value={heatingMcal}
              onChange={(e) => setHeatingMcal(Number(e.target.value))}
              onBlur={(e) => setHeatingMcal(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">난방 단가 (원/Mcal)</label>
            <input
              type="number"
              value={heatingUnitCost}
              onChange={(e) => setHeatingUnitCost(Number(e.target.value))}
              onBlur={(e) => setHeatingUnitCost(Math.max(0, Number(e.target.value) || 80))}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">급탕비 (원)</label>
            <input
              type="number"
              value={hotWater}
              onChange={(e) => setHotWater(Number(e.target.value))}
              onBlur={(e) => setHotWater(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">수도료 (원)</label>
            <input
              type="number"
              value={water}
              onChange={(e) => setWater(Number(e.target.value))}
              onBlur={(e) => setWater(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">전기료 (원)</label>
            <input
              type="number"
              value={electricity}
              onChange={(e) => setElectricity(Number(e.target.value))}
              onBlur={(e) => setElectricity(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">관리비 항목별 내역</h2>
        <div className="space-y-2 text-sm mb-4">
          {items.map(({ label, value }) => value > 0 && (
            <div key={label} className="flex justify-between">
              <span className="text-gray-600">{label}</span>
              <span className="font-bold">{value.toLocaleString()}원</span>
            </div>
          ))}
        </div>
        <div className="border-t border-blue-300 pt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-blue-800">월 관리비 합계</span>
          <span className="text-2xl font-bold text-blue-700">{result.total.toLocaleString()}원</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">전용 + 공용 면적: {exclusiveArea + commonArea}㎡ 기준</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">아파트 관리비 구조 이해하기</h2>
        <p className="mb-3">
          아파트 관리비는 공용관리비와 개별사용료로 구성됩니다. 공용관리비에는 일반관리비, 청소비, 경비비, 소독비, 승강기유지비, 지능형홈네트워크비 등이 포함되며, 전체 면적(전용+공용)에 비례해 부과됩니다. 개별사용료는 난방비, 급탕비, 수도료, 전기료 등 실제 사용량에 따라 청구됩니다.
        </p>
        <p className="mb-3">
          관리비는 아파트 단지 규모, 관리 방식(자치관리/위탁관리), 건물 노후도 등에 따라 크게 차이납니다. 관리비 내역은 공동주택관리정보시스템(K-아파트)에서 단지별로 공개되어 있어 비교가 가능합니다.
        </p>
        <p>
          관리비 이의신청은 입주자대표회의에 공식 요청할 수 있으며, 관리비 횡령 등 비리 의혹이 있을 경우 지방자치단체 또는 주택관리업자 및 사업자 신고센터에 신고할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">관리비 절약 방법</h2>
        <p className="mb-3">
          난방비는 세대 난방 방식(지역난방/개별난방)에 따라 크게 다릅니다. 겨울철 실내 온도를 1도 낮추면 난방비를 약 7% 절약할 수 있습니다. 단열 보완, 이중 커튼 사용도 효과적입니다.
        </p>
        <p>
          전기료는 한국전력 누진제가 적용되므로 월 사용량 관리가 중요합니다. 에너지 절약형 가전제품 사용과 대기전력 차단, LED 조명 교체로 전기료를 줄일 수 있습니다. 수도료는 수도계량기 이상 여부를 주기적으로 확인하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 관리비는 왜 세대마다 다른가요?</p>
          <p>공용관리비는 면적 기준으로 배분되므로 면적이 클수록 더 많이 납부합니다. 난방·수도·전기 등 개별사용료는 실사용량 기준이라 생활 패턴에 따라 차이가 납니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 관리비 내역서는 어디서 확인하나요?</p>
          <p>관리사무소나 단지 관리 앱을 통해 항목별 내역을 확인할 수 있습니다. 공동주택관리정보시스템(apt.molit.go.kr)에서도 단지별 관리비 이력을 조회할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 장기수선충당금은 관리비에 포함되나요?</p>
          <p>네, 관리비 고지서에 장기수선충당금이 포함되지만 이는 임차인이 아닌 소유자 부담입니다. 세입자는 이사 시 집주인에게 납부한 장기수선충당금 반환을 청구할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 관리비 미납하면 어떻게 되나요?</p>
          <p>관리비를 장기 미납하면 연체료(월 0.5~1%)가 부과되고, 심한 경우 단수·단전 등의 조치를 받을 수 있습니다. 생활이 어렵다면 관리사무소와 분납 협의가 가능합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 이사할 때 관리비 정산은 어떻게 하나요?</p>
          <p>이사 당일 기준으로 관리비를 일할 정산합니다. 이사 전 관리사무소에 이사 예정일을 알리고 최종 정산 금액을 확인한 뒤 납부하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 임차인이 관리비를 내지 않으면 집주인이 책임지나요?</p>
          <p>관리비 납부 의무는 실거주자(임차인)에게 있지만, 임차인이 미납 시 집주인이 대신 납부하고 임차인에게 구상권을 행사할 수 있습니다. 계약 시 관리비 납부 의무를 명확히 약정하는 것이 좋습니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/maintenance-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
