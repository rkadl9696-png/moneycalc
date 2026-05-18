"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const MAX_LEGAL_RATE = 20;

export default function ClientPage() {
  const [principal, setPrincipal] = useState(1000000);
  const [overdueRate, setOverdueRate] = useState(15);
  const [overdueDays, setOverdueDays] = useState(30);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const appliedRate = Math.min(overdueRate, MAX_LEGAL_RATE);
    const isCapApplied = overdueRate > MAX_LEGAL_RATE;
    const interest = Math.floor(principal * appliedRate / 100 / 365 * overdueDays);
    const total = principal + interest;

    const tableRows = [];
    for (let d = 10; d <= Math.max(overdueDays, 10); d += 10) {
      const rowInterest = Math.floor(principal * appliedRate / 100 / 365 * d);
      tableRows.push({ days: d, interest: rowInterest, total: principal + rowInterest });
      if (d >= overdueDays && overdueDays % 10 !== 0) break;
    }
    if (overdueDays % 10 !== 0 || tableRows.length === 0) {
      const rowInterest = Math.floor(principal * appliedRate / 100 / 365 * overdueDays);
      const exists = tableRows.find(r => r.days === overdueDays);
      if (!exists) tableRows.push({ days: overdueDays, interest: rowInterest, total: principal + rowInterest });
      tableRows.sort((a, b) => a.days - b.days);
    }

    return { interest, total, appliedRate, isCapApplied };
  }, [principal, overdueRate, overdueDays]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  const tableRows = useMemo(() => {
    const appliedRate = Math.min(overdueRate, MAX_LEGAL_RATE);
    const rows = [];
    const intervals = [10, 30, 60, 90, 180, overdueDays].filter((v, i, arr) => arr.indexOf(v) === i).sort((a, b) => a - b);
    for (const d of intervals) {
      if (d > 0) {
        rows.push({ days: d, interest: Math.floor(principal * appliedRate / 100 / 365 * d) });
      }
    }
    return rows;
  }, [principal, overdueRate, overdueDays]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">연체이자 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        원금과 연체이자율, 연체일수를 입력하면 연체이자를 자동으로 계산합니다.
        법정 최고금리(연 20%) 초과 시 자동으로 20% 상한이 적용되며, 연체일수별 이자 누적 테이블로 시간이 지날수록 늘어나는 연체 부담을 한눈에 확인할 수 있습니다.
        대출·카드·임대 연체 시 참고 자료로 활용하세요.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">원금 (원)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연체이자율 (연 %)</label>
            <input
              type="number"
              value={overdueRate}
              onChange={(e) => setOverdueRate(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
              step={0.1}
            />
            {overdueRate > MAX_LEGAL_RATE && (
              <p className="text-xs text-red-600 mt-1">법정 최고금리(20%)를 초과합니다. 계산은 20% 기준으로 적용됩니다.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연체일수 (일)</label>
            <input
              type="number"
              value={overdueDays}
              onChange={(e) => setOverdueDays(Number(e.target.value))}
              className="w-full border rounded-lg p-2 text-sm"
              min={1}
            />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
        {result.isCapApplied && (
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs text-yellow-800">
            ⚠️ 법정 최고금리(20%) 적용: 입력 금리({overdueRate}%)→20%로 계산
          </div>
        )}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">적용 연체이자율</span>
            <span className="font-bold">{result.appliedRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">연체이자</span>
            <span className="font-bold text-red-600">{fmt(result.interest)}원</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="font-bold text-gray-800">총 상환액 (원금+이자)</span>
            <span className="font-bold text-blue-700">{fmt(result.total)}원</span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-bold mb-2">연체일수별 누적 이자</h3>
          <table className="text-xs w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-1 text-left">연체일수</th>
                <th className="p-1 text-right">이자</th>
                <th className="p-1 text-right">총 상환액</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.days} className={`border-t ${row.days === overdueDays ? "bg-yellow-50 font-bold" : ""}`}>
                  <td className="p-1">{row.days}일</td>
                  <td className="p-1 text-right text-red-600">{fmt(row.interest)}원</td>
                  <td className="p-1 text-right">{fmt(principal + row.interest)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">연체이자 계산 공식</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          연체이자는 원금 × 연체이자율 ÷ 365 × 연체일수 공식으로 계산합니다. 365일 기준(일력)을 사용하는 것이 일반적이며, 일부 금융기관은 360일 기준을 사용하기도 합니다.
          법정 최고금리는 이자제한법에 따라 연 20%로 제한되며, 이를 초과하는 이자 약정은 무효입니다. 카드대금, 개인대출, 임대보증금 반환 지연 등 다양한 상황에서 연체이자가 발생할 수 있으며, 빠른 상환이 최선입니다.
          연체는 신용점수 하락에도 영향을 미치므로 연체가 예상되면 미리 금융기관에 연락하여 상환 조정을 요청하는 것이 좋습니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">연체 예방과 대처 방법</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          연체를 예방하려면 대출 만기일, 카드 결제일, 임대료 납부일 등을 캘린더에 미리 등록하고 자동이체를 설정하는 것이 효과적입니다.
          갑작스러운 자금 부족으로 연체가 예상될 때는 금융기관에 즉시 연락하여 만기 연장, 분할 상환, 상환 유예 등을 요청하세요. 사전 협의 없이 연체가 발생하면 신용점수 하락과 함께 연체이자가 빠르게 불어납니다.
          카드 연체의 경우 신용카드 이용 정지와 함께 연체 사실이 신용조회기관에 등록될 수 있어 향후 금융거래에 불이익이 생길 수 있습니다.
          소액 연체라도 신용점수에 영향을 미치므로 소액 연체를 가볍게 여기지 마세요.
          이미 연체가 발생했다면 가능한 빨리 상환하여 신용 회복에 집중하고, 연체이자 계산기로 총 상환액을 파악한 후 상환 계획을 수립하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "법정 최고금리 20%를 초과하는 이자를 요구받으면 어떻게 하나요?", a: "이자제한법에 따라 연 20%를 초과하는 이자 약정은 무효입니다. 초과 이자를 요구받으면 지급을 거부하고 금융감독원(1332) 또는 한국소비자원에 신고할 수 있습니다." },
          { q: "연체이자는 언제부터 발생하나요?", a: "일반적으로 대출 원리금이나 카드대금의 납부기한 다음날부터 연체이자가 발생합니다. 계약서나 약관에 기재된 연체이자율과 기산일을 확인하세요." },
          { q: "연체이자와 지연이자는 같은 말인가요?", a: "실질적으로 같은 개념입니다. 연체이자는 금융 대출·카드 분야에서 주로 사용되며, 지연이자는 임대보증금 반환 지연 등 민사 채무 관계에서 많이 쓰입니다. 법정 지연이자율은 민법상 연 5%, 상사채권은 연 6%가 기준입니다." },
          { q: "연체가 신용점수에 어떤 영향을 미치나요?", a: "10만 원 이상의 카드 결제 연체가 5영업일 이상 지속되면 신용평가사에 연체 정보가 등록됩니다. 연체 금액과 기간에 따라 신용점수가 크게 하락할 수 있으며, 연체 해소 후에도 일정 기간 기록이 남습니다." },
          { q: "임대료 연체 시 연체이자는 어떻게 적용되나요?", a: "임대차 계약서에 별도의 연체이자 조항이 있으면 그에 따르며, 없을 경우 민법상 법정이자율(연 5%)이 적용됩니다. 다만 상가 임대의 경우 별도 약정에 따라 달라집니다." },
          { q: "원금만 갚으면 연체이자는 사라지나요?", a: "원금을 상환해도 발생한 연체이자는 별도로 납부해야 합니다. 금융기관에 따라 연체이자를 원금에 합산하여 새로운 채무로 관리하기도 하므로, 상환 시 연체이자 포함 총액을 확인하세요." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/overdue-calc" />

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
