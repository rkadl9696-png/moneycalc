"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [deposit, setDeposit] = useState(50000000);
  const [monthlyRent, setMonthlyRent] = useState(1500000);
  const [area, setArea] = useState(33);
  const [region, setRegion] = useState<"서울" | "경기" | "지방">("서울");
  const [conversionRate, setConversionRate] = useState(5.5);
  const [keyMoney, setKeyMoney] = useState(30000000);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const convertedDeposit = deposit + monthlyRent * 100;
    const pyeong = area / 3.3;
    const rentPerPyeong = pyeong > 0 ? Math.round(monthlyRent / pyeong) : 0;
    const rentPerSqm = area > 0 ? Math.round(monthlyRent / area) : 0;
    const appropriateMonthlyRent = Math.round(deposit * conversionRate / 100 / 12);
    const keyMoneyPayback = monthlyRent > 0 ? Math.ceil(keyMoney / monthlyRent) : 0;

    return { convertedDeposit, pyeong: pyeong.toFixed(1), rentPerPyeong, rentPerSqm, appropriateMonthlyRent, keyMoneyPayback };
  }, [deposit, monthlyRent, area, conversionRate, keyMoney]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  const regionBenchmark: Record<string, number> = { 서울: 50000, 경기: 25000, 지방: 15000 };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">상가 임대료 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        상가 임대 시 보증금·월임대료·면적을 입력하면 환산보증금, 3.3㎡(평)당 임대료, 전월세 전환율 기반 적정 임대료를 자동으로 계산합니다.
        지역별 시세와 비교하고 권리금 투자회수기간까지 한눈에 파악하여 상가 창업·임대 협상에 활용하세요.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">보증금 (원)</label>
            <input type="number" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={1000000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">월 임대료 (원)</label>
            <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">면적 (㎡)</label>
            <input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={1} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
            <select value={region} onChange={(e) => setRegion(e.target.value as "서울" | "경기" | "지방")} className="w-full border rounded-lg p-2 text-sm">
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="지방">지방</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전월세 전환율 (%)</label>
            <input type="number" value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={0.1} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">권리금 (원)</label>
            <input type="number" value={keyMoney} onChange={(e) => setKeyMoney(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={1000000} />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">환산보증금 (보증금 + 월세×100)</span>
            <span className="font-bold text-blue-700">{fmt(result.convertedDeposit)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">면적 ({area}㎡)</span>
            <span className="font-bold">{result.pyeong}평</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">3.3㎡(평)당 임대료</span>
            <span className="font-bold">{fmt(result.rentPerPyeong)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">㎡당 임대료</span>
            <span className="font-bold">{fmt(result.rentPerSqm)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">지역 평균 시세 ({region})</span>
            <span className="font-bold text-gray-500">{fmt(regionBenchmark[region])}원/평</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">적정 월임대료 (전환율 기준)</span>
            <span className={`font-bold ${result.appropriateMonthlyRent < monthlyRent ? "text-red-600" : "text-green-600"}`}>
              {fmt(result.appropriateMonthlyRent)}원
            </span>
          </div>
          <hr className="border-blue-200" />
          <div className="flex justify-between">
            <span className="text-gray-600">권리금 투자회수기간</span>
            <span className="font-bold text-orange-600">{result.keyMoneyPayback}개월 ({(result.keyMoneyPayback / 12).toFixed(1)}년)</span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">환산보증금이란?</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          환산보증금은 보증금과 월세를 하나의 금액으로 통합하여 임대 조건을 비교하는 지표입니다. 공식은 보증금 + 월세 × 100으로 계산합니다.
          상가건물임대차보호법에서는 환산보증금이 지역별 기준금액(서울 9억 원, 수도권 6.9억 원, 기타 5.4억 원) 이하일 때 세입자를 보호합니다.
          환산보증금이 기준을 초과하면 임대차 보호법의 일부 조항이 적용되지 않으므로 주의가 필요합니다.
          3.3㎡(평)당 임대료는 인근 상가와 비교할 때 사용하는 핵심 지표로, 지역·상권에 따라 큰 차이가 납니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">상가 임대료 협상 전략</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          상가 임대 협상에서 유리한 조건을 얻으려면 인근 상가의 시세를 충분히 조사하고, 공실 기간이 긴 상가일수록 임대인이 조건을 낮출 의향이 높다는 점을 활용하세요.
          보증금과 월세의 교환은 전월세 전환율을 기준으로 협상할 수 있으며, 임대인 입장에서도 합리적인 기준을 제시하면 협상이 원활해집니다.
          관리비·공과금·인테리어 공사 허용 범위도 계약 전 명확히 협의해야 나중에 분쟁을 예방할 수 있습니다.
          임대 계약 기간은 최소 1년이지만 상가임대차보호법에 따라 5년(2018.10.16 이후 계약은 10년)의 계약 갱신 청구권이 보장됩니다.
          계약서 작성 시 임대료 인상률 상한(연 5% 이내)을 명시하고, 공인중개사를 통해 계약하는 것이 안전합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "환산보증금 기준을 초과하면 어떤 문제가 생기나요?", a: "상가건물임대차보호법상 보호 기준(서울 9억 원)을 초과하면 우선변제권과 대항력 등 핵심 보호 조항을 받지 못할 수 있습니다. 임차인이 보증금을 지키기 위해 전세권 설정이나 임차권 등기를 고려해야 합니다." },
          { q: "상가 임대료는 얼마나 인상할 수 있나요?", a: "상가건물임대차보호법에 따라 임대료 인상률은 직전 임대료의 5%를 초과할 수 없습니다. 다만 경제 상황 변화가 급격한 경우 당사자 협의로 달리 정할 수 있습니다." },
          { q: "계약 갱신 청구권은 몇 년이나 보장되나요?", a: "2018년 10월 16일 이후 체결·갱신된 상가 임대차 계약은 10년간 계약 갱신 청구권이 보장됩니다. 임차인이 갱신을 요청하면 임대인은 정당한 사유 없이 거절할 수 없습니다." },
          { q: "관리비는 임대료에 포함되나요?", a: "관리비는 임대료와 별도로 부과되는 것이 일반적입니다. 관리비 항목(전기·수도·청소·주차 등)과 금액을 계약 전 명확히 확인하고, 관리비 포함 여부에 따라 실질 임대료가 달라집니다." },
          { q: "상가 임대차에서 임차인이 무단 전대하면 어떻게 되나요?", a: "임대인 동의 없이 전대(재임대)하면 임대인은 계약을 해지할 수 있습니다. 전대가 필요한 경우 반드시 임대인의 서면 동의를 받아야 하며, 전대 조건도 원 임대 조건 이내여야 합니다." },
          { q: "상가 임대보증금 반환 보증보험이란 무엇인가요?", a: "HUG(주택도시보증공사)에서 제공하는 상가 임대보증금 반환 보증보험에 가입하면 임대인이 계약 만료 후 보증금을 반환하지 않을 때 HUG가 대신 지급합니다. 일정 조건 충족 시 가입 가능하며 연 보험료가 발생합니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/commercial-rent-calc" />

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
