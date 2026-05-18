"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

function calcPropertyTax(publicPrice: number, propertyType: string) {
  let taxBase = 0;
  let tax = 0;

  if (propertyType === "주택") {
    taxBase = publicPrice * 0.6;
    if (taxBase <= 60_000_000) {
      tax = taxBase * 0.001;
    } else if (taxBase <= 150_000_000) {
      tax = 60_000 + (taxBase - 60_000_000) * 0.0015;
    } else if (taxBase <= 300_000_000) {
      tax = 195_000 + (taxBase - 150_000_000) * 0.0025;
    } else {
      tax = 570_000 + (taxBase - 300_000_000) * 0.004;
    }
  } else if (propertyType === "토지") {
    taxBase = publicPrice * 0.7;
    if (taxBase <= 50_000_000) {
      tax = taxBase * 0.002;
    } else if (taxBase <= 1_000_000_000) {
      tax = 100_000 + (taxBase - 50_000_000) * 0.003;
    } else {
      tax = 2_950_000 + (taxBase - 1_000_000_000) * 0.005;
    }
  } else {
    taxBase = publicPrice * 0.7;
    tax = taxBase * 0.0025;
  }

  const eduTax = tax * 0.2;
  const urbanTax = publicPrice * 0.0014;
  const total = tax + eduTax + urbanTax;

  return {
    taxBase: Math.round(taxBase),
    tax: Math.round(tax),
    eduTax: Math.round(eduTax),
    urbanTax: Math.round(urbanTax),
    total: Math.round(total),
  };
}

export default function ClientPage() {
  const [publicPrice, setPublicPrice] = useState(300_000_000);
  const [propertyType, setPropertyType] = useState("주택");

  const r = useMemo(() => calcPropertyTax(publicPrice, propertyType), [publicPrice, propertyType]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">재산세 계산기</h1>
      <p className="text-gray-600 mb-6">공시가격과 부동산 유형을 입력하면 재산세와 지방교육세, 도시지역분을 자동으로 계산합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">공시가격 (원)</label>
          <input type="number" min={0} step={10000000} value={publicPrice}
            onChange={(e) => setPublicPrice(Number(e.target.value))}
            className="w-full border p-2 rounded" />
          <p className="text-xs text-gray-400 mt-1">{fmt(publicPrice)}원 ({(publicPrice / 100_000_000).toFixed(2)}억)</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">부동산 유형</label>
          <div className="flex gap-2 flex-wrap">
            {["주택", "토지", "건물"].map((t) => (
              <button key={t} onClick={() => setPropertyType(t)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${propertyType === t ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-4 text-blue-800">계산 결과</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">과세표준</p>
            <p className="text-xl font-bold text-gray-800">{fmt(r.taxBase)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">재산세</p>
            <p className="text-xl font-bold text-blue-600">{fmt(r.tax)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">지방교육세 (20%)</p>
            <p className="text-xl font-bold text-gray-700">{fmt(r.eduTax)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">도시지역분 (0.14%)</p>
            <p className="text-xl font-bold text-gray-700">{fmt(r.urbanTax)}원</p>
          </div>
        </div>
        <div className="border-t border-blue-200 pt-4 mt-4">
          <p className="text-xs text-gray-500 mb-0.5">총 납부 세액</p>
          <p className="text-3xl font-bold text-red-600">{fmt(r.total)}원</p>
          <p className="text-xs text-gray-400 mt-1">7월·9월에 각각 50%씩 분할 납부 (20만원 이하 7월 일괄)</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">재산세란?</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          재산세는 매년 6월 1일 기준으로 토지, 건물, 주택 등을 보유한 사람에게 부과되는 지방세입니다.
          주택의 경우 공시가격의 60%가 과세표준이며, 6천만 원 이하 0.1%, 1억 5천만 원 이하 0.15%, 3억 원 이하 0.25%, 3억 원 초과 0.4%의 누진세율이 적용됩니다.
          재산세 외에 지방교육세(재산세의 20%)와 도시지역분(공시가격의 0.14%)이 추가됩니다.
          납부 시기는 7월(건물·주택 절반)과 9월(토지·주택 나머지 절반)로 나뉘며, 세액이 20만 원 이하이면 7월에 전액 납부합니다.
          재산세는 위택스(wetax.go.kr) 또는 납세고지서를 통해 납부할 수 있습니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">주택 재산세율표</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-500">과세표준 (공시가 × 60%)</th>
                <th className="text-right py-2 text-gray-500">세율</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["6,000만 원 이하", "0.1%"],
                ["6,000만 ~ 1억 5,000만 원", "0.15%"],
                ["1억 5,000만 ~ 3억 원", "0.25%"],
                ["3억 원 초과", "0.4%"],
              ].map(([range, rate]) => (
                <tr key={range} className="border-b last:border-0">
                  <td className="py-2 text-gray-700">{range}</td>
                  <td className="py-2 text-right font-bold text-blue-600">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          재산세는 주택 외 건물에는 0.25%, 별도합산 토지에는 0.2~0.4%, 종합합산 토지에는 0.2~0.5% 세율이 적용됩니다.
          도시지역분(공시가격 × 0.14%)은 도시지역 내 토지·건물·주택에만 부과됩니다.
          1세대 1주택자는 공시가격 9억 원 이하 주택에 대해 재산세 특례세율(0.05%p 인하)이 적용될 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "재산세 납부 기한은 언제인가요?", a: "주택 재산세는 7월 16일~31일(50%)과 9월 16일~30일(50%)에 각각 납부합니다. 세액이 20만 원 이하이면 7월에 전액 납부합니다." },
          { q: "재산세와 종합부동산세의 차이는 무엇인가요?", a: "재산세는 모든 부동산 보유자에게 부과되는 지방세이고, 종합부동산세는 일정 기준금액(주택 9억 또는 12억) 초과분에 대해 부과되는 국세입니다. 두 세금은 별도로 납부해야 합니다." },
          { q: "재산세 고지서가 없어도 납부해야 하나요?", a: "재산세는 지방자치단체가 부과·고지하는 세금이므로 고지서를 받아서 납부합니다. 고지서가 오지 않으면 해당 지자체에 문의하세요." },
          { q: "임대 주택은 재산세를 납부해야 하나요?", a: "임대주택도 소유자 기준으로 재산세가 부과됩니다. 다만 임대사업자 등록 주택은 일정 요건 충족 시 재산세 감면 혜택이 있을 수 있습니다." },
          { q: "재산세 분할납부가 가능한가요?", a: "재산세가 500만 원을 초과하는 경우 일부를 분할납부 신청할 수 있습니다. 납부기한 내에 관할 지자체에 신청하면 됩니다." },
          { q: "공시가격은 어떻게 확인하나요?", a: "주택의 공시가격은 국토교통부 부동산 공시가격 알리미(realtyprice.kr)에서 확인할 수 있으며, 토지의 개별공시지가는 해당 지자체 또는 국토교통부에서 확인할 수 있습니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/property-tax-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
