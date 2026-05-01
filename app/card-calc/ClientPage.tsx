"use client";

import { useState } from "react";
import Link from "next/link";

const formatWon = (value: number) => {
  return Math.round(value).toLocaleString() + "원";
};

export default function Page() {
  const [price, setPrice] = useState(100000);
  const [discount, setDiscount] = useState(10);
  const [extraDiscount, setExtraDiscount] = useState(0);

  const firstDiscountAmount = price * (discount / 100);
  const afterFirst = price - firstDiscountAmount;

  const secondDiscountAmount = afterFirst * (extraDiscount / 100);
  const finalPrice = afterFirst - secondDiscountAmount;

  const totalSaved = price - finalPrice;
  const totalRate = price > 0 ? (totalSaved / price) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto p-6">

      <Link
        href="/"
        className="inline-block mb-6 text-base font-semibold text-blue-600 hover:text-blue-800"
      >
        ← 메인으로 돌아가기
      </Link>

      <h1 className="text-2xl font-bold mb-2">카드 할인 계산기</h1>

      <p className="text-gray-600 mb-6">
        결제 금액과 할인율을 입력하면 할인 금액과 최종 결제 금액을 계산합니다.
        추가 할인(중복 할인)도 함께 계산할 수 있습니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-xl font-bold mb-4">1. 할인 조건</h2>

        <label className="block mb-2">결제 금액 (원)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-600 mt-1">
          결제 금액: {formatWon(price)}
        </p>

        <label className="block mt-4 mb-2">기본 할인 (%)</label>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />

        <label className="block mt-4 mb-2">추가 할인 (%)</label>
        <input
          type="number"
          value={extraDiscount}
          onChange={(e) => setExtraDiscount(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-600 mt-1">
          (카드 할인 + 쿠폰 할인 같은 중복 할인 상황)
        </p>
      </section>

      {/* 결과 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>

        <p>1차 할인 금액: {formatWon(firstDiscountAmount)}</p>
        <p>2차 할인 금액: {formatWon(secondDiscountAmount)}</p>

        <p className="mt-2 font-semibold">총 할인 금액: {formatWon(totalSaved)}</p>
        <p>최종 결제 금액: {formatWon(finalPrice)}</p>

        <div className="mt-5 p-4 bg-white rounded border">
          <p className="text-lg font-bold">
            👉 총 할인율은 약 {totalRate.toFixed(1)}% 입니다.
          </p>

          <p className="mt-2 text-gray-700">
            할인은 단순 합산이 아니라 순차적으로 적용되기 때문에,
            10% + 10% 할인은 실제로 약 19% 할인 효과가 발생합니다.
          </p>
        </div>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">카드 할인 계산 방식</h2>

        <p className="mb-3">
          카드 할인은 대부분 중복 적용 시 순차적으로 계산됩니다.
          즉, 첫 번째 할인 후 남은 금액에 두 번째 할인이 적용됩니다.
        </p>

        <p>
          따라서 단순히 할인율을 더하는 것이 아니라 실제 할인율은 더 낮아질 수 있습니다.
        </p>
      </section>

      {/* 검색용 글 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">
          카드 할인율은 왜 단순 합산하면 안 될까?
        </h2>

        <p className="mb-3">
          카드 할인이나 쿠폰 할인이 여러 번 적용될 때는 대부분 할인율을 단순히 더하지 않습니다.
          첫 번째 할인이 적용된 금액에서 다시 두 번째 할인이 적용되는 방식이 많습니다.
        </p>

        <p className="mb-3">
          예를 들어 10% 할인 후 추가 10% 할인을 받는 경우, 실제 할인율은 20%가 아니라 약 19%가 됩니다.
          그래서 여러 할인 조건이 있을 때는 최종 결제 금액을 직접 계산해보는 것이 좋습니다.
        </p>

        <p>
          이 계산기는 결제 금액, 기본 할인율, 추가 할인율을 기준으로 실제 할인 금액과 최종 결제 금액을 계산합니다.
        </p>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 10% + 10% 할인이면 20% 아닌가요?</p>
          <p>
            아닙니다. 10% 할인 후 남은 금액에 다시 10%가 적용되므로 실제 할인율은 약 19%입니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 추가 할인은 언제 사용하나요?</p>
          <p>
            카드 할인 + 쿠폰 할인 + 이벤트 할인처럼 여러 할인 조건이 있을 때 사용합니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 이 계산기는 어떤 상황에서 유용한가요?</p>
          <p>
            쇼핑, 카드 할인, 쿠폰 적용, 프로모션 비교 등 실제 결제 금액을 정확히 알고 싶을 때 유용합니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 실제 카드 청구 금액과 같나요?</p>
          <p>
            카드사 정책, 최대 할인 한도, 특정 조건 등에 따라 실제 금액은 달라질 수 있습니다.
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

      {/* 하단 버튼 */}
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