"use client";

import { useState } from "react";
import Link from "next/link";

const formatMoney = (manwon: number) => {
  const eok = Math.floor(manwon / 10000);
  const rest = manwon % 10000;

  if (eok > 0 && rest > 0) return `${eok}억 ${rest.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${manwon.toLocaleString()}만원`;
};

const formatFullMoney = (value: number) => {
  const rounded = Math.round(value * 10) / 10;
  const eok = Math.floor(rounded / 10000);
  const restMan = Math.floor(rounded % 10000);
  const thousand = Math.round((rounded - Math.floor(rounded)) * 10);

  const parts = [];

  if (eok > 0) parts.push(`${eok}억`);
  if (restMan > 0) parts.push(`${restMan.toLocaleString()}만`);
  if (thousand > 0) parts.push(`${thousand}천원`);

  if (parts.length === 0) return "0원";
  if (thousand === 0) {
    const last = parts[parts.length - 1];
    if (last.endsWith("만")) parts[parts.length - 1] = `${last}원`;
  }

  return parts.join(" ");
};

export default function Page() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(3);
  const [years, setYears] = useState(20);

  const months = years * 12;
  const monthlyRate = rate / 100 / 12;

  const equalPaymentMonthly =
    monthlyRate === 0
      ? amount / months
      : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  const equalPaymentTotal = equalPaymentMonthly * months;

  const principalMonthly = amount / months;

  let balance = amount;
  let principalEqualTotal = 0;

  for (let i = 0; i < months; i++) {
    const interest = balance * monthlyRate;
    principalEqualTotal += principalMonthly + interest;
    balance -= principalMonthly;
  }

  const principalEqualFirstMonth = principalMonthly + amount * monthlyRate;
  const principalEqualLastMonth =
    principalMonthly + principalMonthly * monthlyRate;

  const diff = Math.abs(equalPaymentTotal - principalEqualTotal);
  const isPrincipalEqualBetter = principalEqualTotal < equalPaymentTotal;

  return (
    <div className="max-w-2xl mx-auto p-6">

        <Link
        href="/"
        className="inline-block mb-6 text-base font-semibold text-blue-600 hover:text-blue-800"
        >
        ← 메인으로 돌아가기
        </Link>

      <h1 className="text-2xl font-bold mb-2">대출 상환 계산기</h1>

      <p className="text-gray-600 mb-6">
        대출금, 금리, 기간을 입력하면 원리금균등과 원금균등 상환 방식을 비교할 수 있습니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-xl font-bold mb-4">1. 대출 조건</h2>

        <label className="block mb-2">대출 금액 (만원)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-600 mt-1">
          입력한 대출 금액: {formatMoney(amount)}
        </p>

        <label className="block mt-4 mb-2">금리 (%)</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />

        <label className="block mt-4 mb-2">상환 기간 (년)</label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-600 mt-1">
          총 상환 기간: {months}개월
        </p>
      </section>

      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>

        <div className="mb-4">
          <h3 className="font-bold mb-2">원리금균등 상환</h3>
          <p>매월 상환액: {formatFullMoney(equalPaymentMonthly)}</p>
          <p>총 상환액: {formatFullMoney(equalPaymentTotal)}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">원금균등 상환</h3>
          <p>첫 달 상환액: {formatFullMoney(principalEqualFirstMonth)}</p>
          <p>마지막 달 상환액: {formatFullMoney(principalEqualLastMonth)}</p>
          <p>총 상환액: {formatFullMoney(principalEqualTotal)}</p>
        </div>

        <div className="mt-5 p-4 bg-white rounded border">
          <p className="text-lg font-bold">
            👉 현재 조건에서는 {isPrincipalEqualBetter ? "원금균등" : "원리금균등"}이 더 유리합니다.
          </p>

          <p className="mt-2">
            총 상환액 기준 약 {formatFullMoney(diff)} 차이가 납니다.
          </p>

          <p className="mt-2 text-gray-700">
            이유는 {isPrincipalEqualBetter
              ? "원금균등은 초반에 원금을 더 빠르게 줄이기 때문에 전체 이자가 적게 발생하기 때문입니다."
              : "원리금균등은 매달 내는 금액이 일정해 초기 부담이 적기 때문입니다."}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">원리금균등과 원금균등의 차이</h2>

        <p className="mb-3">
          원리금균등은 매달 내는 금액이 거의 일정한 방식입니다. 월 납입액을 예측하기 쉬워
          주택담보대출이나 장기 대출에서 많이 사용됩니다.
        </p>

        <p className="mb-3">
          원금균등은 매달 갚는 원금이 일정한 방식입니다. 초반 상환 부담은 크지만 원금이 빠르게 줄어들어
          전체 이자는 원리금균등보다 적어지는 경우가 많습니다.
        </p>

        <p>
          따라서 매달 부담을 일정하게 가져가고 싶다면 원리금균등, 총 이자를 줄이고 싶다면 원금균등을 고려할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">
          원리금균등과 원금균등 중 어떤 상환 방식이 좋을까?
        </h2>

        <p className="mb-3">
          대출 상환 방식은 매달 내는 금액과 총 이자 부담에 큰 영향을 줍니다.
          원리금균등은 매달 상환액이 일정해서 자금 계획을 세우기 쉽고,
          원금균등은 초반 부담은 크지만 전체 이자를 줄이는 데 유리할 수 있습니다.
        </p>

        <p className="mb-3">
          금리가 높거나 대출 기간이 길수록 상환 방식에 따른 총 상환액 차이가 커질 수 있습니다.
          따라서 대출 금액, 금리, 기간을 입력해 두 방식의 차이를 직접 비교해보는 것이 좋습니다.
        </p>

        <p>
          월 납입 부담을 줄이고 싶다면 원리금균등, 총 이자를 줄이고 싶다면 원금균등을 우선 비교해볼 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 원리금균등이란 무엇인가요?</p>
          <p>
            원리금균등은 원금과 이자를 합친 월 상환액이 매달 거의 동일하게 유지되는 방식입니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 원금균등이란 무엇인가요?</p>
          <p>
            원금균등은 매달 같은 금액의 원금을 갚고, 남은 원금에 따라 이자가 줄어드는 방식입니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 어떤 방식이 이자를 더 적게 내나요?</p>
          <p>
            일반적으로 원금균등이 전체 이자는 더 적습니다. 원금을 초반부터 빠르게 줄이기 때문입니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 왜 원리금균등을 많이 사용하나요?</p>
          <p>
            매달 내는 금액이 일정해서 자금 계획을 세우기 쉽고 초기 부담이 상대적으로 낮기 때문입니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 금리가 높으면 어떤 방식이 더 유리한가요?</p>
          <p>
            금리가 높을수록 원금을 빨리 줄이는 원금균등 방식이 총 이자 측면에서 더 유리해질 수 있습니다.
          </p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 이 계산기는 실제 은행 상환액과 완전히 같나요?</p>
          <p>
            실제 은행 상품은 중도상환수수료, 거치기간, 우대금리, 상환일 계산 방식 등에 따라 달라질 수 있습니다.
            이 계산기는 기본적인 비교용으로 사용하는 것이 좋습니다.
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