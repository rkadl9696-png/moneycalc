"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const TUITION: Record<string, Record<string, number>> = {
  국공립: { 인문사회: 200, 자연이공: 250, 공학: 250, 의학: 350, 예체능: 230, 사범: 200 },
  사립: { 인문사회: 350, 자연이공: 450, 공학: 450, 의학: 650, 예체능: 500, 사범: 380 },
};

const ADMISSION_FEE: Record<string, number> = { 국공립: 20, 사립: 60 };

export default function ClientPage() {
  const [uniType, setUniType] = useState("사립");
  const [dept, setDept] = useState("인문사회");
  const [semesters, setSemesters] = useState(8);
  const [includeAdmission, setIncludeAdmission] = useState(true);

  const r = useMemo(() => {
    const perSemester = TUITION[uniType][dept] * 10_000;
    const totalTuition = perSemester * semesters;
    const admFee = includeAdmission ? ADMISSION_FEE[uniType] * 10_000 : 0;
    const total = totalTuition + admFee;
    const perYear = perSemester * 2;
    return { perSemester, totalTuition, admFee, total, perYear };
  }, [uniType, dept, semesters, includeAdmission]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();
  const fmtW = (n: number) => (n / 10_000).toFixed(0) + "만원";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">대학 등록금 계산기</h1>
      <p className="text-gray-600 mb-6">대학 유형과 학과 계열을 선택하면 학기별·4년 총 등록금을 자동으로 계산합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">대학 유형</label>
          <div className="flex gap-2">
            {["국공립", "사립"].map((t) => (
              <button key={t} onClick={() => setUniType(t)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${uniType === t ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">학과 계열</label>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(TUITION[uniType]).map((d) => (
              <button key={d} onClick={() => setDept(d)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${dept === d ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">재학 학기 수 (최대 8학기)</label>
          <input type="number" min={1} max={12} value={semesters}
            onChange={(e) => setSemesters(Math.min(12, Math.max(1, Number(e.target.value))))}
            className="w-full border p-2 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="admFee" checked={includeAdmission} onChange={(e) => setIncludeAdmission(e.target.checked)} className="w-4 h-4" />
          <label htmlFor="admFee" className="text-sm text-gray-600">입학금 포함 ({ADMISSION_FEE[uniType]}만원)</label>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-4 text-blue-800">계산 결과</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">학기당 등록금</p>
            <p className="text-xl font-bold text-gray-800">{fmtW(r.perSemester)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">연간 등록금</p>
            <p className="text-xl font-bold text-gray-700">{fmtW(r.perYear)}</p>
          </div>
          {includeAdmission && (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">입학금</p>
              <p className="text-xl font-bold text-gray-700">{fmtW(r.admFee)}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{semesters}학기 등록금 합계</p>
            <p className="text-xl font-bold text-blue-600">{fmtW(r.totalTuition)}</p>
          </div>
        </div>
        <div className="border-t border-blue-200 pt-4 mt-4">
          <p className="text-xs text-gray-500 mb-0.5">총 납부 금액 (입학금 포함)</p>
          <p className="text-3xl font-bold text-red-600">{fmt(r.total)}원</p>
          <p className="text-xs text-gray-400 mt-1">{(r.total / 100_000_000).toFixed(2)}억원</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">대학 유형별 평균 등록금 비교</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-2 px-3 text-gray-500">계열</th>
                <th className="text-right py-2 px-3 text-gray-500">국공립 (학기)</th>
                <th className="text-right py-2 px-3 text-gray-500">사립 (학기)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(TUITION.국공립).map((d) => (
                <tr key={d} className={`border-b last:border-0 ${dept === d ? "bg-blue-50" : ""}`}>
                  <td className="py-2 px-3 font-medium">{d}</td>
                  <td className="py-2 px-3 text-right text-blue-600">{TUITION.국공립[d]}만원</td>
                  <td className="py-2 px-3 text-right text-orange-600">{TUITION.사립[d]}만원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">위 금액은 교육부 통계 기준 평균값이며 대학마다 차이가 있습니다.</p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">대학 등록금 절감 방법</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          대학 등록금 부담을 줄이는 가장 효과적인 방법은 국가장학금을 활용하는 것입니다.
          소득분위에 따라 최대 520만 원까지 지원받을 수 있으며, 성적 기준(1~2분위 C학점, 3~8분위 B학점)을 유지해야 합니다.
          대학 자체 장학금, 지방자치단체 장학금, 기업·재단 장학금 등도 적극 활용하세요.
          군 복무 중 학점은행제나 원격대학 수강으로 학점을 취득하면 복학 후 학비를 줄일 수 있습니다.
          취업 후 상환 학자금 대출(ICL)을 활용하면 재학 중 원금 상환 부담 없이 학업에 집중할 수 있습니다.
          학교 근로장학생이나 교내 아르바이트를 통해 등록금 일부를 충당하는 것도 좋은 방법입니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "국가장학금은 누가 받을 수 있나요?", a: "대한민국 국적의 국내 대학 재학생 중 소득분위 8분위 이하(연간 가구 소득 약 1억 원 이하)이면 신청 자격이 있습니다. 성적 기준과 이수학점 기준도 충족해야 합니다." },
          { q: "입학금이 없는 대학도 있나요?", a: "2023년부터 국공립대학은 입학금을 폐지했으며, 많은 사립대학도 입학금을 폐지하거나 인하했습니다. 입학 전에 해당 대학의 입학금 현황을 확인하세요." },
          { q: "취업 후 상환 학자금 대출(ICL)이란?", a: "한국장학재단의 ICL은 재학 중 이자를 지원하고 취업 후 소득이 생겼을 때부터 상환하는 제도입니다. 연간 소득이 상환 기준소득 이하이면 상환 의무가 없습니다." },
          { q: "등록금 분할 납부가 가능한가요?", a: "많은 대학에서 등록금 분납 제도를 운영합니다. 2~4회 분할 납부를 허용하며, 일부 대학은 신용카드 할부 결제도 가능합니다. 해당 대학 학생처에 문의하세요." },
          { q: "휴학 중에도 등록금을 납부해야 하나요?", a: "일반 휴학 중에는 등록금 납부 의무가 없습니다. 다만 복학 시 정해진 기간 내에 등록금을 납부해야 하며, 복학 학기의 등록금은 당해 기준 금액이 적용됩니다." },
          { q: "편입 시 등록금은 어떻게 되나요?", a: "편입 시에는 편입한 대학의 등록금을 납부합니다. 편입 학기부터는 새 대학의 등록금 기준이 적용되며, 기존 대학의 이수 학점은 인정받을 수 있습니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/tuition-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
