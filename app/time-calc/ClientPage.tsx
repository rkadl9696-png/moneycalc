"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type Mode = "diff" | "add" | "sub";

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(total: number): string {
  const m = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function formatDuration(minutes: number): string {
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const sign = minutes < 0 ? "-" : "";
  if (h === 0) return `${sign}${m}분`;
  if (m === 0) return `${sign}${h}시간`;
  return `${sign}${h}시간 ${m}분`;
}

function formatTime12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? "오전" : "오후";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${hour}:${String(m).padStart(2, "0")}`;
}

export default function ClientPage() {
  const [mode, setMode] = useState<Mode>("diff");

  // diff mode
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  // add/sub mode
  const [baseTime, setBaseTime] = useState("09:00");
  const [addHours, setAddHours] = useState(2);
  const [addMinutes, setAddMinutes] = useState(30);

  const diffResult = useMemo(() => {
    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);
    let diff = endMin - startMin;
    let overnight = false;
    if (diff < 0) { diff += 1440; overnight = true; }
    return { diff, overnight };
  }, [startTime, endTime]);

  const addSubResult = useMemo(() => {
    const baseMin = timeToMinutes(baseTime);
    const deltaMin = addHours * 60 + addMinutes;
    const resultMin = mode === "add"
      ? baseMin + deltaMin
      : baseMin - deltaMin;
    return minutesToTime(resultMin);
  }, [baseTime, addHours, addMinutes, mode]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">시간 계산기</h1>
      <p className="text-gray-600 mb-6">
        두 시간의 차이를 구하거나, 특정 시간에 시간을 더하고 뺄 수 있습니다.
      </p>

      {/* 모드 선택 */}
      <section className="mb-5">
        <div className="flex gap-2">
          {([
            { key: "diff", label: "시간 차이" },
            { key: "add", label: "시간 더하기" },
            { key: "sub", label: "시간 빼기" },
          ] as { key: Mode; label: string }[]).map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-bold transition-colors ${
                mode === m.key
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* 시간 차이 */}
      {mode === "diff" && (
        <>
          <section className="border rounded-lg p-4 mb-5">
            <h2 className="text-base font-bold mb-4">시간 입력</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">시작 시간</label>
                <input
                  type="time" value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <p className="text-xs text-gray-400 mt-1">{formatTime12(startTime)}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">종료 시간</label>
                <input
                  type="time" value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <p className="text-xs text-gray-400 mt-1">{formatTime12(endTime)}</p>
              </div>
            </div>
          </section>

          <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
            <p className="text-sm text-gray-500 mb-1">시간 차이</p>
            <p className="text-4xl font-bold text-blue-600 mb-1">{formatDuration(diffResult.diff)}</p>
            {diffResult.overnight && (
              <p className="text-xs text-orange-500 mt-1">* 다음날 새벽까지 포함 (야간 근무 등)</p>
            )}
            <div className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-white rounded-lg p-2">
                <p className="text-xs text-gray-400">시간</p>
                <p className="font-bold text-gray-700">{Math.floor(diffResult.diff / 60)}시간</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-xs text-gray-400">분</p>
                <p className="font-bold text-gray-700">{diffResult.diff % 60}분</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-xs text-gray-400">총 분</p>
                <p className="font-bold text-gray-700">{diffResult.diff}분</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 시간 더하기/빼기 */}
      {(mode === "add" || mode === "sub") && (
        <>
          <section className="border rounded-lg p-4 mb-5">
            <h2 className="text-base font-bold mb-4">시간 입력</h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">기준 시간</label>
              <input
                type="time" value={baseTime}
                onChange={(e) => setBaseTime(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <p className="text-xs text-gray-400 mt-1">{formatTime12(baseTime)}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                {mode === "add" ? "더할 시간" : "뺄 시간"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} max={999} value={addHours}
                    onChange={(e) => setAddHours(Number(e.target.value))}
                    onBlur={(e) => setAddHours(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full border p-2 rounded"
                  />
                  <span className="text-sm text-gray-500 shrink-0">시간</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} max={59} value={addMinutes}
                    onChange={(e) => setAddMinutes(Number(e.target.value))}
                    onBlur={(e) => setAddMinutes(Math.min(59, Math.max(0, Number(e.target.value) || 0)))}
                    className="w-full border p-2 rounded"
                  />
                  <span className="text-sm text-gray-500 shrink-0">분</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
            <p className="text-sm text-gray-500 mb-1">
              {mode === "add" ? "더한 후 시간" : "뺀 후 시간"}
            </p>
            <p className="text-5xl font-bold text-blue-600">{addSubResult}</p>
            <p className="text-sm text-gray-500 mt-1">{formatTime12(addSubResult)}</p>
            <p className="text-xs text-gray-400 mt-2">
              {formatTime12(baseTime)} {mode === "add" ? "+" : "-"} {formatDuration(addHours * 60 + addMinutes)}
              {(baseTime > addSubResult && mode === "add") || (baseTime < addSubResult && mode === "sub")
                ? " (자정 넘어 다음날)" : ""}
            </p>
          </section>
        </>
      )}

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">시간 계산 활용 예시</h2>
        <div className="flex flex-col gap-3 text-sm">
          {[
            { emoji: "💼", title: "근무 시간 계산", desc: "출근 시간과 퇴근 시간을 입력해 실제 근무 시간을 확인하세요." },
            { emoji: "✈️", title: "비행 도착 시간", desc: "출발 시간에 비행 시간을 더해 현지 도착 시간을 계산하세요." },
            { emoji: "⏰", title: "알람 설정", desc: "현재 시간에서 수면 시간을 더해 적절한 기상 시각을 계산하세요." },
            { emoji: "🍳", title: "조리 완료 시간", desc: "조리 시작 시간에 조리 시간을 더해 완성 시각을 확인하세요." },
          ].map((ex) => (
            <div key={ex.title} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-2xl">{ex.emoji}</span>
              <div>
                <p className="font-bold text-gray-700">{ex.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{ex.desc}</p>
              </div>
            </div>
          ))}
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
