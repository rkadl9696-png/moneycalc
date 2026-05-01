"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function Page() {
  const [monthly, setMonthly] = useState(50);
  const [rate, setRate] = useState(3.5);
  const [months, setMonths] = useState(12);

  // 적금 이자 계산 (단리 기준 - 실제 은행 적금 방식)
  const totalPrincipal = monthly * months;
  const interest = monthly * (rate / 100) * ((months * (months + 1)) / 2) / 12;
  const total = totalPrincipal + interest;
  const taxRate = 0.154;
  const afterTax = totalPrincipal + interest * (1 - taxRate);

  const formatMoney = (v: number) => Math.round(v).toLocaleString() + "만원";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">적금 계산기</h1>
      <p className="text-gray-600 mb-6">
        매월 납입액, 금리, 기간을 입력하면 만기 수령액과 세후 이자를 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-xl font-bold mb-4">1. 적금 조건</h2>

        <label className="block mb-2">매월 납입액 (만원)</label>
        <input type="number" value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))}
          className="w-full border p-2 rounded mb-3" />

        <label className="block mb-2">연 금리 (%)</label>
        <input type="number" value={rate} step="0.1"
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full border p-2 rounded mb-3" />

        <label className="block mb-2">기간 (개월)</label>
        <input type="number" value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="w-full border p-2 rounded" />
      </section>

      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>
        <p>총 납입액: {formatMoney(totalPrincipal)}</p>
        <p>세전 이자: {formatMoney(interest)}</p>
        <p>세전 만기 수령액: {formatMoney(total)}</p>

        <div className="mt-5 p-4 bg-white rounded border">
          <p className="text-lg font-bold">
            👉 세후 만기 수령액: {formatMoney(afterTax)}
          </p>
          <p className="mt-2 text-gray-700">
            이자소득세 15.4% 공제 후 실수령액입니다.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">적금 이자 계산 방식</h2>
        <p className="mb-3">
          적금은 매월 일정 금액을 납입하는 상품으로, 첫 달 납입금은 전체 기간 동안 이자가 붙고
          마지막 달 납입금은 1개월치 이자만 붙습니다.
        </p>
        <p>
          따라서 같은 금리라도 예금보다 실제 이자가 적게 느껴질 수 있습니다.
          실제 수령액은 은행 상품 조건에 따라 다를 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">적금 vs 예금 어떤 게 유리할까?</h2>
        <p className="mb-3">
          목돈이 있다면 예금이 유리하고, 매월 일정 금액을 모으는 습관을 만들고 싶다면 적금이 적합합니다.
          같은 금리라면 예금의 실질 이자가 적금보다 많습니다.
        </p>
        <p>
          적금은 강제 저축 효과가 있어 재테크 초보자에게 추천되는 방식입니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 적금 이자는 어떻게 계산되나요?</p>
          <p>매월 납입액에 남은 기간만큼 이자가 붙는 방식으로 계산됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 세후 이자는 왜 줄어드나요?</p>
          <p>이자소득세 15.4%가 이자에서 차감되기 때문입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 적금을 중도 해지하면 어떻게 되나요?</p>
          <p>중도 해지 시 약정 금리보다 낮은 중도해지 금리가 적용되어 이자가 줄어듭니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 자유적금과 정기적금 차이는?</p>
          <p>정기적금은 매월 고정 금액을 납입하고, 자유적금은 납입 금액을 자유롭게 조절할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 금리가 높은 적금 찾는 방법은?</p>
          <p>은행연합회 소비자포털에서 은행별 적금 금리를 비교할 수 있습니다.</p>
        </div>
      </section>

      <RelatedCalculators />

      <div className="mt-10 text-center">
        <Link href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}