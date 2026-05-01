"use client";

import { useState } from "react";
import Link from "next/link";

// 🔥 만원 → 27만5천원 형태 변환
const formatManwon = (value: number) => {
  const man = Math.floor(value);
  const thousand = Math.round((value - man) * 10);

  if (thousand > 0) {
    return `${man}만${thousand}천원`;
  }
  return `${man}만원`;
};

// 🔥 10000 → 1억원 변환
const formatMoney = (manwon: number) => {
  const eok = Math.floor(manwon / 10000);
  const rest = manwon % 10000;

  if (eok > 0 && rest > 0) return `${eok}억 ${rest.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${manwon.toLocaleString()}만원`;
};

export default function Page() {
  const [jeonseDeposit, setJeonseDeposit] = useState(10000);
  const [rentDeposit, setRentDeposit] = useState(1000);
  const [monthlyRent, setMonthlyRent] = useState(50);
  const [rate, setRate] = useState(3);
  const [months, setMonths] = useState(24);

  // 계산
  const jeonseMonthlyCost = (jeonseDeposit * rate) / 100 / 12;
  const rentDepositMonthlyCost = (rentDeposit * rate) / 100 / 12;
  const rentTotalMonthlyCost = monthlyRent + rentDepositMonthlyCost;

  const monthlyDiff = Math.abs(jeonseMonthlyCost - rentTotalMonthlyCost);
  const totalDiff = monthlyDiff * months;

  const isJeonseBetter = jeonseMonthlyCost < rentTotalMonthlyCost;

  return (
    <div className="max-w-2xl mx-auto p-6">

        <Link
        href="/"
        className="inline-block mb-6 text-base font-semibold text-blue-600 hover:text-blue-800"
        >
        ← 메인으로 돌아가기
        </Link>

      <h1 className="text-2xl font-bold mb-2">전세 vs 월세 계산기</h1>

      <p className="text-gray-600 mb-6">
        전세 보증금의 기회비용과 월세 비용을 비교해서 어떤 선택이 더 유리한지 계산합니다.
      </p>

      {/* 전세 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-xl font-bold mb-4">1. 전세 조건</h2>

        <label className="block mb-2">전세 보증금 (만원)</label>
        <input
          type="number"
          value={jeonseDeposit}
          onChange={(e) => setJeonseDeposit(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-600 mt-1">
          입력한 전세 보증금: {formatMoney(jeonseDeposit)}
        </p>
      </section>

      {/* 월세 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-xl font-bold mb-4">2. 월세 조건</h2>

        <label className="block mb-2">월세 보증금 (만원)</label>
        <input
          type="number"
          value={rentDeposit}
          onChange={(e) => setRentDeposit(Number(e.target.value))}
          className="w-full border p-2 rounded mb-3"
        />
        <p className="text-sm text-gray-600 mb-4">
          입력한 월세 보증금: {formatMoney(rentDeposit)}
        </p>

        <label className="block mb-2">월세 (만원)</label>
        <input
          type="number"
          value={monthlyRent}
          onChange={(e) => setMonthlyRent(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
      </section>

      {/* 기준 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-xl font-bold mb-4">3. 비교 기준</h2>

        <label className="block mb-2">기회비용 기준 금리 (%)</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full border p-2 rounded mb-3"
        />

        <p className="text-sm text-gray-600 mb-4">
          보증금을 예금하거나 투자했을 때 얻을 수 있었던 수익률 기준입니다.
        </p>

        <label className="block mb-2">거주 기간 (개월)</label>
        <input
          type="number"
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
      </section>

      {/* 결과 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>

        <p>전세 월 기회비용: {formatManwon(jeonseMonthlyCost)}</p>
        <p>
          월세 총 월 비용: {formatManwon(rentTotalMonthlyCost)}
          <span className="text-sm text-gray-600">
            {" "}({formatManwon(monthlyRent)} + 보증금 기회비용 {formatManwon(rentDepositMonthlyCost)})
          </span>
        </p>

        <div className="mt-5 p-4 bg-white rounded border">
          <p className="text-lg font-bold">
            👉 현재 조건에서는 {isJeonseBetter ? "전세" : "월세"}가 더 유리합니다.
          </p>

          <p className="mt-2">
            월 기준 약 {formatManwon(monthlyDiff)} 차이가 나며,
            <br />
            {months}개월 기준으로는 약 {formatManwon(totalDiff)} 차이가 납니다.
          </p>

          <p className="mt-2 text-gray-700">
            이유는 {isJeonseBetter
              ? "전세 기회비용이 월세보다 낮기 때문입니다."
              : "월세 총 비용이 전세 기회비용보다 낮기 때문입니다."}
          </p>
        </div>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">전세 vs 월세 핵심 기준</h2>

        <p className="mb-3">
          전세와 월세 비교는 단순 금액이 아니라 ‘기회비용’을 기준으로 판단해야 합니다.
        </p>

        <p>
          보증금은 묶이는 돈이기 때문에 그 돈으로 얻을 수 있었던 수익을 고려하는 것이 중요합니다.
        </p>
      </section>

        {/* FAQ */}
        <section>
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
            <p className="font-bold">Q. 금리는 몇 % 넣어야 하나요?</p>
            <p>
            일반적으로 예금 금리(2~4%) 또는 투자 수익률(5~7%) 기준으로 입력합니다.
            </p>
        </div>

        <div className="mb-5">
            <p className="font-bold">Q. 월세 보증금도 왜 계산하나요?</p>
            <p>
            월세 보증금도 묶이는 돈이기 때문에 기회비용이 발생합니다.
            </p>
        </div>

        <div className="mb-5">
            <p className="font-bold">Q. 전세 vs 월세 정답이 있나요?</p>
            <p>
            금리, 보증금, 기간에 따라 달라지므로 계산기를 통해 판단하는 것이 가장 정확합니다.
            </p>
        </div>

        <div className="mb-5">
            <p className="font-bold">Q. 거주 기간이 길면 전세가 유리한가요?</p>
            <p>
            일반적으로 거주 기간이 길수록 월세를 계속 지불해야 하기 때문에 전세가 유리해질 수 있습니다.
            하지만 금리에 따라 결과는 달라질 수 있습니다.
            </p>
        </div>

        <div className="mb-5">
            <p className="font-bold">Q. 월세가 낮으면 무조건 좋은 건가요?</p>
            <p>
            월세가 낮더라도 보증금이 크거나 금리가 높으면 전체 비용이 증가할 수 있습니다.
            반드시 총 비용 기준으로 비교해야 합니다.
            </p>
        </div>

        <div className="mb-5">
            <p className="font-bold">Q. 이 계산기는 어떤 기준으로 계산되나요?</p>
            <p>
            전세와 월세 모두 보증금이 묶이는 동안 발생하는 기회비용을 포함하여 비교합니다.
            </p>
        </div>

        <div className="mb-5">
            <p className="font-bold">Q. 대출 전세도 이 계산이 맞나요?</p>
            <p>
            전세 대출을 사용하는 경우에는 대출 이자가 추가되므로 실제 비용은 더 높아질 수 있습니다.
            </p>
        </div>

        <div className="mb-5">
            <p className="font-bold">Q. 금리가 오르면 뭐가 불리해지나요?</p>
            <p>
            금리가 올라갈수록 전세 보증금의 기회비용이 증가하기 때문에 전세가 상대적으로 불리해질 수 있습니다.
            </p>
        </div>
        </section>
        <div className="mt-10 text-center">
        <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700"
        >
            계산기 목록으로 돌아가기
        </Link>
        </div>
    </div>
  );
}