"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function Page() {
  const [loan, setLoan] = useState(20000);
  const [rate, setRate] = useState(3.5);
  const [months, setMonths] = useState(24);

  const monthlyRate = rate / 100 / 12;
  const monthlyInterest = loan * monthlyRate;
  const totalInterest = monthlyInterest * months;
  const totalPayment = loan + totalInterest;

  const formatMoney = (v: number) => {
    const rounded = Math.round(v * 10) / 10;
    const man = Math.floor(rounded);
    const thousand = Math.round((rounded - man) * 10);
    if (thousand > 0) return `${man.toLocaleString()}만${thousand}천원`;
    return `${man.toLocaleString()}만원`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/" className="inline-block mb-6 text-base font-semibold text-blue-600 hover:text-blue-800">
        ← 메인으로 돌아가기
      </Link>

      <h1 className="text-2xl font-bold mb-2">전세대출 계산기</h1>
      <p className="text-gray-600 mb-6">
        전세대출 금액, 금리, 기간을 입력하면 월 이자와 총 이자 부담을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-xl font-bold mb-4">1. 대출 조건</h2>

        <label className="block mb-2">전세대출 금액 (만원)</label>
        <input type="number" value={loan}
          onChange={(e) => setLoan(Number(e.target.value))}
          className="w-full border p-2 rounded mb-1" />
        <p className="text-sm text-gray-500 mb-3">
          입력한 대출금액: {loan.toLocaleString()}만원
        </p>

        <label className="block mb-2">연 금리 (%)</label>
        <input type="number" value={rate} step="0.1"
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full border p-2 rounded mb-3" />

        <label className="block mb-2">대출 기간 (개월)</label>
        <input type="number" value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="w-full border p-2 rounded" />
      </section>

      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>
        <p>대출 금액: {loan.toLocaleString()}만원</p>
        <p>월 이자: {formatMoney(monthlyInterest)}</p>
        <p>총 이자: {formatMoney(totalInterest)}</p>

        <div className="mt-5 p-4 bg-white rounded border">
          <p className="text-lg font-bold">
            👉 총 상환 금액: {formatMoney(totalPayment)}
          </p>
          <p className="mt-2 text-gray-700">
            전세대출은 만기 시 원금을 일시 상환하는 방식으로, 매월 이자만 납부합니다.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">전세대출 이자 계산 방식</h2>
        <p className="mb-3">
          전세대출은 일반 주택담보대출과 달리 만기까지 이자만 납부하고
          만기 시 원금을 한 번에 상환하는 구조입니다.
        </p>
        <p>
          따라서 월 부담은 낮지만 전세 계약 만료 시 목돈을 한꺼번에 마련해야 한다는 점을 고려해야 합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">전세대출 금리는 어떻게 결정될까?</h2>
        <p className="mb-3">
          전세대출 금리는 기준금리, 은행 가산금리, 개인 신용도에 따라 달라집니다.
          버팀목 전세대출 등 정부 지원 상품은 시중 금리보다 낮은 우대 금리가 적용됩니다.
        </p>
        <p>
          금리가 0.5%만 달라져도 2년 기준 총 이자 부담이 크게 달라지므로
          여러 상품을 비교해보는 것이 중요합니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 전세대출은 매월 얼마씩 내나요?</p>
          <p>전세대출은 매월 이자만 납부하고 만기 시 원금을 일시 상환합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전세대출 한도는 얼마까지 되나요?</p>
          <p>일반적으로 전세보증금의 80% 이내에서 대출이 가능하며 상품마다 다릅니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 버팀목 전세대출이란?</p>
          <p>정부에서 지원하는 저금리 전세대출 상품으로 소득 조건을 충족하면 낮은 금리로 이용 가능합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전세대출 금리가 오르면 얼마나 부담이 늘어나나요?</p>
          <p>금리가 1% 오르면 1억 대출 기준 월 이자가 약 8만원 증가합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전세대출과 일반 대출 차이는?</p>
          <p>전세대출은 이자만 납부하고 만기 일시상환 방식이며, 일반 대출은 원금+이자를 매월 상환합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전세대출 연장이 가능한가요?</p>
          <p>전세 계약 연장 시 대출도 연장 신청이 가능하며 은행 심사를 통해 결정됩니다.</p>
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