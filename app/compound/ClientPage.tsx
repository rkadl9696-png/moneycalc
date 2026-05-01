"use client";

import { useState } from "react";
import Link from "next/link";

const formatMoney = (manwon: number) => {
  const rounded = Math.round(manwon);
  const eok = Math.floor(rounded / 10000);
  const rest = rounded % 10000;

  if (eok > 0 && rest > 0) return `${eok}억 ${rest.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${rest.toLocaleString()}만원`;
};

export default function Page() {
  const [principal, setPrincipal] = useState(1000);
  const [monthly, setMonthly] = useState(50);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);

  const months = years * 12;
  const monthlyRate = rate / 100 / 12;

  let total = principal;
  let totalInvested = principal;

  for (let i = 0; i < months; i++) {
    total = total * (1 + monthlyRate) + monthly;
    totalInvested += monthly;
  }

  const profit = total - totalInvested;
  const profitRate = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/"
        className="inline-block mb-6 text-base font-semibold text-blue-600 hover:text-blue-800"
      >
        ← 메인으로 돌아가기
      </Link>

      <h1 className="text-2xl font-bold mb-2">복리 계산기</h1>

      <p className="text-gray-600 mb-6">
        초기 투자금, 매월 추가 투자금, 연 수익률, 투자 기간을 입력하면 복리 기준 예상 최종 금액을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-xl font-bold mb-4">1. 투자 조건</h2>

        <label className="block mb-2">초기 투자금 (만원)</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-600 mt-1">
          초기 투자금: {formatMoney(principal)}
        </p>

        <label className="block mt-4 mb-2">매월 추가 투자금 (만원)</label>
        <input
          type="number"
          value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-600 mt-1">
          매월 추가 투자금: {formatMoney(monthly)}
        </p>

        <label className="block mt-4 mb-2">연 수익률 (%)</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />

        <label className="block mt-4 mb-2">투자 기간 (년)</label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-600 mt-1">
          총 투자 기간: {months}개월
        </p>
      </section>

      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>

        <p>총 투자 원금: {formatMoney(totalInvested)}</p>
        <p>예상 수익: {formatMoney(profit)}</p>
        <p>예상 최종 금액: {formatMoney(total)}</p>

        <div className="mt-5 p-4 bg-white rounded border">
          <p className="text-lg font-bold">
            👉 {years}년 후 예상 최종 금액은 약 {formatMoney(total)}입니다.
          </p>

          <p className="mt-2">
            총 투자 원금 대비 예상 수익률은 약 {profitRate.toFixed(1)}%입니다.
          </p>

          <p className="mt-2 text-gray-700">
            복리는 시간이 길어질수록 수익이 다시 수익을 만드는 구조이기 때문에,
            투자 기간이 길수록 결과 차이가 커질 수 있습니다.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">복리란 무엇인가요?</h2>

        <p className="mb-3">
          복리는 원금에서 발생한 수익이 다시 투자되어 다음 수익을 만드는 방식입니다.
          단순히 원금에만 수익이 붙는 단리와 달리, 시간이 지날수록 수익 증가 속도가 커질 수 있습니다.
        </p>

        <p>
          예를 들어 같은 수익률이라도 1년 투자와 10년 투자는 결과가 크게 달라질 수 있습니다.
          그래서 복리 계산에서는 수익률뿐 아니라 투자 기간도 매우 중요합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">복리 계산 기준</h2>

        <p className="mb-3">
          이 계산기는 연 수익률을 월 단위 수익률로 나누어 매월 복리로 반영합니다.
          매월 추가 투자금은 매월 말에 투자되는 것으로 가정합니다.
        </p>

        <p>
          실제 투자에서는 세금, 수수료, 배당소득세, 환율, 가격 변동 등이 발생할 수 있으므로
          결과는 참고용으로 보는 것이 좋습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">
          복리 계산이 장기 투자에서 중요한 이유
        </h2>

        <p className="mb-3">
          복리는 투자 수익이 다시 원금처럼 작동하면서 시간이 지날수록 수익이 누적되는 구조입니다.
          같은 수익률이라도 투자 기간이 길어질수록 결과 차이가 크게 벌어질 수 있습니다.
        </p>

        <p className="mb-3">
          특히 매월 일정 금액을 추가로 투자하는 경우, 원금이 계속 늘어나면서 복리 효과가 더 커질 수 있습니다.
          그래서 장기 투자에서는 수익률뿐 아니라 투자 기간과 매월 투자금도 함께 고려해야 합니다.
        </p>

        <p>
          이 복리 계산기를 사용하면 초기 투자금, 매월 투자금, 수익률, 기간에 따른 예상 최종 금액을 쉽게 확인할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 복리 계산기는 어떤 경우에 사용하나요?</p>
          <p>
            적금, ETF, 펀드, 주식 장기투자처럼 시간이 지남에 따라 수익이 누적되는 경우 예상 결과를 확인할 때 사용합니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 연 수익률은 무엇을 입력하면 되나요?</p>
          <p>
            예금 금리, 투자 기대수익률, ETF 평균 수익률 등 본인이 가정하고 싶은 연간 수익률을 입력하면 됩니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 매월 추가 투자금은 꼭 입력해야 하나요?</p>
          <p>
            아니요. 한 번에 투자하는 경우에는 매월 추가 투자금을 0으로 입력하면 됩니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 계산 결과가 실제 수익과 같나요?</p>
          <p>
            실제 투자 결과는 시장 변동, 세금, 수수료, 환율 등에 따라 달라질 수 있습니다.
            이 계산기는 장기 투자 계획을 세우기 위한 참고용입니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 투자 기간이 길수록 왜 차이가 커지나요?</p>
          <p>
            복리는 수익이 다시 원금처럼 작동하기 때문에 기간이 길어질수록 수익이 누적되는 효과가 커질 수 있습니다.
          </p>
        </div>
      </section>

      <div className="mt-8 text-sm text-gray-600">
        <p className="font-bold mb-2">함께 보면 좋은 계산기</p>
        <ul className="list-disc ml-5 space-y-1">
          <li><Link href="/jeonse-vs-rent">전세 vs 월세 계산기</Link></li>
          <li><Link href="/loan-calc">대출 상환 계산기</Link></li>
          <li><Link href="/salary-calc">연봉 실수령 계산기</Link></li>
          <li><Link href="/compound">복리 계산기</Link></li>
          <li><Link href="/card-calc">카드 할인 계산기</Link></li>
        </ul>
      </div>
      
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