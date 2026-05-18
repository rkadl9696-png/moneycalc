"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [purchaseAmount, setPurchaseAmount] = useState(50000);
  const [rewardRate, setRewardRate] = useState(1);
  const [usedPoints, setUsedPoints] = useState(0);
  const [validityMonths, setValidityMonths] = useState(12);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const earned = Math.floor(purchaseAmount * rewardRate / 100);
    const remaining = Math.max(0, earned - usedPoints);
    const cashValue = remaining;
    return { earned, remaining, cashValue };
  }, [purchaseAmount, rewardRate, usedPoints]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">포인트 적립 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        구매금액과 적립률을 입력하면 이번 구매에서 적립되는 포인트와 사용 후 잔여 포인트, 포인트 현금가치를 즉시 계산합니다.
        신용카드 포인트, 멤버십 포인트, 쇼핑몰 리워드 등 다양한 포인트 프로그램 관리에 활용하세요.
        포인트 유효기간도 함께 확인하여 만료 전 사용 계획을 세울 수 있습니다.
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
            <label className="block text-sm font-medium text-gray-700 mb-1">적립률 (%)</label>
            <input
              type="number"
              value={rewardRate}
              onChange={(e) => setRewardRate(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
              step={0.1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사용 포인트</label>
            <input
              type="number"
              value={usedPoints}
              onChange={(e) => setUsedPoints(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">포인트 유효기간 (개월)</label>
            <input
              type="number"
              value={validityMonths}
              onChange={(e) => setValidityMonths(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={1}
            />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">이번 구매 적립 포인트</span>
            <span className="font-bold text-blue-700">{fmt(result.earned)}P</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">포인트 사용 후 잔여</span>
            <span className="font-bold text-green-700">{fmt(result.remaining)}P</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">잔여 포인트 현금가치</span>
            <span className="font-bold text-gray-800">{fmt(result.cashValue)}원</span>
          </div>
          {validityMonths > 0 && result.remaining > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-xs text-yellow-800">
              ⚠️ {validityMonths}개월 이내에 {fmt(result.remaining)}P를 사용하지 않으면 소멸될 수 있습니다. 빠른 사용을 권장합니다.
            </div>
          )}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">포인트 적립 계산기 활용법</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          포인트 적립 계산기는 구매 시 예상 적립 포인트를 미리 파악하고 효율적인 소비 계획을 세울 수 있도록 도와줍니다.
          적립률은 카드사·멤버십 종류에 따라 0.1%에서 5% 이상까지 다양합니다. 예를 들어 구매금액 10만 원에 1% 적립이면 1,000포인트가 적립됩니다.
          많은 포인트 프로그램은 유효기간(보통 1~3년)이 있어 기간 내 사용하지 않으면 소멸됩니다.
          적립 포인트는 1포인트 = 1원의 현금가치를 가지는 경우가 일반적이므로, 잔여 포인트를 현금처럼 활용하면 실질적인 절약이 가능합니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">포인트 절약 전략과 주의사항</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          포인트를 최대한 활용하려면 높은 적립률을 제공하는 카드나 멤버십을 주력으로 사용하는 것이 중요합니다.
          같은 금액을 지출하더라도 적립률이 2%인 카드는 1%인 카드보다 두 배 많은 포인트를 적립합니다.
          또한 더블 적립 이벤트나 특정 가맹점 보너스 적립을 적극 활용하면 기본 적립 외 추가 혜택을 받을 수 있습니다.
          포인트 소멸 방지를 위해 정기적으로 잔여 포인트를 확인하고, 소멸 예정 포인트는 온라인 쇼핑·편의점 결제·기부 등으로 활용하세요.
          카드사 포인트는 연회비 납부나 상품권 교환으로도 사용할 수 있어 유연하게 활용할 수 있습니다.
          단, 포인트 목적으로 불필요한 소비를 늘리는 것은 오히려 손해가 될 수 있으니 주의가 필요합니다.
          포인트 혜택은 카드 종류·이용 실적에 따라 달라지므로 본인에게 맞는 포인트 전략을 세우는 것이 핵심입니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "포인트 적립률은 어떻게 적용되나요?", a: "적립률은 구매금액의 일정 비율로 포인트를 쌓는 방식입니다. 예를 들어 1% 적립률이면 10만 원 구매 시 1,000포인트가 적립됩니다. 카드사나 쇼핑몰마다 기본 적립률과 보너스 적립 조건이 다릅니다." },
          { q: "포인트의 현금 가치는 얼마인가요?", a: "대부분의 포인트 프로그램에서 1포인트 = 1원의 가치를 갖습니다. 단, 일부 항공 마일리지나 특정 멤버십은 교환 비율이 다를 수 있으니 해당 약관을 확인하세요." },
          { q: "포인트 유효기간이 지나면 어떻게 되나요?", a: "유효기간이 만료된 포인트는 자동으로 소멸되어 되돌릴 수 없습니다. 소멸 전 SMS·앱 알림을 활용하고, 미리 온라인 쇼핑이나 편의점 등에서 사용하거나 기부 프로그램에 참여하세요." },
          { q: "여러 포인트를 합산하여 사용할 수 있나요?", a: "카드사 포인트, 멤버십 포인트, 쇼핑몰 포인트는 별도로 관리되며 일반적으로 합산이 어렵습니다. 단, 포인트 통합 플랫폼(예: OK캐쉬백, CJ ONE 등)을 이용하면 여러 제휴처 포인트를 모아 사용할 수 있습니다." },
          { q: "포인트로 결제하면 추가 적립도 되나요?", a: "포인트로 결제한 금액에 대해서는 추가 포인트가 적립되지 않는 경우가 많습니다. 적립 대상 금액은 현금·카드 결제 금액만 해당되는 경우가 일반적이므로 약관을 확인하세요." },
          { q: "최소 사용 가능 포인트가 있나요?", a: "많은 포인트 프로그램에서 최소 사용 가능 포인트(보통 100~1,000포인트)를 정해두고 있습니다. 잔여 포인트가 최소 사용 기준에 미달하면 사용이 불가능하므로 적립 목표를 세워 관리하세요." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/points-calc" />

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
