"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type HospitalType = "의원" | "병원" | "종합병원" | "상급종합병원";
type VisitType = "외래" | "입원" | "응급";

// 본인부담률 테이블 (%)
const COPAY_RATES: Record<HospitalType, Record<VisitType, number>> = {
  의원: { 외래: 30, 입원: 20, 응급: 60 },
  병원: { 외래: 40, 입원: 20, 응급: 60 },
  종합병원: { 외래: 50, 입원: 20, 응급: 70 },
  상급종합병원: { 외래: 60, 입원: 20, 응급: 80 },
};

const HOSPITAL_TYPES: HospitalType[] = ["의원", "병원", "종합병원", "상급종합병원"];
const VISIT_TYPES: VisitType[] = ["외래", "입원", "응급"];

function formatWon(n: number): string {
  return Math.round(n).toLocaleString() + "원";
}

export default function ClientPage() {
  const [hospitalType, setHospitalType] = useState<HospitalType>("의원");
  const [visitType, setVisitType] = useState<VisitType>("외래");
  const [totalCost, setTotalCost] = useState(100000);
  const [isCritical, setIsCritical] = useState(false);
  const [criticalRate, setCriticalRate] = useState(10); // 5 or 10

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    let copayRate = isCritical ? criticalRate : COPAY_RATES[hospitalType][visitType];
    const copayAmount = totalCost * (copayRate / 100);
    const insurancePays = totalCost - copayAmount;
    const saving = totalCost - copayAmount;

    return {
      copayRate,
      copayAmount,
      insurancePays,
      saving,
    };
  }, [hospitalType, visitType, totalCost, isCritical, criticalRate]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">병원비 계산기</h1>
      <p className="text-gray-600 mb-6">
        의료기관 종류와 진료 유형을 선택하고 총 진료비를 입력하면 건강보험 적용 후 실제 납부액을 계산합니다.
      </p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">진료 정보 입력</h2>
        <div className="flex flex-col gap-4">

          {/* 의료기관 종류 */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">의료기관 종류</label>
            <div className="grid grid-cols-4 gap-2">
              {HOSPITAL_TYPES.map((h) => (
                <button
                  key={h}
                  onClick={() => setHospitalType(h)}
                  className={`py-2 rounded text-sm font-bold border transition-colors ${hospitalType === h ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"}`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* 진료 종류 */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">진료 종류</label>
            <div className="grid grid-cols-3 gap-2">
              {VISIT_TYPES.map((v) => (
                <button
                  key={v}
                  onClick={() => setVisitType(v)}
                  className={`py-2 rounded text-sm font-bold border transition-colors ${visitType === v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* 총 진료비 */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">총 진료비 (원)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={totalCost}
                onChange={(e) => setTotalCost(Number(e.target.value))}
                onBlur={(e) => setTotalCost(Math.max(0, Number(e.target.value) || 0))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">원</span>
            </div>
          </div>

          {/* 산정특례 */}
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="critical"
                checked={isCritical}
                onChange={(e) => setIsCritical(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="critical" className="text-sm font-bold cursor-pointer">산정특례 적용 (중증질환)</label>
            </div>
            {isCritical && (
              <div className="flex gap-3 mt-2">
                <label className="flex items-center gap-1 text-sm cursor-pointer">
                  <input type="radio" name="criticalRate" value={5} checked={criticalRate === 5} onChange={() => setCriticalRate(5)} />
                  암·희귀질환 (5%)
                </label>
                <label className="flex items-center gap-1 text-sm cursor-pointer">
                  <input type="radio" name="criticalRate" value={10} checked={criticalRate === 10} onChange={() => setCriticalRate(10)} />
                  중증질환 (10%)
                </label>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">본인부담률</p>
            <p className="text-3xl font-bold text-blue-600">{result.copayRate}%</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">실제 납부액</p>
            <p className="text-2xl font-bold text-red-600">{formatWon(result.copayAmount)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between py-2 border-b text-sm">
            <span className="text-gray-500">총 진료비</span>
            <span className="font-bold">{formatWon(totalCost)}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-sm">
            <span className="text-gray-500">건강보험 부담</span>
            <span className="font-bold text-green-600">{formatWon(result.insurancePays)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-500">본인 부담 ({result.copayRate}%)</span>
            <span className="font-bold text-red-600">{formatWon(result.copayAmount)}</span>
          </div>
        </div>
      </section>

      {/* 본인부담률 기준표 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">의료기관별 본인부담률</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border text-left">의료기관</th>
                <th className="p-2 border text-center">외래</th>
                <th className="p-2 border text-center">입원</th>
                <th className="p-2 border text-center">응급</th>
              </tr>
            </thead>
            <tbody>
              {HOSPITAL_TYPES.map((h) => (
                <tr key={h} className={`border-b ${hospitalType === h ? "bg-blue-50 font-bold" : ""}`}>
                  <td className="p-2 border">{h}</td>
                  <td className="p-2 border text-center">{COPAY_RATES[h].외래}%</td>
                  <td className="p-2 border text-center">{COPAY_RATES[h].입원}%</td>
                  <td className="p-2 border text-center">{COPAY_RATES[h].응급}%</td>
                </tr>
              ))}
              <tr className="border-b bg-purple-50">
                <td className="p-2 border">산정특례 (암 등)</td>
                <td className="p-2 border text-center" colSpan={3}>5~10%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">※ 비급여 항목은 건강보험 적용 제외, 100% 본인 부담</p>
      </section>

      {/* 핵심 개념 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">건강보험 본인부담금 계산 방법</h2>
        <p className="mb-3">
          건강보험 가입자는 의료기관 이용 시 진료비 전액을 내지 않고 일정 비율(본인부담률)만 납부하며,
          나머지는 건강보험에서 부담합니다. 본인부담률은 의료기관 종류(의원·병원·종합병원·상급종합병원),
          진료 유형(외래·입원·응급)에 따라 다릅니다.
        </p>
        <p className="mb-3">
          산정특례 제도는 암, 희귀 질환 등 중증 질환자의 경제적 부담을 줄이기 위해 본인부담률을
          5~10%로 크게 낮추는 제도입니다. 공단에 등록하면 최대 5년간 혜택을 받을 수 있습니다.
          비급여 항목(MRI, 초음파, 선택 진료비 등)은 건강보험 적용이 안 되어 100% 본인 부담입니다.
        </p>
        <p>
          실손보험에 가입되어 있다면 본인부담금의 상당 부분을 추가로 보장받을 수 있습니다.
          다만 실손 보험금은 건강보험 적용 후 본인부담금 기준으로 산정되므로,
          건강보험 본인부담금을 먼저 계산하는 것이 중요합니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 의원과 병원의 차이는 무엇인가요?</p>
          <p>의원은 일반 동네 병원(30병상 미만), 병원은 30~99병상, 종합병원은 100병상 이상으로 여러 진료과가 있는 병원, 상급종합병원은 복잡하고 중증 질환 치료를 위한 대형 병원입니다. 의원에서 진료 후 상급 기관으로 의뢰받아야 입원이 용이합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 비급여 항목도 건강보험이 적용되나요?</p>
          <p>비급여 항목(특실료, 선택 진료비, 일부 MRI·초음파, 미용 목적 시술 등)은 건강보험 적용 대상이 아니므로 100% 본인 부담입니다. 의료비 청구 시 급여와 비급여를 구분하여 확인하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 본인부담금 상한제란 무엇인가요?</p>
          <p>과도한 의료비 부담을 방지하기 위해 연간 본인부담금이 소득 수준에 따른 상한액을 초과하면 초과분을 건강보험공단이 환급해주는 제도입니다. 상한액은 소득 분위별로 연간 87만원~780만원 수준입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 실손보험과 건강보험을 함께 활용하면?</p>
          <p>건강보험으로 일정 비율을 공제한 후, 실손의료보험으로 남은 본인부담금을 추가 보장받을 수 있습니다. 실손보험은 건강보험 급여 항목의 본인부담금(80~90% 보장)과 일부 비급여 항목을 커버합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 응급실 이용 시 왜 본인부담률이 높나요?</p>
          <p>경증 환자의 응급실 이용을 억제하고 중증 응급 환자에게 의료자원이 집중되도록 경증 환자의 응급실 본인부담률을 높게 설정합니다. 일반 진료로 해결 가능한 경우 응급실보다 일반 외래 진료를 권장합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 산정특례는 어떻게 신청하나요?</p>
          <p>주치의가 중증질환(암, 희귀질환 등)으로 진단하면 건강보험공단에 산정특례를 등록합니다. 등록 후 다음 진료부터 낮은 본인부담률이 적용됩니다. 국민건강보험 홈페이지나 병원 원무과에 문의하세요.</p>
        </div>
      </section>

      <RelatedCalculators current="/hospital-calc" />

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
