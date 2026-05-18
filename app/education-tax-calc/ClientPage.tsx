"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [selfEdu, setSelfEdu] = useState(3_000_000);
  const [elemMidHighCount, setElemMidHighCount] = useState(1);
  const [elemMidHighFee, setElemMidHighFee] = useState(2_000_000);
  const [uniCount, setUniCount] = useState(0);
  const [uniFee, setUniFee] = useState(0);
  const [preSchoolCount, setPreSchoolCount] = useState(0);
  const [preSchoolFee, setPreSchoolFee] = useState(0);

  const r = useMemo(() => {
    const RATE = 0.15;
    const selfDeductible = selfEdu;
    const elemLimit = 3_000_000;
    const uniLimit = 9_000_000;
    const preLimit = 3_000_000;

    const elemDeductible = Math.min(elemMidHighFee, elemLimit) * elemMidHighCount;
    const uniDeductible = Math.min(uniFee, uniLimit) * uniCount;
    const preDeductible = Math.min(preSchoolFee, preLimit) * preSchoolCount;

    const totalDeductible = selfDeductible + elemDeductible + uniDeductible + preDeductible;
    const taxCredit = Math.round(totalDeductible * RATE);

    return { selfDeductible, elemDeductible, uniDeductible, preDeductible, totalDeductible, taxCredit };
  }, [selfEdu, elemMidHighCount, elemMidHighFee, uniCount, uniFee, preSchoolCount, preSchoolFee]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">교육비 세액공제 계산기</h1>
      <p className="text-gray-600 mb-6">교육비를 입력하면 연말정산 시 세액공제 금액(15%)을 자동으로 계산합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">교육비 입력</h2>

        <div className="mb-5 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-bold text-blue-700 mb-2">본인 교육비 (한도 없음)</p>
          <input type="number" min={0} step={100000} value={selfEdu}
            onChange={(e) => setSelfEdu(Number(e.target.value))}
            className="w-full border p-2 rounded" />
          <p className="text-xs text-gray-500 mt-1">대학원, 직업능력개발 훈련비 등 전액 공제</p>
        </div>

        <div className="mb-5 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-bold text-gray-700 mb-2">초·중·고 자녀 (1인당 300만원 한도)</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">자녀 수</label>
              <input type="number" min={0} max={10} value={elemMidHighCount}
                onChange={(e) => setElemMidHighCount(Number(e.target.value))}
                className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500">1인당 교육비 (원)</label>
              <input type="number" min={0} step={100000} value={elemMidHighFee}
                onChange={(e) => setElemMidHighFee(Number(e.target.value))}
                className="w-full border p-2 rounded text-sm" />
            </div>
          </div>
        </div>

        <div className="mb-5 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-bold text-gray-700 mb-2">대학생 자녀 (1인당 900만원 한도)</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">자녀 수</label>
              <input type="number" min={0} max={10} value={uniCount}
                onChange={(e) => setUniCount(Number(e.target.value))}
                className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500">1인당 교육비 (원)</label>
              <input type="number" min={0} step={100000} value={uniFee}
                onChange={(e) => setUniFee(Number(e.target.value))}
                className="w-full border p-2 rounded text-sm" />
            </div>
          </div>
        </div>

        <div className="mb-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-bold text-gray-700 mb-2">취학 전 아동 (1인당 300만원 한도)</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">아동 수</label>
              <input type="number" min={0} max={10} value={preSchoolCount}
                onChange={(e) => setPreSchoolCount(Number(e.target.value))}
                className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500">1인당 교육비 (원)</label>
              <input type="number" min={0} step={100000} value={preSchoolFee}
                onChange={(e) => setPreSchoolFee(Number(e.target.value))}
                className="w-full border p-2 rounded text-sm" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-4 text-blue-800">세액공제 계산 결과</h2>
        <div className="flex flex-col gap-3 mb-4 text-sm">
          {[
            { label: "본인 공제 교육비", value: r.selfDeductible },
            { label: "초·중·고 자녀 공제 교육비", value: r.elemDeductible },
            { label: "대학생 자녀 공제 교육비", value: r.uniDeductible },
            { label: "취학전 아동 공제 교육비", value: r.preDeductible },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-600">{label}</span>
              <span className="font-bold">{fmt(value)}원</span>
            </div>
          ))}
        </div>
        <div className="border-t border-blue-200 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">총 공제 대상 교육비</span>
            <span className="font-bold text-gray-800">{fmt(r.totalDeductible)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">세액공제율</span>
            <span className="font-bold text-blue-600">15%</span>
          </div>
        </div>
        <div className="border-t border-blue-200 pt-4 mt-4">
          <p className="text-xs text-gray-500 mb-0.5">예상 세액공제 (환급) 금액</p>
          <p className="text-3xl font-bold text-red-600">{fmt(r.taxCredit)}원</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">교육비 세액공제란?</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          교육비 세액공제는 근로자가 본인 또는 부양가족의 교육비를 납부한 경우, 해당 금액의 15%를 세액에서 직접 공제해주는 제도입니다.
          본인 교육비는 한도 없이 전액 공제되며, 초·중·고 자녀는 1인당 연 300만 원, 대학생 자녀는 1인당 연 900만 원, 취학전 아동은 1인당 연 300만 원이 한도입니다.
          공제 대상 교육비에는 수업료·입학금·교과서 구입비·학교급식비(학교 내) 등이 포함됩니다.
          학원비·교습비는 초등학교 취학 전 아동의 경우에만 공제가 가능하며, 초등학생 이상의 학원비는 공제되지 않습니다.
          연말정산 시 교육비 납입 영수증이나 교육비 납입 내역을 제출해야 합니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">교육비 공제 한도 요약</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-500">대상</th>
                <th className="text-right py-2 text-gray-500">연간 한도</th>
                <th className="text-right py-2 text-gray-500">공제율</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["본인 (대학원·직업훈련)", "한도 없음", "15%"],
                ["초·중·고 자녀", "1인당 300만원", "15%"],
                ["대학생 자녀", "1인당 900만원", "15%"],
                ["취학전 아동", "1인당 300만원", "15%"],
              ].map(([target, limit, rate]) => (
                <tr key={target} className="border-b last:border-0">
                  <td className="py-2 text-gray-700">{target}</td>
                  <td className="py-2 text-right font-bold text-blue-600">{limit}</td>
                  <td className="py-2 text-right text-gray-600">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          배우자나 형제자매를 위해 지출한 교육비도 공제 대상입니다(단, 부양가족 요건 충족 시).
          장애인 특수교육비는 별도로 전액 공제됩니다.
          교육비는 현금영수증, 카드 결제 내역이 국세청 연말정산 간소화 서비스에 자동 반영됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "학원비도 교육비 세액공제가 되나요?", a: "초등학교 취학 전 아동의 학원·교습소 비용은 공제됩니다. 그러나 초등학생 이상 자녀의 학원비는 교육비 세액공제 대상이 아닙니다." },
          { q: "교육비 공제는 자동으로 처리되나요?", a: "국세청 연말정산 간소화 서비스에서 교육기관이 제출한 자료가 자동 반영됩니다. 누락된 항목은 직접 영수증을 제출해야 합니다." },
          { q: "영어유치원(사립유치원) 비용도 공제되나요?", a: "정부에서 인가한 유치원(영어유치원 포함)의 수업료는 공제되지만, 원외 학원 교습비 등은 공제되지 않습니다. 기관 유형을 확인하세요." },
          { q: "대학원 등록금도 공제되나요?", a: "본인이 다니는 대학원 등록금은 한도 없이 전액 공제됩니다. 그러나 자녀의 대학원 비용은 공제 대상이 아닙니다." },
          { q: "해외 유학 비용도 공제되나요?", a: "국외 교육기관 학비는 초·중·고에 해당하는 경우에만 공제되며, 조건(국내 미취학 중 해외 체류 등)이 있습니다. 자세한 요건은 국세청에 문의하세요." },
          { q: "교육비 세액공제와 소득공제의 차이는?", a: "소득공제는 과세소득에서 차감하는 방식이고, 세액공제는 산출세액에서 직접 차감합니다. 세액공제가 더 직접적인 세금 절감 효과가 있습니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/education-tax-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
