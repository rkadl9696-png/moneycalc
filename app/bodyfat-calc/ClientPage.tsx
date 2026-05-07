"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

interface Grade {
  label: string;
  color: string;
  bg: string;
  border: string;
  range: string;
}

function getGrade(bf: number, gender: "male" | "female"): Grade {
  if (gender === "male") {
    if (bf < 6)  return { label: "필수지방", color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-400",   range: "2~5%" };
    if (bf < 14) return { label: "운동선수", color: "text-green-600",  bg: "bg-green-50",  border: "border-green-400",  range: "6~13%" };
    if (bf < 18) return { label: "건강",     color: "text-teal-600",   bg: "bg-teal-50",   border: "border-teal-400",   range: "14~17%" };
    if (bf < 25) return { label: "허용",     color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-400", range: "18~24%" };
    return               { label: "비만",     color: "text-red-600",    bg: "bg-red-50",    border: "border-red-400",    range: "25% 이상" };
  } else {
    if (bf < 14) return { label: "필수지방", color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-400",   range: "10~13%" };
    if (bf < 21) return { label: "운동선수", color: "text-green-600",  bg: "bg-green-50",  border: "border-green-400",  range: "14~20%" };
    if (bf < 25) return { label: "건강",     color: "text-teal-600",   bg: "bg-teal-50",   border: "border-teal-400",   range: "21~24%" };
    if (bf < 32) return { label: "허용",     color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-400", range: "25~31%" };
    return               { label: "비만",     color: "text-red-600",    bg: "bg-red-50",    border: "border-red-400",    range: "32% 이상" };
  }
}

const MALE_GRADES = [
  { label: "필수지방", range: "2~5%",    color: "text-blue-600" },
  { label: "운동선수", range: "6~13%",   color: "text-green-600" },
  { label: "건강",     range: "14~17%",  color: "text-teal-600" },
  { label: "허용",     range: "18~24%",  color: "text-yellow-600" },
  { label: "비만",     range: "25% 이상",color: "text-red-600" },
];
const FEMALE_GRADES = [
  { label: "필수지방", range: "10~13%",  color: "text-blue-600" },
  { label: "운동선수", range: "14~20%",  color: "text-green-600" },
  { label: "건강",     range: "21~24%",  color: "text-teal-600" },
  { label: "허용",     range: "25~31%",  color: "text-yellow-600" },
  { label: "비만",     range: "32% 이상",color: "text-red-600" },
];

export default function ClientPage() {
  const [gender, setGender]   = useState<"male" | "female">("male");
  const [height, setHeight]   = useState(175);
  const [weight, setWeight]   = useState(75);
  const [waist, setWaist]     = useState(85);
  const [neck, setNeck]       = useState(38);
  const [hip, setHip]         = useState(95);

  const r = useMemo(() => {
    if (waist <= neck) return null;
    if (gender === "female" && waist + hip <= neck) return null;

    let bf: number;
    if (gender === "male") {
      bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    } else {
      bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
    }
    if (bf < 0 || bf > 70) return null;

    const grade = getGrade(bf, gender);
    const fatMass = (weight * bf) / 100;
    const leanMass = weight - fatMass;

    return { bf, grade, fatMass, leanMass };
  }, [gender, height, weight, waist, neck, hip]);

  const gradeTable = gender === "male" ? MALE_GRADES : FEMALE_GRADES;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">체지방률 계산기</h1>
      <p className="text-gray-600 mb-6">
        미해군(U.S. Navy) 공식으로 체지방률을 계산합니다. 줄자 하나로 측정할 수 있는 가장 간편한 방법입니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">신체 측정 입력</h2>

        {/* 성별 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">성별</label>
          <div className="flex gap-3">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-2 rounded-lg border-2 font-bold text-sm transition-colors ${
                  gender === g
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {g === "male" ? "남성" : "여성"}
              </button>
            ))}
          </div>
        </div>

        {/* 키·몸무게 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">키 (cm)</label>
            <input
              type="number" min={100} max={250} value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              onBlur={(e) => setHeight(Math.min(250, Math.max(100, Number(e.target.value) || 100)))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">몸무게 (kg)</label>
            <input
              type="number" min={20} max={300} value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              onBlur={(e) => setWeight(Math.min(300, Math.max(20, Number(e.target.value) || 20)))}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* 허리·목 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">허리둘레 (cm)</label>
            <input
              type="number" min={40} max={200} value={waist}
              onChange={(e) => setWaist(Number(e.target.value))}
              onBlur={(e) => setWaist(Math.min(200, Math.max(40, Number(e.target.value) || 40)))}
              className="w-full border p-2 rounded"
            />
            <p className="text-xs text-gray-400 mt-1">배꼽 높이 기준</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">목둘레 (cm)</label>
            <input
              type="number" min={20} max={80} value={neck}
              onChange={(e) => setNeck(Number(e.target.value))}
              onBlur={(e) => setNeck(Math.min(80, Math.max(20, Number(e.target.value) || 20)))}
              className="w-full border p-2 rounded"
            />
            <p className="text-xs text-gray-400 mt-1">후두골 아래 기준</p>
          </div>
        </div>

        {/* 여성 엉덩이 */}
        {gender === "female" && (
          <div>
            <label className="block text-sm text-gray-500 mb-1">엉덩이둘레 (cm)</label>
            <input
              type="number" min={50} max={200} value={hip}
              onChange={(e) => setHip(Number(e.target.value))}
              onBlur={(e) => setHip(Math.min(200, Math.max(50, Number(e.target.value) || 50)))}
              className="w-full border p-2 rounded"
            />
            <p className="text-xs text-gray-400 mt-1">가장 넓은 부위 기준</p>
          </div>
        )}
      </section>

      {/* 결과 */}
      {r ? (
        <>
          <section className={`rounded-xl border-2 p-5 mb-5 ${r.grade.bg} ${r.grade.border}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500 mb-0.5">체지방률</p>
                <p className={`text-4xl font-bold ${r.grade.color}`}>{r.bf.toFixed(1)}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-0.5">판정</p>
                <p className={`text-2xl font-bold ${r.grade.color}`}>{r.grade.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{gender === "male" ? "남성" : "여성"} {r.grade.range}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-0.5">체지방량</p>
                <p className={`text-xl font-bold ${r.grade.color}`}>{r.fatMass.toFixed(1)} kg</p>
              </div>
              <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-0.5">제지방량 (근육+뼈+장기)</p>
                <p className="text-xl font-bold text-gray-700">{r.leanMass.toFixed(1)} kg</p>
              </div>
            </div>
          </section>

          {/* 판정 기준표 */}
          <section className="border rounded-lg p-4 mb-8">
            <h2 className="text-base font-bold mb-3">체지방률 판정 기준 ({gender === "male" ? "남성" : "여성"})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 border-b font-bold">구분</th>
                    <th className="text-right p-3 border-b font-bold">체지방률 범위</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeTable.map(({ label, range, color }) => (
                    <tr
                      key={label}
                      className={`border-b last:border-b-0 ${r.grade.label === label ? "bg-gray-50 font-bold" : ""}`}
                    >
                      <td className={`p-3 font-bold ${color}`}>{label}</td>
                      <td className="text-right p-3 text-gray-600">{range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="font-bold text-yellow-700">⚠️ 입력값 확인 필요</p>
          <p className="text-sm text-yellow-600 mt-1">허리둘레는 목둘레보다 커야 합니다. 측정값을 다시 확인해주세요.</p>
        </section>
      )}

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">미해군 체지방률 계산 공식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          남성: 86.010 × log₁₀(허리−목) − 70.041 × log₁₀(키) + 36.76<br />
          여성: 163.205 × log₁₀(허리+엉덩이−목) − 97.684 × log₁₀(키) − 78.387
        </div>
        <p className="mb-3">
          미해군(U.S. Navy) 공식은 줄자만으로 체지방률을 추정하는 방법으로,
          DEXA나 수중체중법보다 정확도는 낮지만 가정에서 간편하게 활용할 수 있습니다.
          오차 범위는 약 ±3~4%p입니다.
        </p>
        <p>
          정확한 측정을 위해 아침 공복 상태에서 줄자가 피부를 살짝 조이도록 하여 측정하세요.
          같은 조건에서 주기적으로 측정하면 변화 추이를 파악하는 데 유용합니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 허리둘레는 어디서 재나요?</p>
          <p>배꼽 높이(가장 좁은 부위)에서 수평으로 측정합니다. 숨을 내쉰 상태에서 자연스럽게 잰 값을 사용하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 목둘레는 어디서 재나요?</p>
          <p>후두골(뒷머리 뼈) 바로 아래에서 수평으로 측정합니다. 턱 아래가 아닌 목의 가장 좁은 부위입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. DEXA와 차이가 많이 나나요?</p>
          <p>개인차가 있지만 ±3~4%p 오차가 일반적입니다. 절대값보다 주기적 변화 추이를 확인하는 용도로 사용하면 유용합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 여성의 필수지방이 남성보다 높은 이유는?</p>
          <p>여성은 호르몬 기능, 임신·수유 준비를 위해 생리적으로 더 많은 지방이 필요합니다. 이 지방은 유방, 골반, 허벅지 등에 분포합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 체지방률이 낮을수록 건강한가요?</p>
          <p>필수지방 아래로 떨어지면 오히려 건강에 해롭습니다. 호르몬 불균형, 면역 저하, 뼈 밀도 감소 등의 문제가 생길 수 있습니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/bodyfat-calc" />

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
