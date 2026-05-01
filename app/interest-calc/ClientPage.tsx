"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function Page() {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(3.5);
  const [months, setMonths] = useState(12);
  const [type, setType] = useState<"simple" | "compound">("simple");

  const years = months / 12;

  const simpleInterest = principal * (rate / 100) * years;
  const compoundInterest = principal * Math.pow(1 + rate / 100, years) - principal;

  const interest = type === "simple" ? simpleInterest : compoundInterest;
  const total = principal + interest;
  const taxRate = 0.154;
  const afterTax = principal + interest * (1 - taxRate);

  const formatMoney = (v: number) => Math.round(v).toLocaleString() + "만원";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/" className="inline-block mb-6 text-base font-semibold text-blue-600 hover:text-blue-800">
        ← 메인으로 돌아가기
      </Link>

      <h1 className="text-2xl font-bold mb-2">이자 계산기</h1>
      <p className="text-gray-600 mb-6">
        예금액, 금리, 기간을 입력하면 단리/복리 이자와 세후 수령액을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-xl font-bold mb-4">1. 예금 조건</h2>

        <label className="block mb-2">예금액 (만원)</label>
        <input type="number" value={principal}
          onChange={(e) => setPrincipal(Number(e.target.value))}
          className="w-full border p-2 rounded mb-3" />

        <label className="block mb-2">연 금리 (%)</label>
        <input type="number" value={rate} step="0.1"
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full border p-2 rounded mb-3" />

        <label className="block mb-2">기간 (개월)</label>
        <input type="number" value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="w-full border p-2 rounded mb-3" />

        <label className="block mb-2">이자 방식</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="simple" checked={type === "simple"}
              onChange={() => setType("simple")} />
            단리
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="compound" checked={type === "compound"}
              onChange={() => setType("compound")} />
            복리
          </label>
        </div>
      </section>

      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>
        <p>예금액: {formatMoney(principal)}</p>
        <p>이자: {formatMoney(interest)}</p>
        <p>세전 수령액: {formatMoney(total)}</p>

        <div className="mt-5 p-4 bg-white rounded border">
          <p className="text-lg font-bold">
            👉 세후 수령액: {formatMoney(afterTax)}
          </p>
          <p className="mt-2 text-gray-700">
            이자소득세 15.4% 공제 후 실수령액입니다.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">단리 vs 복리 차이</h2>
        <p className="mb-3">
          단리는 원금에만 이자가 붙고, 복리는 이자에도 이자가 붙습니다.
          기간이 길수록 복리의 효과가 커집니다.
        </p>
        <p>
          예금 상품 대부분은 단리 방식이며, 복리는 주로 투자 수익률 계산에 사용됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">이자 계산기 활용법</h2>
        <p className="mb-3">
          은행 예금 상품 가입 전에 실제 수령액을 미리 계산해보면 상품 비교에 도움이 됩니다.
          금리가 같아도 단리와 복리에 따라 수령액이 달라질 수 있습니다.
        </p>
        <p>
          이자소득세 15.4%는 일반 과세 기준이며, 비과세 상품은 세금이 면제됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 이자소득세는 얼마인가요?</p>
          <p>일반 과세 기준 15.4%(소득세 14% + 지방소득세 1.4%)입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 단리와 복리 중 어떤 게 유리한가요?</p>
          <p>기간이 길수록 복리가 유리합니다. 단기 예금은 차이가 크지 않습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 실제 은행 이자와 다를 수 있나요?</p>
          <p>네, 상품에 따라 우대금리, 세금 우대 등 조건이 다를 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 비과세 상품은 어떻게 계산하나요?</p>
          <p>세후 수령액 계산 시 이자 전액을 수령한다고 보면 됩니다.</p>
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