"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type Relation = "spouse" | "ascendant" | "descendant" | "other";

const DEDUCTION: Record<string, number> = {
  spouse:           600_000_000, // 배우자: 6억
  ascendant:         50_000_000, // 직계존속 성년: 5,000만
  ascendant_minor:   20_000_000, // 직계존속 미성년자: 2,000만
  descendant:        50_000_000, // 직계비속: 5,000만
  other:             10_000_000, // 기타: 1,000만
};

// 누진공제 방식 증여세 산출
function calcGiftTax(base: number): number {
  if (base <= 0)                return 0;
  if (base <= 100_000_000)      return base * 0.10;
  if (base <= 500_000_000)      return base * 0.20 -  10_000_000;
  if (base <= 1_000_000_000)    return base * 0.30 -  60_000_000;
  if (base <= 3_000_000_000)    return base * 0.40 - 160_000_000;
  return                               base * 0.50 - 460_000_000;
}

function getRateLabel(base: number): string {
  if (base <= 0)             return "해당 없음";
  if (base <= 100_000_000)   return "10%";
  if (base <= 500_000_000)   return "20%";
  if (base <= 1_000_000_000) return "30%";
  if (base <= 3_000_000_000) return "40%";
  return "50%";
}

const won = (n: number) => `${Math.round(n).toLocaleString()}원`;
const manwon = (n: number) => {
  if (n <= 0) return "0원";
  const eok = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man.toLocaleString()}만원`;
};

const RELATION_LABELS: Record<Relation, string> = {
  spouse:     "배우자",
  ascendant:  "직계존속 (부모·조부모)",
  descendant: "직계비속 (자녀·손자녀)",
  other:      "기타 친족",
};

export default function ClientPage() {
  const [amountMan, setAmountMan]     = useState(10000); // 만원
  const [relation, setRelation]       = useState<Relation>("ascendant");
  const [isMinor, setIsMinor]         = useState(false);
  const [applyDiscount, setApplyDiscount] = useState(true); // 신고세액공제 3%

  const r = useMemo(() => {
    const amount = amountMan * 10_000; // 원

    const deductionKey =
      relation === "ascendant" && isMinor ? "ascendant_minor" : relation;
    const deduction = DEDUCTION[deductionKey];
    const taxBase   = Math.max(0, amount - deduction);
    const rawTax    = calcGiftTax(taxBase);
    const discount  = applyDiscount ? Math.floor(rawTax * 0.03) : 0;
    const finalTax  = Math.max(0, rawTax - discount);
    const rateLabel = getRateLabel(taxBase);
    const effectiveRate = amount > 0 ? (finalTax / amount) * 100 : 0;

    return {
      amount, deduction, taxBase, rawTax, discount, finalTax, rateLabel, effectiveRate,
      taxFree: taxBase <= 0,
    };
  }, [amountMan, relation, isMinor, applyDiscount]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">증여세 계산기</h1>
      <p className="text-gray-600 mb-6">
        증여 금액과 증여자 관계를 입력하면 공제 후 납부세액을 바로 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">증여 정보 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">증여 금액 (만원)</label>
          <input
            type="number"
            min={1}
            value={amountMan}
            onChange={(e) => setAmountMan(Math.max(1, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-blue-600 mt-1 font-medium">
            입력 금액: {manwon(amountMan * 10_000)}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">증여자(주는 사람) 관계</label>
          <div className="flex flex-col gap-2">
            {(Object.keys(RELATION_LABELS) as Relation[]).map((key) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="relation"
                  checked={relation === key}
                  onChange={() => { setRelation(key); setIsMinor(false); }}
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  {RELATION_LABELS[key]}
                  <span className="ml-2 text-xs text-gray-400">
                    (공제 {manwon(
                      key === "ascendant"
                        ? DEDUCTION.ascendant
                        : DEDUCTION[key]
                    )})
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {relation === "ascendant" && (
          <div className="mb-4 pl-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isMinor}
                onChange={(e) => setIsMinor(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">
                수증자(받는 사람)가 미성년자
                <span className="ml-2 text-xs text-gray-400">(공제 2,000만원 적용)</span>
              </span>
            </label>
          </div>
        )}

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={applyDiscount}
            onChange={(e) => setApplyDiscount(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">
            신고세액공제 3% 적용
            <span className="ml-2 text-xs text-gray-400">(증여세 신고기한 내 자진신고 시)</span>
          </span>
        </label>
      </section>

      {/* 결과 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>

        <div className="flex flex-col gap-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">증여 금액</span>
            <span className="font-medium">{manwon(r.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">
              증여재산공제
              <span className="ml-1 text-xs text-gray-400">(10년 합산)</span>
            </span>
            <span className="font-medium text-blue-600">- {manwon(r.deduction)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-2 mt-1">
            <span className="text-gray-600">과세표준</span>
            <span className="font-bold">{manwon(r.taxBase)}</span>
          </div>
          {!r.taxFree && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">적용 세율</span>
                <span className="font-medium">{r.rateLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">산출세액</span>
                <span className="font-medium">{manwon(r.rawTax)}</span>
              </div>
              {applyDiscount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">신고세액공제 (3%)</span>
                  <span className="font-medium text-blue-600">- {won(r.discount)}</span>
                </div>
              )}
            </>
          )}
        </div>

        {r.taxFree ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="font-bold text-green-700">공제 한도 이내 — 납부세액 없음</p>
            <p className="text-sm text-green-600 mt-1">
              증여 금액({manwon(r.amount)})이 공제 한도({manwon(r.deduction)}) 이하입니다.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-white rounded border">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-500">최종 납부세액</p>
              <p className="text-xs text-gray-400">
                실효세율 {r.effectiveRate.toFixed(2)}%
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-700">{manwon(r.finalTax)}</p>
          </div>
        )}
      </section>

      {/* 세율 구간표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">증여세 세율 구간</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">과세표준</th>
                <th className="text-center p-3 border-b font-bold">세율</th>
                <th className="text-right p-3 border-b font-bold">누진공제</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1억원 이하",          "10%",  "–"],
                ["1억 초과 ~ 5억 이하",  "20%",  "1,000만원"],
                ["5억 초과 ~ 10억 이하", "30%",  "6,000만원"],
                ["10억 초과 ~ 30억 이하","40%",  "1억 6,000만원"],
                ["30억 초과",           "50%",  "4억 6,000만원"],
              ].map(([range, rate, deduction]) => (
                <tr key={range} className="border-b last:border-b-0">
                  <td className="p-3">{range}</td>
                  <td className="text-center p-3 font-bold text-blue-600">{rate}</td>
                  <td className="text-right p-3 text-gray-600">{deduction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 공제 한도표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">관계별 증여재산공제 한도 (10년 합산)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">증여자 관계</th>
                <th className="text-right p-3 border-b font-bold">공제 한도</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["배우자",              "6억원"],
                ["직계존속 (성년자녀)", "5,000만원"],
                ["직계존속 (미성년자녀)","2,000만원"],
                ["직계비속 (자녀→부모)", "5,000만원"],
                ["기타 친족",           "1,000만원"],
              ].map(([rel, limit]) => (
                <tr key={rel} className="border-b last:border-b-0">
                  <td className="p-3">{rel}</td>
                  <td className="text-right p-3 font-medium text-blue-600">{limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * 10년 이내 동일인으로부터 받은 증여 금액 합산 기준입니다.
        </p>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">증여세 계산 방식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          과세표준 = 증여 금액 − 증여재산공제<br />
          산출세액 = 과세표준 × 세율 − 누진공제<br />
          납부세액 = 산출세액 − 신고세액공제(3%)
        </div>
        <p className="mb-3">
          증여세는 증여받은 재산에서 관계에 따른 공제액을 뺀 과세표준에 세율을 적용합니다.
          공제 한도는 10년 단위로 합산되므로, 같은 사람에게 10년 내 받은 증여액을 모두 합산해야 합니다.
        </p>
        <p>
          증여세 신고는 증여일이 속하는 달의 말일부터 3개월 이내에 해야 하며, 기한 내 자진신고 시 산출세액의 3%를 공제받을 수 있습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 증여세 신고는 언제까지 해야 하나요?</p>
          <p>증여일이 속하는 달의 말일부터 3개월 이내에 수증자(받는 사람)가 신고해야 합니다. 기한 내 신고 시 3% 세액공제를 받을 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 공제 한도는 한 번만 쓸 수 있나요?</p>
          <p>아니요, 10년마다 초기화됩니다. 같은 사람에게 10년 이내에 받은 모든 증여액을 합산해 공제 한도를 적용합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 현금 증여도 신고해야 하나요?</p>
          <p>네, 현금도 증여세 과세 대상입니다. 공제 한도 이내라도 증빙을 위해 신고해두는 것이 유리할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 부모가 자녀 대출을 대신 갚아주면 증여세가 붙나요?</p>
          <p>네, 타인의 채무를 대신 변제해주는 것도 증여에 해당합니다. 공제 한도를 초과하면 증여세를 납부해야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 계산기 결과와 실제 납부세액이 다를 수 있나요?</p>
          <p>네, 10년 내 누적 증여 금액, 채무 공제, 감정평가액 등에 따라 실제 세액이 달라질 수 있습니다. 정확한 계산은 세무사에게 문의하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 증여세와 상속세의 차이는 무엇인가요?</p>
          <p>증여세는 살아있는 동안 재산을 무상으로 이전할 때 부과되고, 상속세는 사망 후 재산을 이전할 때 부과됩니다. 세율 구조는 동일하지만 공제 항목과 한도가 다릅니다.</p>
        </div>
      </section>

      <RelatedCalculators />

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
