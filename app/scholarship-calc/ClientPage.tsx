"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const SCHOLARSHIP_AMOUNT: Record<number, number> = {
  1: 5_200_000,
  2: 5_200_000,
  3: 5_200_000,
  4: 3_900_000,
  5: 3_680_000,
  6: 2_900_000,
  7: 2_240_000,
  8: 675_000,
  9: 0,
  10: 0,
};

const MIN_GRADE: Record<number, number> = {
  1: 2.0, 2: 2.0, 3: 2.5, 4: 2.5, 5: 2.5, 6: 2.5, 7: 2.5, 8: 2.5, 9: 0, 10: 0,
};

const TUITION_DEFAULT: Record<string, number> = {
  국공립: 2_500_000,
  사립: 4_500_000,
};

export default function ClientPage() {
  const [income, setIncome] = useState(4);
  const [gpa, setGpa] = useState(3.5);
  const [uniType, setUniType] = useState("사립");
  const [tuitionInput, setTuitionInput] = useState(4_500_000);

  useEffect(() => {
    setTuitionInput(TUITION_DEFAULT[uniType]);
  }, [uniType]);

  const r = useMemo(() => {
    const maxScholarship = SCHOLARSHIP_AMOUNT[income];
    const minGrade = MIN_GRADE[income];
    const meetsGrade = gpa >= minGrade;
    const eligible = maxScholarship > 0 && meetsGrade;
    const scholarship = eligible ? Math.min(maxScholarship, tuitionInput) : 0;
    const selfPay = tuitionInput - scholarship;
    return { maxScholarship, minGrade, meetsGrade, eligible, scholarship, selfPay };
  }, [income, gpa, tuitionInput]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();
  const fmtW = (n: number) => Math.round(n / 10_000) + "만원";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">장학금 계산기</h1>
      <p className="text-gray-600 mb-6">소득분위와 성적을 입력하면 국가장학금 I유형 수혜 금액과 자부담 등록금을 계산합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">소득분위 (1~10)</label>
          <input type="range" min={1} max={10} value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1분위 (저소득)</span>
            <span className="font-bold text-blue-600">{income}분위</span>
            <span>10분위 (고소득)</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">학점 (4.5 만점)</label>
          <input type="number" min={0} max={4.5} step={0.1} value={gpa}
            onChange={(e) => setGpa(Number(e.target.value))}
            className="w-full border p-2 rounded" />
          <p className="text-xs text-gray-400 mt-1">{income}분위 최소 요구 학점: {MIN_GRADE[income].toFixed(1)}</p>
        </div>
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
          <label className="block text-sm text-gray-500 mb-1">학기 등록금 (원)</label>
          <input type="number" min={0} step={100000} value={tuitionInput}
            onChange={(e) => setTuitionInput(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
      </section>

      <section className={`border-2 rounded-xl p-5 mb-8 ${r.eligible ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400"}`}>
        <h2 className="text-base font-bold mb-4">{r.eligible ? "장학금 수혜 가능" : "장학금 수혜 불가"}</h2>
        {!r.meetsGrade && income <= 8 && (
          <p className="text-red-600 text-sm mb-3">성적 기준 미달: {income}분위는 {r.minGrade.toFixed(1)} 이상 필요 (현재 {gpa.toFixed(1)})</p>
        )}
        {income > 8 && (
          <p className="text-orange-600 text-sm mb-3">9~10분위는 국가장학금 I유형 지원 대상이 아닙니다.</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">최대 장학금 (분위 기준)</p>
            <p className="text-xl font-bold text-gray-800">{fmtW(r.maxScholarship)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">실제 장학금 (등록금 한도)</p>
            <p className="text-xl font-bold text-green-600">{fmtW(r.scholarship)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">등록금</p>
            <p className="text-xl font-bold text-gray-700">{fmtW(tuitionInput)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">자부담 등록금</p>
            <p className="text-2xl font-bold text-blue-600">{fmtW(r.selfPay)}</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">국가장학금 I유형 지원 금액</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-2 px-3 text-gray-500">소득분위</th>
                <th className="text-right py-2 px-3 text-gray-500">연간 지원금액</th>
                <th className="text-right py-2 px-3 text-gray-500">최소 학점</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(SCHOLARSHIP_AMOUNT).map(([div, amount]) => (
                <tr key={div} className={`border-b last:border-0 ${Number(div) === income ? "bg-blue-50" : ""}`}>
                  <td className="py-2 px-3 font-medium">{div}분위</td>
                  <td className="py-2 px-3 text-right font-bold text-blue-600">{amount > 0 ? fmtW(amount) : "해당없음"}</td>
                  <td className="py-2 px-3 text-right text-gray-500">{MIN_GRADE[Number(div)] > 0 ? `${MIN_GRADE[Number(div)].toFixed(1)} 이상` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8 bg-gray-50 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">국가장학금 외 다른 장학금</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          국가장학금 I유형 외에도 다양한 장학금 제도가 있습니다.
          국가장학금 II유형은 대학이 자체적으로 등록금을 인하하는 방식으로 지원되며, 학생이 별도로 신청하지 않아도 됩니다.
          근로장학금은 교내·외 근로를 통해 월 최대 20만~50만 원을 지원받는 제도입니다.
          대학 자체 장학금(성적우수, 입학, 형제자매 등), 지자체 장학금, 기업·재단 장학금도 적극 활용하세요.
          한국장학재단 홈페이지(kosaf.go.kr)에서 다양한 장학 정보를 확인하고 매 학기 신청 기간을 놓치지 마세요.
          소득분위 산정은 건강보험료 기준으로 하며, 직전 학기 성적이 기준에 미치지 못하면 수혜가 제한될 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "국가장학금 신청 시기는 언제인가요?", a: "국가장학금은 1학기 신청(11~12월)과 2학기 신청(5~6월)으로 나뉩니다. 한국장학재단 홈페이지에서 신청 기간을 확인하고 기간 내에 꼭 신청하세요." },
          { q: "소득분위는 어떻게 결정되나요?", a: "소득분위는 가구원의 건강보험료 납부액과 재산 보유 현황을 기반으로 산정됩니다. 한국장학재단 홈페이지에서 소득분위 산정 기준을 확인할 수 있습니다." },
          { q: "편입생도 국가장학금을 받을 수 있나요?", a: "편입생도 소득 요건과 성적 기준을 충족하면 국가장학금을 신청할 수 있습니다. 다만 편입 학기를 기준으로 지원 학기 제한이 적용됩니다." },
          { q: "국가장학금과 다른 장학금을 동시에 받을 수 있나요?", a: "국가장학금과 대학 자체 장학금은 중복 수령이 가능하나, 장학금 합산액이 등록금을 초과하면 초과분은 지급되지 않습니다." },
          { q: "성적 미달로 장학금을 받지 못하면 다음 학기에 다시 신청할 수 있나요?", a: "성적 기준 미충족으로 장학금 수혜에 실패해도 다음 학기에 성적 기준을 충족하면 다시 신청하여 받을 수 있습니다." },
          { q: "군 휴학 중에도 국가장학금을 받을 수 있나요?", a: "군 복무 중 휴학 기간은 수혜 가능 학기 계산에서 제외됩니다. 복학 후 정상적으로 신청하면 됩니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/scholarship-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
