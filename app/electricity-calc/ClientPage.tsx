"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type HousingType = "low" | "high";

// 한국전력 2024년 주택용 누진제 (저압 기준)
const LOW_TIERS = [
  { max: 200, baseRate: 910, unitRate: 120.0 },
  { max: 400, baseRate: 1600, unitRate: 214.6 },
  { max: Infinity, baseRate: 7300, unitRate: 307.3 },
];

// 주택용 고압 (참고용)
const HIGH_TIERS = [
  { max: 200, baseRate: 730, unitRate: 101.4 },
  { max: 400, baseRate: 1260, unitRate: 178.4 },
  { max: Infinity, baseRate: 6060, unitRate: 254.1 },
];

function calcElectricityBill(kwh: number, type: HousingType) {
  const tiers = type === "low" ? LOW_TIERS : HIGH_TIERS;
  let tier = tiers[0];
  for (let i = 0; i < tiers.length; i++) {
    if (kwh <= tiers[i].max) {
      tier = tiers[i];
      break;
    }
    if (i === tiers.length - 1) tier = tiers[i];
  }

  const baseCharge = tier.baseRate;
  const energyCharge = kwh * tier.unitRate;
  const climateEnv = kwh * 9.0;
  const fuelAdj = kwh * 5.0;
  const subtotal = baseCharge + energyCharge + climateEnv + fuelAdj;
  const vat = Math.round(subtotal * 0.1);
  const fundCharge = Math.round(subtotal * 0.037);
  const total = Math.round(subtotal + vat + fundCharge);

  return { baseCharge, energyCharge, climateEnv, fuelAdj, subtotal, vat, fundCharge, total, tier };
}

export default function ClientPage() {
  const [kwh, setKwh] = useState(300);
  const [type, setType] = useState<HousingType>("low");

  const r = useMemo(() => calcElectricityBill(kwh, type), [kwh, type]);

  const fmt = (n: number) => Math.round(n).toLocaleString();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">⚡ 전기요금 계산기</h1>
      <p className="text-gray-600 mb-6">월 사용량(kWh)을 입력하면 한국전력 2024년 누진제 기준으로 전기요금을 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">사용 정보 입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">주택 유형</label>
          <div className="flex gap-3">
            <button onClick={() => setType("low")}
              className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${type === "low" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
              주택용 저압
            </button>
            <button onClick={() => setType("high")}
              className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${type === "high" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
              주택용 고압
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">월 사용량 (kWh)</label>
          <div className="flex items-center gap-2">
            <input type="number" min={0} max={2000} value={kwh}
              onChange={(e) => setKwh(Number(e.target.value))}
              onBlur={(e) => setKwh(Math.min(2000, Math.max(0, Number(e.target.value) || 0)))}
              className="w-full border rounded p-2 text-right" />
            <span className="text-sm text-gray-500 shrink-0">kWh</span>
          </div>
          <div className="flex gap-2 mt-2">
            {[100, 200, 300, 400, 500].map((v) => (
              <button key={v} onClick={() => setKwh(v)}
                className={`flex-1 py-1 text-xs rounded border transition-colors ${kwh === v ? "bg-gray-200 font-bold" : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-base font-bold mb-4">전기요금 계산 결과</h2>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500 mb-1">이번 달 전기요금</p>
          <p className="text-4xl font-bold text-blue-600">{fmt(r.total)}원</p>
          <p className="text-xs text-gray-400 mt-1">
            {kwh <= 200 ? "1구간 (200kWh 이하)" : kwh <= 400 ? "2구간 (201~400kWh)" : "3구간 (400kWh 초과)"} 적용
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">기본요금</span>
            <span className="font-medium">{fmt(r.baseCharge)}원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">전력량요금 ({kwh}kWh × {r.tier.unitRate}원)</span>
            <span className="font-medium">{fmt(r.energyCharge)}원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">기후환경요금 ({kwh}kWh × 9.0원)</span>
            <span className="font-medium">{fmt(r.climateEnv)}원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">연료비조정액 ({kwh}kWh × 5.0원)</span>
            <span className="font-medium">{fmt(r.fuelAdj)}원</span>
          </div>
          <div className="flex justify-between py-2 border-b font-medium">
            <span>소계</span>
            <span>{fmt(r.subtotal)}원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">부가가치세 (10%)</span>
            <span className="font-medium">{fmt(r.vat)}원</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">전력산업기반기금 (3.7%)</span>
            <span className="font-medium">{fmt(r.fundCharge)}원</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>합계</span>
            <span className="text-blue-600">{fmt(r.total)}원</span>
          </div>
        </div>
      </section>

      {/* 누진제 요금표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">주택용 누진제 요금표 (2024년 기준)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b">구간</th>
                <th className="text-center p-3 border-b">기본료</th>
                <th className="text-center p-3 border-b">kWh당 단가</th>
              </tr>
            </thead>
            <tbody>
              {(type === "low" ? LOW_TIERS : HIGH_TIERS).map((tier, i) => (
                <tr key={i} className={`border-b last:border-b-0 ${r.tier === tier ? "bg-blue-50 font-bold" : ""}`}>
                  <td className="p-3">
                    {i === 0 ? "200kWh 이하" : i === 1 ? "201~400kWh" : "400kWh 초과"}
                  </td>
                  <td className="text-center p-3">{tier.baseRate.toLocaleString()}원</td>
                  <td className="text-center p-3">{tier.unitRate}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">전기요금 구성 요소</h2>
        <p className="mb-3 text-gray-700">
          한국전력 전기요금은 기본요금, 전력량요금, 기후환경요금, 연료비조정액으로 구성되며 여기에 부가가치세(10%)와 전력산업기반기금(3.7%)이 추가됩니다. 기본요금은 사용량에 관계없이 부과되는 고정 비용이고, 전력량요금은 실제 사용량(kWh)에 단가를 곱한 변동 비용입니다.
        </p>
        <p className="text-gray-700">
          기후환경요금은 신재생에너지 지원, 탄소중립 이행 등을 위한 비용이며, 연료비조정액은 발전 원가 변동을 요금에 반영하는 항목입니다. 누진제가 적용되는 주택용 전력은 사용량이 200kWh를 넘을 때마다 요금이 크게 높아지므로, 전기 절약이 경제적으로 유리합니다.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">전기요금 절약 방법</h2>
        <p className="mb-3 text-gray-700">
          전기요금을 줄이는 가장 효과적인 방법은 대기전력을 차단하는 것입니다. TV, 셋톱박스, 컴퓨터 등은 사용하지 않을 때 콘센트에서 뽑거나 멀티탭 스위치를 끄면 연간 수만원을 절약할 수 있습니다. LED 조명으로 교체하면 기존 형광등 대비 50~60% 전력을 절약할 수 있습니다.
        </p>
        <p className="mb-3 text-gray-700">
          에어컨의 경우 냉방 온도를 1℃ 올리면 약 7% 전력이 절감됩니다. 인버터형 에어컨은 기존 정속형보다 30~40% 에너지 효율이 높습니다. 세탁기는 가득 채워 돌리고, 냉장고는 용량의 60~70%만 채우는 것이 효율적입니다. 전력 소비가 많은 시간대(오전 11시~오후 12시, 오후 5~9시) 외 시간에 전기 사용을 집중하면 계절별 절약 효과가 있습니다.
        </p>
        <p className="text-gray-700">
          한전의 복지할인 제도를 활용하면 전기요금을 크게 절약할 수 있습니다. 장애인, 기초생활수급자, 독립유공자, 사회복지시설 등에 대해 월 최대 16,000원까지 할인이 적용됩니다. 해당 여부는 한전 고객센터(123) 또는 온라인 고객센터에서 확인하세요.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "주택용 저압과 고압의 차이는?", a: "주택용 저압은 단독주택이나 소형 공동주택에서 사용하는 220V 일반 전력이고, 주택용 고압은 변압기를 통해 공급받는 대형 공동주택(아파트 단지)에서 사용하는 전력입니다. 고압은 저압보다 기본료와 단가가 약간 낮습니다." },
          { q: "누진제는 왜 적용되나요?", a: "누진제는 에너지 절약을 유도하고 소비량이 많은 가구에 더 높은 요금을 부과하여 에너지 형평성을 높이기 위한 제도입니다. 한국은 2016년 전기요금 누진제를 3단계로 단순화했습니다." },
          { q: "전기요금 영수증에 표시된 kWh는 어떻게 확인하나요?", a: "전기 계량기나 한전 앱(한전 ON)에서 현재 사용량을 확인할 수 있습니다. 이전 달 요금 고지서의 사용량과 현재 계량기 수치를 비교하거나, 한전 ON 앱에서 일별·월별 사용량을 조회할 수 있습니다." },
          { q: "에어컨을 많이 쓰는 여름에는 요금이 얼마나 오르나요?", a: "에어컨(1.5HP 기준)을 하루 8시간 30일 사용하면 약 200~300kWh가 추가됩니다. 기존 200kWh 사용 가구가 에어컨으로 100kWh 추가하면 2구간이 되어 단가가 크게 높아져 총 요금이 2~3배까지 오를 수 있습니다." },
          { q: "태양광 패널 설치 시 전기요금이 얼마나 줄어드나요?", a: "3kW 가정용 태양광 시스템은 월 평균 300~360kWh를 발전합니다. 자가 소비 후 잉여 전력은 한전에 판매(역전력)할 수 있습니다. 설치비는 300~400만원 수준이며, 정부 보조금을 받으면 더 줄어들고 5~8년 내 투자 회수가 가능합니다." },
          { q: "전기요금 자동 납부 할인이 있나요?", a: "한전의 전자고지서 서비스에 가입하거나 자동납부를 신청하면 월 최대 200원의 할인 혜택이 있습니다. 카드 납부 시 카드사에 따라 추가 할인이나 포인트 적립 혜택을 받을 수 있습니다." },
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
