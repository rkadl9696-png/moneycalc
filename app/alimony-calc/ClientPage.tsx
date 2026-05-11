"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

function formatWon(n: number): string {
  if (n >= 100000000) {
    return `${(n / 100000000).toFixed(1)}억원`;
  }
  if (n >= 10000) {
    return `${Math.round(n / 10000)}만원`;
  }
  return `${n.toLocaleString()}원`;
}

export default function ClientPage() {
  const [marriageYears, setMarriageYears] = useState(5);
  const [reason, setReason] = useState<"외도" | "폭력" | "유기" | "기타">("외도");
  const [severity, setSeverity] = useState<"경" | "중" | "심각">("중");
  const [children, setChildren] = useState(1);
  const [incomeDiff, setIncomeDiff] = useState(200); // 만원/월

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    // 기본 위자료: 혼인 기간 × 기준금액
    let base = 10_000_000; // 1000만원 기본

    // 혼인 기간 가산
    if (marriageYears >= 1) base += Math.min(marriageYears, 20) * 2_000_000;

    // 유책 사유별 가산
    const reasonBonus: Record<string, number> = {
      외도: 30_000_000,
      폭력: 40_000_000,
      유기: 20_000_000,
      기타: 10_000_000,
    };
    base += reasonBonus[reason] ?? 0;

    // 유책 정도별 배율
    const severityMult: Record<string, number> = {
      경: 0.7,
      중: 1.0,
      심각: 1.5,
    };
    base = base * (severityMult[severity] ?? 1.0);

    // 자녀 가산 (자녀 1명당 500만원)
    base += children * 5_000_000;

    // 경제적 차이 가산 (월소득 차이 × 6)
    base += incomeDiff * 10000 * 6;

    // 상한 3억
    const clamped = Math.min(base, 300_000_000);
    // 하한 1000만
    const final = Math.max(clamped, 10_000_000);

    const low = Math.round(final * 0.7 / 1000000) * 1000000;
    const high = Math.round(final * 1.3 / 1000000) * 1000000;

    return { estimate: Math.round(final / 1000000) * 1000000, low, high };
  }, [marriageYears, reason, severity, children, incomeDiff]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">위자료 계산기</h1>
      <p className="text-gray-600 mb-6">
        혼인 기간, 유책 사유 등 주요 요소를 입력하면 한국 법원 기준 위자료 추정액을 계산합니다.
      </p>

      {/* 면책 문구 */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-5 text-sm text-yellow-800">
        ⚠️ 이 계산기는 참고용으로, 실제 법원 판결 금액과 다를 수 있습니다. 정확한 위자료는 변호사 상담을 받으시기 바랍니다.
      </div>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">정보 입력</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">혼인 기간 (년)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={marriageYears}
                onChange={(e) => setMarriageYears(Number(e.target.value))}
                onBlur={(e) => setMarriageYears(Math.min(50, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">년</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">유책 사유</label>
            <div className="grid grid-cols-4 gap-2">
              {(["외도", "폭력", "유기", "기타"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`py-2 rounded text-sm font-bold border transition-colors ${reason === r ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">유책 정도</label>
            <div className="grid grid-cols-3 gap-2">
              {(["경", "중", "심각"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`py-2 rounded text-sm font-bold border transition-colors ${severity === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">자녀 수</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                onBlur={(e) => setChildren(Math.min(10, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">명</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">쌍방 월소득 차이 (만원)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={incomeDiff}
                onChange={(e) => setIncomeDiff(Number(e.target.value))}
                onBlur={(e) => setIncomeDiff(Math.min(5000, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">만원</span>
            </div>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <p className="text-sm text-gray-500 mb-3">추정 위자료 범위</p>
        <div className="text-center mb-4">
          <p className="text-4xl font-bold text-blue-600">{formatWon(result.estimate)}</p>
          <p className="text-sm text-gray-500 mt-1">추정 중간값</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">하한 추정</p>
            <p className="text-lg font-bold text-gray-700">{formatWon(result.low)}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">상한 추정</p>
            <p className="text-lg font-bold text-gray-700">{formatWon(result.high)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          ※ 실제 법원 판결과 상당히 다를 수 있습니다. 반드시 전문 변호사와 상담하세요.
        </p>
      </section>

      {/* 핵심 개념 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">위자료란?</h2>
        <p className="mb-3">
          위자료는 이혼 시 유책 배우자가 상대방에게 지급하는 정신적 피해에 대한 손해배상금입니다.
          한국 법원에서는 혼인 기간, 유책 행위의 종류와 정도, 자녀 유무, 양 당사자의 경제력 등을
          종합적으로 고려하여 위자료를 결정합니다.
        </p>
        <p className="mb-3">
          실무상 한국 법원에서 인정되는 위자료는 보통 1,000만원에서 3억원 사이이며,
          혼인 기간이 길수록, 유책 행위가 심각할수록 높은 금액이 인정되는 경향이 있습니다.
          외도(불륜)의 경우에는 유책 배우자뿐 아니라 상간자에게도 손해배상 청구가 가능합니다.
        </p>
        <p>
          이 계산기는 참고용 추정치를 제공하며, 실제 위자료는 법원의 재량에 따라 다르게 결정됩니다.
          중요한 법적 결정을 내리기 전에 반드시 가정법 전문 변호사와 상담하시기 바랍니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 위자료와 재산 분할은 다른가요?</p>
          <p>네, 위자료는 정신적 손해에 대한 배상이고, 재산 분할은 혼인 중 형성된 공동 재산을 나누는 것입니다. 두 가지는 별개의 청구권으로 동시에 요구할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 쌍방 유책이면 위자료를 받을 수 없나요?</p>
          <p>쌍방에게 유책 사유가 있어도 각자의 유책 정도를 비교해 상대적으로 더 유책한 배우자가 위자료를 지급할 수 있습니다. 법원은 쌍방 과실 비율을 고려합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 위자료 청구 시효는 얼마나 되나요?</p>
          <p>위자료 청구권의 소멸시효는 이혼 성립 또는 손해 및 가해자를 안 날로부터 3년입니다. 이혼 후 3년이 경과하면 청구가 어려울 수 있으니 신속히 행동하는 것이 중요합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 협의 이혼과 재판 이혼에서 위자료 차이가 있나요?</p>
          <p>협의 이혼에서는 양 당사자가 합의한 금액으로 위자료를 정할 수 있습니다. 재판 이혼에서는 법원이 증거와 상황을 종합해 결정합니다. 합의가 안 되면 재판을 통해 청구해야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 위자료에 세금이 붙나요?</p>
          <p>위자료는 손해배상금의 성격으로 원칙적으로 소득세가 과세되지 않습니다. 다만 재산 분할의 경우 취득세나 양도세 문제가 생길 수 있으므로 세무사에게도 문의하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 상간자에게도 위자료를 청구할 수 있나요?</p>
          <p>배우자의 외도 상대방(상간자)에 대해서도 불법행위에 따른 손해배상을 청구할 수 있습니다. 이를 상간자 위자료 소송이라 하며, 통상 1,000만원~5,000만원 수준에서 판결이 납니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/alimony-calc" />

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
