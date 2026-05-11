"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

// 원점수 기준 등급 (100점 만점)
const SCORE_GRADE_CUTOFFS = [96, 87, 76, 63, 50, 37, 26, 17];

function getGrade(score: number): number {
  for (let i = 0; i < SCORE_GRADE_CUTOFFS.length; i++) {
    if (score >= SCORE_GRADE_CUTOFFS[i]) return i + 1;
  }
  return 9;
}

// 등급별 환산 점수 (대략적인 가산점 기준)
const GRADE_SCORE: Record<number, number> = {
  1: 200, 2: 196, 3: 189, 4: 179, 5: 166, 6: 150, 7: 130, 8: 106, 9: 80,
};

const GRADE_LABELS: Record<number, { color: string; bg: string }> = {
  1: { color: "text-red-600", bg: "bg-red-50" },
  2: { color: "text-orange-600", bg: "bg-orange-50" },
  3: { color: "text-yellow-600", bg: "bg-yellow-50" },
  4: { color: "text-lime-600", bg: "bg-lime-50" },
  5: { color: "text-green-600", bg: "bg-green-50" },
  6: { color: "text-teal-600", bg: "bg-teal-50" },
  7: { color: "text-blue-600", bg: "bg-blue-50" },
  8: { color: "text-indigo-600", bg: "bg-indigo-50" },
  9: { color: "text-gray-600", bg: "bg-gray-50" },
};

export default function ClientPage() {
  const [korean, setKorean] = useState(80);
  const [math, setMath] = useState(80);
  const [englishGrade, setEnglishGrade] = useState(2);
  const [inquiry1, setInquiry1] = useState(40);
  const [inquiry2, setInquiry2] = useState(40);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const korGrade = getGrade(korean);
    const mathGrade = getGrade(math);
    const engGrade = englishGrade;
    const inq1Grade = getGrade(Math.round((inquiry1 / 50) * 100));
    const inq2Grade = getGrade(Math.round((inquiry2 / 50) * 100));

    const subjects = [
      { name: "국어", score: korean, maxScore: 100, grade: korGrade },
      { name: "수학", score: math, maxScore: 100, grade: mathGrade },
      { name: "영어", score: null, maxScore: null, grade: engGrade },
      { name: "탐구1", score: inquiry1, maxScore: 50, grade: inq1Grade },
      { name: "탐구2", score: inquiry2, maxScore: 50, grade: inq2Grade },
    ];

    const avgGrade =
      (korGrade + mathGrade + engGrade + inq1Grade + inq2Grade) / 5;

    return { subjects, avgGrade };
  }, [korean, math, englishGrade, inquiry1, inquiry2]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">수능 등급 계산기</h1>
      <p className="text-gray-600 mb-6">
        과목별 원점수를 입력하면 수능 등급과 환산 점수를 계산합니다. 영어는 절대평가 등급을 직접 선택하세요.
      </p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">원점수 입력</h2>

        <div className="flex flex-col gap-4">
          {/* 국어 */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">국어 (0~100점)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={korean}
                onChange={(e) => setKorean(Number(e.target.value))}
                onBlur={(e) => setKorean(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">점</span>
            </div>
          </div>

          {/* 수학 */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">수학 (0~100점)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={math}
                onChange={(e) => setMath(Number(e.target.value))}
                onBlur={(e) => setMath(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">점</span>
            </div>
          </div>

          {/* 영어 (절대평가) */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">영어 (절대평가 등급 직접 선택)</label>
            <select
              value={englishGrade}
              onChange={(e) => setEnglishGrade(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                <option key={g} value={g}>{g}등급</option>
              ))}
            </select>
          </div>

          {/* 탐구1 */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">탐구1 (0~50점)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inquiry1}
                onChange={(e) => setInquiry1(Number(e.target.value))}
                onBlur={(e) => setInquiry1(Math.min(50, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">점</span>
            </div>
          </div>

          {/* 탐구2 */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">탐구2 (0~50점)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inquiry2}
                onChange={(e) => setInquiry2(Number(e.target.value))}
                onBlur={(e) => setInquiry2(Math.min(50, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">점</span>
            </div>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <p className="text-sm text-gray-600 mb-3 font-bold">과목별 등급 결과</p>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {result.subjects.map((sub) => {
            const style = GRADE_LABELS[sub.grade] ?? GRADE_LABELS[9];
            return (
              <div key={sub.name} className={`rounded-lg p-3 text-center ${style.bg}`}>
                <p className="text-xs text-gray-500 mb-1">{sub.name}</p>
                {sub.score !== null && sub.maxScore !== null && (
                  <p className="text-xs text-gray-400 mb-0.5">{sub.score}점</p>
                )}
                {sub.score === null && (
                  <p className="text-xs text-gray-400 mb-0.5">절대평가</p>
                )}
                <p className={`text-2xl font-bold ${style.color}`}>{sub.grade}등급</p>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-sm text-gray-500">평균 등급</p>
          <p className="text-2xl font-bold text-blue-600">{result.avgGrade.toFixed(2)}</p>
          <p className="text-xs text-gray-400">5과목 단순 평균</p>
        </div>
      </section>

      {/* 등급 기준표 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">원점수 등급 기준 (100점 만점 환산)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border text-left">등급</th>
              <th className="p-2 border text-center">원점수 기준</th>
              <th className="p-2 border text-center">상위 비율</th>
            </tr>
          </thead>
          <tbody>
            {[
              { grade: 1, cut: "96점 이상", pct: "상위 4%" },
              { grade: 2, cut: "87~95점", pct: "상위 11%" },
              { grade: 3, cut: "76~86점", pct: "상위 23%" },
              { grade: 4, cut: "63~75점", pct: "상위 40%" },
              { grade: 5, cut: "50~62점", pct: "상위 60%" },
              { grade: 6, cut: "37~49점", pct: "상위 77%" },
              { grade: 7, cut: "26~36점", pct: "상위 89%" },
              { grade: 8, cut: "17~25점", pct: "상위 96%" },
              { grade: 9, cut: "16점 이하", pct: "하위 100%" },
            ].map((row) => (
              <tr key={row.grade} className="border-b">
                <td className={`p-2 border font-bold ${GRADE_LABELS[row.grade]?.color}`}>{row.grade}등급</td>
                <td className="p-2 border text-center">{row.cut}</td>
                <td className="p-2 border text-center text-gray-500">{row.pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-2">※ 실제 수능은 표준점수 기준이며, 이 계산기는 원점수 기준 추정값입니다.</p>
      </section>

      {/* 핵심 개념 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">수능 등급 계산 방법</h2>
        <p className="mb-3">
          대학수학능력시험(수능)의 등급은 1~9등급으로 나뉩니다. 상위 4% 이내가 1등급, 11% 이내가 2등급이며
          이런 방식으로 9등급까지 구분됩니다. 국어·수학·탐구는 상대평가(표준점수 기반)이며,
          영어·한국사는 절대평가로 원점수 구간으로 등급이 결정됩니다.
        </p>
        <p className="mb-3">
          실제 수능에서는 원점수를 그대로 사용하지 않고 평균과 표준편차를 이용한 표준점수로 변환합니다.
          이 계산기는 원점수 기준 등급을 추정하는 용도로, 실제 수능 등급과 다를 수 있습니다.
          탐구 과목은 50점 만점을 100점으로 환산하여 등급을 계산합니다.
        </p>
        <p>
          대학 입시에서는 수능 등급 외에도 학생부 내신, 수시·정시 전형 방식에 따라 반영 비율이 달라집니다.
          목표 대학의 입시 요강을 반드시 확인하세요.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 영어는 왜 절대평가인가요?</p>
          <p>영어는 2018학년도 수능부터 절대평가로 전환되었습니다. 90점 이상이면 1등급, 80점대가 2등급 등 10점 간격으로 등급이 구분됩니다. 상대평가 방식의 점수 경쟁 완화가 목적입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 표준점수란 무엇인가요?</p>
          <p>표준점수는 원점수를 시험 난이도와 응시생 분포를 반영해 변환한 점수입니다. 쉬운 시험에서 높은 원점수를 받아도 표준점수가 낮을 수 있고, 어려운 시험에서 낮은 원점수도 높은 표준점수가 될 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 탐구 과목은 몇 개 선택해야 하나요?</p>
          <p>일반적으로 탐구 영역에서 2과목을 선택합니다. 사회탐구, 과학탐구, 직업탐구 영역 중 선택하며, 각 과목은 50점 만점입니다. 지원 대학과 학과에 따라 특정 탐구 영역이 필수인 경우도 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 수능 1등급 컷은 매년 달라지나요?</p>
          <p>네, 상대평가이므로 매년 시험 난이도와 응시생 분포에 따라 등급 컷이 달라집니다. 난이도가 높으면 1등급 원점수 컷이 낮아지고, 쉬우면 높아집니다. 한국교육과정평가원 공식 발표를 확인하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 수능 점수로 어느 대학에 지원할 수 있나요?</p>
          <p>대학마다 수능 반영 방식이 다릅니다. 수능 등급이나 표준점수, 백분위를 조합해 활용합니다. 대학입시 포털(어디가, 입시정보 등)에서 환산 점수로 지원 가능 대학을 검색할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 수능 재수 시 전년도 성적을 사용할 수 있나요?</p>
          <p>일반적으로 재수생은 당해 연도 수능 성적만 활용합니다. 일부 수시 전형에서 이전 수능 성적을 활용하는 경우가 있을 수 있으나, 정시는 당해 수능 성적을 기준으로 합니다. 지원 대학 요강을 반드시 확인하세요.</p>
        </div>
      </section>

      <RelatedCalculators current="/suneung-calc" />

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
