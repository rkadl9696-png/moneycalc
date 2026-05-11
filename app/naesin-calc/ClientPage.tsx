"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

// 등급 상위 누적 비율 (%)
const GRADE_CUTOFFS = [4, 11, 23, 40, 60, 77, 89, 96, 100];
// 등급별 환산 점수
const GRADE_SCORE: Record<number, number> = {
  1: 10, 2: 9, 3: 8, 4: 7, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2,
};

function calcGrade(rank: number, total: number): number {
  if (total <= 0) return 9;
  const pct = (rank / total) * 100;
  for (let i = 0; i < GRADE_CUTOFFS.length; i++) {
    if (pct <= GRADE_CUTOFFS[i]) return i + 1;
  }
  return 9;
}

const GRADE_COLORS: Record<number, string> = {
  1: "text-red-600", 2: "text-orange-600", 3: "text-yellow-600",
  4: "text-lime-600", 5: "text-green-600", 6: "text-teal-600",
  7: "text-blue-600", 8: "text-indigo-600", 9: "text-gray-600",
};

interface Subject {
  id: number;
  name: string;
  rank: number;
  total: number;
  credit: number;
}

let nextId = 1;

export default function ClientPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: nextId++, name: "국어", rank: 5, total: 100, credit: 3 },
    { id: nextId++, name: "수학", rank: 8, total: 100, credit: 3 },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const withGrades = subjects.map((s) => ({
      ...s,
      grade: calcGrade(s.rank, s.total),
      pct: s.total > 0 ? (s.rank / s.total) * 100 : 0,
    }));

    const totalCredit = subjects.reduce((s, sub) => s + sub.credit, 0);
    const weightedGradeSum = withGrades.reduce(
      (s, sub) => s + sub.grade * sub.credit, 0
    );
    const avgGrade = totalCredit > 0 ? weightedGradeSum / totalCredit : 0;
    const avgScore = totalCredit > 0
      ? withGrades.reduce((s, sub) => s + GRADE_SCORE[sub.grade] * sub.credit, 0) / totalCredit
      : 0;

    return { withGrades, avgGrade, avgScore, totalCredit };
  }, [subjects]);

  function addSubject() {
    if (subjects.length >= 15) return;
    setSubjects((prev) => [...prev, { id: nextId++, name: "", rank: 1, total: 100, credit: 3 }]);
  }

  function removeSubject(id: number) {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  }

  function updateSubject(id: number, field: keyof Subject, value: string | number) {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">내신 등급 계산기</h1>
      <p className="text-gray-600 mb-6">
        석차와 전체 인원을 입력하면 내신 등급(1~9등급)과 환산 점수를 자동으로 계산합니다.
      </p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">과목별 석차 입력 ({subjects.length}/15)</h2>
          <button
            onClick={addSubject}
            disabled={subjects.length >= 15}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-40"
          >
            + 과목 추가
          </button>
        </div>

        <div className="grid grid-cols-[1fr_70px_70px_70px_36px] gap-2 text-xs text-gray-500 mb-2 px-1">
          <span>과목명</span>
          <span className="text-center">석차</span>
          <span className="text-center">전체인원</span>
          <span className="text-center">단위수</span>
          <span></span>
        </div>

        <div className="flex flex-col gap-2">
          {subjects.map((sub) => (
            <div key={sub.id} className="grid grid-cols-[1fr_70px_70px_70px_36px] gap-2 items-center">
              <input
                type="text"
                value={sub.name}
                placeholder="과목명"
                onChange={(e) => updateSubject(sub.id, "name", e.target.value)}
                className="border rounded p-1.5 text-sm w-full"
              />
              <input
                type="number"
                value={sub.rank}
                onChange={(e) => updateSubject(sub.id, "rank", Number(e.target.value))}
                onBlur={(e) => updateSubject(sub.id, "rank", Math.max(1, Number(e.target.value) || 1))}
                className="border rounded p-1.5 text-sm text-center"
              />
              <input
                type="number"
                value={sub.total}
                onChange={(e) => updateSubject(sub.id, "total", Number(e.target.value))}
                onBlur={(e) => updateSubject(sub.id, "total", Math.max(1, Number(e.target.value) || 1))}
                className="border rounded p-1.5 text-sm text-center"
              />
              <select
                value={sub.credit}
                onChange={(e) => updateSubject(sub.id, "credit", Number(e.target.value))}
                className="border rounded p-1.5 text-sm"
              >
                {[1, 2, 3, 4, 5].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                onClick={() => removeSubject(sub.id)}
                className="text-gray-400 hover:text-red-500 text-lg font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">평균 내신 등급</p>
            <p className="text-3xl font-bold text-blue-600">{result.avgGrade.toFixed(2)}</p>
            <p className="text-xs text-gray-400">가중평균</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">환산 점수</p>
            <p className="text-3xl font-bold text-purple-600">{result.avgScore.toFixed(2)}</p>
            <p className="text-xs text-gray-400">10점 만점</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3">
          <p className="text-xs text-gray-500 font-bold mb-2">과목별 등급</p>
          <div className="flex flex-col gap-1.5">
            {result.withGrades.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 w-20 truncate">{sub.name || "과목"}</span>
                <span className="text-gray-400 text-xs">석차 {sub.rank}/{sub.total} ({sub.pct.toFixed(1)}%)</span>
                <span className={`font-bold ${GRADE_COLORS[sub.grade]}`}>{sub.grade}등급</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 등급 기준표 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">내신 등급 기준</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border text-center">등급</th>
              <th className="p-2 border text-center">누적 비율</th>
              <th className="p-2 border text-center">환산 점수</th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3,4,5,6,7,8,9].map((g) => (
              <tr key={g} className="border-b">
                <td className={`p-2 border text-center font-bold ${GRADE_COLORS[g]}`}>{g}등급</td>
                <td className="p-2 border text-center">
                  {g === 1 ? "~4%" : `~${GRADE_CUTOFFS[g-1]}%`}
                </td>
                <td className="p-2 border text-center">{GRADE_SCORE[g]}점</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 핵심 개념 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">내신 등급이란?</h2>
        <p className="mb-3">
          고등학교 내신 등급은 학교 내 석차 백분율로 결정됩니다. 석차를 전체 수강 인원으로 나눈 비율이
          상위 4% 이내이면 1등급, 11% 이내이면 2등급입니다. 절대적인 점수가 아니라 반에서 몇 번째인지가
          중요합니다.
        </p>
        <p className="mb-3">
          내신 등급은 수시 전형, 특히 학생부 교과 전형에서 핵심 평가 요소입니다. 대학마다
          환산 방식이 달라 동일한 등급이라도 대학별 환산 점수가 다를 수 있습니다.
          단위수(학점)가 큰 과목이 평균 내신에 더 큰 영향을 미칩니다.
        </p>
        <p>
          이 계산기의 환산 점수는 참고용 기준(1등급=10점~9등급=2점)이며, 실제 대학 입시에서는
          각 대학의 환산 공식을 별도로 확인해야 합니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 동점자가 있으면 석차는 어떻게 계산되나요?</p>
          <p>동점자가 있을 경우 석차를 공동으로 처리합니다. 예를 들어 100명 중 2명이 공동 1등이면 두 사람 모두 석차 1위로 처리합니다. 등급 산정 시에는 동점자를 포함한 석차를 기준으로 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 내신 등급을 올리려면 어떻게 해야 하나요?</p>
          <p>내신은 상대평가이므로 같은 반 친구들보다 높은 점수를 받아야 합니다. 단위수가 큰 주요 과목(국어, 수학, 영어)에서 높은 등급을 받는 것이 평균 내신 향상에 효과적입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전교 석차와 반 석차 중 어느 것을 입력해야 하나요?</p>
          <p>내신 등급은 해당 과목을 수강한 전체 학생 중 석차를 기준으로 합니다. 같은 학년 전체가 같은 과목을 수강한다면 학년 전체 석차를 입력하시면 됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 예체능 과목도 내신에 포함되나요?</p>
          <p>체육, 음악, 미술 등 예체능 과목도 내신에 포함될 수 있습니다. 다만 대학 입시에서 활용하는 교과는 주로 주요 교과(국어, 수학, 영어, 사회, 과학)이며, 지원 대학의 반영 교과를 확인하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 수시 학생부 교과 전형에서 내신 반영 방법은?</p>
          <p>대학마다 반영 교과, 반영 학기, 가중치 등이 다릅니다. 일부 대학은 전 과목 반영, 일부는 주요 과목만 반영합니다. 각 대학의 수시 모집요강을 반드시 확인하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 내신 1등급은 어느 정도 성적인가요?</p>
          <p>내신 1등급은 해당 과목 수강생 상위 4% 이내입니다. 100명이 수강한다면 4명만 1등급을 받을 수 있습니다. 일반적으로 95점 이상의 고득점이 필요하지만, 학교와 과목에 따라 다릅니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/naesin-calc" />

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
