"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const REGIONS = [
  { name: "서울", hours: 3.5 },
  { name: "부산", hours: 3.8 },
  { name: "대구", hours: 3.9 },
  { name: "인천", hours: 3.4 },
  { name: "광주", hours: 3.7 },
  { name: "대전", hours: 3.6 },
  { name: "제주", hours: 4.0 },
  { name: "기타", hours: 3.5 },
];

const SMP = 130; // 원/kWh (계통한계가격)
const REC = 40;  // 원/kWh (신재생에너지 공급 인증서)
const SELL_RATE = SMP + REC; // 170원/kWh

function formatWon(n: number): string {
  if (n >= 100000000) return `${(n / 100000000).toFixed(2)}억원`;
  if (n >= 10000) return `${Math.round(n / 10000).toLocaleString()}만원`;
  return `${Math.round(n).toLocaleString()}원`;
}

export default function ClientPage() {
  const [capacityKw, setCapacityKw] = useState(3); // kW
  const [installCostManwon, setInstallCostManwon] = useState(600); // 만원
  const [regionIdx, setRegionIdx] = useState(0);
  const [degradationPct, setDegradationPct] = useState(0.5); // 연간 성능 저하율 %

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const region = REGIONS[regionIdx];
    const dailyKwh = capacityKw * region.hours;
    const monthlyKwh = dailyKwh * 30;
    const yearlyKwh = dailyKwh * 365;

    const monthlyRevenue = monthlyKwh * SELL_RATE;
    const yearlyRevenue = yearlyKwh * SELL_RATE;

    const installCost = installCostManwon * 10000;
    const paybackYears = installCost / yearlyRevenue;

    // 20년 총 수익 (연간 성능 저하 반영)
    let total20 = 0;
    for (let y = 1; y <= 20; y++) {
      const eff = Math.pow(1 - degradationPct / 100, y - 1);
      total20 += yearlyRevenue * eff;
    }
    const profit20 = total20 - installCost;

    return {
      region,
      dailyKwh,
      monthlyKwh,
      yearlyKwh,
      monthlyRevenue,
      yearlyRevenue,
      installCost,
      paybackYears,
      total20,
      profit20,
    };
  }, [capacityKw, installCostManwon, regionIdx, degradationPct]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">태양광 수익 계산기</h1>
      <p className="text-gray-600 mb-6">
        설치 용량과 지역을 입력하면 태양광 발전 수익, 투자 회수 기간, 20년 총 수익을 계산합니다.
      </p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">설치 정보 입력</h2>
        <div className="flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">설치 용량 (kW)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={capacityKw}
                  onChange={(e) => setCapacityKw(Number(e.target.value))}
                  onBlur={(e) => setCapacityKw(Math.min(1000, Math.max(0.1, Number(e.target.value) || 0.1)))}
                  className="w-full border p-2 rounded"
                />
                <span className="text-sm text-gray-500 shrink-0">kW</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">설치 비용 (만원)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={installCostManwon}
                  onChange={(e) => setInstallCostManwon(Number(e.target.value))}
                  onBlur={(e) => setInstallCostManwon(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full border p-2 rounded"
                />
                <span className="text-sm text-gray-500 shrink-0">만원</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">지역 (일조 시간)</label>
            <div className="grid grid-cols-4 gap-2">
              {REGIONS.map((r, idx) => (
                <button
                  key={r.name}
                  onClick={() => setRegionIdx(idx)}
                  className={`py-2 rounded text-sm font-bold border transition-colors ${regionIdx === idx ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"}`}
                >
                  {r.name}
                  <span className="block text-xs font-normal">{r.hours}h</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">연간 성능 저하율 (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={degradationPct}
                step={0.1}
                onChange={(e) => setDegradationPct(Number(e.target.value))}
                onBlur={(e) => setDegradationPct(Math.min(5, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">%/년</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">일반적으로 연 0.3~0.8% 성능 저하 (기본값 0.5%)</p>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">월 예상 수익</p>
            <p className="text-2xl font-bold text-blue-600">{formatWon(result.monthlyRevenue)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">연 예상 수익</p>
            <p className="text-2xl font-bold text-green-600">{formatWon(result.yearlyRevenue)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-3">
          <div className="flex justify-between py-1.5 border-b text-sm">
            <span className="text-gray-500">일 발전량</span>
            <span className="font-bold">{result.dailyKwh.toFixed(1)} kWh</span>
          </div>
          <div className="flex justify-between py-1.5 border-b text-sm">
            <span className="text-gray-500">월 발전량</span>
            <span className="font-bold">{result.monthlyKwh.toFixed(0)} kWh</span>
          </div>
          <div className="flex justify-between py-1.5 border-b text-sm">
            <span className="text-gray-500">연 발전량</span>
            <span className="font-bold">{result.yearlyKwh.toFixed(0)} kWh</span>
          </div>
          <div className="flex justify-between py-1.5 border-b text-sm">
            <span className="text-gray-500">매전 단가 (SMP+REC)</span>
            <span className="font-bold">{SELL_RATE}원/kWh</span>
          </div>
          <div className="flex justify-between py-1.5 text-sm">
            <span className="text-gray-500">투자 회수 기간</span>
            <span className="font-bold text-orange-600">{result.paybackYears.toFixed(1)}년</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <p className="text-sm font-bold mb-2 text-gray-700">20년 수익 분석</p>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-500">20년 총 발전 수익</span>
            <span className="font-bold text-green-600">{formatWon(result.total20)}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-500">설치 비용</span>
            <span className="font-bold text-red-500">{formatWon(result.installCost)}</span>
          </div>
          <div className="flex justify-between py-1 border-t text-sm">
            <span className="text-gray-700 font-bold">20년 순수익</span>
            <span className={`font-bold ${result.profit20 >= 0 ? "text-blue-600" : "text-red-500"}`}>
              {formatWon(result.profit20)}
            </span>
          </div>
        </div>
      </section>

      {/* 핵심 개념 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">태양광 발전 수익 구조</h2>
        <p className="mb-3">
          태양광 발전 사업의 수익은 주로 SMP(계통한계가격)와 REC(신재생에너지 공급 인증서)로 구성됩니다.
          SMP는 전력 도매 가격으로 시장 상황에 따라 변동되며, REC는 신재생에너지 발전에 대한 인증서로
          한국전력 등에 판매됩니다. 현재 합산 단가는 약 130~200원/kWh 수준입니다.
        </p>
        <p className="mb-3">
          설치 비용은 용량에 따라 다르며, 3kW 주택용 기준 설치비는 400~700만원 수준입니다.
          정부와 지자체의 보조금 프로그램을 활용하면 설치 비용을 줄일 수 있습니다.
          태양광 패널의 수명은 약 25~30년으로, 적절한 관리를 하면 장기간 수익을 창출할 수 있습니다.
        </p>
        <p>
          이 계산기는 참고용이며, 실제 수익은 날씨, 패널 방향·경사도, 음영 여부, SMP와 REC 가격 변동에
          따라 달라질 수 있습니다. 정확한 수익성 분석을 위해서는 태양광 전문 업체와 상담하세요.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 아파트에도 태양광을 설치할 수 있나요?</p>
          <p>발코니형 소규모 태양광(0.3~1kW)을 설치할 수 있습니다. 일부 지자체에서 보조금을 지원합니다. 단, 아파트 관리 규약 확인과 관리소 허가가 필요할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 태양광 설치 보조금은 얼마나 받을 수 있나요?</p>
          <p>주택용 태양광의 경우 정부·지자체 보조금을 합산하면 설치비의 30~50%까지 지원받을 수 있습니다. 신청 시기와 지역마다 다르므로 한국에너지공단이나 지자체 에너지 관련 부서에 문의하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. SMP 가격은 항상 130원/kWh인가요?</p>
          <p>아닙니다. SMP는 연료비(LNG 등)에 따라 매시간 변동됩니다. 2024년 기준 100~170원/kWh 범위에서 변동했습니다. 이 계산기는 참고 기준가를 사용하므로 실제 수익과 차이가 있을 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 태양광 발전량에 영향을 미치는 요소는?</p>
          <p>패널 방향(남향 최적), 경사도(30~35도 최적), 음영(나무, 건물), 온도(고온에서 효율 감소), 먼지 오염, 날씨 등이 영향을 미칩니다. 정기적인 패널 청소와 시스템 점검이 중요합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 태양광 패널 수명이 다하면 어떻게 하나요?</p>
          <p>태양광 패널의 설계 수명은 25~30년이며, 수명이 다하면 폐패널 처리 비용이 발생합니다. 환경부에서 폐태양광 패널 재활용 제도를 운영하고 있으며, 설치 시 이 비용도 고려해야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전기 자가 소비와 매전 중 어떤 게 유리한가요?</p>
          <p>한국전력 소매 요금(약 120~300원/kWh 누진)과 비교하면 자가 소비가 유리한 경우가 많습니다. 고용량 사용 가정에서는 누진 구간을 낮추는 효과가 커서 자가 소비가 더 이익일 수 있습니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/solar-calc" />

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
