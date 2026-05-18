"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const currentYear = new Date().getFullYear();

function calcCarTax(cc: number, carType: string, year: number) {
  let baseTax = 0;

  if (carType === "승용") {
    if (cc <= 1000) baseTax = cc * 80;
    else if (cc <= 1600) baseTax = cc * 140;
    else baseTax = cc * 200;
  } else if (carType === "승합") {
    baseTax = cc <= 1000 ? 6_600 : cc <= 1600 ? 9_100 : 18_000;
  } else {
    baseTax = cc <= 1000 ? 6_600 : cc <= 1600 ? 9_100 : 13_500;
  }

  const age = currentYear - year;
  let discountRate = 0;
  if (age === 3) discountRate = 0.05;
  else if (age === 4) discountRate = 0.10;
  else if (age === 5) discountRate = 0.15;
  else if (age === 6) discountRate = 0.20;
  else if (age === 7) discountRate = 0.25;
  else if (age === 8) discountRate = 0.30;
  else if (age >= 9) discountRate = 0.50;

  const yearlyTax = Math.round(baseTax * (1 - discountRate));
  const eduTax = Math.round(yearlyTax * 0.3);
  const total = yearlyTax + eduTax;

  return { baseTax, discountRate, yearlyTax, eduTax, total };
}

export default function ClientPage() {
  const [cc, setCc] = useState(1998);
  const [carType, setCarType] = useState("승용");
  const [year, setYear] = useState(currentYear - 2);

  const r = useMemo(() => calcCarTax(cc, carType, year), [cc, carType, year]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();
  const age = currentYear - year;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">자동차세 계산기</h1>
      <p className="text-gray-600 mb-6">배기량, 차종, 연식을 입력하면 자동차세와 지방교육세를 자동으로 계산합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">차종</label>
          <div className="flex gap-2">
            {["승용", "승합", "화물"].map((t) => (
              <button key={t} onClick={() => setCarType(t)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${carType === t ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">배기량 (cc)</label>
          <input type="number" min={100} max={10000} value={cc}
            onChange={(e) => setCc(Number(e.target.value))}
            className="w-full border p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">차량 연식 (년도)</label>
          <input type="number" min={1990} max={currentYear} value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full border p-2 rounded" />
          <p className="text-xs text-gray-400 mt-1">차령 {age}년 → 감면율 {(r.discountRate * 100).toFixed(0)}%</p>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-4 text-blue-800">계산 결과</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">기본 자동차세</p>
            <p className="text-xl font-bold text-gray-800">{fmt(r.baseTax)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">연식 감면 후</p>
            <p className="text-xl font-bold text-blue-600">{fmt(r.yearlyTax)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">지방교육세 (30%)</p>
            <p className="text-xl font-bold text-gray-700">{fmt(r.eduTax)}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">연간 합계</p>
            <p className="text-2xl font-bold text-red-600">{fmt(r.total)}원</p>
          </div>
        </div>
        <div className="border-t border-blue-200 pt-4 mt-4 grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500">6월 납부 (50%)</p>
            <p className="font-bold text-gray-700">{fmt(Math.round(r.total / 2))}원</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">12월 납부 (50%)</p>
            <p className="font-bold text-gray-700">{fmt(Math.round(r.total / 2))}원</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자동차세란?</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          자동차세는 자동차 보유자에게 부과되는 지방세로, 매년 6월과 12월에 각각 50%씩 납부합니다.
          승용차의 경우 배기량(cc)에 따라 세율이 달라지며, 1,000cc 이하는 cc당 80원, 1,600cc 이하는 140원, 1,600cc 초과는 200원이 적용됩니다.
          차령(차량 연식)에 따라 3년차부터 감면 혜택이 주어지며, 9년 이상 된 차량은 50%까지 감면됩니다.
          자동차세에는 지방교육세(자동차세의 30%)가 함께 부과됩니다.
          연납 신청 시 1월에 연간 세액의 9.15%, 3월에 7.5%를 할인받아 납부할 수 있습니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">연식별 감면율</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-500">차령</th>
                <th className="text-right py-2 text-gray-500">감면율</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1~2년", "0%"],
                ["3년", "5%"],
                ["4년", "10%"],
                ["5년", "15%"],
                ["6년", "20%"],
                ["7년", "25%"],
                ["8년", "30%"],
                ["9년 이상", "50%"],
              ].map(([age, rate]) => (
                <tr key={age} className="border-b last:border-0">
                  <td className="py-2 text-gray-700">{age}</td>
                  <td className="py-2 text-right font-bold text-blue-600">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          승용차 배기량별 기본 세율: 1,000cc 이하 80원/cc, 1,601cc 이상 200원/cc.
          전기차·수소차는 배기량 기준이 아닌 별도의 정액 기준이 적용됩니다.
          연납 신청(1월·3월·6월)으로 세금 할인 혜택을 받을 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "자동차세 납부 기간은 언제인가요?", a: "자동차세는 6월 16일~30일(1기분)과 12월 16일~31일(2기분)에 납부합니다. 연납 신청 시 1월(9.15% 할인), 3월(7.5% 할인), 6월(5% 할인) 중 선택 가능합니다." },
          { q: "전기차는 자동차세가 얼마인가요?", a: "전기차는 배기량이 없으므로 cc당 세율 대신 정액으로 부과됩니다. 2024년 기준 전기승용차는 연간 13만 원(지방교육세 포함 약 16.9만 원)이 부과됩니다." },
          { q: "자동차 연납 신청은 어떻게 하나요?", a: "자동차세 연납 신청은 위택스(wetax.go.kr), 이택스(etax.seoul.go.kr) 또는 지자체 세무부서에서 신청할 수 있습니다. 1월에 신청 시 가장 높은 할인율(9.15%)이 적용됩니다." },
          { q: "중고차를 구입하면 자동차세는 언제부터 납부하나요?", a: "자동차세는 소유권 이전일을 기준으로 일할 계산됩니다. 매매 후 이전등록을 완료하면 그날부터 새 소유자가 해당 기간의 자동차세를 납부합니다." },
          { q: "장기 수출이나 말소 시 이미 낸 자동차세를 환급받을 수 있나요?", a: "말소등록이나 이전등록 시 이미 납부한 자동차세를 일할 환급받을 수 있습니다. 관할 지자체 세무부서에 환급 신청하면 됩니다." },
          { q: "배기량이 같아도 차종에 따라 세금이 다른가요?", a: "네, 승용·승합·화물 차종에 따라 과세 기준이 다릅니다. 승합차와 화물차는 승용차보다 낮은 세율이 적용되며, 정액으로 부과됩니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/car-tax-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
