"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const exercises = [
  { label: "걷기(느리게)", met: 2.8 },
  { label: "걷기(빠르게)", met: 4.3 },
  { label: "달리기(6km/h)", met: 6.0 },
  { label: "달리기(10km/h)", met: 10.0 },
  { label: "자전거(느리게)", met: 4.0 },
  { label: "자전거(빠르게)", met: 8.0 },
  { label: "수영", met: 6.0 },
  { label: "줄넘기", met: 10.0 },
  { label: "등산", met: 6.0 },
  { label: "헬스(웨이트)", met: 4.0 },
  { label: "요가", met: 3.0 },
  { label: "축구", met: 7.0 },
  { label: "배드민턴", met: 5.5 },
];

function getIntensity(met: number): { label: string; color: string } {
  if (met < 3) return { label: "저강도", color: "text-green-600" };
  if (met < 6) return { label: "중강도", color: "text-yellow-600" };
  if (met < 9) return { label: "고강도", color: "text-orange-600" };
  return { label: "최고강도", color: "text-red-600" };
}

export default function ClientPage() {
  const [weight, setWeight] = useState(65);
  const [duration, setDuration] = useState(30);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const r = useMemo(() => {
    const ex = exercises[selectedIdx];
    const hours = duration / 60;
    const calories = ex.met * weight * hours;
    const fatBurn = (calories / 7700) * 1000; // g
    const intensity = getIntensity(ex.met);
    return { calories, fatBurn, met: ex.met, intensity };
  }, [weight, duration, selectedIdx]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link scroll={false}
        href="/" className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors">← 계산기 목록</Link>
      <h1 className="text-2xl font-bold mb-2">🏃 운동 소모 칼로리 계산기</h1>
      <p className="text-gray-600 mb-6">체중·운동 종류·운동 시간을 입력하면 MET 공식으로 소모 칼로리와 지방 연소량을 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">운동 정보 입력</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">체중 (kg)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={20} max={200} value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                onBlur={(e) => setWeight(Math.min(200, Math.max(20, Number(e.target.value) || 65)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">kg</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">운동 시간 (분)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={600} value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                onBlur={(e) => setDuration(Math.min(600, Math.max(1, Number(e.target.value) || 30)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">분</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-2">운동 종류</label>
          <div className="grid grid-cols-3 gap-2">
            {exercises.map((ex, i) => (
              <button key={ex.label} onClick={() => setSelectedIdx(i)}
                className={`py-2 px-2 rounded border text-sm transition-colors ${selectedIdx === i ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-base font-bold mb-4">계산 결과</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">소모 칼로리</p>
            <p className="text-3xl font-bold text-orange-500">{r.calories.toFixed(0)}</p>
            <p className="text-sm text-gray-500">kcal</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">지방 연소량</p>
            <p className="text-3xl font-bold text-red-500">{r.fatBurn.toFixed(1)}</p>
            <p className="text-sm text-gray-500">g</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">MET 값</p>
            <p className="text-2xl font-bold text-blue-600">{r.met.toFixed(1)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">운동 강도</p>
            <p className={`text-2xl font-bold ${r.intensity.color}`}>{r.intensity.label}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">* 지방 1kg = 7,700kcal 기준. 실제 연소량은 개인차가 있습니다.</p>
      </section>

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">MET란 무엇인가요?</h2>
        <p className="mb-3 text-gray-700">
          MET(Metabolic Equivalent of Task)는 신체 활동의 강도를 나타내는 지표입니다. 안정 시 산소 소비량(3.5ml/kg/min)을 1 MET로 정의하며, 운동 중 산소 소비량이 안정 시의 몇 배인지를 나타냅니다. 예를 들어 MET 6인 달리기는 안정 시보다 6배의 에너지를 사용합니다.
        </p>
        <p className="text-gray-700">
          소모 칼로리 공식은 <strong>칼로리(kcal) = MET × 체중(kg) × 시간(h)</strong>입니다. 같은 운동이라도 체중이 많을수록, 운동 시간이 길수록 더 많은 칼로리를 소모합니다. 지방 연소량은 소모 칼로리를 7,700kcal(지방 1kg의 열량)로 나눈 값으로 계산됩니다.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">효과적인 칼로리 소모를 위한 운동법</h2>
        <p className="mb-3 text-gray-700">
          체중 감량을 위해서는 고강도 유산소 운동과 근력 운동을 병행하는 것이 가장 효과적입니다. 달리기, 줄넘기처럼 MET 값이 높은 고강도 운동은 짧은 시간에 많은 칼로리를 소모하지만, 부상 위험이 높아 초보자에게는 빠른 걷기나 자전거 타기 같은 중강도 운동을 먼저 권장합니다.
        </p>
        <p className="mb-3 text-gray-700">
          고강도 인터벌 트레이닝(HIIT)은 고강도와 저강도 운동을 번갈아 실시하는 방식으로, 운동 후에도 칼로리 소모가 이어지는 '운동 후 과잉 산소 소비(EPOC)' 효과가 있습니다. 또한 근력 운동(웨이트 트레이닝)은 근육량을 늘려 기초대사량을 높이므로, 장기적인 체중 관리에 매우 유리합니다.
        </p>
        <p className="text-gray-700">
          세계보건기구(WHO)는 성인이 주당 150~300분의 중강도 또는 75~150분의 고강도 유산소 운동을 권장합니다. 일주일에 2회 이상 근력 운동도 함께 실시할 것을 권고합니다. 운동 효과를 극대화하려면 규칙적인 운동과 함께 적절한 영양 섭취와 충분한 수면이 필수적입니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "같은 시간 운동해도 체중에 따라 칼로리가 다른가요?", a: "네, 체중이 많을수록 같은 운동을 할 때 더 많은 에너지가 필요합니다. 70kg인 사람이 30분 달리기를 하면 약 210kcal를 소모하지만, 50kg인 사람은 약 150kcal를 소모합니다." },
          { q: "지방 1g을 태우려면 얼마나 운동해야 하나요?", a: "지방 1g = 약 7.7kcal입니다. 체중 65kg인 사람이 달리기(10km/h)로 7.7kcal를 소모하려면 약 0.7분(42초)이 필요합니다. 지방 1kg을 태우려면 약 770분(12.8시간)이 필요합니다." },
          { q: "운동 후 식욕이 증가하는데 어떻게 관리하나요?", a: "운동 직후 단백질(닭가슴살, 달걀, 두부 등)을 섭취하면 포만감을 유지하면서 근육 회복에 도움이 됩니다. 탄수화물과 단백질을 3:1 비율로 섭취하는 것이 일반적으로 권장됩니다." },
          { q: "공복 운동과 식후 운동 중 어느 것이 더 효과적인가요?", a: "공복 운동은 지방 연소 비율이 높지만 운동 강도가 낮아지고 근육 손실 우려가 있습니다. 식후 1~2시간 뒤 중강도 운동이 일반적으로 더 안전하고 효과적입니다. 개인의 컨디션에 따라 선택하세요." },
          { q: "운동 없이 식이 조절만으로 체중 감량이 가능한가요?", a: "가능하지만 근육 손실이 함께 일어나 기초대사량이 낮아질 수 있습니다. 운동과 식이 조절을 병행하면 근육을 유지하면서 체지방을 줄일 수 있어 요요 현상을 예방하고 장기적인 체중 유지에 유리합니다." },
          { q: "하루에 얼마나 운동해야 체중이 감량되나요?", a: "1주일에 0.5kg 감량을 목표로 하면 하루 약 500kcal 적자가 필요합니다. 운동으로 300kcal, 식이 조절로 200kcal를 줄이는 방식이 현실적입니다. 무리한 감량보다 꾸준한 습관이 중요합니다." },
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
