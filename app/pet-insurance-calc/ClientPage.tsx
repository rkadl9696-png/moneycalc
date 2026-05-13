"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type PetType = "dog" | "cat";
type SizeType = "small" | "medium" | "large";
type PlanType = "basic" | "standard" | "premium";

const BASE_RATES: Record<PetType, Record<SizeType, number>> = {
  dog: { small: 15_000, medium: 20_000, large: 25_000 },
  cat: { small: 13_000, medium: 13_000, large: 13_000 },
};

const PLAN_MULTIPLIERS: Record<PlanType, number> = {
  basic: 1.0,
  standard: 1.5,
  premium: 2.2,
};

const COVERAGE_ITEMS: Record<PlanType, string[]> = {
  basic: ["입원비", "수술비 (기본)", "응급치료비"],
  standard: ["입원비", "수술비", "응급치료비", "외래 통원 진료비", "CT/MRI 검사비"],
  premium: ["입원비", "수술비 (전액)", "응급치료비", "외래 통원 진료비", "CT/MRI 검사비", "치과 치료", "건강검진", "예방접종"],
};

export default function ClientPage() {
  const [petType, setPetType] = useState<PetType>("dog");
  const [age, setAge] = useState(3);
  const [size, setSize] = useState<SizeType>("small");
  const [plan, setPlan] = useState<PlanType>("standard");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const baseRate = BASE_RATES[petType][size];

    // 나이 할증
    let ageFactor = 1.0;
    if (age >= 10) ageFactor = 2.0;
    else if (age >= 8) ageFactor = 1.5;
    else if (age >= 5) ageFactor = 1.2;

    const planMultiplier = PLAN_MULTIPLIERS[plan];
    const monthlyPremium = Math.round(baseRate * ageFactor * planMultiplier);
    const annualPremium = monthlyPremium * 12;
    const selfPay = 0.2; // 자기부담금 20%
    const coverageItems = COVERAGE_ITEMS[plan];

    return { monthlyPremium, annualPremium, selfPay, coverageItems, ageFactor };
  }, [petType, age, size, plan]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">반려동물 보험 계산기</h1>
      <p className="text-gray-600 mb-6">
        반려동물 정보와 보장 범위를 입력하면 예상 월 보험료를 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">반려동물 정보 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">동물 종류</label>
          <div className="flex gap-2">
            <button
              onClick={() => setPetType("dog")}
              className={`flex-1 py-2 rounded border text-sm font-bold ${petType === "dog" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
            >
              개 (강아지)
            </button>
            <button
              onClick={() => setPetType("cat")}
              className={`flex-1 py-2 rounded border text-sm font-bold ${petType === "cat" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
            >
              고양이
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">나이 (세)</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            onBlur={(e) => setAge(Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">
            나이 할증: 5세 이상 +20%, 8세 이상 +50%, 10세 이상 +100%
            {result.ageFactor > 1 && ` (현재 ×${result.ageFactor.toFixed(1)} 적용)`}
          </p>
        </div>

        {petType === "dog" && (
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">품종 크기</label>
            <div className="flex gap-2">
              {(["small", "medium", "large"] as SizeType[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-2 rounded border text-sm font-bold ${size === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
                >
                  {s === "small" ? "소형 (~10kg)" : s === "medium" ? "중형 (~25kg)" : "대형 (25kg~)"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">보장 범위</label>
          <div className="flex gap-2">
            {(["basic", "standard", "premium"] as PlanType[]).map((p) => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={`flex-1 py-2 rounded border text-sm font-bold ${plan === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
              >
                {p === "basic" ? "기본형" : p === "standard" ? "표준형" : "종합형"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">보험료 계산 결과</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-500 mb-1">월 보험료 (추정)</p>
            <p className="text-2xl font-bold text-blue-700">{result.monthlyPremium.toLocaleString()}원</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-500 mb-1">연간 보험료</p>
            <p className="text-2xl font-bold text-blue-700">{result.annualPremium.toLocaleString()}원</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-blue-200 mb-3">
          <p className="text-xs text-gray-500 mb-1">자기부담금</p>
          <p className="text-sm font-bold">치료비의 20% 본인 부담</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-gray-500 mb-2">{plan === "basic" ? "기본형" : plan === "standard" ? "표준형" : "종합형"} 주요 보장 항목</p>
          <ul className="space-y-1">
            {result.coverageItems.map((item) => (
              <li key={item} className="text-sm flex items-center gap-2">
                <span className="text-green-500">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-gray-500 mt-3">* 추정값입니다. 실제 보험료는 보험사별·품종별로 다릅니다.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">반려동물 보험이란?</h2>
        <p className="mb-3">
          반려동물 보험은 강아지·고양이의 질병 치료비, 수술비, 입원비 등을 보장하는 손해보험 상품입니다. 우리나라는 반려동물 의료비가 국가 의료보험 적용을 받지 않아 치료비 부담이 크기 때문에, 보험 가입을 통해 경제적 리스크를 줄일 수 있습니다.
        </p>
        <p className="mb-3">
          보험료는 종류(개/고양이), 나이, 품종 크기(몸무게), 보장 범위에 따라 결정됩니다. 일반적으로 나이가 많을수록 질병 위험이 높아 보험료가 높아지며, 10세 이상 고령 반려동물은 가입이 어렵거나 제한될 수 있습니다.
        </p>
        <p>
          대부분의 반려동물 보험은 자기부담금 제도를 운영합니다. 치료비의 20~30%는 본인이 부담하며, 보험사는 나머지를 지급합니다. 선천성 질환, 예방접종, 미용 등은 보장 제외 항목인 경우가 많으니 가입 전 약관을 확인하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">반려동물 보험 선택 가이드</h2>
        <p className="mb-3">
          반려동물 보험을 선택할 때는 보장 한도, 자기부담금 비율, 갱신 조건(나이에 따른 보험료 인상), 면책 기간(가입 후 일정 기간 보장 제외) 등을 비교해야 합니다. 특히 품종 특이 질환(심장병·슬개골 탈구 등)의 보장 여부를 확인하세요.
        </p>
        <p>
          반려동물 보험사로는 삼성화재, 현대해상, DB손해보험, 메리츠화재 등 주요 손해보험사와 반려동물 전문 보험사가 있습니다. 보험다모아(www.e-insmarket.or.kr)에서 여러 상품을 비교할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 반려동물 보험은 몇 살까지 가입 가능한가요?</p>
          <p>대부분의 보험사는 강아지·고양이 생후 61일 이상~만 8~10세 이하인 경우 신규 가입을 받습니다. 가입 후 갱신은 15~20세까지 가능한 상품도 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 선천성 질환도 보장되나요?</p>
          <p>대부분의 반려동물 보험은 선천성 질환을 보장 제외로 규정합니다. 슬개골 탈구, 고관절 이형성증 등 품종 특이 질환도 면책 항목일 수 있으니 약관 확인이 필요합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 면책 기간이란 무엇인가요?</p>
          <p>보험 가입 후 일정 기간(보통 30~90일) 동안 보장이 제외되는 기간입니다. 이 기간 중 발생한 질병은 보험금 청구가 불가합니다. 사고(외상)는 면책 기간 없이 즉시 보장되는 경우가 많습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 갱신 시 보험료가 올라가나요?</p>
          <p>네, 나이가 들수록 질병 위험이 높아지므로 갱신 시 보험료가 인상됩니다. 상품에 따라 갱신 보장 여부와 인상 폭이 다르므로 장기적 비용을 고려해 상품을 선택하세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 입원·수술 후 보험금 청구 방법은?</p>
          <p>동물병원에서 진료 영수증, 진단서, 의무기록지를 발급받아 보험사 앱이나 홈페이지에서 청구할 수 있습니다. 실손보험처럼 자동 청구는 안 되므로 직접 서류를 제출해야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 반려동물 보험이 없으면 치료비는 얼마나 드나요?</p>
          <p>슬개골 수술 30~80만원, 위장 이물질 수술 100~200만원, MRI 촬영 40~80만원, 암 치료 200~500만원 이상 등 고액 치료비가 발생할 수 있습니다. 보험은 이러한 위험을 대비하는 수단입니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/pet-insurance-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
