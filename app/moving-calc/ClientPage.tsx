"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type MoveType = "oneroom" | "single" | "two" | "three" | "office" | "package";

const MOVE_TYPES = [
  { key: "oneroom" as MoveType, label: "원룸 이사", min: 200_000, max: 400_000 },
  { key: "single" as MoveType, label: "1인가구 이사", min: 300_000, max: 600_000 },
  { key: "two" as MoveType, label: "2룸 이사", min: 600_000, max: 1_000_000 },
  { key: "three" as MoveType, label: "3룸 이사 (3~4인)", min: 1_000_000, max: 1_500_000 },
  { key: "office" as MoveType, label: "사무실 이사", min: 800_000, max: 2_000_000 },
  { key: "package" as MoveType, label: "포장 이사", min: 1_000_000, max: 2_500_000 },
];

const EXTRA_SERVICES = [
  { label: "에어컨 이전 설치", cost: 50_000 },
  { label: "피아노 운반", cost: 100_000 },
  { label: "대형가전 추가 (개당)", cost: 30_000 },
  { label: "사다리차 사용", cost: 80_000 },
];

export default function ClientPage() {
  const [moveType, setMoveType] = useState<MoveType>("single");
  const [distance, setDistance] = useState(10);
  const [isPeakSeason, setIsPeakSeason] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);
  const [extraServices, setExtraServices] = useState<number[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const base = MOVE_TYPES.find((t) => t.key === moveType) ?? MOVE_TYPES[0];
    // 거리 추가 요금 (10km 이상 시 km당 3,000원)
    const distanceFee = distance > 10 ? (distance - 10) * 3_000 : 0;
    // 이사철 할증 20%
    const peakRate = isPeakSeason ? 0.2 : 0;
    // 주말/공휴일 할증 10%
    const weekendRate = isWeekend ? 0.1 : 0;
    const surcharge = peakRate + weekendRate;
    const extraCost = extraServices.reduce((sum, idx) => sum + EXTRA_SERVICES[idx].cost, 0);

    const minCost = Math.round((base.min + distanceFee) * (1 + surcharge) + extraCost);
    const maxCost = Math.round((base.max + distanceFee) * (1 + surcharge) + extraCost);

    return { minCost, maxCost, distanceFee, surcharge, extraCost };
  }, [moveType, distance, isPeakSeason, isWeekend, extraServices]);

  const toggleExtra = (idx: number) => {
    setExtraServices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">이사 비용 계산기</h1>
      <p className="text-gray-600 mb-6">
        이사 유형, 거리, 날짜 조건으로 예상 이사 비용을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">이사 조건 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">이사 유형</label>
          <div className="grid grid-cols-2 gap-2">
            {MOVE_TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => setMoveType(t.key)}
                className={`py-2 rounded border text-sm font-bold ${moveType === t.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">이동 거리 (km)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            onBlur={(e) => setDistance(Math.max(0, Number(e.target.value) || 0))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">10km 초과 시 km당 3,000원 추가</p>
        </div>

        <div className="mb-4 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPeakSeason}
              onChange={(e) => setIsPeakSeason(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">이사철 할증 (3~4월, 9~10월) +20%</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isWeekend}
              onChange={(e) => setIsWeekend(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">주말/공휴일 할증 +10%</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">추가 서비스 (복수 선택)</label>
          <div className="grid grid-cols-2 gap-2">
            {EXTRA_SERVICES.map((svc, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={extraServices.includes(i)}
                  onChange={() => toggleExtra(i)}
                  className="rounded"
                />
                <span className="text-xs">
                  {svc.label}
                  <br />
                  <span className="text-gray-400">+{svc.cost.toLocaleString()}원</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">예상 이사 비용</h2>
        <div className="space-y-2 text-sm mb-4">
          {result.distanceFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">거리 추가 ({distance - 10}km × 3,000원)</span>
              <span>+ {result.distanceFee.toLocaleString()}원</span>
            </div>
          )}
          {result.surcharge > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">할증 ({(result.surcharge * 100).toFixed(0)}%)</span>
              <span>적용</span>
            </div>
          )}
          {result.extraCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">추가 서비스</span>
              <span>+ {result.extraCost.toLocaleString()}원</span>
            </div>
          )}
        </div>
        <div className="border-t border-blue-300 pt-3">
          <p className="text-sm text-gray-600 mb-1">예상 비용 범위</p>
          <p className="text-2xl font-bold text-blue-700">
            {result.minCost.toLocaleString()}원 ~ {result.maxCost.toLocaleString()}원
          </p>
          <p className="text-xs text-gray-500 mt-1">* 실제 비용은 업체, 짐 상태, 층수 등에 따라 다를 수 있습니다</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">이사 비용 절약 팁</h2>
        <p className="mb-3">
          이사 비용은 이사 유형, 이동 거리, 짐의 양, 날짜 등에 따라 크게 달라집니다. 이사철(3~4월, 9~10월)과 주말은 수요가 많아 할증이 붙습니다. 가능하면 평일 이사를 이용하면 10~20% 비용을 절약할 수 있습니다.
        </p>
        <p className="mb-3">
          이삿짐을 미리 정리하고 버릴 물건을 줄이면 트럭 크기와 비용을 낮출 수 있습니다. 직접 포장 후 이사(반포장 이사)는 완전 포장 이사보다 저렴합니다. 3~4곳 이상의 업체에서 견적을 받아 비교하는 것이 좋습니다.
        </p>
        <p>
          이사 후 파손·분실 발생 시 책임 소재가 명확하려면 계약서에 배상 조항을 꼭 확인하고, 이사 전·후 사진을 남겨두세요. 공정거래위원회 표준약관을 사용하는 업체를 이용하면 분쟁 발생 시 보호받기 쉽습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">이사 준비 체크리스트</h2>
        <p className="mb-3">
          이사 전 전입신고 변경, 공과금(전기·가스·수도) 이전·해지 신청, 우편물 주소 변경, 보험·카드사·금융기관 주소 변경이 필요합니다. 아이가 있으면 전학 신청도 미리 준비하세요.
        </p>
        <p>
          새 집의 열쇠 수령, 청소 상태 확인, 가스·전기 점검, 하자 보수 요구 등을 이사 전날 또는 당일에 확인하세요. 인터넷·TV 설치 예약도 사전에 해두면 편리합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 이사 비용은 현금 지급인가요?</p>
          <p>대부분 현금이나 계좌이체로 이루어지지만, 카드 결제를 받는 업체도 있습니다. 계좌이체나 카드 결제 시 영수증을 반드시 받고, 현금영수증 발급도 요청하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 이사 당일 파손이 생기면 어떻게 하나요?</p>
          <p>이사 중 파손·분실된 물품은 계약서의 배상 조항에 따라 보상받을 수 있습니다. 현장에서 즉시 확인하고 사진을 남겨두세요. 분쟁 발생 시 한국이삿짐운송협회 또는 소비자원에 도움을 요청할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 포장 이사와 일반 이사의 차이는?</p>
          <p>포장 이사는 이삿짐 업체가 짐 포장부터 운반, 정리까지 모두 담당하며, 일반 이사보다 30~50% 비쌉니다. 직접 포장하는 일반 이사는 저렴하지만 파손 위험이 높습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 이사 견적 비교 시 주의해야 할 점은?</p>
          <p>견적 비교 시 서비스 범위(포장 포함 여부, 층수 추가 요금, 엘리베이터 사용료 등)가 동일한지 확인하세요. 지나치게 저렴한 업체는 추가 요금 청구나 부실 서비스 위험이 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 고층 아파트 이사 시 추가 요금이 있나요?</p>
          <p>엘리베이터가 없거나 크기가 작으면 사다리차 비용(7~12만원)이 추가됩니다. 고층(15층 이상)이나 계단 이용 시 층수 추가 요금이 붙을 수 있으니 사전에 확인하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 이사 당일 취소 시 위약금이 있나요?</p>
          <p>공정거래위원회 표준약관에 따르면 이사 2일 전 취소 시 계약금 환급, 당일 취소는 계약금의 50%, 이사 시작 후 취소는 견적의 25%를 위약금으로 부담합니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/moving-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
