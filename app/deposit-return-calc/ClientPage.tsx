"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const TODAY = new Date();
const TODAY_STR = TODAY.toISOString().split("T")[0];

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default function ClientPage() {
  const [deposit, setDeposit] = useState(100_000_000);
  const [expiryDate, setExpiryDate] = useState(formatDate(new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, TODAY.getDate())));
  const [delayRate] = useState(12); // 연 12%, 고정

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const expiry = new Date(expiryDate);
    const today = new Date(TODAY_STR);
    const diffMs = today.getTime() - expiry.getTime();
    const delayDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const dailyRate = delayRate / 365 / 100;
    const delayInterest = Math.round(deposit * dailyRate * delayDays);
    const totalClaim = deposit + delayInterest;
    return { delayDays, delayInterest, totalClaim, isOverdue: diffMs > 0 };
  }, [deposit, expiryDate, delayRate]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">전세 보증금 반환 계산기</h1>
      <p className="text-gray-600 mb-6">
        계약 만료 후 보증금 지연 반환 시 청구 가능한 지연이자와 총액을 계산합니다.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">계약 정보 입력</h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">전세 보증금 (원)</label>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            onBlur={(e) => setDeposit(Math.max(0, Number(e.target.value) || 0))}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">{deposit.toLocaleString()}원</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">계약 만료일</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-400 mt-1">오늘 기준: {TODAY_STR}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <p className="text-gray-600">지연이자율: <span className="font-bold">연 {delayRate}%</span> (주택임대차보호법 기준)</p>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <h2 className="text-base font-bold mb-4 text-blue-800">청구 금액 계산 결과</h2>
        {!result.isOverdue ? (
          <div className="text-center py-4">
            <p className="text-lg font-bold text-green-600">아직 계약 만료 전이거나 당일입니다</p>
            <p className="text-gray-500 text-sm mt-1">만료일 다음 날부터 지연이자가 발생합니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">지연 일수</span>
              <span className="font-bold text-red-600">{result.delayDays.toLocaleString()}일</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">전세 보증금 원금</span>
              <span className="font-bold">{deposit.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">지연이자 (연 {delayRate}% × {result.delayDays}일)</span>
              <span className="font-bold text-orange-600">+ {result.delayInterest.toLocaleString()}원</span>
            </div>
            <div className="border-t border-blue-300 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-blue-800">총 반환 청구액</span>
              <span className="text-2xl font-bold text-blue-700">{result.totalClaim.toLocaleString()}원</span>
            </div>
          </div>
        )}
      </section>

      <section className="border border-yellow-300 bg-yellow-50 rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-3 text-yellow-800">임차인 권리 안내</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><span className="font-bold text-yellow-700">임차권등기명령:</span> 보증금을 돌려받지 못한 채 이사가야 할 경우, 법원에 신청하면 대항력·우선변제권 유지</li>
          <li><span className="font-bold text-yellow-700">보증금반환청구소송:</span> 내용증명 → 지급명령 → 민사소송 순서로 진행 가능</li>
          <li><span className="font-bold text-yellow-700">전세보증보험:</span> HUG, HF, SGI서울보증 등 전세보증금 반환보증 가입 시 보험사가 대위 청구</li>
          <li><span className="font-bold text-yellow-700">주거복지센터:</span> 무료 법률상담 (☎ 1600-0777)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">전세 보증금 반환 절차</h2>
        <p className="mb-3">
          계약 만료일 다음 날부터 집주인이 보증금을 돌려주지 않으면 지연이자가 발생합니다. 주택임대차보호법 시행령에 따라 지연이자율은 연 12%(일 약 0.0329%)입니다. 임차인은 이 금액을 집주인에게 청구할 권리가 있습니다.
        </p>
        <p className="mb-3">
          먼저 내용증명(우체국)을 통해 반환을 요구하고, 응하지 않을 경우 법원에 지급명령 신청 또는 민사소송을 제기할 수 있습니다. 소송 전 임차권등기명령을 신청하면 이사 후에도 대항력을 유지할 수 있습니다.
        </p>
        <p>
          전세보증보험(HUG, HF, SGI 등)에 가입한 경우, 보증기관이 집주인 대신 보증금을 먼저 지급하고 집주인에게 구상권을 행사합니다. 신규 계약 시 전세보증보험 가입을 적극 권장합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">전세 사기 예방 체크리스트</h2>
        <p className="mb-3">
          계약 전 등기부등본에서 근저당, 압류, 가압류 여부를 반드시 확인하세요. 전세가율(전세가/매매가)이 80%를 초과하면 위험신호입니다. 집주인의 국세·지방세 체납 여부도 확인할 수 있습니다.
        </p>
        <p>
          전입신고와 확정일자를 계약 당일 또는 이사 당일에 받아 우선변제권을 확보하는 것이 중요합니다. 임대인 동의 없이 전입신고가 가능하므로 반드시 신고하세요. 전세보증보험 가입 가능 여부도 사전에 확인하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 지연이자율 연 12%는 법적으로 정해진 것인가요?</p>
          <p>네, 주택임대차보호법 시행령 제11조에 따라 보증금 반환 지연 시 연 12%의 이자를 청구할 수 있습니다. 당사자 간 합의로 더 높은 이율을 정할 수 있지만, 낮게 정한 약정은 무효입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 계약 만료 전에 이사를 나가도 되나요?</p>
          <p>임차인은 계약 종료 전이라도 집주인과 협의 하에 이사할 수 있지만, 이 경우 지연이자 청구는 어렵습니다. 집주인의 의무는 계약 만료일에 발생합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 임차권등기명령은 어디서 신청하나요?</p>
          <p>임대 주택 소재지 관할 지방법원에 신청합니다. 신청 시 임대차계약서, 등기부등본, 전입세대확인서 등이 필요하며, 신청 수수료는 수천 원 수준입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 집주인이 파산한 경우 보증금을 어떻게 받나요?</p>
          <p>전세보증보험에 가입했다면 보증기관에 보험금 청구가 가능합니다. 미가입 시 경매에서 배당 요구를 하거나 선순위 채권자가 없으면 소액임차인 최우선변제권을 활용할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 내용증명은 어떻게 보내나요?</p>
          <p>우체국 방문 또는 인터넷 우체국에서 내용증명 우편을 발송할 수 있습니다. 수신인, 발신인, 날짜, 청구 내용을 명확히 기재하고, 3부를 작성해 1부는 집주인에게, 1부는 우체국 보관, 1부는 본인 보관합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 전세보증보험은 어디서 가입하나요?</p>
          <p>HUG(주택도시보증공사), HF(한국주택금융공사), SGI서울보증에서 가입할 수 있습니다. 조건에 따라 가입 가능 여부가 다르므로 각 기관 홈페이지에서 확인하세요.</p>
        </div>
      </section>

      <RelatedCalculators current="/deposit-return-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false} href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
