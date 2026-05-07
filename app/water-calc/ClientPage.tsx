"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const ACTIVITY_OPTIONS = [
  { label: "낮음",  desc: "주로 앉아서 생활, 운동 거의 없음", extra: 0 },
  { label: "보통",  desc: "가벼운 운동 주 1~3회",              extra: 500 },
  { label: "높음",  desc: "격렬한 운동 주 4회 이상",           extra: 1000 },
];

const WEATHER_OPTIONS = [
  { label: "보통",     desc: "15~25°C",  extra: 0 },
  { label: "더움",     desc: "26~34°C",  extra: 500 },
  { label: "매우 더움",desc: "35°C 이상",extra: 1000 },
];

const SCHEDULE = [
  { time: "기상 직후 (07:00)",   amount: 250, tip: "수면 중 손실된 수분 보충" },
  { time: "오전 (09:00)",        amount: 250, tip: "집중력 향상" },
  { time: "오전 (11:00)",        amount: 250, tip: "점심 전 공복 수분 보충" },
  { time: "점심 식사 중 (12:30)",amount: 200, tip: "식사 소화 보조" },
  { time: "오후 (14:00)",        amount: 250, tip: "오후 졸음 방지" },
  { time: "오후 (16:00)",        amount: 250, tip: "저녁 식욕 조절" },
  { time: "저녁 식사 중 (18:30)",amount: 200, tip: "식사 소화 보조" },
  { time: "저녁 (20:00)",        amount: 200, tip: "취침 전 과다 섭취 방지" },
];
const SCHEDULE_BASE = SCHEDULE.reduce((s, x) => s + x.amount, 0); // 1850ml

function formatMl(ml: number): string {
  if (ml >= 1000) return `${(ml / 1000).toFixed(1)}L`;
  return `${ml}ml`;
}

export default function ClientPage() {
  const [weight, setWeight]       = useState(65);
  const [activityIdx, setActivityIdx] = useState(0);
  const [weatherIdx, setWeatherIdx]   = useState(0);

  const r = useMemo(() => {
    const base    = weight * 30;
    const actExtra = ACTIVITY_OPTIONS[activityIdx].extra;
    const wtExtra  = WEATHER_OPTIONS[weatherIdx].extra;
    const total    = base + actExtra + wtExtra;

    const cups = Math.round(total / 200); // 200ml 기준 컵

    // 스케줄 비례 조정
    const ratio = total / SCHEDULE_BASE;
    const schedule = SCHEDULE.map((s) => ({
      ...s,
      adjusted: Math.round((s.amount * ratio) / 50) * 50,
    }));

    return { base, actExtra, wtExtra, total, cups, schedule };
  }, [weight, activityIdx, weatherIdx]);

  const activity = ACTIVITY_OPTIONS[activityIdx];
  const weather  = WEATHER_OPTIONS[weatherIdx];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">적정 음수량 계산기</h1>
      <p className="text-gray-600 mb-6">
        몸무게·활동 수준·날씨를 입력하면 하루 권장 음수량과 시간대별 음수 스케줄을 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">정보 입력</h2>

        {/* 몸무게 */}
        <div className="mb-4">
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

        {/* 활동 수준 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">활동 수준</label>
          <div className="flex flex-col gap-2">
            {ACTIVITY_OPTIONS.map((a, i) => (
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
                  <p className={`text-sm font-bold ${activityIdx === i ? "text-blue-700" : "text-gray-700"}`}>{a.label}</p>
                  <p className="text-xs text-gray-400">{a.desc}</p>
                </div>
                <span className={`text-xs font-medium ${activityIdx === i ? "text-blue-500" : "text-gray-400"}`}>
                  {a.extra === 0 ? "기본" : `+${formatMl(a.extra)}`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 날씨 */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">날씨·기온</label>
          <div className="flex gap-2">
            {WEATHER_OPTIONS.map((w, i) => (
              <button
                key={i}
                onClick={() => setWeatherIdx(i)}
                className={`flex-1 py-3 rounded-lg border-2 text-sm font-bold transition-colors ${
                  weatherIdx === i
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <p>{w.label}</p>
                <p className={`text-xs font-normal mt-0.5 ${weatherIdx === i ? "text-blue-400" : "text-gray-400"}`}>{w.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 결과 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <p className="text-sm text-gray-500 mb-1">하루 권장 음수량</p>
        <p className="text-4xl font-bold text-blue-600 mb-1">
          {formatMl(r.total)}
          <span className="text-xl font-normal text-gray-500 ml-2">({r.cups}컵)</span>
        </p>
        <p className="text-xs text-gray-400 mb-4">200ml 컵 기준</p>

        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">기본 권장량 (체중 × 30ml)</span>
            <span className="font-medium">{formatMl(r.base)}</span>
          </div>
          {r.actExtra > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">활동 수준 추가 ({activity.label})</span>
              <span className="font-medium text-blue-600">+{formatMl(r.actExtra)}</span>
            </div>
          )}
          {r.wtExtra > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">날씨 추가 ({weather.label})</span>
              <span className="font-medium text-blue-600">+{formatMl(r.wtExtra)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t border-blue-200 pt-1.5 mt-0.5">
            <span>합계</span>
            <span className="text-blue-600">{formatMl(r.total)}</span>
          </div>
        </div>
      </section>

      {/* 시간대별 스케줄 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">시간대별 음수 스케줄</h2>
        <div className="flex flex-col gap-2">
          {r.schedule.map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-gray-400 w-40 shrink-0">{s.time}</span>
              <span className="font-bold text-blue-600 w-14 shrink-0">{formatMl(s.adjusted)}</span>
              <span className="text-gray-400 text-xs">{s.tip}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">* 스케줄은 참고용이며, 목마름을 느낄 때 마시는 것이 가장 중요합니다.</p>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">하루 음수량 계산 방법</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          기본 권장량 = 체중(kg) × 30ml<br />
          활동 추가: 보통 +500ml / 높음 +1,000ml<br />
          날씨 추가: 더움 +500ml / 매우 더움 +1,000ml
        </div>
        <p className="mb-3">
          일반적으로 성인은 체중 1kg당 30ml의 물이 필요합니다.
          운동이나 더운 날씨에는 땀으로 손실되는 수분이 늘어나므로 추가 섭취가 필요합니다.
        </p>
        <p>
          음수량에는 물 외에도 음식, 주스, 국물 등에 포함된 수분도 포함됩니다.
          일반적으로 식품을 통해 하루 약 700~1,000ml의 수분이 공급되므로
          실제 물로만 마셔야 하는 양은 계산값보다 적을 수 있습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 물을 너무 많이 마셔도 되나요?</p>
          <p>건강한 성인은 신장이 초과 수분을 배출하지만, 단시간에 과도하게 마시면 저나트륨혈증(물 중독)이 생길 수 있습니다. 하루에 걸쳐 나눠 마시는 것이 중요합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 커피나 차도 음수량에 포함되나요?</p>
          <p>카페인 음료는 이뇨 작용이 있어 순수 음수량에는 제외하는 것이 좋습니다. 다만 적당량의 커피(하루 3잔 이하)는 수분 손실 효과가 크지 않습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 소변 색으로 수분 상태를 확인할 수 있나요?</p>
          <p>옅은 노란색(레모네이드 색)이 적정 수분 상태입니다. 진한 노란색이나 갈색이면 탈수 신호이고, 투명에 가까우면 과도한 수분 섭취일 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 식사 중 물을 마시면 소화에 방해가 되나요?</p>
          <p>적당한 양(200ml 이하)의 물은 소화에 도움이 됩니다. 다만 많은 양을 한꺼번에 마시면 위산이 희석되어 소화 효율이 낮아질 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 운동 후 수분 보충은 어떻게 하나요?</p>
          <p>운동 후 체중 감소분의 약 1.5배 수분 섭취를 권장합니다. 1시간 이상 운동 시 전해질 음료나 소금을 함께 섭취하면 효과적입니다.</p>
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
