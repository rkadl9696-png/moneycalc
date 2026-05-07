"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}

function formatShort(date: Date): string {
  return date.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
}

function daysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ClientPage() {
  const today = new Date();
  const defaultDate = new Date(today);
  defaultDate.setDate(today.getDate() - 14);
  const defaultStr = defaultDate.toISOString().split("T")[0];
  const todayStr = today.toISOString().split("T")[0];

  const [lastPeriod, setLastPeriod] = useState(defaultStr);
  const [cycle, setCycle] = useState(28);
  const [duration, setDuration] = useState(5);

  const r = useMemo(() => {
    if (!lastPeriod) return null;
    const last = new Date(lastPeriod);
    const nextPeriod = addDays(last, cycle);
    const ovulation = addDays(nextPeriod, -14);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = addDays(ovulation, 1);
    const periodEnd = addDays(last, duration - 1);
    const dDay = daysUntil(nextPeriod);

    const future = [0, 1, 2].map((i) => addDays(nextPeriod, cycle * i));

    return { nextPeriod, ovulation, fertileStart, fertileEnd, periodEnd, dDay, future };
  }, [lastPeriod, cycle, duration]);

  const dDayLabel = (d: number) => {
    if (d === 0) return "D-Day";
    if (d > 0) return `D-${d}`;
    return `D+${Math.abs(d)}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">🌸 생리 주기 계산기</h1>
      <p className="text-gray-600 mb-6">마지막 생리 시작일과 주기를 입력하면 다음 생리 예정일, 배란 예정일, 가임기를 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">생리 정보 입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">마지막 생리 시작일</label>
          <input type="date" value={lastPeriod} max={todayStr}
            onChange={(e) => setLastPeriod(e.target.value)}
            className="w-full border rounded p-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">생리 주기 (일)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={21} max={45} value={cycle}
                onChange={(e) => setCycle(Number(e.target.value))}
                onBlur={(e) => setCycle(Math.min(45, Math.max(21, Number(e.target.value) || 28)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">일</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">생리 기간 (일)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={2} max={10} value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                onBlur={(e) => setDuration(Math.min(10, Math.max(2, Number(e.target.value) || 5)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">일</span>
            </div>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      {r && (
        <section className="bg-gray-100 rounded-lg p-5 mb-8">
          <h2 className="text-base font-bold mb-4">계산 결과</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
              <p className="text-xs text-pink-600 font-medium mb-1">다음 생리 예정일</p>
              <p className="font-bold text-gray-800">{formatShort(r.nextPeriod)}</p>
              <p className={`text-lg font-bold mt-1 ${r.dDay <= 3 && r.dDay >= 0 ? "text-red-500" : "text-pink-600"}`}>{dDayLabel(r.dDay)}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-600 font-medium mb-1">배란 예정일</p>
              <p className="font-bold text-gray-800">{formatShort(r.ovulation)}</p>
              <p className="text-sm text-gray-500 mt-1">{dDayLabel(daysUntil(r.ovulation))}</p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-600 font-medium mb-1">가임기 (임신 가능 기간)</p>
            <p className="font-bold text-gray-800">{formatShort(r.fertileStart)} ~ {formatShort(r.fertileEnd)}</p>
            <p className="text-xs text-gray-500 mt-1">배란일 기준 5일 전 ~ 1일 후</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">향후 3회 예정일</p>
            <div className="flex gap-2">
              {r.future.map((d, i) => (
                <div key={i} className="flex-1 bg-white rounded p-2 text-center border">
                  <p className="text-xs text-gray-500">{i + 1}회차</p>
                  <p className="text-sm font-bold text-gray-800">{formatShort(d)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">생리 주기 계산 방법</h2>
        <p className="mb-3 text-gray-700">
          생리 주기는 생리 시작일부터 다음 생리 시작일 전날까지의 기간입니다. 평균 28일이지만 21일~35일 범위가 정상으로 간주됩니다. 다음 생리 예정일은 마지막 생리 시작일에 생리 주기를 더해 계산하며, 배란 예정일은 다음 생리 예정일에서 14일을 빼서 계산합니다.
        </p>
        <p className="text-gray-700">
          가임기(임신 가능 기간)는 배란일 5일 전부터 배란 후 1일까지로, 정자가 여성의 생식기 내에서 최대 5일 생존할 수 있기 때문입니다. 그러나 생리 주기는 스트레스, 체중 변화, 건강 상태 등 다양한 요인에 의해 변할 수 있으므로, 이 계산기는 참고용으로만 사용하세요.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">생리 불순과 생리 주기 관리</h2>
        <p className="mb-3 text-gray-700">
          생리 주기가 21일 미만이거나 35일을 초과하는 경우, 또는 주기 변화가 7일 이상 되는 경우를 생리 불순이라고 합니다. 생리 불순의 주요 원인으로는 호르몬 불균형, 극심한 스트레스, 과도한 체중 변화, 다낭성 난소 증후군(PCOS), 갑상선 질환 등이 있습니다. 생리 불순이 지속되면 부인과 전문의 상담을 권장합니다.
        </p>
        <p className="mb-3 text-gray-700">
          생리 주기를 정확하게 파악하려면 적어도 3~6개월 동안의 생리 기록을 추적하는 것이 좋습니다. 생리 시작일, 기간, 양, 통증 정도 등을 기록하면 자신의 주기 패턴을 파악하고 이상 징후를 조기에 발견하는 데 도움이 됩니다. 다양한 생리 추적 앱을 활용하거나 달력에 표시하는 방법도 효과적입니다.
        </p>
        <p className="text-gray-700">
          이 계산기의 모든 결과는 평균적인 주기를 기반으로 한 예측값이며, 실제 생리일 또는 배란일과 다를 수 있습니다. 임신을 원하거나 피임을 위한 목적으로 사용할 경우에는 반드시 의사 또는 산부인과 전문의의 조언을 받으시기 바랍니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "배란일을 정확히 알 수 있는 방법은?", a: "배란 예측 테스트기(LH 서지 측정), 기초체온 측정(배란 직후 0.2~0.5℃ 상승), 자궁경부 점액 관찰, 초음파 검사 등을 통해 더 정확하게 확인할 수 있습니다. 계산기 결과는 참고용입니다." },
          { q: "생리 주기가 매달 다른데 어떻게 계산하나요?", a: "최근 3~6개월의 생리 주기 평균을 사용하는 것이 좋습니다. 예를 들어 최근 3개월이 27일, 28일, 29일이었다면 평균 28일을 입력하세요." },
          { q: "월경 전 증후군(PMS)은 왜 생기나요?", a: "생리 전 1~2주 동안 에스트로겐과 프로게스테론 호르몬의 변화로 인해 복통, 두통, 부종, 기분 변화 등이 나타납니다. 규칙적인 운동, 균형 잡힌 식단, 카페인·염분 줄이기가 증상 완화에 도움이 됩니다." },
          { q: "스트레스가 생리 주기에 영향을 미치나요?", a: "네, 심한 스트레스는 시상하부-뇌하수체-난소 축에 영향을 주어 배란과 생리 주기를 불규칙하게 만들 수 있습니다. 충분한 수면, 명상, 가벼운 운동이 도움이 됩니다." },
          { q: "생리량이 갑자기 많아지거나 줄었어요.", a: "생리량의 급격한 변화는 자궁근종, 자궁내막증, 호르몬 불균형, 갑상선 질환 등의 신호일 수 있습니다. 패드 사용량이 시간당 1개 이상이면 과다 월경으로 볼 수 있으며, 산부인과 진료를 받으시기 바랍니다." },
          { q: "임신이 되면 생리가 완전히 멈추나요?", a: "임신 초기에는 착상혈(소량의 출혈)이 있을 수 있어 생리로 오해할 수 있습니다. 임신이 되면 일반적으로 생리가 중단됩니다. 생리 예정일에서 1주일 이상 지나도 생리가 없다면 임신 테스트를 해보세요." },
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
