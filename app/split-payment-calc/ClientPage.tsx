"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [purchaseAmount, setPurchaseAmount] = useState(1200000);
  const [months, setMonths] = useState(12);
  const [annualRate, setAnnualRate] = useState(12);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    if (months <= 0) return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, effectiveRate: 0, schedule: [] };
    const monthlyRate = annualRate / 100 / 12;
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = purchaseAmount / months;
    } else {
      monthlyPayment = purchaseAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    }
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - purchaseAmount;
    const effectiveRate = purchaseAmount > 0 ? (totalInterest / purchaseAmount) * 100 : 0;

    const schedule = [];
    let balance = purchaseAmount;
    const displayMonths = Math.min(months, 12);
    for (let i = 1; i <= displayMonths; i++) {
      const interestAmt = balance * monthlyRate;
      const principal = monthlyPayment - interestAmt;
      balance = Math.max(0, balance - principal);
      schedule.push({ month: i, payment: Math.round(monthlyPayment), interest: Math.round(interestAmt), principal: Math.round(principal), balance: Math.round(balance) });
    }
    return { monthlyPayment: Math.round(monthlyPayment), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest), effectiveRate, schedule };
  }, [purchaseAmount, months, annualRate]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">분할납부 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        구매금액과 할부개월(2~36개월), 연 할부수수료율을 입력하면 월 납부액과 총 납부액, 총 이자를 계산합니다.
        개월별 납부 스케줄 테이블(최대 12개월)로 원금·이자 내역을 확인하고, 실질 이자율을 파악하여 현명한 할부 결정을 내리세요.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">구매금액 (원)</label>
            <input
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할부개월 (2~36개월)</label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(Math.min(36, Math.max(2, Number(e.target.value))))}
              className="w-full border rounded-lg p-2 text-sm"
              min={2}
              max={36}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할부수수료율 (연 %)</label>
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
              step={0.1}
            />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">월 납부액</span>
            <span className="font-bold text-blue-700 text-lg">{fmt(result.monthlyPayment)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">총 납부액</span>
            <span className="font-bold">{fmt(result.totalPayment)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">총 이자</span>
            <span className="font-bold text-red-600">{fmt(result.totalInterest)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">실질 이자율</span>
            <span className="font-bold">{result.effectiveRate.toFixed(2)}%</span>
          </div>
        </div>
        {result.schedule.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-2">납부 스케줄 (첫 12개월)</h3>
            <div className="overflow-x-auto">
              <table className="text-xs w-full">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-1 text-left">월</th>
                    <th className="p-1 text-right">납부액</th>
                    <th className="p-1 text-right">원금</th>
                    <th className="p-1 text-right">이자</th>
                    <th className="p-1 text-right">잔금</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="border-t">
                      <td className="p-1">{row.month}회</td>
                      <td className="p-1 text-right">{fmt(row.payment)}</td>
                      <td className="p-1 text-right">{fmt(row.principal)}</td>
                      <td className="p-1 text-right text-red-600">{fmt(row.interest)}</td>
                      <td className="p-1 text-right">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">분할납부와 할부의 차이</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          분할납부는 구매금액을 여러 번에 나눠 내는 방식으로, 신용카드 할부와 유사하지만 쇼핑몰·제조사가 직접 제공하는 경우를 분할납부라고도 합니다.
          카드사 할부는 카드사가 수수료를 부과하며, 무이자 할부는 판매자가 수수료를 대신 부담하는 방식입니다.
          무이자 할부를 최대한 활용하면 실제로 추가 비용 없이 현금 흐름을 분산시킬 수 있어 유용합니다.
          이자부 할부의 경우 할부 개월이 길어질수록 총 이자 부담이 늘어나므로, 여유자금이 있다면 일시불이 더 경제적입니다.
          할부수수료율은 연율로 표시되므로 실제 부담은 개월에 비례하여 달라집니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">현명한 할부 활용 전략</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          할부를 현명하게 활용하려면 무이자 할부 기간(보통 2~6개월)을 최대한 이용하는 것이 핵심입니다.
          연 12%의 할부수수료는 월 1%에 해당하며, 12개월 할부 시 총 이자는 원금의 6~7%에 달합니다.
          대형 구매(가전·가구·여행 등)의 경우 카드사 무이자 할부 이벤트를 미리 체크하고 구매 시기를 조정하면 큰 절약이 가능합니다.
          할부 중 중도 상환이 필요한 경우 카드사에 따라 수수료가 발생할 수 있으니 확인하세요.
          여러 할부가 동시에 진행되면 매월 고정 지출이 증가하여 현금흐름이 악화될 수 있으므로 총 할부 부담을 월수입의 20% 이내로 관리하는 것이 바람직합니다.
          분할납부 계획 수립 시 이 계산기로 월 부담액을 미리 확인하고 재무 계획에 반영하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "무이자 할부는 정말 이자가 없나요?", a: "카드사 무이자 할부는 구매자가 이자를 내지 않지만, 판매자(가맹점)가 카드사에 수수료를 대납하는 구조입니다. 소비자 입장에서는 실제로 추가 비용이 없으나, 판매자 입장에서는 비용이 발생합니다." },
          { q: "할부수수료율은 어떻게 결정되나요?", a: "할부수수료율은 카드사마다 다르며 보통 연 5~15% 수준입니다. 신용등급, 카드 종류, 할부 기간에 따라 달라집니다. 카드사 앱이나 고객센터에서 본인의 정확한 수수료율을 확인하세요." },
          { q: "할부 도중 중도 상환하면 이자를 줄일 수 있나요?", a: "네, 중도 상환 시 남은 원금에 대한 이자가 줄어들어 총 비용이 감소합니다. 단, 일부 카드사는 중도 상환 수수료를 부과하는 경우가 있으므로 확인이 필요합니다." },
          { q: "할부와 리볼빙의 차이는 무엇인가요?", a: "할부는 고정된 금액을 정해진 기간 동안 나눠 내는 방식이고, 리볼빙은 최소금액만 납부하고 나머지를 이월시키는 방식입니다. 리볼빙은 수수료율이 매우 높으므로 가급적 피하는 것이 좋습니다." },
          { q: "할부 개월을 늘리면 월 부담이 줄지만 총 이자도 늘어나나요?", a: "네, 할부 기간이 길어질수록 월 납부액은 줄지만 이자를 내는 기간이 늘어나 총 이자 부담이 증가합니다. 여유가 있다면 짧은 기간 할부가 총 비용 면에서 더 유리합니다." },
          { q: "분할납부와 대출의 금리를 비교하는 방법이 있나요?", a: "할부수수료 연율을 대출 금리와 직접 비교하면 됩니다. 예를 들어 할부수수료가 연 12%라면 같은 금액을 연 8% 금리 대출로 조달하는 편이 더 저렴합니다. 이 계산기의 실질 이자율을 참고하여 비교하세요." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/split-payment-calc" />

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
