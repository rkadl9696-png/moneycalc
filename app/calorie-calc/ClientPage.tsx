"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const ACTIVITY_LEVELS = [
  { label: "거의 안 움직임",           desc: "사무직·하루 종일 앉아서 생활", multiplier: 1.2 },
  { label: "가벼운 운동 (주 1~3회)",   desc: "가벼운 걷기·스트레칭",         multiplier: 1.375 },
  { label: "보통 운동 (주 3~5회)",     desc: "조깅·수영·자전거",             multiplier: 1.55 },
  { label: "강한 운동 (주 6~7회)",     desc: "고강도 운동·육체노동",         multiplier: 1.725 },
  { label: "매우 강한 운동",           desc: "하루 2회 운동·운동선수",       multiplier: 1.9 },
];

const GOALS = [
  { label: "체중 감량", delta: -500, color: "text-blue-600",  bg: "bg-blue-50",  border: "border-blue-400" },
  { label: "체중 유지", delta: 0,    color: "text-green-600", bg: "bg-green-50", border: "border-green-400" },
  { label: "체중 증량", delta: 500,  color: "text-red-600",   bg: "bg-red-50",   border: "border-red-400" },
];

export default function ClientPage() {
  const [gender, setGender]     = useState<"male" | "female">("male");
  const [age, setAge]           = useState(30);
  const [height, setHeight]     = useState(170);
  const [weight, setWeight]     = useState(70);
  const [activityIdx, setActivityIdx] = useState(1);
  const [goalIdx, setGoalIdx]   = useState(1);

  const r = useMemo(() => {
    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const multiplier = ACTIVITY_LEVELS[activityIdx].multiplier;
    const tdee = Math.round(bmr * multiplier);
    const goal = GOALS[goalIdx];
    const target = tdee + goal.delta;

    const protein = Math.round(weight * 1.6);
    const fat     = Math.round((target * 0.25) / 9);
    const carb    = Math.round((target - protein * 4 - fat * 9) / 4);

    return { bmr: Math.round(bmr), tdee, target, protein, fat, carb };
  }, [gender, age, height, weight, activityIdx, goalIdx]);

  const goal = GOALS[goalIdx];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">칼로리 계산기</h1>
      <p className="text-gray-600 mb-6">
        성별·나이·키·몸무게와 활동 수준을 입력하면 기초대사량(BMR)과 일일 권장 칼로리를 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">신체 정보 입력</h2>

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

        {/* 나이·키·몸무게 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">나이</label>
            <div className="flex items-center gap-1">
              <input
                type="number" min={10} max={100} value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                onBlur={(e) => setAge(Math.min(100, Math.max(10, Number(e.target.value) || 10)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">세</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">키</label>
            <div className="flex items-center gap-1">
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
            <label className="block text-sm text-gray-500 mb-1">몸무게</label>
            <div className="flex items-center gap-1">
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

        {/* 활동 수준 */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">활동 수준</label>
          <div className="flex flex-col gap-2">
            {ACTIVITY_LEVELS.map((a, i) => (
              <button
                key={i}
                onClick={() => setActivityIdx(i)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg border-2 text-left transition-colors ${
                  activityIdx === i
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div>
                  <p className={`text-sm font-bold ${activityIdx === i ? "text-blue-700" : "text-gray-700"}`}>
                    {a.label}
                  </p>
                  <p className="text-xs text-gray-400">{a.desc}</p>
                </div>
                <span className={`text-xs font-mono ${activityIdx === i ? "text-blue-500" : "text-gray-400"}`}>
                  ×{a.multiplier}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 기초대사량 결과 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-3">기초대사량 (BMR)</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-0.5">하루 가만히 있어도 소비되는 칼로리</p>
            <p className="text-3xl font-bold text-gray-800">{r.bmr.toLocaleString()} <span className="text-lg font-normal text-gray-500">kcal</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-0.5">활동 대사량 (TDEE)</p>
            <p className="text-2xl font-bold text-blue-600">{r.tdee.toLocaleString()} <span className="text-base font-normal text-gray-500">kcal</span></p>
          </div>
        </div>
      </section>

      {/* 목표 선택 및 권장 칼로리 */}
      <section className={`rounded-xl border-2 p-5 mb-5 ${goal.bg} ${goal.border}`}>
        <h2 className="text-base font-bold mb-3">목표별 권장 칼로리</h2>
        <div className="flex gap-2 mb-4">
          {GOALS.map((g, i) => (
            <button
              key={i}
              onClick={() => setGoalIdx(i)}
              className={`flex-1 py-2 rounded-lg border-2 font-bold text-sm transition-colors ${
                goalIdx === i
                  ? `${g.border} ${g.bg} ${g.color}`
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">
            {goal.label === "체중 감량" ? "TDEE − 500kcal" : goal.label === "체중 증량" ? "TDEE + 500kcal" : "TDEE 유지"}
          </p>
          <p className={`text-4xl font-bold ${goal.color}`}>
            {r.target.toLocaleString()}
            <span className="text-xl font-normal text-gray-500 ml-1">kcal/일</span>
          </p>
          {goal.delta !== 0 && (
            <p className="text-xs text-gray-400 mt-1">
              주당 약 {Math.abs(goal.delta * 7 / 7700).toFixed(2)}kg {goal.delta < 0 ? "감량" : "증량"} 가능
            </p>
          )}
        </div>
      </section>

      {/* 3대 영양소 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">권장 3대 영양소 (목표 기준)</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">단백질</p>
            <p className="text-xl font-bold text-red-600">{r.protein}g</p>
            <p className="text-xs text-gray-400 mt-0.5">{r.protein * 4} kcal</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">지방</p>
            <p className="text-xl font-bold text-yellow-600">{r.fat}g</p>
            <p className="text-xs text-gray-400 mt-0.5">{r.fat * 9} kcal</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">탄수화물</p>
            <p className="text-xl font-bold text-green-600">{r.carb}g</p>
            <p className="text-xs text-gray-400 mt-0.5">{r.carb * 4} kcal</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">* 단백질 체중 × 1.6g, 지방 총칼로리의 25%, 나머지 탄수화물</p>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">칼로리 계산 방식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          BMR (남) = 10×체중 + 6.25×키 − 5×나이 + 5<br />
          BMR (여) = 10×체중 + 6.25×키 − 5×나이 − 161<br />
          TDEE = BMR × 활동계수
        </div>
        <p className="mb-3">
          기초대사량(BMR)은 아무것도 하지 않아도 생명 유지를 위해 소비되는 칼로리입니다.
          여기에 활동 수준에 따른 계수를 곱한 값이 실제 하루 총 에너지 소비량(TDEE)입니다.
        </p>
        <p>
          체중 감량 시에는 TDEE보다 약 500kcal 적게 섭취하면 일주일에 약 0.45kg 감량이 가능합니다.
          급격한 칼로리 제한은 근육 손실을 유발하므로 권장하지 않습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. Mifflin-St Jeor 공식이 정확한가요?</p>
          <p>현재 가장 널리 사용되는 공식으로, 일반 성인에게 비교적 정확합니다. 다만 체지방률이 높거나 근육량이 많은 경우 오차가 생길 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 활동 수준은 어떻게 선택하나요?</p>
          <p>운동 외에도 직업적 활동을 포함해 선택하세요. 사무직이라면 주 3~5회 운동을 해도 "보통 운동" 수준이 적합합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 하루 최소 칼로리는 얼마인가요?</p>
          <p>일반적으로 여성 1,200kcal, 남성 1,500kcal 미만으로는 섭취하지 않는 것이 좋습니다. 과도한 칼로리 제한은 기초대사량 저하와 근육 손실을 유발합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 단백질을 왜 체중 × 1.6g으로 계산하나요?</p>
          <p>운동하는 성인 기준 근육 유지 및 합성에 필요한 권장량입니다. 비활동적인 경우 체중 × 0.8g으로 줄여도 됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 체중 증량 시 500kcal 추가가 맞나요?</p>
          <p>주당 0.3~0.5kg 증량을 목표로 할 때 적합합니다. 근육 증가를 원한다면 충분한 단백질 섭취와 함께 저항 운동을 병행하세요.</p>
        </div>
      </section>

      <RelatedCalculators current="/calorie-calc" />

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
