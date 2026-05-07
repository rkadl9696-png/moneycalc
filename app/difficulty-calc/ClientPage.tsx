"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const criteria = [
  {
    key: "complexity",
    label: "업무 복잡도",
    options: ["단순", "보통", "복잡", "매우 복잡", "극도로 복잡"],
  },
  {
    key: "deadline",
    label: "마감 압박",
    options: ["여유", "보통", "촉박", "매우 촉박", "긴급"],
  },
  {
    key: "expertise",
    label: "필요 전문성",
    options: ["누구나", "약간", "전문가", "고급 전문가", "최고 전문가"],
  },
  {
    key: "collaboration",
    label: "협업 난이도",
    options: ["혼자", "2~3명", "5명 이하", "10명 이하", "10명 이상"],
  },
  {
    key: "uncertainty",
    label: "불확실성",
    options: ["명확", "대체로 명확", "보통", "불명확", "매우 불명확"],
  },
];

function getGrade(total: number): { label: string; color: string; bg: string; border: string; advice: string } {
  if (total <= 9) return { label: "쉬움", color: "text-green-600", bg: "bg-green-50", border: "border-green-400", advice: "충분히 혼자 처리할 수 있는 수준입니다. 꼼꼼하게 완료하세요." };
  if (total <= 14) return { label: "보통", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-400", advice: "적절한 계획과 집중력이 필요합니다. 중간 점검을 권장합니다." };
  if (total <= 19) return { label: "어려움", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-400", advice: "전문적인 역량과 팀 지원이 필요합니다. 리스크 관리에 주의하세요." };
  return { label: "매우 어려움", color: "text-red-600", bg: "bg-red-50", border: "border-red-400", advice: "최고 수준의 전문성과 체계적인 프로젝트 관리가 필요합니다. 상급자와 상의하세요." };
}

export default function ClientPage() {
  const [scores, setScores] = useState<Record<string, number>>({
    complexity: 1,
    deadline: 1,
    expertise: 1,
    collaboration: 1,
    uncertainty: 1,
  });

  const r = useMemo(() => {
    const total = Object.values(scores).reduce((sum, v) => sum + v, 0);
    const grade = getGrade(total);
    const percentage = ((total - 5) / 20) * 100;
    return { total, grade, percentage };
  }, [scores]);

  const setScore = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/" className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors">← 계산기 목록</Link>
      <h1 className="text-2xl font-bold mb-2">🎯 난이도 계산기</h1>
      <p className="text-gray-600 mb-6">업무나 프로젝트의 5가지 항목을 평가하면 난이도 지수를 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">항목별 평가</h2>
        <div className="flex flex-col gap-5">
          {criteria.map((criterion) => (
            <div key={criterion.key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">{criterion.label}</label>
                <span className="text-sm text-gray-500">{scores[criterion.key]}점 / 5점</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {criterion.options.map((opt, idx) => {
                  const val = idx + 1;
                  return (
                    <button key={opt} onClick={() => setScore(criterion.key, val)}
                      className={`py-2 px-1 rounded border text-xs transition-colors text-center ${scores[criterion.key] === val ? "bg-blue-600 text-white border-blue-600 font-bold" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className={`rounded-lg p-5 mb-8 border-2 ${r.grade.bg} ${r.grade.border}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">총점</p>
            <p className={`text-4xl font-bold ${r.grade.color}`}>{r.total}점</p>
            <p className="text-xs text-gray-400">5 ~ 25점</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">난이도</p>
            <p className={`text-3xl font-bold ${r.grade.color}`}>{r.grade.label}</p>
          </div>
        </div>
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div className={`h-4 rounded-full transition-all ${r.total <= 9 ? "bg-green-500" : r.total <= 14 ? "bg-yellow-500" : r.total <= 19 ? "bg-orange-500" : "bg-red-500"}`}
              style={{ width: `${r.percentage}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>쉬움 (5)</span>
            <span>보통 (10)</span>
            <span>어려움 (15)</span>
            <span>매우 어려움 (25)</span>
          </div>
        </div>
        <p className={`text-sm font-medium ${r.grade.color}`}>{r.grade.advice}</p>
      </section>

      {/* 항목별 점수 표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">항목별 점수 현황</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b">항목</th>
                <th className="text-center p-3 border-b">선택</th>
                <th className="text-center p-3 border-b">점수</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((criterion) => (
                <tr key={criterion.key} className="border-b last:border-b-0">
                  <td className="p-3 font-medium">{criterion.label}</td>
                  <td className="text-center p-3 text-gray-600">{criterion.options[scores[criterion.key] - 1]}</td>
                  <td className="text-center p-3 font-bold">{scores[criterion.key]}점</td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="p-3 font-bold">합계</td>
                <td className="text-center p-3" />
                <td className={`text-center p-3 font-bold text-lg ${r.grade.color}`}>{r.total}점</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">난이도 지수란?</h2>
        <p className="mb-3 text-gray-700">
          업무·프로젝트 난이도 지수는 단순히 기술적 복잡도만이 아니라 마감 압박, 필요 전문성, 협업 규모, 불확실성 등 다양한 요소를 종합하여 난이도를 평가합니다. 각 항목에서 1~5점을 선택하면 총 5~25점 범위의 점수가 산출됩니다. 이를 통해 업무 배분, 자원 할당, 리스크 관리에 활용할 수 있습니다.
        </p>
        <p className="text-gray-700">
          특히 프로젝트 관리에서 난이도 평가는 WBS(작업 분류 체계)와 함께 사용하면 효과적입니다. 고난이도 업무에는 더 많은 시간과 인력을 배정하고, 저난이도 업무는 신입이나 중급자에게 위임하여 팀 전체의 효율성을 높일 수 있습니다.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">업무 난이도 관리의 중요성</h2>
        <p className="mb-3 text-gray-700">
          업무 난이도를 정확히 파악하면 현실적인 일정 계획 수립, 적절한 인력 배치, 번아웃 예방에 도움이 됩니다. 고난이도 업무에는 버퍼 기간을 충분히 두고, 복잡한 업무는 더 작은 단위로 분할하여 관리하는 것이 효과적입니다. 스크럼이나 칸반 등의 애자일 방법론에서도 업무 난이도 추정(스토리 포인트)이 핵심 요소입니다.
        </p>
        <p className="mb-3 text-gray-700">
          불확실성이 높은 업무는 스파이크(Spike) 기간을 별도로 두어 분석한 후 본 작업에 착수하는 것이 리스크를 줄이는 방법입니다. 마감 압박이 심한 업무는 MVP(최소 기능 제품) 방식으로 핵심 기능만 먼저 완성하고 점진적으로 개선하는 전략을 사용하세요.
        </p>
        <p className="text-gray-700">
          팀으로 수행하는 고난이도 업무에서는 명확한 역할 분담, 정기적인 진행 상황 공유, 병목 지점 조기 발견이 성공의 핵심입니다. RACI(Responsible, Accountable, Consulted, Informed) 매트릭스를 활용하면 복잡한 협업 업무의 책임 소재를 명확히 할 수 있습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "난이도 점수가 높을수록 무조건 나쁜 건가요?", a: "아닙니다. 고난이도 업무는 높은 성장 기회를 의미하기도 합니다. 중요한 것은 난이도에 맞게 충분한 시간과 자원을 확보하는 것입니다. 도전적인 업무를 통해 역량을 키울 수 있습니다." },
          { q: "난이도 평가를 팀원들과 함께 해야 하나요?", a: "가능하면 관련 팀원들이 함께 평가하는 것이 더 정확합니다. 애자일에서는 플래닝 포커(Planning Poker) 등의 방법으로 팀 전체가 난이도를 추정합니다. 개인마다 관점이 다를 수 있으므로 합의를 통해 평가하세요." },
          { q: "불확실성이 높은 업무를 어떻게 처리하나요?", a: "불확실성이 높을수록 사전 분석(프로토타이핑, 기술 검증)에 더 많은 시간을 투자해야 합니다. 스파이크 작업을 통해 불확실 요소를 먼저 해소하고, 이후 작업에서 예측 가능성을 높이세요." },
          { q: "협업 인원이 많을수록 왜 난이도가 올라가나요?", a: "코디네이션 오버헤드 때문입니다. 팀원이 n명이면 커뮤니케이션 채널은 n(n-1)/2개가 됩니다. 5명이면 10개, 10명이면 45개의 채널이 생깁니다. 소통 비용이 기하급수적으로 증가하여 실제 작업 시간이 줄어듭니다." },
          { q: "마감 압박을 낮추기 위한 방법은?", a: "일정을 세울 때 버퍼 기간을 10~20% 추가하고, 작업을 작은 단위로 분할하여 중간 마일스톤을 설정하세요. 조기에 리스크를 파악하여 이해관계자와 소통하고, 필요하면 범위 조정(스코프 협상)을 요청하는 것도 방법입니다." },
          { q: "이 계산기를 성과 평가에 사용할 수 있나요?", a: "참고 자료로 활용할 수 있지만, 단독으로 성과 평가에 사용하는 것은 적합하지 않습니다. 성과 평가에는 결과물의 품질, 기여도, 협업 능력 등 다양한 요소가 고려되어야 합니다. 이 도구는 업무 계획 수립과 자원 배분을 위한 보조 도구로 사용하세요." },
        ].map((item) => (
          <div key={item.q} className="mb-4 border-b pb-4 last:border-b-0">
            <p className="font-bold text-gray-800 mb-1">Q. {item.q}</p>
            <p className="text-gray-600 text-sm">{item.a}</p>
          </div>
        ))}
      </section>

      <RelatedCalculators />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">계산기 목록으로 돌아가기</Link>
      </div>
    </div>
  );
}
