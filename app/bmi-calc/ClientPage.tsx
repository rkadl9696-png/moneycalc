"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

interface BmiGrade {
  label: string;
  color: string;        // 텍스트 색상
  bg: string;           // 배경 색상
  border: string;       // 테두리 색상
  range: string;
}

function getGrade(bmi: number): BmiGrade {
  if (bmi < 18.5)  return { label: "저체중",  color: "text-blue-600",  bg: "bg-blue-50",  border: "border-blue-400",  range: "18.5 미만" };
  if (bmi < 23)    return { label: "정상",    color: "text-green-600", bg: "bg-green-50", border: "border-green-400", range: "18.5 ~ 22.9" };
  if (bmi < 25)    return { label: "과체중",  color: "text-yellow-600",bg: "bg-yellow-50",border: "border-yellow-400",range: "23 ~ 24.9" };
  if (bmi < 30)    return { label: "비만",    color: "text-orange-600",bg: "bg-orange-50",border: "border-orange-400",range: "25 ~ 29.9" };
  return             { label: "고도비만", color: "text-red-600",   bg: "bg-red-50",   border: "border-red-400",   range: "30 이상" };
}

// BMI 바 위의 위치 (0~100%)
function bmiToPercent(bmi: number): number {
  return Math.min(100, Math.max(0, ((bmi - 10) / (40 - 10)) * 100));
}

export default function ClientPage() {
  const [height, setHeight] = useState(170); // cm
  const [weight, setWeight] = useState(65);  // kg

  const r = useMemo(() => {
    const h = height / 100; // m
    const bmi = weight / (h * h);
    const grade = getGrade(bmi);
    const minWeight = 18.5 * h * h;
    const maxWeight = 22.9 * h * h;
    const diffFromNormal = bmi < 18.5
      ? minWeight - weight
      : bmi >= 23
      ? weight - maxWeight
      : 0;
    return { bmi, grade, minWeight, maxWeight, diffFromNormal };
  }, [height, weight]);

  const grades = [
    { label: "저체중",  range: "~18.4", color: "bg-blue-400",   flex: 1 },
    { label: "정상",    range: "18.5~22.9", color: "bg-green-400",  flex: 1.5 },
    { label: "과체중",  range: "23~24.9", color: "bg-yellow-400", flex: 0.8 },
    { label: "비만",    range: "25~29.9", color: "bg-orange-400", flex: 1.5 },
    { label: "고도비만",range: "30~", color: "bg-red-400",    flex: 1 },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        scroll={false}
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">BMI 계산기</h1>
      <p className="text-gray-600 mb-6">
        키와 몸무게를 입력하면 체질량지수(BMI)와 정상 체중 범위를 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">신체 정보 입력</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">키 (cm)</label>
            <div className="flex items-center gap-2">
              <input
                type="number" min={100} max={250} value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                onBlur={(e) => setHeight(Math.min(250, Math.max(100, Number(e.target.value) || 100)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">cm</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">몸무게 (kg)</label>
            <div className="flex items-center gap-2">
              <input
                type="number" min={20} max={300} value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                onBlur={(e) => setWeight(Math.min(300, Math.max(20, Number(e.target.value) || 20)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">kg</span>
            </div>
          </div>
        </div>
      </section>

      {/* 결과 */}
      <section className={`rounded-xl border-2 p-5 mb-5 ${r.grade.bg} ${r.grade.border}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500 mb-0.5">내 BMI</p>
            <p className={`text-4xl font-bold ${r.grade.color}`}>{r.bmi.toFixed(1)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-0.5">판정</p>
            <p className={`text-2xl font-bold ${r.grade.color}`}>{r.grade.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">BMI {r.grade.range}</p>
          </div>
        </div>

        {r.diffFromNormal > 0 && (
          <p className={`text-sm font-medium mt-2 ${r.grade.color}`}>
            {r.bmi < 18.5
              ? `정상 체중까지 약 ${r.diffFromNormal.toFixed(1)}kg 더 필요합니다.`
              : `정상 체중 범위까지 약 ${r.diffFromNormal.toFixed(1)}kg 감량이 필요합니다.`}
          </p>
        )}
        {r.diffFromNormal === 0 && (
          <p className="text-sm font-medium mt-2 text-green-600">
            정상 체중 범위 내에 있습니다.
          </p>
        )}
      </section>

      {/* BMI 바 */}
      <section className="mb-5">
        <div className="flex rounded-full overflow-hidden h-4 mb-1">
          {grades.map((g) => (
            <div
              key={g.label}
              className={`${g.color} h-full`}
              style={{ flex: g.flex }}
            />
          ))}
        </div>
        {/* 마커 */}
        <div className="relative h-3">
          <div
            className="absolute top-0 w-0.5 h-3 bg-gray-800"
            style={{ left: `${bmiToPercent(r.bmi)}%`, transform: "translateX(-50%)" }}
          />
        </div>
        <div className="flex text-xs text-gray-400 mt-1">
          <span style={{ flex: 1 }}>저체중</span>
          <span style={{ flex: 1.5 }}>정상</span>
          <span style={{ flex: 0.8 }}>과체중</span>
          <span style={{ flex: 1.5 }}>비만</span>
          <span style={{ flex: 1 }}>고도비만</span>
        </div>
      </section>

      {/* 정상 체중 범위 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">키 {height}cm 기준 정상 체중 범위</h2>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">최소 (BMI 18.5)</p>
            <p className="text-xl font-bold text-green-600">{r.minWeight.toFixed(1)} kg</p>
          </div>
          <div className="text-gray-300 text-2xl">~</div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">최대 (BMI 22.9)</p>
            <p className="text-xl font-bold text-green-600">{r.maxWeight.toFixed(1)} kg</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          현재 {weight}kg — 정상 범위까지{" "}
          {weight < r.minWeight
            ? `+${(r.minWeight - weight).toFixed(1)}kg`
            : weight > r.maxWeight
            ? `-${(weight - r.maxWeight).toFixed(1)}kg`
            : "✓ 정상"}
        </p>
      </section>

      {/* 판정 기준표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">BMI 판정 기준 (아시아 기준)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">BMI 범위</th>
                <th className="text-center p-3 border-b font-bold">판정</th>
                <th className="text-right p-3 border-b font-bold">{height}cm 체중</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: "18.5 미만",  label: "저체중",  color: "text-blue-600",   bmiMin: 10,   bmiMax: 18.5 },
                { range: "18.5 ~ 22.9",label: "정상",   color: "text-green-600",  bmiMin: 18.5, bmiMax: 23 },
                { range: "23 ~ 24.9",  label: "과체중", color: "text-yellow-600", bmiMin: 23,   bmiMax: 25 },
                { range: "25 ~ 29.9",  label: "비만",   color: "text-orange-600", bmiMin: 25,   bmiMax: 30 },
                { range: "30 이상",    label: "고도비만",color: "text-red-600",    bmiMin: 30,   bmiMax: 50 },
              ].map(({ range, label, color, bmiMin, bmiMax }) => {
                const h = height / 100;
                const wMin = (bmiMin * h * h).toFixed(1);
                const wMax = bmiMax < 50 ? (bmiMax * h * h).toFixed(1) : null;
                return (
                  <tr
                    key={label}
                    className={`border-b last:border-b-0 ${r.grade.label === label ? "bg-gray-50 font-bold" : ""}`}
                  >
                    <td className="p-3">{range}</td>
                    <td className={`text-center p-3 font-bold ${color}`}>{label}</td>
                    <td className="text-right p-3 text-gray-600">
                      {wMax ? `${wMin} ~ ${wMax}kg` : `${wMin}kg 이상`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">* 아시아·태평양 기준 (WHO 서양인 기준과 다름)</p>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">BMI란?</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono">
          BMI = 체중(kg) ÷ 키(m)²
        </div>
        <p className="mb-3">
          BMI(Body Mass Index, 체질량지수)는 체중과 키의 비율로 비만도를 측정하는 지표입니다.
          아시아인 기준으로 23 이상이면 과체중, 25 이상이면 비만으로 분류됩니다.
          WHO 기준(서양인)은 25 이상을 과체중으로 보아 아시아 기준과 다릅니다.
        </p>
        <p>
          BMI는 간편한 지표지만 근육량이 많은 운동선수나 고령자, 임산부 등에게는
          정확하지 않을 수 있습니다. 정확한 체성분 분석은 의료 기관에서 받아보세요.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 아시아인 BMI 기준이 다른 이유는?</p>
          <p>같은 BMI라도 아시아인은 서양인보다 체지방 비율이 높고 당뇨·심혈관 질환 위험이 더 높게 나타나 WHO가 아시아인에게는 더 낮은 기준을 권장합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. BMI가 정상인데도 건강 문제가 생길 수 있나요?</p>
          <p>BMI가 정상이어도 복부 비만(내장지방)이 있는 경우 대사 질환 위험이 높을 수 있습니다. 허리둘레(남 90cm, 여 85cm 이상 복부비만)도 함께 확인하는 것이 좋습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 근육이 많으면 BMI가 높게 나오나요?</p>
          <p>네, BMI는 체지방과 근육을 구분하지 않습니다. 근육질 운동선수는 BMI가 과체중이나 비만으로 나와도 실제로는 건강한 체성분일 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 어린이에게도 같은 기준을 적용하나요?</p>
          <p>아니요, 어린이·청소년은 나이와 성별에 따른 성장 백분위수 기준을 사용합니다. 성인용 BMI 기준을 그대로 적용하면 안 됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 건강한 체중 감량 속도는 어느 정도인가요?</p>
          <p>일반적으로 주당 0.5~1kg 감량이 건강하고 지속 가능한 속도로 알려져 있습니다. 급격한 감량은 근육 손실과 요요 현상을 유발할 수 있습니다.</p>
        </div>
      </section>

      <RelatedCalculators />

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
