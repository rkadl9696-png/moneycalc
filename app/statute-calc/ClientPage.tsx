"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

interface DebtType {
  label: string;
  years: number;
  note: string;
}

const DEBT_TYPES: DebtType[] = [
  { label: "일반 민사채권", years: 10, note: "민법 제162조 - 계약에 따른 일반 채권" },
  { label: "판결로 확정된 채권", years: 10, note: "민사집행법 - 판결, 조정, 화해 등" },
  { label: "상사채권", years: 5, note: "상법 제64조 - 상행위로 인한 채권" },
  { label: "임금채권", years: 3, note: "근로기준법 제49조 - 임금, 퇴직금, 재해보상" },
  { label: "불법행위 손해배상 (단기)", years: 3, note: "민법 제766조 1항 - 손해 및 가해자를 안 날로부터" },
  { label: "불법행위 손해배상 (장기)", years: 10, note: "민법 제766조 2항 - 불법행위일로부터" },
  { label: "의료과실 손해배상 (단기)", years: 3, note: "손해 및 가해자를 안 날로부터" },
  { label: "의료과실 손해배상 (장기)", years: 10, note: "불법행위가 발생한 날로부터" },
  { label: "정기급부채권", years: 3, note: "민법 제163조 - 이자, 부양료, 급료 등" },
  { label: "소비대차(원금)", years: 10, note: "민법 제162조 - 금전 대여" },
];

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function toInputDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default function ClientPage() {
  const today = new Date();
  const [debtTypeIdx, setDebtTypeIdx] = useState(0);
  const [startDate, setStartDate] = useState(toInputDate(new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const debtType = DEBT_TYPES[debtTypeIdx];
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return null;

    const expiry = addYears(start, debtType.years);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const daysLeft = daysBetween(now, expiry);
    const isExpired = daysLeft < 0;
    const daysExpiredAgo = isExpired ? Math.abs(daysLeft) : 0;

    return { debtType, start, expiry, daysLeft, isExpired, daysExpiredAgo };
  }, [debtTypeIdx, startDate]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">소멸시효 계산기</h1>
      <p className="text-gray-600 mb-6">
        채권 종류와 기산일을 입력하면 소멸시효 만료일과 남은 기간을 계산합니다.
      </p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">채권 정보 입력</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">채권 종류</label>
            <select
              value={debtTypeIdx}
              onChange={(e) => setDebtTypeIdx(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              {DEBT_TYPES.map((dt, idx) => (
                <option key={idx} value={idx}>
                  {dt.label} ({dt.years}년)
                </option>
              ))}
            </select>
            {DEBT_TYPES[debtTypeIdx] && (
              <p className="text-xs text-gray-400 mt-1">{DEBT_TYPES[debtTypeIdx].note}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">기산일 (소멸시효 시작일)</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      {result && (
        <section className={`border-2 rounded-xl p-5 mb-5 ${result.isExpired ? "bg-red-50 border-red-400" : "bg-blue-50 border-blue-400"}`}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">소멸시효 기간</p>
              <p className="text-2xl font-bold text-gray-800">{result.debtType.years}년</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">만료일</p>
              <p className="text-base font-bold text-gray-800">{formatDate(result.expiry)}</p>
            </div>
          </div>

          <div className={`rounded-lg p-4 text-center ${result.isExpired ? "bg-red-100" : "bg-blue-100"}`}>
            {result.isExpired ? (
              <>
                <p className="text-2xl font-bold text-red-600 mb-1">소멸시효 만료</p>
                <p className="text-sm text-red-500">{result.daysExpiredAgo}일 전에 만료되었습니다</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-blue-600 mb-1">D-{result.daysLeft}</p>
                <p className="text-sm text-blue-500">만료까지 {result.daysLeft}일 남았습니다</p>
              </>
            )}
          </div>

          <div className="mt-3 text-sm text-gray-600">
            <p>기산일: {formatDate(result.start)}</p>
            <p>만료일: {formatDate(result.expiry)}</p>
          </div>
        </section>
      )}

      {/* 소멸시효 중단 사유 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">소멸시효 중단·정지 사유</h2>
        <div className="flex flex-col gap-3">
          {[
            { title: "소장 접수 (소 제기)", desc: "법원에 소송을 제기하면 소멸시효가 중단됩니다. 판결 확정 후 새로운 10년 시효가 시작됩니다." },
            { title: "채무 승인", desc: "채무자가 채무의 존재를 인정하는 행위(일부 변제, 이자 지급, 서면 승인 등)를 하면 시효가 중단됩니다." },
            { title: "압류·가압류·가처분", desc: "채권자가 법원에 압류나 가압류 신청을 하면 시효가 중단됩니다." },
            { title: "독촉 (내용증명)", desc: "내용증명 발송만으로는 일시적으로 중단되지 않고 최고(催告) 효력만 있으며, 6개월 내 재판상 청구 등이 필요합니다." },
          ].map((item) => (
            <div key={item.title} className="border-l-4 border-blue-400 pl-3">
              <p className="font-bold text-sm">{item.title}</p>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 핵심 개념 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">소멸시효란?</h2>
        <p className="mb-3">
          소멸시효란 권리를 행사할 수 있음에도 일정 기간 동안 행사하지 않으면 그 권리가 소멸하는 제도입니다.
          채권자가 오랫동안 권리를 방치한 경우 법적 안정성과 채무자 보호를 위해 설정된 제도입니다.
          소멸시효 기간은 채권의 종류에 따라 3년, 5년, 10년 등으로 다릅니다.
        </p>
        <p className="mb-3">
          소멸시효가 완성되어도 자동으로 채권이 소멸하지는 않으며, 채무자가 시효 완성을 주장(항변)해야
          효력이 발생합니다. 시효가 완성되기 전에 소송 제기, 압류, 채무 승인 등으로
          시효를 중단시킬 수 있습니다.
        </p>
        <p>
          중요한 채권이 있다면 소멸시효 만료 전에 반드시 법적 조치를 취하거나 변호사에게
          상담받으시기 바랍니다. 시효 만료 후에는 법적 구제가 크게 제한됩니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 소멸시효가 지나면 절대 받을 수 없나요?</p>
          <p>소멸시효가 완성되어도 채무자가 시효 완성을 주장하지 않으면 채권은 유효합니다. 또한 채무자가 시효 완성을 알면서도 변제하면 부당이득 반환 청구도 불가능합니다. 하지만 소송으로는 강제 집행이 어렵습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 내용증명을 보내면 시효가 중단되나요?</p>
          <p>내용증명은 최고(催告) 효력이 있어 6개월간 시효 진행이 유예됩니다. 하지만 내용증명 발송만으로는 완전한 시효 중단이 아니며, 6개월 내에 소송 제기 등 재판상 청구를 해야 시효가 중단됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 임금채권 소멸시효는 언제부터 시작되나요?</p>
          <p>임금채권의 소멸시효는 임금 지급 예정일(지급일)부터 시작됩니다. 퇴직금은 퇴직 후 14일 이내 지급 의무가 있으므로, 퇴직 후 14일이 지난 날부터 3년이 시효입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 판결을 받았는데 또 시효를 신경 써야 하나요?</p>
          <p>판결로 확정된 채권도 10년의 소멸시효가 적용됩니다. 판결 확정 후 10년 내에 강제집행을 하지 않으면 시효가 완성될 수 있습니다. 강제집행이나 채무 승인을 통해 시효를 중단시키세요.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 상사채권이란 무엇인가요?</p>
          <p>상사채권은 상행위로 인해 발생한 채권으로, 상법 적용을 받습니다. 사업자 간 거래에서 발생한 물품 대금, 서비스 대금 등이 해당됩니다. 소멸시효가 5년으로 일반 민사채권(10년)보다 짧습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 미성년자에 대한 채권도 소멸시효가 동일한가요?</p>
          <p>미성년자에 대한 채권은 법정대리인이 없는 경우 시효 정지 사유가 있을 수 있습니다. 성년이 된 후 6개월간 시효가 정지됩니다. 구체적인 상황은 변호사에게 문의하세요.</p>
        </div>
      </section>

      <RelatedCalculators current="/statute-calc" />

      <div className="mt-10 text-center">
        <Link
          scroll={false}
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700"
        >
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
