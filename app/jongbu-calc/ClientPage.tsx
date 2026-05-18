"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

function calcJongbu(publicPrice: number, singleHome: boolean) {
  const deduction = singleHome ? 1_200_000_000 : 900_000_000;
  const marketRatio = 0.6;
  const taxBase = Math.max(0, publicPrice * marketRatio - deduction);
  if (taxBase <= 0) return { taxBase: 0, tax: 0, ruralTax: 0, total: 0 };

  const brackets = [
    { limit: 300_000_000, rate: 0.005 },
    { limit: 600_000_000, rate: 0.007 },
    { limit: 1_200_000_000, rate: 0.010 },
    { limit: 5_000_000_000, rate: 0.014 },
    { limit: 9_400_000_000, rate: 0.020 },
    { limit: Infinity, rate: 0.027 },
  ];

  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (taxBase <= prev) break;
    const slice = Math.min(taxBase - prev, b.limit - prev);
    tax += slice * b.rate;
    prev = b.limit;
    if (taxBase <= b.limit) break;
  }

  const ruralTax = tax * 0.2;
  return { taxBase, tax: Math.round(tax), ruralTax: Math.round(ruralTax), total: Math.round(tax + ruralTax) };
}

export default function ClientPage() {
  const [publicPrice, setPublicPrice] = useState(1_000_000_000);
  const [singleHome, setSingleHome] = useState(true);

  const r = useMemo(() => calcJongbu(publicPrice, singleHome), [publicPrice, singleHome]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">종합부동산세 계산기</h1>
      <p className="text-gray-600 mb-6">공시가격과 주택 수를 입력하면 종합부동산세와 농어촌특별세를 자동으로 계산합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">공시가격 (원)</label>
          <input
            type="number" min={0} step={10000000} value={publicPrice}
            onChange={(e) => setPublicPrice(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">{fmt(publicPrice)}원 ({(publicPrice / 100_000_000).toFixed(2)}억)</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">1주택자 여부</label>
          <div className="flex gap-3">
            {[true, false].map((v) => (
              <button key={String(v)} onClick={() => setSingleHome(v)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${singleHome === v ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {v ? "1주택자" : "2주택 이상"}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">기본공제: 1주택 12억, 2주택 이상 9억</p>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-4 text-blue-800">계산 결과</h2>
        {r.taxBase <= 0 ? (
          <p className="text-green-600 font-bold text-lg">종합부동산세 과세 대상이 아닙니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">과세표준</p>
              <p className="text-xl font-bold text-gray-800">{fmt(r.taxBase)}원</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">종합부동산세</p>
              <p className="text-xl font-bold text-blue-600">{fmt(r.tax)}원</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">농어촌특별세 (20%)</p>
              <p className="text-xl font-bold text-gray-700">{fmt(r.ruralTax)}원</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">총 납부세액</p>
              <p className="text-2xl font-bold text-red-600">{fmt(r.total)}원</p>
            </div>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">종합부동산세란?</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          종합부동산세(종부세)는 일정 기준금액을 초과하는 부동산을 보유한 개인 및 법인에게 부과되는 국세입니다.
          매년 6월 1일 기준으로 보유한 주택의 공시가격 합산액이 기준금액(1주택자 12억 원, 다주택자 9억 원)을 초과하면
          초과분에 대해 과세됩니다. 과세표준은 공시가격에서 기본공제를 뺀 금액에 공정시장가액비율(60%)을 곱해 산출하며,
          세율은 0.5%~2.7%의 누진세율이 적용됩니다. 매년 12월에 신고·납부하며, 분납도 가능합니다.
          농어촌특별세는 종부세액의 20%가 추가 부과됩니다. 1주택자 중 고령자·장기보유자는 추가 공제 혜택이 있으니
          세무사와 상담하는 것을 권장합니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">종합부동산세 세율표</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-500">과세표준</th>
                <th className="text-right py-2 text-gray-500">세율</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["3억 원 이하", "0.5%"],
                ["3억 초과 ~ 6억 이하", "0.7%"],
                ["6억 초과 ~ 12억 이하", "1.0%"],
                ["12억 초과 ~ 50억 이하", "1.4%"],
                ["50억 초과 ~ 94억 이하", "2.0%"],
                ["94억 초과", "2.7%"],
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
          종합부동산세는 조정대상지역 내 2주택자, 3주택 이상 보유자에 대해 중과세율이 적용될 수 있습니다.
          위 세율은 일반세율 기준이며, 정확한 세액은 국세청 홈택스를 통해 확인하시기 바랍니다.
          과세표준 = (공시가격 합산 - 기본공제) × 공정시장가액비율(60%)로 계산됩니다.
          2023년 이후 기본공제 금액이 조정되었으며, 1세대 1주택자는 12억 원, 일반은 9억 원이 적용됩니다.
          고령자(60세 이상) 및 장기보유(5년 이상) 세액공제도 활용하면 실제 납부세액을 줄일 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "종합부동산세 납부 시기는 언제인가요?", a: "종합부동산세는 매년 12월 1일부터 12월 15일 사이에 신고·납부합니다. 세액이 500만 원을 초과하면 분납도 가능합니다." },
          { q: "공시가격은 어디서 확인하나요?", a: "공시가격은 국토교통부 부동산 공시가격 알리미(www.realtyprice.kr) 또는 위택스(www.wetax.go.kr)에서 확인할 수 있습니다." },
          { q: "종부세 대상 여부를 어떻게 판단하나요?", a: "매년 6월 1일 기준으로 보유 주택의 공시가격 합산액이 1주택자는 12억 원, 그 외는 9억 원을 초과하면 종부세 과세 대상입니다." },
          { q: "농어촌특별세는 별도로 신고해야 하나요?", a: "농어촌특별세는 종합부동산세 신고 시 함께 신고하며, 종부세액의 20%가 자동으로 계산됩니다. 별도 신고는 필요하지 않습니다." },
          { q: "1세대 1주택자 특별공제 조건은 무엇인가요?", a: "만 60세 이상 고령자 또는 5년 이상 장기보유자는 세액공제를 받을 수 있습니다. 고령자는 최대 30%, 장기보유는 최대 50%, 합산 최대 80%까지 공제됩니다." },
          { q: "공동명의 주택의 경우 어떻게 계산하나요?", a: "공동명의의 경우 각각의 지분에 해당하는 공시가격을 기준으로 개인별로 계산합니다. 부부 공동명의는 특례 신청을 통해 1주택자 혜택을 받을 수도 있습니다." },
          { q: "전세나 월세를 주고 있는 주택도 종부세가 부과되나요?", a: "임대를 주고 있는 주택도 소유자 기준으로 종부세가 부과됩니다. 단, 임대사업자 등록을 한 경우 일정 요건 충족 시 합산배제 혜택을 받을 수 있습니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/jongbu-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
