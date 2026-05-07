"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const BASIC_DEDUCTION   = 2_500_000;       // 기본공제 250만원
const HIGH_PRICE_LIMIT  = 1_200_000_000;   // 고가주택 기준 12억원

// 장기보유특별공제율 (일반): 3년 6%, 이후 1년마다 2% 추가, 최대 10년 20%
function getLtdRate(years: number): number {
  if (years < 3) return 0;
  if (years >= 10) return 0.20;
  return 0.06 + (years - 3) * 0.02;
}

// 양도소득세 누진공제
function calcTax(base: number): number {
  if (base <= 0)                 return 0;
  if (base <= 12_000_000)        return base * 0.06;
  if (base <= 46_000_000)        return base * 0.15 -  1_080_000;
  if (base <= 88_000_000)        return base * 0.24 -  5_220_000;
  if (base <= 150_000_000)       return base * 0.35 - 14_900_000;
  if (base <= 300_000_000)       return base * 0.38 - 19_400_000;
  if (base <= 500_000_000)       return base * 0.40 - 25_400_000;
  if (base <= 1_000_000_000)     return base * 0.42 - 35_400_000;
  return                                base * 0.45 - 65_400_000;
}

function getRateLabel(base: number): string {
  if (base <= 12_000_000)        return "6%";
  if (base <= 46_000_000)        return "15%";
  if (base <= 88_000_000)        return "24%";
  if (base <= 150_000_000)       return "35%";
  if (base <= 300_000_000)       return "38%";
  if (base <= 500_000_000)       return "40%";
  if (base <= 1_000_000_000)     return "42%";
  return "45%";
}

const manwon = (n: number) => {
  if (n <= 0) return "0원";
  const eok = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man.toLocaleString()}만원`;
};

export default function ClientPage() {
  const [acquireMan, setAcquireMan] = useState(50_000); // 취득가액 (만원)
  const [transferMan, setTransferMan] = useState(70_000); // 양도가액 (만원)
  const [holdYears, setHoldYears]   = useState(5);
  const [isOneHouse, setIsOneHouse] = useState(false);

  const r = useMemo(() => {
    const acquire  = acquireMan  * 10_000;
    const transfer = transferMan * 10_000;

    // 1가구 1주택 2년 이상 보유 → 비과세 체크
    const taxFree      = isOneHouse && holdYears >= 2 && transfer <= HIGH_PRICE_LIMIT;
    const highPrice    = isOneHouse && holdYears >= 2 && transfer > HIGH_PRICE_LIMIT;

    const gain = Math.max(0, transfer - acquire);
    if (gain <= 0) return { noGain: true, gain: 0 };

    // 고가주택: 과세대상 양도차익 = 전체 차익 × (양도가액 - 12억) / 양도가액
    const taxableGain = highPrice
      ? gain * (transfer - HIGH_PRICE_LIMIT) / transfer
      : gain;

    const ltdRate      = getLtdRate(holdYears);
    const ltdAmount    = Math.floor(taxableGain * ltdRate);
    const incomeAmount = Math.max(0, taxableGain - ltdAmount);
    const taxBase      = Math.max(0, incomeAmount - BASIC_DEDUCTION);
    const incomeTax    = Math.floor(calcTax(taxBase));
    const localTax     = Math.floor(incomeTax * 0.1);
    const totalTax     = incomeTax + localTax;
    const rateLabel    = getRateLabel(taxBase);
    const effectiveRate = transfer > 0 ? (totalTax / transfer) * 100 : 0;

    return {
      noGain: false,
      taxFree, highPrice,
      acquire, transfer, gain, taxableGain,
      ltdRate, ltdAmount,
      incomeAmount,
      taxBase,
      incomeTax, localTax, totalTax,
      rateLabel, effectiveRate,
    };
  }, [acquireMan, transferMan, holdYears, isOneHouse]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">양도소득세 계산기</h1>
      <p className="text-gray-600 mb-6">
        취득가액·양도가액·보유기간을 입력하면 장기보유특별공제 반영 후 양도소득세를 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">매매 정보 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">취득가액 (만원)</label>
          <input
            type="number" min={1} value={acquireMan}
            onChange={(e) => setAcquireMan(Math.max(1, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-blue-600 mt-1">{manwon(acquireMan * 10_000)}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">양도가액 (만원)</label>
          <input
            type="number" min={1} value={transferMan}
            onChange={(e) => setTransferMan(Math.max(1, Number(e.target.value)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-blue-600 mt-1">{manwon(transferMan * 10_000)}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">보유기간 (년)</label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={0} max={50} value={holdYears}
              onChange={(e) => setHoldYears(Math.max(0, Number(e.target.value)))}
              className="w-full border p-2 rounded"
            />
            <span className="text-sm text-gray-500 shrink-0">년</span>
          </div>
          {holdYears >= 3 && (
            <p className="text-xs text-green-600 mt-1">
              장기보유특별공제 {(getLtdRate(holdYears) * 100).toFixed(0)}% 적용
            </p>
          )}
          {holdYears < 3 && holdYears > 0 && (
            <p className="text-xs text-gray-400 mt-1">3년 이상 보유 시 장기보유특별공제 적용</p>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isOneHouse}
            onChange={(e) => setIsOneHouse(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">1가구 1주택</span>
        </label>
      </section>

      {/* 양도차익 없음 */}
      {r.noGain && (
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
          <p className="font-bold text-gray-600">양도차익 없음</p>
          <p className="text-sm text-gray-500 mt-1">양도가액이 취득가액 이하이면 양도소득세가 발생하지 않습니다.</p>
        </section>
      )}

      {/* 1가구 1주택 비과세 */}
      {!r.noGain && r.taxFree && (
        <section className="bg-green-50 border border-green-200 rounded-lg p-5 mb-8">
          <p className="font-bold text-green-700">1가구 1주택 비과세 대상</p>
          <p className="text-sm text-green-600 mt-1">
            2년 이상 보유 + 양도가액 12억원 이하 조건을 충족해 양도소득세가 부과되지 않습니다.
          </p>
          <p className="text-xs text-green-500 mt-2">
            * 조정대상지역은 2년 이상 거주 요건이 추가될 수 있습니다.
          </p>
        </section>
      )}

      {/* 고가주택 안내 */}
      {!r.noGain && r.highPrice && (
        <section className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-5">
          <p className="font-bold text-orange-700">1가구 1주택 고가주택 (12억 초과)</p>
          <p className="text-sm text-orange-600 mt-1">
            양도가액 12억원 초과분에 대해서만 과세됩니다.
            과세대상 양도차익 = 전체 차익 × (양도가액 − 12억) ÷ 양도가액
          </p>
        </section>
      )}

      {/* 계산 결과 */}
      {!r.noGain && !r.taxFree && (
        <section className="bg-gray-100 rounded-lg p-5 mb-8">
          <h2 className="text-xl font-bold mb-4">계산 결과</h2>

          <div className="flex flex-col gap-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">양도차익</span>
              <span className="font-medium">{manwon(r.gain!)}</span>
            </div>
            {r.highPrice && (
              <div className="flex justify-between">
                <span className="text-gray-600">과세대상 양도차익 (12억 초과분)</span>
                <span className="font-medium">{manwon(r.taxableGain!)}</span>
              </div>
            )}
            {r.ltdRate! > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  장기보유특별공제 ({(r.ltdRate! * 100).toFixed(0)}%)
                </span>
                <span className="font-medium text-blue-600">- {manwon(r.ltdAmount!)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">양도소득금액</span>
              <span className="font-medium">{manwon(r.incomeAmount!)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">기본공제</span>
              <span className="font-medium text-blue-600">- 250만원</span>
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-2 mt-1">
              <span className="text-gray-600">과세표준</span>
              <span className="font-bold">{manwon(r.taxBase!)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">적용 세율</span>
              <span className="font-medium">{r.rateLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">양도소득세 (산출세액)</span>
              <span className="font-medium">{manwon(r.incomeTax!)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">지방소득세 (산출세액 × 10%)</span>
              <span className="font-medium">{manwon(r.localTax!)}</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded border">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-500">최종 납부세액</p>
              <p className="text-xs text-gray-400">실효세율 {r.effectiveRate!.toFixed(2)}%</p>
            </div>
            <p className="text-2xl font-bold text-blue-700">{manwon(r.totalTax!)}</p>
          </div>
        </section>
      )}

      {/* 세율 구간표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">양도소득세 세율 구간</h2>
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
                ["1,200만원 이하",         "6%",   "–"],
                ["4,600만원 이하",         "15%",  "108만원"],
                ["8,800만원 이하",         "24%",  "522만원"],
                ["1억 5,000만원 이하",     "35%",  "1,490만원"],
                ["3억원 이하",             "38%",  "1,940만원"],
                ["5억원 이하",             "40%",  "2,540만원"],
                ["10억원 이하",            "42%",  "3,540만원"],
                ["10억원 초과",            "45%",  "6,540만원"],
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
        <p className="text-xs text-gray-400 mt-2">* 지방소득세(산출세액 × 10%) 별도</p>
      </section>

      {/* 장기보유특별공제표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">장기보유특별공제율 (일반)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">보유기간</th>
                <th className="text-center p-3 border-b font-bold">공제율</th>
              </tr>
            </thead>
            <tbody>
              {[3,4,5,6,7,8,9,10].map((y) => (
                <tr key={y} className="border-b last:border-b-0">
                  <td className="p-3">{y === 10 ? "10년 이상" : `${y}년`}</td>
                  <td className="text-center p-3 font-medium text-blue-600">
                    {(getLtdRate(y) * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * 1가구 1주택 고가주택은 보유·거주기간별로 각 4%씩 최대 80%까지 공제 가능 (별도 계산)
        </p>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">양도소득세 계산 방식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          양도차익 = 양도가액 − 취득가액<br />
          양도소득금액 = 양도차익 − 장기보유특별공제<br />
          과세표준 = 양도소득금액 − 기본공제(250만원)<br />
          납부세액 = 산출세액 + 지방소득세(10%)
        </div>
        <p className="mb-3">
          취득세·중개수수료·수리비 등 필요경비를 취득가액에 합산하면 양도차익을 줄일 수 있습니다.
          3년 이상 보유하면 장기보유특별공제(6~20%)를 받을 수 있어 세 부담이 줄어듭니다.
        </p>
        <p>
          1가구 1주택은 2년 이상 보유하고 양도가액이 12억원 이하면 양도소득세가 비과세됩니다.
          12억원을 초과하는 고가주택은 초과분에 대해서만 과세됩니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 취득가액에 포함되는 항목은 무엇인가요?</p>
          <p>매매가액 외에 취득세, 부동산 중개수수료, 법무사 비용, 인테리어 비용(자본적 지출) 등 필요경비를 포함할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 양도소득세 신고는 언제 해야 하나요?</p>
          <p>부동산 양도일이 속하는 달의 말일부터 2개월 이내에 신고·납부해야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 보유기간 2년 미만이면 세율이 다른가요?</p>
          <p>단기 양도세율이 적용됩니다. 1년 미만 보유 시 70%, 1~2년 미만 보유 시 60%의 세율이 적용됩니다 (주택 기준).</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 다주택자는 세율이 더 높나요?</p>
          <p>조정대상지역 내 다주택자는 기본 세율에 중과세율(2주택 +20%, 3주택 이상 +30%)이 추가됩니다. 이 계산기는 일반 세율 기준입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 1가구 1주택 비과세 조건이 정확히 무엇인가요?</p>
          <p>보유기간 2년 이상, 양도가액 12억원 이하가 기본 조건입니다. 조정대상지역의 경우 2017년 8월 3일 이후 취득분은 2년 이상 거주 요건도 충족해야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 상속·증여받은 부동산의 취득가액은 어떻게 되나요?</p>
          <p>상속은 상속 개시일 기준 시가, 증여는 증여 당시 시가를 취득가액으로 봅니다. 정확한 산정은 세무사에게 문의하세요.</p>
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
