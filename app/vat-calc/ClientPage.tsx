"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type Mode = "supply_to_total" | "total_to_supply";

const SIMPLIFIED_RATES = [
  { label: "소매업 (15%)", rate: 0.15 },
  { label: "음식점업 (10%)", rate: 0.10 },
  { label: "제조업 (20%)", rate: 0.20 },
  { label: "숙박업 (25%)", rate: 0.25 },
  { label: "건설업 (30%)", rate: 0.30 },
  { label: "기타 서비스업 (30%)", rate: 0.30 },
  { label: "부동산임대업 (30%)", rate: 0.30 },
  { label: "과세유흥장소 (40%)", rate: 0.40 },
];

export default function ClientPage() {
  const [mode, setMode] = useState<Mode>("supply_to_total");
  const [amount, setAmount] = useState(1_000_000);
  const [vatRate, setVatRate] = useState(10);
  const [isSimplified, setIsSimplified] = useState(false);
  const [simplifiedRateIdx, setSimplifiedRateIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    if (isSimplified) {
      const sRate = SIMPLIFIED_RATES[simplifiedRateIdx].rate;
      if (mode === "supply_to_total") {
        const supply = amount;
        const vat = supply * 0.1 * sRate;
        const total = supply + vat;
        return { supply, vat, total };
      } else {
        // 간이과세 역산: total = supply * (1 + 0.1 * sRate)
        const total = amount;
        const supply = total / (1 + 0.1 * sRate);
        const vat = total - supply;
        return { supply, vat, total };
      }
    } else {
      const rate = vatRate / 100;
      if (mode === "supply_to_total") {
        const supply = amount;
        const vat = supply * rate;
        const total = supply + vat;
        return { supply, vat, total };
      } else {
        const total = amount;
        const supply = total / (1 + rate);
        const vat = total - supply;
        return { supply, vat, total };
      }
    }
  }, [mode, amount, vatRate, isSimplified, simplifiedRateIdx]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">부가가치세 계산기</h1>
      <p className="text-gray-600 mb-6">
        공급가액 ↔ VAT 포함가를 간편하게 계산합니다. 간이과세도 지원합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">계산 설정</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">계산 방향</label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("supply_to_total")}
              className={`flex-1 py-2 rounded border text-sm font-bold ${mode === "supply_to_total" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
            >
              공급가액 → VAT 포함가
            </button>
            <button
              onClick={() => setMode("total_to_supply")}
              className={`flex-1 py-2 rounded border text-sm font-bold ${mode === "total_to_supply" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
            >
              VAT 포함가 → 공급가액
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">
            {mode === "supply_to_total" ? "공급가액 (원)" : "VAT 포함가 (원)"}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            onBlur={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">{amount.toLocaleString()}원</p>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSimplified}
              onChange={(e) => setIsSimplified(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">간이과세자</span>
          </label>
        </div>

        {isSimplified ? (
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">업종별 부가율</label>
            <select
              value={simplifiedRateIdx}
              onChange={(e) => setSimplifiedRateIdx(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              {SIMPLIFIED_RATES.map((r, i) => (
                <option key={i} value={i}>{r.label}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">VAT율 (%)</label>
            <input
              type="number"
              value={vatRate}
              onChange={(e) => setVatRate(Number(e.target.value))}
              onBlur={(e) => setVatRate(Math.max(0, Math.min(100, Number(e.target.value) || 10)))}
              className="w-full border p-2 rounded"
            />
          </div>
        )}
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">계산 결과</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-blue-200">
            <span className="text-gray-700">공급가액</span>
            <span className="text-xl font-bold">{Math.round(result.supply).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-blue-200">
            <span className="text-gray-700">부가세 (VAT)</span>
            <span className="text-xl font-bold text-orange-600">+ {Math.round(result.vat).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-lg font-bold text-blue-800">VAT 포함 금액</span>
            <span className="text-2xl font-bold text-blue-700">{Math.round(result.total).toLocaleString()}원</span>
          </div>
        </div>
        {isSimplified && (
          <p className="text-xs text-gray-500 mt-3">
            * 간이과세: 부가율 {(SIMPLIFIED_RATES[simplifiedRateIdx].rate * 100).toFixed(0)}% 적용
          </p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">부가가치세란?</h2>
        <p className="mb-3">
          부가가치세(VAT, Value Added Tax)는 재화나 용역의 공급에 부과되는 간접세로, 최종 소비자가 부담하지만 사업자가 징수하여 국가에 납부합니다. 우리나라 표준 부가세율은 10%입니다. 공급가액의 10%가 부가세이며, 부가세 포함 금액(소비자가격)에서 역산할 경우 공급가액 = 부가세 포함 금액 ÷ 1.1이 됩니다.
        </p>
        <p className="mb-3">
          간이과세자는 연 매출 8,000만원 미만의 소규모 사업자로, 업종별 부가율(1.5%~4%)을 공급가액에 곱한 값에 10%를 추가 적용하여 납부세액을 계산합니다. 일반과세자에 비해 세금 부담이 작지만 매입세액 전액 공제가 불가능합니다.
        </p>
        <p>
          세금계산서 발행 시에는 공급가액과 세액을 반드시 구분 표기해야 합니다. 영세율(0%) 적용 대상은 수출품, 국외 제공 서비스 등이 있으며, 면세 항목(의료·교육·금융 등)은 부가세가 아예 부과되지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">부가세 신고 및 납부 안내</h2>
        <p className="mb-3">
          일반과세자는 1년에 2회(1기: 1~6월분 7월 신고, 2기: 7~12월분 다음해 1월 신고) 확정 신고·납부합니다. 법인사업자는 예정 신고도 추가로 해야 합니다. 간이과세자는 연 1회(1~12월분 다음해 1월) 신고합니다.
        </p>
        <p>
          홈택스(www.hometax.go.kr)를 통해 전자 신고가 가능하며, 전자신고 세액공제(1만원)를 받을 수 있습니다. 부가세 환급은 조기환급 신청 시 15일 이내, 일반 환급은 30일 이내에 이루어집니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 공급가액과 공급대가(VAT 포함가)의 차이는?</p>
          <p>공급가액은 VAT를 제외한 순수 재화·용역의 가격이고, 공급대가(또는 VAT 포함가)는 공급가액에 부가세를 더한 소비자 실제 지불 금액입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 10만원짜리 물건의 부가세는 얼마인가요?</p>
          <p>10만원이 VAT 포함가라면 공급가액은 약 90,909원, 부가세는 약 9,091원입니다. 10만원이 공급가액이라면 VAT 포함가는 11만원이고 부가세는 1만원입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 간이과세자도 세금계산서를 발행할 수 있나요?</p>
          <p>2021년 7월부터 연 매출 4,800만원 이상 간이과세자는 세금계산서 발행이 의무화되었습니다. 4,800만원 미만은 영수증을 발행할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 부가세 면세 항목에는 어떤 것이 있나요?</p>
          <p>미가공 식료품, 의료·교육·금융·보험 서비스, 도서·신문, 토지, 국가·지방자치단체가 공급하는 용역 등이 면세 대상입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 간이과세자와 일반과세자 중 어느 쪽이 유리한가요?</p>
          <p>매입이 많은 업종(도소매, 제조업 등)은 매입세액 전액 공제가 가능한 일반과세자가 유리할 수 있습니다. 매입이 적고 매출이 낮은 서비스업은 간이과세자가 세 부담이 적습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 해외 직구 상품에도 VAT가 부과되나요?</p>
          <p>네, 해외 직구 상품도 과세가격(물품가+운임+보험료)의 10%가 부가세로 부과됩니다. 다만 미국 직배송은 $200 이하, 기타는 $150 이하인 경우 면세입니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/vat-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
