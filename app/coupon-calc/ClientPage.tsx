"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [originalPrice, setOriginalPrice] = useState(50000);
  const [coupon1Type, setCoupon1Type] = useState<"amount" | "percent">("percent");
  const [coupon1Value, setCoupon1Value] = useState(10);
  const [coupon2Type, setCoupon2Type] = useState<"amount" | "percent">("amount");
  const [coupon2Value, setCoupon2Value] = useState(2000);
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [minOrderAmount, setMinOrderAmount] = useState(30000);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const disc1 = coupon1Type === "percent"
      ? Math.floor(originalPrice * coupon1Value / 100)
      : coupon1Value;
    const afterCoupon1 = Math.max(0, originalPrice - disc1);
    const disc2 = coupon2Type === "percent"
      ? Math.floor(afterCoupon1 * coupon2Value / 100)
      : coupon2Value;
    const afterCoupon2 = Math.max(0, afterCoupon1 - disc2);
    const extraDisc = Math.floor(afterCoupon2 * extraDiscount / 100);
    const finalPrice = Math.max(0, afterCoupon2 - extraDisc);
    const totalDiscount = originalPrice - finalPrice;
    const discountRate = originalPrice > 0 ? Math.round(totalDiscount / originalPrice * 100) : 0;
    const belowMinOrder = originalPrice < minOrderAmount;
    return { disc1, disc2, extraDisc, finalPrice, totalDiscount, discountRate, belowMinOrder };
  }, [originalPrice, coupon1Type, coupon1Value, coupon2Type, coupon2Value, extraDiscount, minOrderAmount]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">쿠폰 할인 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        정가와 할인쿠폰(금액 또는 %), 추가할인을 입력하면 최종 결제금액과 총 할인금액, 할인율을 계산합니다.
        쿠폰 두 개를 중복 적용하는 시뮬레이션도 가능하여 온라인 쇼핑 시 최적의 쿠폰 조합을 미리 파악할 수 있습니다.
        최소주문금액 미달 여부도 함께 확인하세요.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">정가 (원)</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
            />
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">쿠폰 1</label>
            <div className="flex gap-2">
              <select
                value={coupon1Type}
                onChange={(e) => setCoupon1Type(e.target.value as "amount" | "percent")}
                className="border rounded-lg p-2 text-sm w-28"
              >
                <option value="percent">% 할인</option>
                <option value="amount">금액 할인</option>
              </select>
              <input
                type="number"
                value={coupon1Value}
                onChange={(e) => setCoupon1Value(Number(e.target.value))}
                className="flex-1 border rounded-lg p-2 text-sm"
                min={0}
              />
              <span className="self-center text-sm text-gray-500">{coupon1Type === "percent" ? "%" : "원"}</span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">쿠폰 2 (선택)</label>
            <div className="flex gap-2">
              <select
                value={coupon2Type}
                onChange={(e) => setCoupon2Type(e.target.value as "amount" | "percent")}
                className="border rounded-lg p-2 text-sm w-28"
              >
                <option value="percent">% 할인</option>
                <option value="amount">금액 할인</option>
              </select>
              <input
                type="number"
                value={coupon2Value}
                onChange={(e) => setCoupon2Value(Number(e.target.value))}
                className="flex-1 border rounded-lg p-2 text-sm"
                min={0}
              />
              <span className="self-center text-sm text-gray-500">{coupon2Type === "percent" ? "%" : "원"}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">추가할인 (%)</label>
            <input
              type="number"
              value={extraDiscount}
              onChange={(e) => setExtraDiscount(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
              max={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">최소주문금액 (원)</label>
            <input
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
            />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
        {result.belowMinOrder && (
          <div className="mb-3 p-2 bg-red-50 border border-red-300 rounded text-xs text-red-700">
            ⚠️ 주문금액이 최소주문금액({fmt(minOrderAmount)}원)에 미달합니다.
          </div>
        )}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">쿠폰 1 할인</span>
            <span className="font-bold text-red-600">-{fmt(result.disc1)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">쿠폰 2 할인</span>
            <span className="font-bold text-red-600">-{fmt(result.disc2)}원</span>
          </div>
          {result.extraDisc > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">추가 할인</span>
              <span className="font-bold text-red-600">-{fmt(result.extraDisc)}원</span>
            </div>
          )}
          <hr className="border-blue-200" />
          <div className="flex justify-between">
            <span className="text-gray-600">총 할인금액</span>
            <span className="font-bold text-orange-600">{fmt(result.totalDiscount)}원 ({result.discountRate}%)</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="font-bold text-gray-800">최종 결제금액</span>
            <span className="font-bold text-blue-700 text-xl">{fmt(result.finalPrice)}원</span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">쿠폰 할인 계산 방식</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          쿠폰 할인 계산기는 정가에서 쿠폰1을 먼저 적용하고, 할인된 금액에 쿠폰2를 순차적으로 적용하는 방식입니다.
          % 할인쿠폰은 해당 시점의 금액을 기준으로 비율만큼 할인되며, 금액 할인쿠폰은 지정된 금액이 차감됩니다.
          추가할인은 두 쿠폰 적용 후의 금액에 추가로 % 할인을 적용합니다.
          쇼핑몰마다 쿠폰 중복 적용 규정이 다를 수 있으므로 실제 결제 전 중복 가능 여부를 확인하세요.
          최소주문금액 조건은 원래 주문금액 기준으로 적용되는 경우가 많으므로 쿠폰 적용 전 금액이 기준입니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">쿠폰 최대 활용 전략</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          쿠폰을 최대한 활용하려면 쇼핑몰의 정기 할인 시즌(블랙프라이데이, 명절, 창립기념일 등)에 맞춰 대형 구매를 계획하는 것이 좋습니다.
          이때 플랫폼 쿠폰 + 브랜드 쿠폰 + 카드 즉시할인을 함께 적용하면 30~50% 이상의 높은 할인율을 달성할 수 있습니다.
          % 할인쿠폰은 금액이 클수록 혜택이 커지므로 장바구니를 모아 한 번에 구매하는 것이 유리합니다.
          금액 할인쿠폰(예: 5,000원 할인)은 저렴한 상품에 적용할수록 할인율이 높아집니다.
          쿠폰 만료일을 미리 확인하고, 불필요한 충동구매를 피하면서 실질 절약 효과를 극대화하세요.
          네이버, 카카오, 쿠팡 등 각 플랫폼별 쿠폰 정책과 중복 적용 규정을 숙지하는 것이 현명한 소비의 첫걸음입니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "쿠폰 중복 적용이 항상 가능한가요?", a: "쇼핑몰마다 중복 적용 정책이 다릅니다. 일반적으로 플랫폼 쿠폰과 브랜드 쿠폰은 중복 적용되는 경우가 많지만, 같은 종류의 쿠폰은 1개만 사용 가능한 경우가 많습니다. 결제 전 약관을 확인하세요." },
          { q: "% 할인과 금액 할인 중 어느 것이 더 유리한가요?", a: "구매금액이 클수록 % 할인이 유리하고, 금액이 작을수록 금액 할인이 유리할 수 있습니다. 예를 들어 10만 원 구매 시 10% 할인은 1만 원, 7천 원 할인 쿠폰보다 더 큰 혜택입니다." },
          { q: "최소주문금액 미달 시 쿠폰을 어떻게 사용하나요?", a: "최소주문금액에 미달하면 해당 쿠폰은 사용이 불가합니다. 추가 상품을 담아 최소금액을 충족하거나, 최소주문금액 조건이 없는 다른 쿠폰을 찾아보세요." },
          { q: "쿠폰 만료일이 지나면 어떻게 되나요?", a: "만료된 쿠폰은 사용이 불가능하며 연장이나 환불도 어렵습니다. 만료 전 알림을 설정해두고, 마지막 날에라도 소액 구매에 활용하거나 다음 구매 계획에 반영하세요." },
          { q: "쿠폰 적용 후 취소·환불 시 쿠폰도 돌려받나요?", a: "쇼핑몰 정책에 따라 다릅니다. 쿠폰이 반환되는 경우도 있지만, 이미 사용한 쿠폰은 재발급이 안 되는 경우도 있습니다. 취소 전 고객센터에 쿠폰 환원 여부를 확인하세요." },
          { q: "카드 즉시할인도 쿠폰 중복 적용이 가능한가요?", a: "카드 즉시할인은 쿠폰과 별개로 적용되는 경우가 대부분입니다. 특정 카드로 결제 시 추가로 5~10% 즉시할인이 되는 이벤트를 활용하면 쿠폰 할인에 더해 추가 절약이 가능합니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/coupon-calc" />

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
