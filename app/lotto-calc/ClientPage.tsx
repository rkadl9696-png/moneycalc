"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

// C(45,6) = 8,145,060
const TOTAL = 8145060;

const PRIZES = [
  {
    rank: "1등",
    match: "6개 일치",
    prob: 1 / TOTAL,
    prize: "평균 20억원+",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-400",
  },
  {
    rank: "2등",
    match: "5개 + 보너스 일치",
    prob: 6 / TOTAL,
    prize: "평균 6천만원",
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-300",
  },
  {
    rank: "3등",
    match: "5개 일치",
    prob: 252 / TOTAL,
    prize: "평균 150만원",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-300",
  },
  {
    rank: "4등",
    match: "4개 일치",
    prob: 13545 / TOTAL,
    prize: "5만원",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-300",
  },
  {
    rank: "5등",
    match: "3개 일치",
    prob: 182780 / TOTAL,
    prize: "5천원",
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-300",
  },
];

function formatProb(p: number): string {
  if (p >= 0.01) return `${(p * 100).toFixed(2)}%`;
  if (p >= 0.001) return `약 ${Math.round(1 / p)}분의 1`;
  return `약 ${Math.round(1 / p).toLocaleString()}분의 1`;
}

function formatExpected(p: number, tickets: number, weeks: number): string {
  const expected = p * tickets * weeks;
  if (expected >= 1) return `약 ${expected.toFixed(1)}회`;
  const onceIn = Math.round(1 / expected);
  if (onceIn > 10000) return `약 ${(onceIn / 10000).toFixed(0)}만 주에 1회`;
  return `약 ${onceIn.toLocaleString()}주에 1회`;
}

export default function ClientPage() {
  const [tickets, setTickets] = useState(5);
  const [weeks, setWeeks] = useState(52);

  const totalSpend = useMemo(() => tickets * weeks * 1000, [tickets, weeks]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">로또 확률 계산기</h1>
      <p className="text-gray-600 mb-6">
        로또 6/45 당첨 확률과 구매 매수·기간별 기대 당첨 횟수를 계산합니다.
      </p>

      {/* 등위별 확률 */}
      <section className="mb-5">
        <h2 className="text-base font-bold mb-3">등위별 당첨 확률</h2>
        <div className="flex flex-col gap-2">
          {PRIZES.map((p) => (
            <div
              key={p.rank}
              className={`flex items-center justify-between px-4 py-3 rounded-lg border ${p.bg} ${p.border}`}
            >
              <div>
                <span className={`font-bold text-sm ${p.color}`}>{p.rank}</span>
                <span className="text-xs text-gray-500 ml-2">{p.match}</span>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${p.color}`}>{formatProb(p.prob)}</p>
                <p className="text-xs text-gray-400">{p.prize}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 시뮬레이션 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">나의 기대 당첨 횟수</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">주당 구매 매수</label>
            <div className="flex items-center gap-2">
              <input
                type="number" min={1} max={100} value={tickets}
                onChange={(e) => setTickets(Number(e.target.value))}
                onBlur={(e) => setTickets(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">매</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">구매 기간</label>
            <div className="flex items-center gap-2">
              <input
                type="number" min={1} max={5200} value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                onBlur={(e) => setWeeks(Math.min(5200, Math.max(1, Number(e.target.value) || 1)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">주</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mb-4">
          총 구매: <strong>{(tickets * weeks).toLocaleString()}매</strong>
          <span className="mx-2">·</span>
          총 지출: <strong>{totalSpend.toLocaleString()}원</strong>
        </div>

        <div className="flex flex-col gap-2">
          {PRIZES.map((p) => (
            <div key={p.rank} className="flex items-center justify-between text-sm py-1 border-b last:border-b-0">
              <span className={`font-bold ${p.color}`}>{p.rank}</span>
              <span className="text-gray-600">{formatExpected(p.prob, tickets, weeks)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 1등 당첨에 드는 기간 */}
      <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-2 text-yellow-700">1등 당첨 기대 기간</h2>
        <p className="text-sm text-gray-600">
          주 {tickets}매씩 구매 시, 평균{" "}
          <strong className="text-yellow-700">
            {Math.round(TOTAL / tickets).toLocaleString()}주
            ({Math.round(TOTAL / tickets / 52).toLocaleString()}년)
          </strong>
          에 한 번 1등 기대
        </p>
        <p className="text-xs text-gray-400 mt-2">
          * 확률은 이론값이며 실제 당첨을 보장하지 않습니다.
        </p>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">로또 확률 계산 방법</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          전체 경우의 수: C(45,6) = 8,145,060<br />
          1등: 6개 모두 일치 → 1/8,145,060<br />
          2등: 5개 + 보너스 → 6/8,145,060<br />
          3등: 5개 일치 → 252/8,145,060<br />
          4등: 4개 일치 → 13,545/8,145,060<br />
          5등: 3개 일치 → 182,780/8,145,060
        </div>
        <p>
          로또 6/45는 1~45 중 6개를 선택하는 복권입니다.
          1등은 6개 모두 일치해야 하며, 약 814만 분의 1의 확률입니다.
          당첨금은 판매금의 50%를 등위별로 분배하므로 회차마다 다릅니다.
        </p>
      </section>

      <RelatedCalculators current="/lotto-calc" />

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
