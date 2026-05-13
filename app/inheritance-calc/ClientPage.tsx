"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type HeirType = "spouse_only" | "children_only" | "spouse_and_children" | "other";

function calcInheritanceTax(taxBase: number): number {
  if (taxBase <= 0) return 0;
  if (taxBase <= 100_000_000) return taxBase * 0.1;
  if (taxBase <= 500_000_000) return taxBase * 0.2 - 10_000_000;
  if (taxBase <= 1_000_000_000) return taxBase * 0.3 - 60_000_000;
  if (taxBase <= 3_000_000_000) return taxBase * 0.4 - 160_000_000;
  return taxBase * 0.5 - 460_000_000;
}

export default function ClientPage() {
  const [totalAsset, setTotalAsset] = useState(1_000_000_000);
  const [heirType, setHeirType] = useState<HeirType>("spouse_and_children");
  const [childCount, setChildCount] = useState(2);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    // 기초공제 2억
    const basicDeduction = 200_000_000;

    // 배우자공제: 배우자 있을 경우 최소 5억, 최대 30억
    let spouseDeduction = 0;
    if (heirType === "spouse_only" || heirType === "spouse_and_children") {
      spouseDeduction = Math.min(3_000_000_000, Math.max(500_000_000, totalAsset * 0.5));
    }

    // 일괄공제: 기초공제+인적공제 vs 5억 중 큰 값
    const personalDeduction = childCount * 50_000_000;
    const itemizedDeduction = basicDeduction + personalDeduction;
    const lumpSumDeduction = 500_000_000;

    let totalDeduction: number;
    if (heirType === "spouse_only") {
      // 배우자만: 배우자공제만 적용
      totalDeduction = spouseDeduction;
    } else if (heirType === "children_only" || heirType === "other") {
      // 배우자 없음: 일괄공제 vs 항목공제
      totalDeduction = Math.max(itemizedDeduction, lumpSumDeduction);
    } else {
      // 배우자+자녀: 배우자공제 + max(일괄공제, 항목공제)
      const childDeduction = Math.max(itemizedDeduction, lumpSumDeduction);
      totalDeduction = spouseDeduction + childDeduction;
    }

    const taxBase = Math.max(0, totalAsset - totalDeduction);
    const grossTax = calcInheritanceTax(taxBase);
    // 신고세액공제 3%
    const reportingCredit = grossTax * 0.03;
    const finalTax = Math.max(0, grossTax - reportingCredit);

    return {
      basicDeduction,
      spouseDeduction,
      totalDeduction,
      taxBase,
      grossTax,
      reportingCredit,
      finalTax,
    };
  }, [totalAsset, heirType, childCount]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">상속세 계산기</h1>
      <p className="text-gray-600 mb-6">
        상속 재산과 상속인 구성을 입력하면 공제 후 납부세액을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">상속 정보 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">상속 재산 총액 (원)</label>
          <input
            type="number"
            value={totalAsset}
            onChange={(e) => setTotalAsset(Number(e.target.value))}
            onBlur={(e) => setTotalAsset(Math.max(0, Number(e.target.value) || 0))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">{totalAsset.toLocaleString()}원</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">상속인 구성</label>
          <select
            value={heirType}
            onChange={(e) => setHeirType(e.target.value as HeirType)}
            className="w-full border p-2 rounded"
          >
            <option value="spouse_and_children">배우자 + 자녀</option>
            <option value="spouse_only">배우자만</option>
            <option value="children_only">자녀만</option>
            <option value="other">기타</option>
          </select>
        </div>

        {(heirType === "children_only" || heirType === "spouse_and_children" || heirType === "other") && (
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">자녀 수</label>
            <input
              type="number"
              min={0}
              max={10}
              value={childCount}
              onChange={(e) => setChildCount(Number(e.target.value))}
              onBlur={(e) => setChildCount(Math.min(10, Math.max(0, Number(e.target.value) || 0)))}
              className="w-full border p-2 rounded"
            />
          </div>
        )}
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">계산 결과</h2>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">상속 재산 총액</span>
            <span className="font-bold">{result.taxBase > 0 ? totalAsset.toLocaleString() : totalAsset.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">총 공제액</span>
            <span className="font-bold text-green-700">- {result.totalDeduction.toLocaleString()}원</span>
          </div>
          <div className="border-t border-blue-200 pt-2 flex justify-between">
            <span className="text-gray-600">과세표준</span>
            <span className="font-bold">{result.taxBase.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">산출세액</span>
            <span className="font-bold">{result.grossTax.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">신고세액공제 (3%)</span>
            <span className="font-bold text-green-700">- {result.reportingCredit.toLocaleString()}원</span>
          </div>
        </div>
        <div className="border-t border-blue-300 pt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-blue-800">최종 납부세액</span>
          <span className="text-2xl font-bold text-blue-700">{result.finalTax.toLocaleString()}원</span>
        </div>
        {result.finalTax === 0 && (
          <p className="text-sm text-green-600 mt-2 font-medium">공제 후 과세표준이 없어 납부세액이 없습니다.</p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">상속세란?</h2>
        <p className="mb-3">
          상속세는 피상속인(돌아가신 분)의 재산을 상속받을 때 부과되는 세금입니다. 우리나라 상속세는 유산 전체에 과세하는 유산세 방식을 채택하고 있으며, 상속인이 받은 재산에서 각종 공제를 차감한 과세표준에 누진세율을 적용합니다.
        </p>
        <p className="mb-3">
          기초공제 2억원은 모든 상속에 기본 적용되며, 배우자가 있을 경우 법정 상속 지분액과 실제 상속액 중 작은 금액을 기준으로 최소 5억원에서 최대 30억원까지 배우자공제가 가능합니다. 자녀·미성년자·장애인 등 인적공제를 합산한 금액이 5억원에 미달할 경우 일괄공제 5억원을 적용받을 수 있습니다.
        </p>
        <p>
          산출세액에서 기한 내 신고 시 3%의 신고세액공제를 추가로 받을 수 있습니다. 상속세는 상속개시일이 속하는 달의 말일로부터 6개월 이내에 신고·납부해야 합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">상속세 세율표 및 절세 방법</h2>
        <p className="mb-3">
          상속세 세율은 과세표준 1억원 이하 10%, 5억원 이하 20%(누진공제 1천만원), 10억원 이하 30%(누진공제 6천만원), 30억원 이하 40%(누진공제 1억 6천만원), 30억원 초과 50%(누진공제 4억 6천만원)의 5단계 누진세율 구조입니다. 상속재산이 클수록 세율이 높아지므로 사전 증여를 통한 절세 계획이 중요합니다. 10년 이내 증여 재산은 상속 재산에 합산되므로 장기적인 재산 이전 계획을 세우는 것이 효과적입니다.
        </p>
        <p>
          배우자공제는 실제 상속받는 금액 기준으로 최대 30억원까지 가능하므로, 배우자가 생존해 있는 경우 상속세 부담이 크게 줄어들 수 있습니다. 금융재산공제(금융재산의 20%, 최대 2억원), 동거주택 상속공제(최대 6억원) 등 추가 공제 항목도 활용하면 절세에 도움이 됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 상속세 신고 기한은 언제까지인가요?</p>
          <p>상속개시일(사망일)이 속하는 달의 말일부터 6개월 이내에 신고해야 합니다. 해외 거주자는 9개월 이내입니다. 기한 내 신고 시 3% 신고세액공제 혜택을 받습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 배우자공제는 얼마까지 받을 수 있나요?</p>
          <p>배우자가 실제로 상속받는 금액과 법정상속분 중 작은 금액을 기준으로 최소 5억원에서 최대 30억원까지 공제받을 수 있습니다. 배우자가 아무것도 상속받지 않더라도 5억원은 공제됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 일괄공제 5억원과 기초공제+인적공제 중 어느 것이 유리한가요?</p>
          <p>자녀가 없거나 적을 경우 일괄공제 5억원이 유리하고, 자녀가 많거나 미성년자·장애인이 있는 경우 인적공제 합산액이 더 클 수 있습니다. 두 방식을 비교해 유리한 쪽을 선택합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 사전 증여 재산도 상속세에 포함되나요?</p>
          <p>상속개시일 이전 10년 이내에 상속인에게 증여한 재산(5년 이내 비상속인 증여 포함)은 상속 재산에 합산됩니다. 단, 이미 납부한 증여세는 상속세에서 공제됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 상속세를 분할 납부할 수 있나요?</p>
          <p>납부세액이 2천만원을 초과하는 경우 연부연납(최대 10년 분할납부)을 신청할 수 있습니다. 물납(부동산·유가증권으로 납부)도 일정 요건 충족 시 가능합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 이 계산기의 결과는 정확한가요?</p>
          <p>이 계산기는 주요 공제항목만 반영한 간이 계산 결과입니다. 금융재산공제, 동거주택공제, 가업상속공제 등 추가 공제항목은 반영되지 않으므로 실제 신고 시에는 세무사와 상담하시기 바랍니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/inheritance-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
