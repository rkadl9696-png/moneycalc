"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const GRADES = ["A+", "A0", "B+", "B0", "C+", "C0", "D+", "D0", "F"] as const;
type Grade = (typeof GRADES)[number];

const GRADE_TO_45: Record<Grade, number> = {
  "A+": 4.5, "A0": 4.0, "B+": 3.5, "B0": 3.0,
  "C+": 2.5, "C0": 2.0, "D+": 1.5, "D0": 1.0, "F": 0.0,
};
const GRADE_TO_43: Record<Grade, number> = {
  "A+": 4.3, "A0": 4.0, "B+": 3.3, "B0": 3.0,
  "C+": 2.3, "C0": 2.0, "D+": 1.3, "D0": 1.0, "F": 0.0,
};

interface Subject {
  id: number;
  name: string;
  credits: number;
  grade: Grade;
}

let nextId = 1;

export default function ClientPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: nextId++, name: "전공과목1", credits: 3, grade: "A+" },
    { id: nextId++, name: "교양과목1", credits: 2, grade: "B+" },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const totalCredits = subjects.reduce((s, sub) => s + sub.credits, 0);
    if (totalCredits === 0) return { gpa45: 0, gpa43: 0, totalCredits: 0 };
    const weighted45 = subjects.reduce((s, sub) => s + GRADE_TO_45[sub.grade] * sub.credits, 0);
    const weighted43 = subjects.reduce((s, sub) => s + GRADE_TO_43[sub.grade] * sub.credits, 0);
    return {
      gpa45: weighted45 / totalCredits,
      gpa43: weighted43 / totalCredits,
      totalCredits,
    };
  }, [subjects]);

  function addSubject() {
    if (subjects.length >= 15) return;
    setSubjects((prev) => [...prev, { id: nextId++, name: "", credits: 3, grade: "B+" }]);
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
      <h1 className="text-2xl font-bold mb-2">학점 계산기</h1>
      <p className="text-gray-600 mb-6">
        과목별 학점수와 성적을 입력하면 4.5 만점·4.3 만점 기준 평균 평점(GPA)을 자동 계산합니다.
      </p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">과목 입력 ({subjects.length}/15)</h2>
          <button
            onClick={addSubject}
            disabled={subjects.length >= 15}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-40"
          >
            + 과목 추가
          </button>
        </div>

        <div className="grid grid-cols-[1fr_80px_90px_36px] gap-2 text-xs text-gray-500 mb-2 px-1">
          <span>과목명</span>
          <span className="text-center">학점</span>
          <span className="text-center">성적</span>
          <span></span>
        </div>

        <div className="flex flex-col gap-2">
          {subjects.map((sub) => {
            const contrib45 = result.totalCredits > 0
              ? (GRADE_TO_45[sub.grade] * sub.credits) / result.totalCredits
              : 0;
            return (
              <div key={sub.id} className="grid grid-cols-[1fr_80px_90px_36px] gap-2 items-center">
                <input
                  type="text"
                  value={sub.name}
                  placeholder="과목명"
                  onChange={(e) => updateSubject(sub.id, "name", e.target.value)}
                  className="border rounded p-1.5 text-sm w-full"
                />
                <select
                  value={sub.credits}
                  onChange={(e) => updateSubject(sub.id, "credits", Number(e.target.value))}
                  className="border rounded p-1.5 text-sm"
                >
                  {[1, 2, 3, 4].map((c) => (
                    <option key={c} value={c}>{c}학점</option>
                  ))}
                </select>
                <select
                  value={sub.grade}
                  onChange={(e) => updateSubject(sub.id, "grade", e.target.value as Grade)}
                  className="border rounded p-1.5 text-sm"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>{g} ({GRADE_TO_45[g].toFixed(1)})</option>
                  ))}
                </select>
                <button
                  onClick={() => removeSubject(sub.id)}
                  className="text-gray-400 hover:text-red-500 text-lg font-bold"
                  title="삭제"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {subjects.length === 0 && (
          <p className="text-center text-gray-400 py-4 text-sm">과목을 추가하세요</p>
        )}
      </section>

      {/* 결과 섹션 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <p className="text-sm text-gray-500 mb-3">총 이수 학점: <strong>{result.totalCredits}학점</strong></p>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center bg-white rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">4.5 만점</p>
            <p className="text-3xl font-bold text-blue-600">{result.gpa45.toFixed(2)}</p>
          </div>
          <div className="text-center bg-white rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">4.3 만점</p>
            <p className="text-3xl font-bold text-purple-600">{result.gpa43.toFixed(2)}</p>
          </div>
        </div>

        {subjects.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2 font-bold">과목별 기여도 (4.5 기준)</p>
            {subjects.map((sub) => {
              const contrib = result.totalCredits > 0
                ? (GRADE_TO_45[sub.grade] * sub.credits) / result.totalCredits
                : 0;
              const pct = result.totalCredits > 0
                ? (sub.credits / result.totalCredits) * 100
                : 0;
              return (
                <div key={sub.id} className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-600 w-24 truncate">{sub.name || "과목"}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {contrib.toFixed(2)}p
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 성적 환산표 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">성적 환산표</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left border">등급</th>
                <th className="p-2 text-center border">4.5 만점</th>
                <th className="p-2 text-center border">4.3 만점</th>
              </tr>
            </thead>
            <tbody>
              {GRADES.map((g) => (
                <tr key={g} className="border-b">
                  <td className="p-2 border font-bold">{g}</td>
                  <td className="p-2 text-center border">{GRADE_TO_45[g].toFixed(1)}</td>
                  <td className="p-2 text-center border">{GRADE_TO_43[g].toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 핵심 개념 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">학점 평점(GPA) 계산 방법</h2>
        <p className="mb-3">
          평균 평점(GPA, Grade Point Average)은 수강한 과목의 성적과 학점 수를 가중 평균하여 계산합니다.
          계산 공식은 <strong>각 과목의 (성적 점수 × 학점 수)의 합계 ÷ 총 이수 학점</strong>입니다.
          학점이 많은 과목일수록 GPA에 더 큰 영향을 미칩니다.
        </p>
        <p className="mb-3">
          국내 대학교는 4.5 만점제와 4.3 만점제를 주로 사용합니다. 4.5 만점제에서는 A+이 4.5점,
          4.3 만점제에서는 A+이 4.3점으로 계산됩니다. 학교별로 성적 체계가 다를 수 있으니
          학교 규정을 먼저 확인하세요. F는 두 체계 모두 0점으로 처리되며 학점에 포함됩니다.
        </p>
        <p>
          장학금이나 대학원 진학을 목표로 하는 경우, 보통 3.5 이상(4.5 만점)을 목표로 하며,
          전공 과목의 비중이 교양보다 높아 전공 GPA를 별도로 관리하는 것도 중요합니다.
        </p>
      </section>

      {/* SEO 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">학점 계산기 활용법</h2>
        <p className="mb-3">
          대학교 학점 계산기는 학기 중 성적 관리, 장학금 신청 기준 확인, 졸업 요건 충족 여부 점검에 유용합니다.
          이 계산기는 최대 15개 과목을 입력할 수 있어 한 학기 전체 성적을 한 번에 계산할 수 있습니다.
          4.5 만점과 4.3 만점을 동시에 확인할 수 있어 편리합니다.
        </p>
        <p>
          성적 목표를 세울 때는 현재 GPA와 목표 GPA의 차이를 확인하고, 남은 학기에서
          얼마나 높은 성적을 받아야 하는지 역산해볼 수 있습니다. 학점 계산기, 평점 계산기,
          GPA 계산기로도 불리며 대학생이라면 꼭 활용해야 할 도구입니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 4.5 만점과 4.3 만점의 차이는?</p>
          <p>A+ 등급의 점수가 다릅니다. 4.5 만점제에서 A+은 4.5점이고, 4.3 만점제에서는 4.3점입니다. 나머지 등급도 일부 다르게 설정됩니다. 자신의 학교가 어떤 체계를 사용하는지 학교 학사 규정에서 확인하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. F 학점은 GPA에 어떻게 반영되나요?</p>
          <p>F 학점은 0점으로 처리되며, 해당 과목의 학점 수만큼 총 이수 학점에 포함됩니다. 따라서 F를 받으면 GPA가 크게 낮아집니다. F 과목은 재수강하여 성적 개선이 가능하며 대부분의 학교에서 최근 성적으로 대체합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 장학금 기준 GPA는 얼마나 되나요?</p>
          <p>대학마다 다르지만 일반적으로 성적 우수 장학금은 3.5~4.0(4.5 만점) 이상을 요구하는 경우가 많습니다. 국가장학금 소득분위 기준과 별도로 성적 기준도 있으니 학생처나 장학재단 안내를 확인하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. P/F 과목은 GPA에 포함되나요?</p>
          <p>P(Pass)/F(Fail) 과목은 일반적으로 GPA 계산에 포함되지 않습니다. P 학점을 받아도 GPA에 반영되지 않으며, 이수 학점으로만 인정됩니다. 단, 학교 규정에 따라 다를 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 학점이 큰 과목이 GPA에 더 영향을 미치나요?</p>
          <p>맞습니다. GPA는 가중평균이므로 3학점 과목은 1학점 과목보다 3배 큰 영향을 미칩니다. 따라서 학점이 많은 전공 과목에서 높은 성적을 받는 것이 GPA 향상에 효과적입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 졸업 요건 GPA는 어떻게 확인하나요?</p>
          <p>대부분의 대학에서 졸업을 위한 최저 GPA 기준이 있습니다. 보통 2.0(4.5 만점) 이상이며, 전공 과목 별도 기준이 있는 경우도 있습니다. 학교 홈페이지 학사 규정이나 학과 사무실에 문의하세요.</p>
        </div>
      </section>

      <RelatedCalculators current="/gpa-calc" />

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
