"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

function calcAcquisitionTax(price: number, homes: number, type: string, over85sqm: boolean) {
  let rate = 0;
  if (type === "상속") {
    rate = 0.028;
  } else if (type === "증여") {
    rate = 0.035;
  } else {
    if (homes === 1) {
      if (price <= 600_000_000) {
        rate = 0.01;
      } else if (price <= 900_000_000) {
        rate = (price - 600_000_000) / 300_000_000 * 0.02 + 0.01;
      } else {
        rate = 0.03;
      }
    } else if (homes === 2) {
      rate = 0.08;
    } else {
      rate = 0.12;
    }
  }

  const acquisitionTax = Math.round(price * rate);
  const eduTax = Math.round(acquisitionTax * 0.1);
  const ruralTax = over85sqm ? Math.round(acquisitionTax * 0.1) : 0;
  const total = acquisitionTax + eduTax + ruralTax;

  return { rate: (rate * 100).toFixed(2), acquisitionTax, eduTax, ruralTax, total };
}

export default function ClientPage() {
  const [price, setPrice] = useState(500_000_000);
  const [homes, setHomes] = useState(1);
  const [acquireType, setAcquireType] = useState("매매");
  const [over85sqm, setOver85sqm] = useState(false);

  const r = useMemo(() => calcAcquisitionTax(price, homes, acquireType, over85sqm), [price, homes, acquireType, over85sqm]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">취득세 계산기</h1>
      <p className="text-gray-600 mb-6">주택 취득가액과 주택 수, 취득 유형을 입력하면 취득세 및 부가세를 자동 계산합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">취득가액 (원)</label>
          <input type="number" min={0} step={10000000} value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border p-2 rounded" />
          <p className="text-xs text-gray-400 mt-1">{fmt(price)}원 ({(price / 100_000_000).toFixed(2)}억)</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">취득 유형</label>
          <div className="flex gap-2 flex-wrap">
            {["매매", "증여", "상속"].map((t) => (
              <button key={t} onClick={() => setAcquireType(t)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${acquireType === t ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {acquireType === "매매" && (
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-2">현재 주택 수 (취득 후 기준)</label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3].map((n) => (
                <button key={n} onClick={() => setHomes(n)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${homes === n ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                  {n === 3 ? "3주택 이상" : `${n}주택`}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="over85" checked={over85sqm} onChange={(e) => setOver85sqm(e.target.checked)} className="w-4 h-4" />
          <label htmlFor="over85" className="text-sm text-gray-600">전용면적 85㎡ 초과 (농어촌특별세 부과)</label>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-4 text-blue-800">계산 결과</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">적용 세율</p>
            <p className="text-xl font-bold text-blue-600">{r.rate}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">취득세</p>
            <p className="text-xl font-bold text-gray-800">{fmt(r.acquisitionTax)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">지방교육세 (10%)</p>
            <p className="text-xl font-bold text-gray-700">{fmt(r.eduTax)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">농어촌특별세 {over85sqm ? "(10%)" : "(해당없음)"}</p>
            <p className="text-xl font-bold text-gray-700">{fmt(r.ruralTax)}원</p>
          </div>
        </div>
        <div className="border-t border-blue-200 pt-4 mt-4">
          <p className="text-xs text-gray-500 mb-0.5">총 납부 세액</p>
          <p className="text-3xl font-bold text-red-600">{fmt(r.total)}원</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">취득세란?</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          취득세는 부동산이나 차량 등을 취득할 때 납부하는 지방세입니다. 주택 취득 시에는 취득가액, 주택 수, 취득 원인(매매·증여·상속)에 따라 세율이 다르게 적용됩니다.
          1주택자 매매의 경우 6억 원 이하는 1%, 6억~9억 원 구간은 취득가액에 비례하여 1~3%로 증가하며, 9억 원 초과 시 3%가 적용됩니다.
          2주택자는 8%, 3주택 이상은 12%의 중과세율이 적용됩니다. 취득세 외에 지방교육세(취득세의 10%)와 전용면적 85㎡ 초과 주택의 경우 농어촌특별세(취득세의 10%)가 추가됩니다.
          취득일로부터 60일 이내에 신고·납부해야 하며, 이를 초과하면 가산세가 부과됩니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">취득세율 요약</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-500">구분</th>
                <th className="text-right py-2 text-gray-500">세율</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1주택 (6억 이하)", "1%"],
                ["1주택 (6억~9억)", "1~3% 비례"],
                ["1주택 (9억 초과)", "3%"],
                ["2주택 (조정대상지역)", "8%"],
                ["3주택 이상", "12%"],
                ["증여", "3.5%"],
                ["상속", "2.8%"],
              ].map(([cat, rate]) => (
                <tr key={cat} className="border-b last:border-0">
                  <td className="py-2 text-gray-700">{cat}</td>
                  <td className="py-2 text-right font-bold text-blue-600">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          위 세율은 일반적인 기준이며, 취득세 감면 특례(생애최초 주택 구입, 신혼부부 등)가 적용될 수 있습니다. 정확한 세액은 관할 지자체 세무서에 문의하시기 바랍니다.
          취득세 외 지방교육세 10%, 85㎡ 초과 시 농어촌특별세 10%가 추가됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "취득세 신고 기한은 언제인가요?", a: "취득세는 취득일로부터 60일 이내에 신고·납부해야 합니다. 기한을 넘기면 신고불성실가산세(20%)와 납부지연가산세가 부과됩니다." },
          { q: "생애최초 주택 구입 시 취득세 혜택이 있나요?", a: "생애최초로 주택을 구입하는 경우 일정 요건(소득 기준 등) 충족 시 취득세를 최대 200만 원까지 감면받을 수 있습니다." },
          { q: "증여세와 취득세를 동시에 납부해야 하나요?", a: "증여로 부동산을 취득하면 증여세는 국세청에, 취득세는 지방자치단체에 각각 납부해야 합니다. 두 세금은 별개입니다." },
          { q: "6억~9억 원 구간의 취득세율은 어떻게 계산하나요?", a: "6억~9억 원 구간의 세율은 (취득가액 × 2/3억 - 3) × 1/100으로 계산됩니다. 예를 들어 7억 5천만 원이면 세율은 약 2%입니다." },
          { q: "신혼부부 취득세 감면 혜택은?", a: "혼인 후 5년 이내 공동명의로 주택을 취득하는 신혼부부는 취득가액 5억 원 이하 주택에 대해 취득세 50%(최대 500만 원)를 감면받을 수 있습니다." },
          { q: "취득가액이 없는 경우(경매 등) 세율은 어떻게 되나요?", a: "경매나 공매로 취득하는 경우에는 낙찰가격이 취득가액이 됩니다. 법원 경매 낙찰가 또는 공매 낙찰가를 기준으로 취득세를 계산합니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/acquisition-tax-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
