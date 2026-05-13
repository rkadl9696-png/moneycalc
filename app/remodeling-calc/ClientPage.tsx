"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type AreaUnit = "pyeong" | "sqm";

interface RemodelingItem {
  key: string;
  label: string;
  unit: string;
  perUnit: boolean; // true: 단가×면적, false: 개수 기반
  minRate: number;
  maxRate: number;
  countKey?: string;
}

const ITEMS: RemodelingItem[] = [
  { key: "wallpaper", label: "도배/장판", unit: "원/평", perUnit: true, minRate: 70_000, maxRate: 150_000 },
  { key: "bathroom", label: "욕실 공사", unit: "원/개", perUnit: false, minRate: 1_000_000, maxRate: 3_000_000 },
  { key: "kitchen", label: "주방 공사", unit: "원", perUnit: false, minRate: 1_500_000, maxRate: 4_000_000 },
  { key: "electrical", label: "전기/조명", unit: "원", perUnit: false, minRate: 300_000, maxRate: 800_000 },
  { key: "window", label: "창호 교체", unit: "원/개", perUnit: false, minRate: 600_000, maxRate: 1_500_000 },
  { key: "flooring", label: "바닥재", unit: "원/평", perUnit: true, minRate: 50_000, maxRate: 200_000 },
  { key: "insulation", label: "외벽 단열", unit: "원/평", perUnit: true, minRate: 150_000, maxRate: 300_000 },
  { key: "full", label: "전체 인테리어", unit: "원/평", perUnit: true, minRate: 500_000, maxRate: 1_500_000 },
];

export default function ClientPage() {
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("pyeong");
  const [areaPyeong, setAreaPyeong] = useState(25);
  const [areaSqm, setAreaSqm] = useState(83);
  const [selected, setSelected] = useState<Set<string>>(new Set(["wallpaper"]));
  const [bathroomCount, setBathroomCount] = useState(1);
  const [windowCount, setWindowCount] = useState(4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pyeong = areaUnit === "pyeong" ? areaPyeong : areaSqm / 3.3058;

  const toggleItem = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const result = useMemo(() => {
    let totalMin = 0;
    let totalMax = 0;
    const details: { label: string; min: number; max: number }[] = [];

    for (const item of ITEMS) {
      if (!selected.has(item.key)) continue;
      let min: number;
      let max: number;
      if (item.perUnit) {
        min = Math.round(item.minRate * pyeong);
        max = Math.round(item.maxRate * pyeong);
      } else if (item.key === "bathroom") {
        min = item.minRate * bathroomCount;
        max = item.maxRate * bathroomCount;
      } else if (item.key === "window") {
        min = item.minRate * windowCount;
        max = item.maxRate * windowCount;
      } else {
        min = item.minRate;
        max = item.maxRate;
      }
      totalMin += min;
      totalMax += max;
      details.push({ label: item.label, min, max });
    }

    return { details, totalMin, totalMax };
  }, [selected, pyeong, bathroomCount, windowCount]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">리모델링 비용 계산기</h1>
      <p className="text-gray-600 mb-6">
        면적과 공사 항목을 선택하면 예상 인테리어 비용 범위를 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">면적 입력</h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setAreaUnit("pyeong")}
            className={`flex-1 py-2 rounded border text-sm font-bold ${areaUnit === "pyeong" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
          >
            평 단위
          </button>
          <button
            onClick={() => setAreaUnit("sqm")}
            className={`flex-1 py-2 rounded border text-sm font-bold ${areaUnit === "sqm" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
          >
            ㎡ 단위
          </button>
        </div>

        {areaUnit === "pyeong" ? (
          <div>
            <label className="block text-sm text-gray-500 mb-1">면적 (평)</label>
            <input
              type="number"
              value={areaPyeong}
              onChange={(e) => setAreaPyeong(Number(e.target.value))}
              onBlur={(e) => setAreaPyeong(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm text-gray-500 mb-1">면적 (㎡)</label>
            <input
              type="number"
              value={areaSqm}
              onChange={(e) => setAreaSqm(Number(e.target.value))}
              onBlur={(e) => setAreaSqm(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded"
            />
            <p className="text-xs text-gray-400 mt-1">≈ {(areaSqm / 3.3058).toFixed(1)}평</p>
          </div>
        )}
      </section>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">공사 항목 선택 (복수 선택)</h2>
        <div className="space-y-3">
          {ITEMS.map((item) => (
            <div key={item.key}>
              <label className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selected.has(item.key)}
                  onChange={() => toggleItem(item.key)}
                  className="mt-0.5 rounded"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    {item.perUnit
                      ? `${item.minRate.toLocaleString()}~${item.maxRate.toLocaleString()}원/평`
                      : item.key === "bathroom" || item.key === "window"
                      ? `${item.minRate.toLocaleString()}~${item.maxRate.toLocaleString()}원/개`
                      : `${item.minRate.toLocaleString()}~${item.maxRate.toLocaleString()}원`}
                  </span>
                </div>
              </label>
              {selected.has(item.key) && item.key === "bathroom" && (
                <div className="ml-8 mt-1">
                  <label className="block text-xs text-gray-500 mb-1">욕실 개수</label>
                  <input
                    type="number"
                    value={bathroomCount}
                    onChange={(e) => setBathroomCount(Number(e.target.value))}
                    onBlur={(e) => setBathroomCount(Math.min(5, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-24 border p-1 rounded text-sm"
                  />
                </div>
              )}
              {selected.has(item.key) && item.key === "window" && (
                <div className="ml-8 mt-1">
                  <label className="block text-xs text-gray-500 mb-1">창호 개수</label>
                  <input
                    type="number"
                    value={windowCount}
                    onChange={(e) => setWindowCount(Number(e.target.value))}
                    onBlur={(e) => setWindowCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-24 border p-1 rounded text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">예상 리모델링 비용</h2>
        {result.details.length === 0 ? (
          <p className="text-gray-500 text-sm">공사 항목을 선택해주세요</p>
        ) : (
          <>
            <div className="space-y-2 text-sm mb-4">
              {result.details.map(({ label, min, max }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-bold">{min.toLocaleString()} ~ {max.toLocaleString()}원</span>
                </div>
              ))}
            </div>
            <div className="border-t border-blue-300 pt-3">
              <p className="text-sm text-gray-600 mb-1">예상 총 비용</p>
              <p className="text-2xl font-bold text-blue-700">
                {result.totalMin.toLocaleString()}원 ~ {result.totalMax.toLocaleString()}원
              </p>
              <p className="text-xs text-gray-500 mt-1">* 기준: 약 {pyeong.toFixed(1)}평 / 실제 견적은 업체 방문 후 확인</p>
            </div>
          </>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">리모델링 비용 산정 기준</h2>
        <p className="mb-3">
          리모델링 비용은 자재 등급, 시공업체, 지역, 건물 상태에 따라 큰 차이가 납니다. 이 계산기는 일반적인 시중 견적 범위를 기준으로 최솟값과 최댓값을 제시합니다. 도배·장판은 평당 7~15만원, 욕실 전체 교체는 100~300만원, 주방 공사는 150~400만원이 일반적입니다.
        </p>
        <p className="mb-3">
          전체 인테리어(풀 리모델링)의 경우 평당 50~150만원 수준이며, 구형 아파트 노후화 정도와 자재 선택에 따라 달라집니다. 창호 교체는 단창→이중창, PVC→시스템창 등 선택에 따라 개당 60~150만원입니다.
        </p>
        <p>
          인테리어 공사는 반드시 계약서를 작성하고, 단계별 공정 기준으로 중도금을 지급하는 방식을 권장합니다. 선금은 전체 금액의 30% 이내로 하고, 잔금은 공사 완료 확인 후 지급하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">리모델링 절세 및 자금 지원</h2>
        <p className="mb-3">
          주택 리모델링 시 에너지 효율 개선 공사(단열·창호 교체 등)에 대해 주택도시기금의 그린리모델링 이자 지원 사업을 활용할 수 있습니다. 저금리 대출로 자금 부담을 줄일 수 있습니다.
        </p>
        <p>
          노후 주택의 경우 지자체별 주거환경개선 사업이나 취약계층 지원 프로그램을 활용하면 비용을 지원받을 수 있습니다. 리모델링 후 양도 시 취득가 산정에 공사비를 포함할 수 있어 양도소득세 절감에도 도움이 됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 도배만 하는 비용은 얼마나 드나요?</p>
          <p>25평 기준 합지 도배는 30~50만원, 실크 도배는 50~100만원 수준입니다. 장판(PVC 장판)은 평당 2~5만원 추가됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 욕실 리모델링 기간은 얼마나 걸리나요?</p>
          <p>일반적인 욕실 전체 공사는 3~5일 소요됩니다. 타일, 변기, 세면대, 욕조·샤워기, 조명, 방수 공사 등이 포함됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 인테리어 업체 선정 시 확인해야 할 점은?</p>
          <p>사업자등록 여부, 실적(포트폴리오), 보증보험 가입 여부, 계약서 내 하자 보수 조항을 확인하세요. 3곳 이상 견적 비교가 필수입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전체 인테리어와 부분 리모델링 중 어느 것이 나은가요?</p>
          <p>한 번에 전체 공사하면 공정 간 연계가 좋고 비용이 절감됩니다. 부분 공사는 비용이 적게 들지만 후에 전체 공사 시 이미 완료한 부분을 다시 손대야 할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 공사 중 하자가 생기면 어떻게 하나요?</p>
          <p>인테리어 공사의 하자 보증 기간은 계약에 따라 다르나 보통 1~2년입니다. 하자 발생 시 업체에 즉시 서면(문자·이메일)으로 요청하고, 해결이 안 되면 소비자원에 신고하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 세입자가 리모델링할 수 있나요?</p>
          <p>임차인은 원칙적으로 구조 변경이나 시설 교체를 집주인 동의 없이 할 수 없습니다. 도배나 소규모 공사라도 분쟁을 예방하기 위해 집주인의 서면 동의를 받고 진행하세요.</p>
        </div>
      </section>

      <RelatedCalculators current="/remodeling-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
