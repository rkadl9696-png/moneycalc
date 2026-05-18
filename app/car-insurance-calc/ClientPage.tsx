"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

function calcInsurance(carValue: number, age: number, experience: number, accidentYears: number) {
  const basePremium = carValue * 0.05;

  let ageRate = 0;
  if (age < 21) ageRate = 0.30;
  else if (age <= 25) ageRate = 0.15;
  else if (age <= 30) ageRate = 0.05;
  else ageRate = 0;

  let expRate = 0;
  if (experience < 1) expRate = 0.20;
  else if (experience < 3) expRate = 0.10;
  else expRate = 0;

  let noAccidentDiscount = 0;
  if (accidentYears >= 3) noAccidentDiscount = -0.15;
  else if (accidentYears >= 2) noAccidentDiscount = -0.10;
  else if (accidentYears >= 1) noAccidentDiscount = -0.05;
  else noAccidentDiscount = 0;

  const totalRate = 1 + ageRate + expRate + noAccidentDiscount;
  const premium = Math.round(basePremium * totalRate);

  return {
    basePremium: Math.round(basePremium),
    ageRate,
    expRate,
    noAccidentDiscount,
    totalRate,
    premium,
  };
}

export default function ClientPage() {
  const [carValue, setCarValue] = useState(30_000_000);
  const [age, setAge] = useState(35);
  const [experience, setExperience] = useState(5);
  const [accidentYears, setAccidentYears] = useState(3);

  const r = useMemo(() => calcInsurance(carValue, age, experience, accidentYears), [carValue, age, experience, accidentYears]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();
  const fmtPct = (r: number) => r >= 0 ? `+${(r * 100).toFixed(0)}%` : `${(r * 100).toFixed(0)}%`;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">자동차 보험료 계산기</h1>
      <p className="text-gray-600 mb-6">차량가액과 운전자 조건을 입력하면 예상 자동차 보험료를 계산합니다. 실제 보험료는 보험사별로 다를 수 있습니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">차량 가액 (원)</label>
          <input type="number" min={1000000} step={1000000} value={carValue}
            onChange={(e) => setCarValue(Number(e.target.value))}
            className="w-full border p-2 rounded" />
          <p className="text-xs text-gray-400 mt-1">{fmt(carValue)}원 ({(carValue / 10_000_000).toFixed(1)}천만)</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">운전자 나이 (세)</label>
          <input type="number" min={18} max={80} value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">보험 가입 경력 (년)</label>
          <input type="number" min={0} max={50} value={experience}
            onChange={(e) => setExperience(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">무사고 기간 (년)</label>
          <input type="number" min={0} max={30} value={accidentYears}
            onChange={(e) => setAccidentYears(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-4 text-blue-800">계산 결과</h2>
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-0.5">기본 보험료 (차량가 × 5%)</p>
          <p className="text-xl font-bold text-gray-800">{fmt(r.basePremium)}원</p>
        </div>
        <div className="flex flex-col gap-2 mb-4 text-sm">
          {r.ageRate !== 0 && (
            <div className="flex justify-between bg-orange-50 border border-orange-200 rounded p-2">
              <span className="text-gray-600">나이 할증/할인</span>
              <span className="font-bold text-orange-600">{fmtPct(r.ageRate)}</span>
            </div>
          )}
          {r.expRate !== 0 && (
            <div className="flex justify-between bg-orange-50 border border-orange-200 rounded p-2">
              <span className="text-gray-600">가입경력 할증</span>
              <span className="font-bold text-orange-600">{fmtPct(r.expRate)}</span>
            </div>
          )}
          {r.noAccidentDiscount !== 0 && (
            <div className="flex justify-between bg-green-50 border border-green-200 rounded p-2">
              <span className="text-gray-600">무사고 할인</span>
              <span className="font-bold text-green-600">{fmtPct(r.noAccidentDiscount)}</span>
            </div>
          )}
        </div>
        <div className="border-t border-blue-200 pt-4">
          <p className="text-xs text-gray-500 mb-0.5">예상 연간 보험료</p>
          <p className="text-3xl font-bold text-blue-600">{fmt(r.premium)}원</p>
          <p className="text-xs text-gray-400 mt-1">월 약 {fmt(Math.round(r.premium / 12))}원</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자동차 보험료 산정 기준</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          자동차 보험료는 차량의 가치, 운전자의 나이, 가입 경력, 사고 이력 등 다양한 요소에 의해 결정됩니다.
          일반적으로 기본 보험료는 차량가액의 약 5% 수준에서 시작하며, 여기에 할증과 할인이 적용됩니다.
          21세 미만 운전자는 30% 할증, 21~25세는 15% 할증, 26~30세는 5% 할증이 적용됩니다.
          보험 가입 경력이 짧을수록(1년 미만 20%, 1~2년 10%) 보험료가 높아지며, 무사고 기간이 길수록 할인 혜택이 커집니다.
          실제 보험료는 가입하는 보험사, 보장 범위, 특약 선택에 따라 크게 달라질 수 있으므로 여러 보험사를 비교하는 것을 권장합니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">보험료 할증·할인 기준</h2>
        <div className="flex flex-col gap-3 text-sm">
          {[
            { label: "나이 기준", items: ["21세 미만: +30% 할증", "21~25세: +15% 할증", "26~30세: +5% 할증", "31세 이상: 기준"] },
            { label: "가입경력 기준", items: ["1년 미만: +20% 할증", "1~2년: +10% 할증", "3년 이상: 기준"] },
            { label: "무사고 할인", items: ["1년 무사고: -5%", "2년 무사고: -10%", "3년 이상 무사고: -15%"] },
          ].map((g) => (
            <div key={g.label} className="bg-white border rounded-lg p-3">
              <p className="font-bold text-gray-700 mb-2">{g.label}</p>
              <ul className="flex flex-col gap-1">
                {g.items.map((item) => <li key={item} className="text-gray-600">• {item}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          본 계산기는 참고용 예상 금액입니다. 실제 자동차 보험료는 보험사, 담보 범위, 자기부담금, 특약 등에 따라 달라집니다.
          보험 가입 전 여러 보험사의 견적을 비교하고, 다이렉트 보험을 활용하면 보험료를 절감할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "자동차 보험료를 낮추는 방법은 무엇인가요?", a: "무사고 유지, 마일리지 특약 활용, 블랙박스 할인, 다이렉트 가입, 가족 한정 운전 등록, 자기부담금 상향 등으로 보험료를 낮출 수 있습니다." },
          { q: "다이렉트 자동차 보험과 설계사 가입의 차이는?", a: "다이렉트 보험은 온라인으로 직접 가입하여 설계사 수수료가 없어 10~30% 저렴합니다. 보장 내용은 동일하지만 사고 처리 시 직접 연락해야 할 수 있습니다." },
          { q: "마일리지 특약이란 무엇인가요?", a: "마일리지 특약은 연간 주행 거리가 적을수록 보험료를 할인해주는 특약입니다. 연간 3,000km 이하면 최대 30~40%까지 할인받을 수 있습니다." },
          { q: "사고가 나면 다음 해 보험료가 얼마나 오르나요?", a: "사고 이력에 따라 보험료 할증폭이 달라집니다. 경미한 사고 1건은 통상 10~20% 인상, 큰 사고나 여러 건의 사고는 30~50% 이상 인상될 수 있습니다." },
          { q: "자동차 보험 의무 가입 항목은 무엇인가요?", a: "대인배상 I, 대물배상(2천만 원 이상), 자동차상해보험은 의무 가입 항목입니다. 대인배상 II, 자기차량손해, 무보험차 상해 등은 선택 가입입니다." },
          { q: "중고차를 구입했을 때 보험 처리는 어떻게 하나요?", a: "중고차 구입 후 이전등록 전 차량을 인도받으면 즉시 보험에 가입해야 합니다. 기존 계약을 차량 변경하거나 신규 계약을 체결하면 됩니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/car-insurance-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
