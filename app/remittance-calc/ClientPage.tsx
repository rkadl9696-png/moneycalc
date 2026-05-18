"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [sendAmount, setSendAmount] = useState(1000000);
  const [receiveCurrency, setReceiveCurrency] = useState("USD");
  const [baseRate, setBaseRate] = useState(1350);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const METHODS = useMemo(() => [
    {
      name: "은행 (일반)",
      fee: 10000,
      telegramFee: 5000,
      fxSpread: 0.02,
      note: "수수료 10,000원 + 전신료 5,000원",
    },
    {
      name: "토스/카카오",
      fee: 1000,
      telegramFee: 0,
      fxSpread: 0.005,
      note: "수수료 1,000원, 환율 우대 95%",
    },
    {
      name: "웨스턴유니온",
      fee: 15000,
      telegramFee: 0,
      fxSpread: 0.025,
      note: "수수료 약 15,000원 (금액에 따라 변동)",
    },
  ], []);

  const results = useMemo(() => {
    return METHODS.map((m) => {
      const totalFeeKRW = m.fee + m.telegramFee;
      const netAmountKRW = Math.max(0, sendAmount - totalFeeKRW);
      const appliedRate = baseRate * (1 + m.fxSpread);
      const receiveAmount = (netAmountKRW / appliedRate).toFixed(2);
      return { ...m, totalFeeKRW, receiveAmount, appliedRate: appliedRate.toFixed(1) };
    });
  }, [sendAmount, baseRate, METHODS]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">해외송금 수수료 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        송금액과 수취 통화, 기준 환율을 입력하면 은행·핀테크·웨스턴유니온 세 가지 방법의 실수취액과 총 수수료를 계산하고 비교합니다.
        방법별 수수료 구조와 환율 차이를 한눈에 확인하여 가장 저렴한 해외송금 방법을 선택하세요.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">송금액 (원)</label>
            <input type="number" value={sendAmount} onChange={(e) => setSendAmount(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">수취 통화</label>
            <select value={receiveCurrency} onChange={(e) => setReceiveCurrency(e.target.value)} className="w-full border rounded-lg p-2 text-sm">
              <option value="USD">USD (미국 달러)</option>
              <option value="EUR">EUR (유로)</option>
              <option value="JPY">JPY (일본 엔)</option>
              <option value="CNY">CNY (중국 위안)</option>
              <option value="VND">VND (베트남 동)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">기준 환율 (원/{receiveCurrency})</label>
            <input type="number" value={baseRate} onChange={(e) => setBaseRate(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={1} />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">송금 방법별 비교</h2>
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={r.name} className={`p-3 rounded-lg border ${i === 1 ? "bg-green-50 border-green-400" : "bg-white border-gray-200"}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm">{r.name} {i === 1 ? "✅ 추천" : ""}</span>
                <span className="font-bold text-blue-700">{r.receiveAmount} {receiveCurrency}</span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div className="flex justify-between">
                  <span>총 수수료</span>
                  <span className="text-red-600 font-medium">{fmt(r.totalFeeKRW)}원</span>
                </div>
                <div className="flex justify-between">
                  <span>적용 환율</span>
                  <span>{r.appliedRate}원</span>
                </div>
                <div className="text-gray-400">{r.note}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">해외송금 수수료 구조</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          해외송금 비용은 크게 세 가지로 구성됩니다. 첫째는 송금 수수료(고정 금액), 둘째는 SWIFT 전신료(통신 비용), 셋째는 환전 스프레드(환율 차익)입니다.
          은행은 수수료와 전신료가 높지만 안정성이 높고 거액 송금에 유리합니다.
          핀테크(토스, 카카오페이, 트랜스퍼와이즈 등)는 낮은 고정 수수료와 높은 환율 우대율로 소액 송금에 유리합니다.
          웨스턴유니온은 수취인이 은행 계좌 없이도 현금으로 수령할 수 있는 장점이 있지만 수수료가 높습니다.
          수취 은행에서도 중개 수수료를 부과할 수 있으며, 이를 SHA(공동부담), OUR(송금인 전액부담), BEN(수취인 전액부담) 방식으로 선택할 수 있습니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">저렴한 해외송금 전략</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          소액(100만 원 이하) 해외송금에는 토스·카카오페이·트랜스퍼와이즈(Wise) 같은 핀테크 서비스가 가장 경제적입니다.
          수수료가 1,000원 내외이고 환율 우대율이 95% 이상이어서 기존 은행보다 10~30% 절약이 가능합니다.
          거액 송금(500만 원 이상)은 하나은행·기업은행 등의 인터넷 해외송금 서비스를 이용하면 수수료 할인 혜택을 받을 수 있습니다.
          일부 은행은 특정 국가·통화 송금에 수수료 면제 이벤트를 제공하므로 정기 송금 전 확인하세요.
          정기적인 해외 송금이 필요하다면 월정액 서비스나 대량 송금 전용 상품을 문의하면 추가 할인이 가능합니다.
          환율 변동에 민감한 경우 목표 환율 달성 시 자동 송금해주는 예약 환율 서비스도 활용하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "해외송금 한도는 얼마인가요?", a: "연간 미화 5만 달러(또는 그 상당액)까지는 신고 없이 송금 가능합니다. 이를 초과하면 한국은행에 지급 신고를 해야 합니다. 단, 유학비·해외 부동산 취득 등 특정 목적은 별도 규정이 적용됩니다." },
          { q: "SWIFT 전신료란 무엇인가요?", a: "SWIFT는 국제 금융기관 간 메시지를 전달하는 통신망입니다. 전신료는 이 통신망 사용에 따른 비용으로, 보통 건당 3,000~8,000원이 부과됩니다. 핀테크 서비스는 별도 전신료를 부과하지 않는 경우가 많습니다." },
          { q: "수취인이 은행 계좌가 없어도 해외송금이 가능한가요?", a: "웨스턴유니온, 머니그램 등 국제 송금 서비스를 이용하면 수취인이 은행 계좌 없이도 현금으로 받을 수 있습니다. 다만 수수료가 높으므로 계좌 송금이 가능한 경우 핀테크 서비스를 우선 활용하세요." },
          { q: "해외송금 완료까지 얼마나 걸리나요?", a: "은행 SWIFT 송금은 보통 2~5 영업일이 소요됩니다. 핀테크 서비스는 주요 통화의 경우 당일~1 영업일 내 처리되는 경우가 많아 빠릅니다. 수취국의 금융 인프라와 통화에 따라 시간이 더 걸릴 수 있습니다." },
          { q: "해외송금 시 세금 신고가 필요한가요?", a: "연간 5만 달러 이하의 개인 송금은 별도 세금 신고가 필요 없습니다. 단, 사업 목적 송금, 해외 투자, 외국인 근로자의 임금 송금 등은 목적에 따라 신고 의무가 다르므로 세무사 또는 은행 외환 담당자와 상담하세요." },
          { q: "수수료 없는 해외송금 서비스가 있나요?", a: "완전히 수수료 없는 서비스는 드물지만, 일부 핀테크 서비스는 첫 송금 무료, 특정 통화·금액 대 수수료 면제 이벤트를 제공합니다. Wise(구 TransferWise)는 투명한 수수료 구조로 인기가 높으며, 트래블월렛은 일부 통화에 수수료를 받지 않습니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/remittance-calc" />

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
