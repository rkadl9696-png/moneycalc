"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type ShipType = "us_direct" | "other";

export default function ClientPage() {
  const [priceUsd, setPriceUsd] = useState(300);
  const [exchangeRate, setExchangeRate] = useState(1380);
  const [customsRate, setCustomsRate] = useState(8);
  const [shipType, setShipType] = useState<ShipType>("other");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const freeLimit = shipType === "us_direct" ? 200 : 150;
    const isTaxFree = priceUsd <= freeLimit;
    const taxableKrw = priceUsd * exchangeRate;
    const customs = isTaxFree ? 0 : taxableKrw * (customsRate / 100);
    const vat = isTaxFree ? 0 : (taxableKrw + customs) * 0.1;
    const totalTax = customs + vat;
    const totalCost = taxableKrw + totalTax;
    return { isTaxFree, freeLimit, taxableKrw, customs, vat, totalTax, totalCost };
  }, [priceUsd, exchangeRate, customsRate, shipType]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">관세 계산기</h1>
      <p className="text-gray-600 mb-6">
        해외 직구 물품의 관세와 부가세, 총 납부 비용을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">물품 정보 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">배송 방식</label>
          <div className="flex gap-2">
            <button
              onClick={() => setShipType("us_direct")}
              className={`flex-1 py-2 rounded border text-sm font-bold ${shipType === "us_direct" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
            >
              미국 직배송 (면세 $200)
            </button>
            <button
              onClick={() => setShipType("other")}
              className={`flex-1 py-2 rounded border text-sm font-bold ${shipType === "other" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
            >
              기타 국가 (면세 $150)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">물품 가격 (USD)</label>
            <input
              type="number"
              value={priceUsd}
              onChange={(e) => setPriceUsd(Number(e.target.value))}
              onBlur={(e) => setPriceUsd(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">환율 (원/달러)</label>
            <input
              type="number"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(Number(e.target.value))}
              onBlur={(e) => setExchangeRate(Math.max(1, Number(e.target.value) || 1380))}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">관세율 (%)</label>
          <input
            type="number"
            value={customsRate}
            onChange={(e) => setCustomsRate(Number(e.target.value))}
            onBlur={(e) => setCustomsRate(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">의류 13%, 신발 13%, 전자제품 0~8%, 식품 8~27% (관세청 기준)</p>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        {result.isTaxFree ? (
          <div className="text-center py-4">
            <p className="text-3xl font-bold text-green-600 mb-2">면세 대상</p>
            <p className="text-gray-600">물품 가격 ${priceUsd}가 면세 한도 ${result.freeLimit} 이하입니다.</p>
            <p className="text-lg font-bold mt-3">총 비용: {result.taxableKrw.toLocaleString()}원</p>
          </div>
        ) : (
          <>
            <h2 className="text-base font-bold mb-4 text-blue-800">세금 계산 결과</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">과세가격 (원화)</span>
                <span className="font-bold">{result.taxableKrw.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">관세 ({customsRate}%)</span>
                <span className="font-bold">{result.customs.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">부가세 10%</span>
                <span className="font-bold">{result.vat.toLocaleString()}원</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between">
                <span className="text-gray-600">총 납부세액</span>
                <span className="font-bold text-orange-600">{result.totalTax.toLocaleString()}원</span>
              </div>
            </div>
            <div className="border-t border-blue-300 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-blue-800">최종 비용 합계</span>
              <span className="text-2xl font-bold text-blue-700">{result.totalCost.toLocaleString()}원</span>
            </div>
          </>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">해외 직구 관세 안내</h2>
        <p className="mb-3">
          해외 직구 상품은 과세가격(물품가 × 환율)이 면세 한도를 초과하면 관세와 부가세가 부과됩니다. 미국 직배송은 $200 이하, 그 외 국가는 $150 이하일 때 면세입니다. 단, 술·담배·향수는 면세 한도 적용 없이 항상 과세됩니다.
        </p>
        <p className="mb-3">
          관세율은 품목(HS 코드)에 따라 다르며, 의류·신발은 13%, 가방은 8%, 일반 전자제품은 0~8%, 식품은 8~27% 수준입니다. 관세청 홈페이지에서 품목별 정확한 세율을 확인할 수 있습니다.
        </p>
        <p>
          부가세는 (과세가격 + 관세)의 10%입니다. 목록통관 방식(물품 가격 $150 이하, 미국산 $200 이하)은 세관에 직접 신고 없이 간이 통관되며, 초과 시 일반 수입신고를 해야 합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">직구 시 주의사항과 절세 팁</h2>
        <p className="mb-3">
          면세 한도는 물품 가격만 기준이 아니라 운임과 보험료를 포함한 과세가격 기준입니다. 국내 배송 대행 서비스를 이용할 경우 배송비가 과세가격에 포함될 수 있어 총 비용이 달라질 수 있습니다.
        </p>
        <p>
          목록통관 가능한 품목(의류, 신발, 가방 등)은 $150/$200 이하로 나누어 구매하면 면세 혜택을 받을 수 있습니다. 단, 동일 날짜에 같은 쇼핑몰에서 주문 분할은 합산 과세될 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 관세 면세 한도 $150/$200는 물품가만 기준인가요?</p>
          <p>일반적으로 물품 가격 기준이지만, 국제 배송비와 보험료를 합산하는 경우도 있습니다. 정확한 과세가격은 관세청 고시에 따라 결정됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 하루에 여러 번 구매하면 합산되나요?</p>
          <p>같은 날 동일 해외 판매자로부터 구매한 물품은 합산 과세될 수 있습니다. 다른 날, 다른 쇼핑몰을 이용하면 별도 건으로 처리됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 직구 물품을 대리 수령하면 관세가 달라지나요?</p>
          <p>물품은 최종 수령자 기준으로 과세됩니다. 타인 명의로 대리 수령하거나 분할 배송으로 면세 한도를 의도적으로 회피하면 탈세로 처벌받을 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 관세 납부는 어떻게 하나요?</p>
          <p>배송 대행 업체 이용 시 업체가 대신 납부 후 청구하거나, 관세청에서 직접 납부 고지서를 받아 은행·홈택스에서 납부할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 해외 직구 반품 시 이미 낸 관세는 돌려받나요?</p>
          <p>네, 반품 후 수출 사실을 증명하는 서류를 세관에 제출하면 납부한 관세와 부가세를 환급받을 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전자제품은 관세가 없나요?</p>
          <p>스마트폰, 노트북 등 IT 제품은 WTO 협정에 의해 관세율 0%가 적용되지만, 부가세 10%는 부과됩니다. 가전제품 일부는 별도 관세가 적용될 수 있습니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/customs-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
