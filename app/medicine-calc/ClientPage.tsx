"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

interface Drug {
  name: string;
  activeIngredient: string;
  adultDosePerKg: number;      // mg/kg per dose
  childDosePerKg: number;      // mg/kg per dose
  maxSingleAdult: number;      // mg, 1회 최대
  maxSingleChild: number;      // mg/kg, 1회 최대
  maxDailyAdult: number;       // mg, 1일 최대
  maxDailyChild: number;       // mg/kg, 1일 최대
  timesPerDay: number;
  childNote: string;
  adultNote: string;
}

const DRUGS: Drug[] = [
  {
    name: "타이레놀 (아세트아미노펜)",
    activeIngredient: "아세트아미노펜 (Acetaminophen)",
    adultDosePerKg: 10,
    childDosePerKg: 10,
    maxSingleAdult: 1000,
    maxSingleChild: 15,
    maxDailyAdult: 4000,
    maxDailyChild: 75,
    timesPerDay: 4,
    childNote: "4~6시간 간격, 1일 5회 초과 금지",
    adultNote: "4~6시간 간격, 1일 4,000mg 초과 금지 (음주 시 2,000mg)",
  },
  {
    name: "이부프로펜",
    activeIngredient: "이부프로펜 (Ibuprofen)",
    adultDosePerKg: 7,
    childDosePerKg: 7,
    maxSingleAdult: 800,
    maxSingleChild: 10,
    maxDailyAdult: 3200,
    maxDailyChild: 40,
    timesPerDay: 3,
    childNote: "6~8시간 간격, 6개월 미만 소아 금기",
    adultNote: "식사와 함께 복용 권장, 위장 장애 주의",
  },
  {
    name: "아스피린",
    activeIngredient: "아스피린 (Aspirin)",
    adultDosePerKg: 10,
    childDosePerKg: 0,
    maxSingleAdult: 1000,
    maxSingleChild: 0,
    maxDailyAdult: 4000,
    maxDailyChild: 0,
    timesPerDay: 4,
    childNote: "소아·청소년 원칙적 금기 (라이 증후군 위험)",
    adultNote: "18세 미만 원칙적 금기. 혈전 예방 목적엔 저용량(100mg) 사용",
  },
  {
    name: "항생제 (일반 페니실린계)",
    activeIngredient: "아목시실린 (Amoxicillin)",
    adultDosePerKg: 8,
    childDosePerKg: 12.5,
    maxSingleAdult: 500,
    maxSingleChild: 25,
    maxDailyAdult: 3000,
    maxDailyChild: 90,
    timesPerDay: 3,
    childNote: "처방전 없이 복용 금지. 8시간 간격",
    adultNote: "처방전 없이 복용 금지. 내성 예방을 위해 처방 기간 완료",
  },
  {
    name: "어린이 시럽 (아세트아미노펜 160mg/5mL)",
    activeIngredient: "아세트아미노펜 (Acetaminophen)",
    adultDosePerKg: 0,
    childDosePerKg: 10,
    maxSingleAdult: 0,
    maxSingleChild: 15,
    maxDailyAdult: 0,
    maxDailyChild: 75,
    timesPerDay: 4,
    childNote: "160mg/5mL 기준 시럽량 = (체중×10mg÷160mg)×5mL. 4~6시간 간격",
    adultNote: "성인 전용 제품 사용 권장",
  },
];

export default function ClientPage() {
  const [weight, setWeight] = useState(10);
  const [ageGroup, setAgeGroup] = useState<"adult" | "child">("child");
  const [drugIdx, setDrugIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const drug = DRUGS[drugIdx];
    const isChild = ageGroup === "child";

    if (isChild) {
      if (drug.childDosePerKg === 0) return { isForbidden: true, drug };
      const singleDose = Math.min(weight * drug.childDosePerKg, weight * drug.maxSingleChild);
      const maxDaily = Math.min(weight * drug.maxDailyChild, weight * drug.maxSingleChild * drug.timesPerDay);
      let syrupMl: number | null = null;
      if (drug.name.includes("시럽")) {
        syrupMl = (singleDose / 160) * 5;
      }
      return { isForbidden: false, drug, singleDose, maxDaily, syrupMl, isChild };
    } else {
      const singleDose = Math.min(weight * drug.adultDosePerKg, drug.maxSingleAdult);
      const maxDaily = Math.min(drug.maxSingleAdult * drug.timesPerDay, drug.maxDailyAdult);
      return { isForbidden: false, drug, singleDose, maxDaily, syrupMl: null, isChild };
    }
  }, [weight, ageGroup, drugIdx]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">약 용량 계산기</h1>
      <p className="text-gray-600 mb-6">
        체중과 약물 종류를 선택하면 체중 기준 1회 복용량과 1일 최대 복용량을 계산합니다.
      </p>

      {/* 중요 면책 문구 */}
      <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-5 text-sm text-red-800 font-bold">
        ⚠️ 이 계산기는 참고용입니다. 반드시 의사·약사의 처방과 지시에 따라 복용하세요. 자의적인 용량 조절은 위험할 수 있습니다.
      </div>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">정보 입력</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">성인/소아 구분</label>
            <div className="grid grid-cols-2 gap-2">
              {(["adult", "child"] as const).map((ag) => (
                <button
                  key={ag}
                  onClick={() => setAgeGroup(ag)}
                  className={`py-2 rounded text-sm font-bold border transition-colors ${ageGroup === ag ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"}`}
                >
                  {ag === "adult" ? "성인 (18세 이상)" : "소아 (18세 미만)"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">체중 (kg)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                onBlur={(e) => setWeight(Math.min(200, Math.max(1, Number(e.target.value) || 1)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">kg</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">약물 종류</label>
            <select
              value={drugIdx}
              onChange={(e) => setDrugIdx(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              {DRUGS.map((d, idx) => (
                <option key={idx} value={idx}>{d.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">성분: {DRUGS[drugIdx].activeIngredient}</p>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        {result.isForbidden ? (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-center">
            <p className="text-red-600 font-bold text-lg mb-1">⛔ 해당 약물은 소아에게 금기입니다</p>
            <p className="text-sm text-red-500">{result.drug.childNote}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">1회 복용량</p>
                <p className="text-3xl font-bold text-blue-600">
                  {result.singleDose !== undefined ? result.singleDose.toFixed(0) : "-"}
                  <span className="text-sm font-normal ml-1">mg</span>
                </p>
                {result.syrupMl && (
                  <p className="text-sm text-green-600 mt-1">시럽 {result.syrupMl.toFixed(1)}mL</p>
                )}
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">1일 최대</p>
                <p className="text-3xl font-bold text-purple-600">
                  {result.maxDaily !== undefined ? result.maxDaily.toFixed(0) : "-"}
                  <span className="text-sm font-normal ml-1">mg</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">{result.drug.timesPerDay}회 분할</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm font-bold mb-1">복용 주의사항</p>
              <p className="text-sm text-gray-600">{result.isChild ? result.drug.childNote : result.drug.adultNote}</p>
            </div>
          </>
        )}
      </section>

      {/* 핵심 개념 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">약 용량 계산 방법</h2>
        <p className="mb-3">
          소아 약물 용량은 성인과 달리 체중(kg)을 기준으로 계산합니다. 소아는 체중 1kg당 몇 mg이라는
          방식(mg/kg)으로 용량을 결정하며, 성인의 용량을 그대로 주면 과다 복용이 될 수 있습니다.
          반면 성인은 체중과 관계없이 일정 용량을 복용하는 경우가 많습니다.
        </p>
        <p className="mb-3">
          타이레놀(아세트아미노펜)은 가장 안전한 해열진통제로 알려져 있으나, 1일 최대 용량을 초과하면
          간 손상을 유발할 수 있습니다. 이부프로펜은 소염 효과가 있으나 6개월 미만 영아, 신장 질환자,
          소화성 궤양 환자에게는 주의가 필요합니다.
        </p>
        <p>
          이 계산기는 일반적인 참고 용량을 제공하며, 실제 복용량은 환자의 건강 상태, 다른 약물과의 상호작용,
          의사·약사의 처방에 따라 달라질 수 있습니다. 반드시 전문가의 지시에 따르세요.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 타이레놀과 이부프로펜을 함께 복용해도 되나요?</p>
          <p>두 약물은 성분이 다르므로 의사의 지시에 따라 교차 복용이 가능한 경우도 있습니다. 그러나 자의적인 복합 복용은 위험할 수 있으니 반드시 의사나 약사에게 확인하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 어린이에게 아스피린을 먹이면 안 되는 이유는?</p>
          <p>소아·청소년에게 아스피린을 투여하면 라이 증후군(Reye Syndrome)이라는 심각한 간 및 뇌 손상을 유발할 수 있습니다. 따라서 18세 미만에게는 아스피린 사용이 원칙적으로 금기입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 해열제를 먹었는데 열이 안 내려가면 어떻게 하나요?</p>
          <p>복용 후 1~2시간이 지나도 열이 내려가지 않으면 의료기관을 방문하세요. 특히 3개월 미만 영아의 발열, 38.5도 이상의 고열, 발열과 함께 다른 증상이 있으면 즉시 진료를 받아야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 약 복용 간격은 얼마나 지켜야 하나요?</p>
          <p>타이레놀은 4~6시간 간격, 이부프로펜은 6~8시간 간격을 권장합니다. 간격을 지키지 않으면 과다 복용으로 이어질 수 있습니다. 다음 복용 시간을 메모해두는 것이 좋습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 어린이 시럽 용량 계산이 어려운 이유는?</p>
          <p>어린이 해열 시럽은 농도가 160mg/5mL 등 다양하며, 체중에 따라 mL를 계산해야 합니다. 제품마다 농도가 다를 수 있으니 약 포장의 용량표를 우선 확인하고, 동봉된 계량컵이나 주사기를 사용하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 항생제는 처방 없이 먹어도 되나요?</p>
          <p>항생제는 반드시 의사의 처방이 필요합니다. 처방 없이 임의로 복용하면 내성균이 생기고 치료 효과가 떨어질 수 있습니다. 처방받은 경우에도 증상이 나아져도 처방 기간을 완료해야 합니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/medicine-calc" />

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
