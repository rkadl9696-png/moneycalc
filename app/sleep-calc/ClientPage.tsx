"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const CYCLE_MINUTES = 90;

const AGE_GROUPS = [
  { label: "영유아 (1~2세)",    min: 11, max: 14 },
  { label: "학령기 (6~13세)",   min: 9,  max: 11 },
  { label: "청소년 (14~17세)",  min: 8,  max: 10 },
  { label: "성인 (18~64세)",    min: 7,  max: 9  },
  { label: "노인 (65세 이상)",  min: 7,  max: 8  },
];

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.abs(minutes) % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? "오전" : "오후";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${hour}:${String(m).padStart(2, "0")}`;
}

export default function ClientPage() {
  const [bedTime, setBedTime]   = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [ageGroup, setAgeGroup] = useState(3); // 성인

  const r = useMemo(() => {
    const bedMin  = timeToMinutes(bedTime);
    const wakeMin = timeToMinutes(wakeTime);

    let sleepMinutes = wakeMin - bedMin;
    if (sleepMinutes <= 0) sleepMinutes += 1440;

    const cycles = sleepMinutes / CYCLE_MINUTES;
    const fullCycles = Math.floor(cycles);

    // 취침 시각 기준으로 권장 기상 시각 (90분 배수, 2~6사이클)
    const recommended = [3, 4, 5, 6].map((c) => ({
      cycles: c,
      time: minutesToTime(bedMin + c * CYCLE_MINUTES + 14), // 입면까지 14분 평균 가산
      duration: c * CYCLE_MINUTES + 14,
    }));

    const { min: recMin, max: recMax } = AGE_GROUPS[ageGroup];
    const recMinutes = recMin * 60;
    const debt = recMinutes - sleepMinutes;

    let grade: string;
    let gradeColor: string;
    let gradeBg: string;
    let gradeBorder: string;

    if (sleepMinutes >= recMin * 60 && sleepMinutes <= recMax * 60) {
      grade = "적정";
      gradeColor = "text-green-600";
      gradeBg = "bg-green-50";
      gradeBorder = "border-green-400";
    } else if (sleepMinutes < recMin * 60) {
      grade = "부족";
      gradeColor = "text-red-600";
      gradeBg = "bg-red-50";
      gradeBorder = "border-red-400";
    } else {
      grade = "과다";
      gradeColor = "text-yellow-600";
      gradeBg = "bg-yellow-50";
      gradeBorder = "border-yellow-400";
    }

    return {
      sleepMinutes, cycles, fullCycles,
      recommended, debt,
      grade, gradeColor, gradeBg, gradeBorder,
      recMin, recMax,
    };
  }, [bedTime, wakeTime, ageGroup]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">수면 시간 계산기</h1>
      <p className="text-gray-600 mb-6">
        취침·기상 시간을 입력하면 수면 시간, 수면 사이클, 권장 기상 시간을 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">수면 시간 입력</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">취침 시간</label>
            <input
              type="time" value={bedTime}
              onChange={(e) => setBedTime(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">기상 시간</label>
            <input
              type="time" value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-2">나이대 (권장 수면 기준)</label>
          <div className="flex flex-col gap-1.5">
            {AGE_GROUPS.map((g, i) => (
              <button
                key={i}
                onClick={() => setAgeGroup(i)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border-2 text-left text-sm transition-colors ${
                  ageGroup === i
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-bold"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span>{g.label}</span>
                <span className={`text-xs ${ageGroup === i ? "text-blue-500" : "text-gray-400"}`}>
                  {g.min}~{g.max}시간
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 결과 */}
      <section className={`rounded-xl border-2 p-5 mb-5 ${r.gradeBg} ${r.gradeBorder}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-0.5">총 수면 시간</p>
            <p className={`text-4xl font-bold ${r.gradeColor}`}>{formatDuration(r.sleepMinutes)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-0.5">판정</p>
            <p className={`text-2xl font-bold ${r.gradeColor}`}>{r.grade}</p>
            <p className="text-xs text-gray-400 mt-0.5">권장 {r.recMin}~{r.recMax}시간</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">수면 사이클</p>
            <p className={`text-xl font-bold ${r.gradeColor}`}>{r.cycles.toFixed(1)}회</p>
            <p className="text-xs text-gray-400">(완전 {r.fullCycles}사이클)</p>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">
              {r.debt > 0 ? "수면 부채" : r.debt < 0 ? "초과 수면" : "수면 균형"}
            </p>
            <p className={`text-xl font-bold ${r.debt > 0 ? "text-red-600" : r.debt < 0 ? "text-yellow-600" : "text-green-600"}`}>
              {r.debt === 0 ? "±0" : (r.debt > 0 ? "-" : "+") + formatDuration(Math.abs(r.debt))}
            </p>
            <p className="text-xs text-gray-400">권장 대비</p>
          </div>
        </div>
      </section>

      {/* 권장 기상 시간 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-1">권장 기상 시간 (취침 {formatTime(bedTime)} 기준)</h2>
        <p className="text-xs text-gray-400 mb-3">입면 14분 + 90분 사이클 배수 기준</p>
        <div className="grid grid-cols-2 gap-2">
          {r.recommended.map((rec) => (
            <div
              key={rec.cycles}
              className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 ${
                rec.time === minutesToTime(timeToMinutes(wakeTime))
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div>
                <p className="font-bold text-gray-800">{formatTime(rec.time)}</p>
                <p className="text-xs text-gray-400">{formatDuration(rec.duration)}</p>
              </div>
              <span className="text-xs text-gray-500">{rec.cycles}사이클</span>
            </div>
          ))}
        </div>
      </section>

      {/* 나이별 권장 수면표 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">나이별 권장 수면 시간 (미국 수면 재단 기준)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">나이대</th>
                <th className="text-right p-3 border-b font-bold">권장 수면</th>
              </tr>
            </thead>
            <tbody>
              {AGE_GROUPS.map((g, i) => (
                <tr key={i} className={`border-b last:border-b-0 ${ageGroup === i ? "bg-blue-50 font-bold" : ""}`}>
                  <td className="p-3">{g.label}</td>
                  <td className="text-right p-3 text-gray-600">{g.min}~{g.max}시간</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">수면 사이클이란?</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono">
          1 수면 사이클 = 약 90분 (비렘수면 + 렘수면)
        </div>
        <p className="mb-3">
          수면은 약 90분 주기로 비렘수면(깊은 수면)과 렘수면(꿈 수면)이 반복됩니다.
          사이클이 완전히 끝나는 시점에 기상하면 뇌가 자연스럽게 각성 상태에 들어와 개운하게 일어날 수 있습니다.
        </p>
        <p>
          권장 기상 시간은 평균 입면 시간(14분)을 포함해 계산됩니다.
          실제 입면 시간은 개인차가 있으므로 몇 번 시도해보면서 자신에게 맞는 취침 시간을 찾는 것이 좋습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 수면 사이클 중간에 깨면 왜 더 피곤한가요?</p>
          <p>깊은 비렘수면 중에 깨면 수면 관성(sleep inertia)이 강하게 나타나 더 피곤하고 멍한 느낌이 듭니다. 렘수면 직후인 사이클 끝에 기상하면 훨씬 개운합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 주말에 몰아 자면 수면 부채가 해소되나요?</p>
          <p>단기적으로는 도움이 되지만 완전히 해소되지는 않습니다. 주말 과다 수면은 오히려 월요일 각성을 어렵게 해 사회적 시차 증후군(Social Jetlag)을 유발할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 낮잠은 얼마나 자는 게 좋나요?</p>
          <p>20~30분의 파워냅이 가장 효과적입니다. 90분 이상 자면 깊은 수면에 들어가 오히려 밤 수면을 방해할 수 있습니다. 오후 3시 이후 낮잠은 피하는 것이 좋습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 잠들기 어려울 때 어떻게 하나요?</p>
          <p>취침 1시간 전 스마트폰·TV 화면을 끄고, 실내 조도를 낮추세요. 일정한 수면 스케줄을 유지하는 것이 가장 중요하며, 카페인은 취침 6시간 전까지만 섭취하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 8시간을 자도 피곤한 이유는?</p>
          <p>수면의 질이 낮거나(수면 무호흡증, 자주 깨는 경우), 수면 타이밍이 맞지 않거나, 철분·비타민D 부족 등이 원인일 수 있습니다. 지속적으로 피곤하다면 전문의 상담을 권장합니다.</p>
        </div>
      </section>

      <RelatedCalculators />

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700"
        >
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
