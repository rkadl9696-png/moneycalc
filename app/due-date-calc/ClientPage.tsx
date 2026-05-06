"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const today = new Date();
today.setHours(0, 0, 0, 0);

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

const defaultLmp = (() => {
  const d = new Date(today);
  d.setDate(d.getDate() - 70); // 약 10주 전
  return d.toISOString().split("T")[0];
})();

export default function ClientPage() {
  const [lmpStr, setLmpStr] = useState(defaultLmp);

  const r = useMemo(() => {
    const lmp = new Date(lmpStr);
    if (isNaN(lmp.getTime())) return null;
    if (lmp > today) return null;

    const dueDate = addDays(lmp, 280);
    const diffDays = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    const remainDays = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    let trimester: number;
    let trimesterLabel: string;
    let trimesterColor: string;
    let trimesterBg: string;
    let trimesterBorder: string;

    if (weeks < 13) {
      trimester = 1;
      trimesterLabel = "1분기";
      trimesterColor = "text-pink-600";
      trimesterBg = "bg-pink-50";
      trimesterBorder = "border-pink-400";
    } else if (weeks < 28) {
      trimester = 2;
      trimesterLabel = "2분기";
      trimesterColor = "text-purple-600";
      trimesterBg = "bg-purple-50";
      trimesterBorder = "border-purple-400";
    } else {
      trimester = 3;
      trimesterLabel = "3분기";
      trimesterColor = "text-blue-600";
      trimesterBg = "bg-blue-50";
      trimesterBorder = "border-blue-400";
    }

    const milestones = [
      {
        label: "심장 소리 청취 가능",
        weekStart: 6, weekEnd: 8,
        date: formatDateShort(addDays(lmp, 6 * 7)),
        dateEnd: formatDateShort(addDays(lmp, 8 * 7)),
        done: weeks >= 8,
        icon: "💓",
      },
      {
        label: "기형아 검사 (NT 초음파)",
        weekStart: 11, weekEnd: 13,
        date: formatDateShort(addDays(lmp, 11 * 7)),
        dateEnd: formatDateShort(addDays(lmp, 13 * 7)),
        done: weeks >= 13,
        icon: "🔬",
      },
      {
        label: "정밀 초음파",
        weekStart: 20, weekEnd: 24,
        date: formatDateShort(addDays(lmp, 20 * 7)),
        dateEnd: formatDateShort(addDays(lmp, 24 * 7)),
        done: weeks >= 24,
        icon: "🩻",
      },
      {
        label: "출산 예정일",
        weekStart: 40, weekEnd: 40,
        date: formatDate(dueDate),
        dateEnd: null,
        done: today >= dueDate,
        icon: "👶",
      },
    ];

    const progress = Math.min(100, Math.round((diffDays / 280) * 100));

    return {
      lmp, dueDate, weeks, days, remainDays,
      trimester, trimesterLabel, trimesterColor, trimesterBg, trimesterBorder,
      milestones, progress,
    };
  }, [lmpStr]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">임신 출산 예정일 계산기</h1>
      <p className="text-gray-600 mb-6">
        마지막 생리 시작일을 입력하면 출산 예정일과 현재 임신 주수, 주요 검사 일정을 확인할 수 있습니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-3">마지막 생리 시작일 (LMP)</h2>
        <input
          type="date"
          value={lmpStr}
          max={today.toISOString().split("T")[0]}
          onChange={(e) => setLmpStr(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <p className="text-xs text-gray-400 mt-2">
          * 마지막 생리가 시작된 첫째 날을 입력하세요.
        </p>
      </section>

      {r ? (
        <>
          {/* 현재 임신 주수 */}
          <section className={`rounded-xl border-2 p-5 mb-5 ${r.trimesterBg} ${r.trimesterBorder}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-0.5">현재 임신 주수</p>
                <p className={`text-4xl font-bold ${r.trimesterColor}`}>
                  {r.weeks}주 {r.days}일
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-0.5">분기</p>
                <p className={`text-2xl font-bold ${r.trimesterColor}`}>{r.trimesterLabel}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {r.trimester === 1 ? "1~12주" : r.trimester === 2 ? "13~27주" : "28주 이상"}
                </p>
              </div>
            </div>

            {/* 진행 바 */}
            <div className="mb-1">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>임신 시작</span>
                <span>임신 {r.progress}% 경과</span>
                <span>출산 예정일</span>
              </div>
              <div className="w-full bg-white bg-opacity-60 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${r.trimesterColor.replace("text-", "bg-")}`}
                  style={{ width: `${r.progress}%` }}
                />
              </div>
            </div>
          </section>

          {/* 출산 예정일 & 카운트다운 */}
          <section className="grid grid-cols-2 gap-3 mb-5">
            <div className="border rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">출산 예정일</p>
              <p className="text-lg font-bold text-gray-800">{formatDate(r.dueDate)}</p>
            </div>
            <div className={`rounded-lg p-4 text-center ${r.remainDays === 0 ? "bg-pink-50 border-2 border-pink-400" : "border"}`}>
              <p className="text-xs text-gray-500 mb-1">출산까지</p>
              {r.remainDays === 0 ? (
                <p className="text-lg font-bold text-pink-600">D-Day 🎉</p>
              ) : (
                <p className="text-lg font-bold text-blue-600">D-{r.remainDays.toLocaleString()}일</p>
              )}
            </div>
          </section>

          {/* 분기 안내 */}
          <section className="border rounded-lg p-4 mb-5">
            <h2 className="text-base font-bold mb-3">임신 3분기 구분</h2>
            <div className="flex flex-col gap-2">
              {[
                { num: 1, label: "1분기", range: "1~12주", desc: "태아 주요 장기 형성기", color: "text-pink-600", bg: r.trimester === 1 ? "bg-pink-50 border-pink-300" : "bg-gray-50 border-gray-200" },
                { num: 2, label: "2분기", range: "13~27주", desc: "태동 시작, 안정기", color: "text-purple-600", bg: r.trimester === 2 ? "bg-purple-50 border-purple-300" : "bg-gray-50 border-gray-200" },
                { num: 3, label: "3분기", range: "28주~", desc: "출산 준비, 태아 급성장", color: "text-blue-600", bg: r.trimester === 3 ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200" },
              ].map((t) => (
                <div key={t.num} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${t.bg}`}>
                  <div>
                    <span className={`font-bold ${t.color}`}>{t.label}</span>
                    <span className="text-xs text-gray-400 ml-2">{t.range}</span>
                  </div>
                  <span className="text-sm text-gray-500">{t.desc}</span>
                  {r.trimester === t.num && <span className="text-xs font-bold text-white bg-gray-600 px-2 py-0.5 rounded-full ml-2">현재</span>}
                </div>
              ))}
            </div>
          </section>

          {/* 주요 일정 */}
          <section className="border rounded-lg p-4 mb-8">
            <h2 className="text-base font-bold mb-3">주요 임신 일정</h2>
            <div className="flex flex-col gap-3">
              {r.milestones.map((m) => (
                <div
                  key={m.label}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${m.done ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-blue-200"}`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${m.done ? "text-gray-400 line-through" : "text-gray-800"}`}>
                      {m.label}
                    </p>
                    <p className="text-xs text-gray-400">
                      {m.weekStart === m.weekEnd
                        ? `${m.weekStart}주 · ${m.date}`
                        : `${m.weekStart}~${m.weekEnd}주 · ${m.date} ~ ${m.dateEnd}`}
                    </p>
                  </div>
                  {m.done && <span className="text-xs text-gray-400">완료</span>}
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="font-bold text-yellow-700">⚠️ 날짜를 확인해주세요</p>
          <p className="text-sm text-yellow-600 mt-1">오늘 이전 날짜를 입력해주세요.</p>
        </section>
      )}

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">출산 예정일 계산 방법</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono">
          출산 예정일 = 마지막 생리 시작일 + 280일 (40주)
        </div>
        <p className="mb-3">
          네겔레 공식(Naegele's rule)에 따라 마지막 생리 시작일에서 280일(40주)을 더한 날이 출산 예정일입니다.
          실제 출산은 예정일 전후 2주 이내(38~42주)가 정상 범위입니다.
        </p>
        <p>
          임신 주수는 마지막 생리 시작일을 0주 0일로 계산합니다.
          실제 수정은 생리 후 약 2주 뒤에 일어나지만, 의학적으로는 생리 시작일을 기준으로 합니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 생리 주기가 불규칙하면 예정일이 달라지나요?</p>
          <p>네, 이 계산기는 28일 주기를 기준으로 합니다. 생리 주기가 다르다면 초음파 검사로 측정한 태아 크기를 기준으로 예정일을 조정하는 것이 더 정확합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 예정일에 정확히 태어나는 경우가 많나요?</p>
          <p>예정일 당일에 태어나는 경우는 약 5% 정도입니다. 대부분은 예정일 전후 1~2주 사이에 태어납니다. 38~42주 사이면 정상 만삭 출산입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 기형아 검사는 꼭 해야 하나요?</p>
          <p>NT 초음파(11~13주)와 혈액 검사를 통한 1차 기형아 검사는 선택 사항이지만 강력히 권장됩니다. 고령 임산부(35세 이상)는 추가적인 검사를 권유받을 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 임신 1분기가 가장 조심스러운 이유는?</p>
          <p>1분기(1~12주)는 태아의 주요 장기와 신체 구조가 형성되는 시기로, 외부 자극에 가장 민감합니다. 약 복용, 방사선 노출, 음주·흡연을 특히 주의해야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 쌍둥이인 경우 예정일이 다른가요?</p>
          <p>쌍둥이는 단태아보다 일찍 태어나는 경향이 있어, 일반적으로 36~37주를 기준으로 합니다. 정확한 예정일은 담당 의사와 상담하세요.</p>
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
