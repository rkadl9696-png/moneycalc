"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const GOVT_SUPPORT: Record<string, Record<string, number>> = {
  "어린이집": { "0세": 514_000, "1세": 453_000, "2세": 453_000, "3세": 260_000, "4세": 260_000, "5세": 260_000 },
  "유치원": { "0세": 0, "1세": 0, "2세": 0, "3세": 140_000, "4세": 140_000, "5세": 140_000 },
  "가정양육": { "0세": 200_000, "1세": 150_000, "2세": 100_000, "3세": 0, "4세": 0, "5세": 0 },
};

const TOTAL_COST: Record<string, Record<string, number>> = {
  "어린이집": { "0세": 700_000, "1세": 600_000, "2세": 600_000, "3세": 450_000, "4세": 450_000, "5세": 450_000 },
  "유치원": { "0세": 0, "1세": 0, "2세": 0, "3세": 350_000, "4세": 350_000, "5세": 350_000 },
  "가정양육": { "0세": 800_000, "1세": 700_000, "2세": 600_000, "3세": 500_000, "4세": 450_000, "5세": 400_000 },
};

const AGE_OPTIONS = ["0세", "1세", "2세", "3세", "4세", "5세"];
const REGION_EXTRA: Record<string, number> = { "서울": 50_000, "경기": 20_000, "지방": 0 };

export default function ClientPage() {
  const [childAge, setChildAge] = useState("1세");
  const [facility, setFacility] = useState("어린이집");
  const [region, setRegion] = useState("서울");
  const [diapers, setDiapers] = useState(true);

  const r = useMemo(() => {
    const govt = GOVT_SUPPORT[facility][childAge] ?? 0;
    const total = TOTAL_COST[facility][childAge] ?? 0;
    const regionExtra = REGION_EXTRA[region];
    const diapersSupport = (childAge === "0세" || childAge === "1세") && diapers ? 140_000 : 0;
    const totalCost = total + regionExtra;
    const netCost = Math.max(0, totalCost - govt - diapersSupport);
    return { govt, diapersSupport, totalCost, netCost, annual: netCost * 12 };
  }, [childAge, facility, region, diapers]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fmt = (n: number) => n.toLocaleString();

  const facilityOptions = childAge === "0세" || childAge === "1세" || childAge === "2세"
    ? ["어린이집", "가정양육"]
    : ["어린이집", "유치원", "가정양육"];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">육아비용 계산기</h1>
      <p className="text-gray-600 mb-6">자녀 나이와 보육 유형을 선택하면 정부지원금 반영 실부담 육아비용을 계산합니다.</p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">자녀 나이</label>
          <div className="flex gap-2 flex-wrap">
            {AGE_OPTIONS.map((a) => (
              <button key={a} onClick={() => setChildAge(a)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${childAge === a ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">보육 유형</label>
          <div className="flex gap-2 flex-wrap">
            {facilityOptions.map((f) => (
              <button key={f} onClick={() => setFacility(f)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${facility === f ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">거주 지역</label>
          <div className="flex gap-2">
            {["서울", "경기", "지방"].map((r) => (
              <button key={r} onClick={() => setRegion(r)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${region === r ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        {(childAge === "0세" || childAge === "1세") && (
          <div className="flex items-center gap-3">
            <input type="checkbox" id="diapers" checked={diapers} onChange={(e) => setDiapers(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="diapers" className="text-sm text-gray-600">기저귀·분유 바우처 이용 (월 14만원 지원)</label>
          </div>
        )}
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-4 text-blue-800">월별 육아비용 계산</h2>
        <div className="flex flex-col gap-3 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">예상 월 총 지출</span>
            <span className="font-bold">{fmt(r.totalCost)}원</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>정부 보육료 지원금</span>
            <span className="font-bold">-{fmt(r.govt)}원</span>
          </div>
          {r.diapersSupport > 0 && (
            <div className="flex justify-between text-green-600">
              <span>기저귀·분유 바우처</span>
              <span className="font-bold">-{fmt(r.diapersSupport)}원</span>
            </div>
          )}
        </div>
        <div className="border-t border-blue-200 pt-4">
          <p className="text-xs text-gray-500 mb-0.5">월 실부담 육아비용</p>
          <p className="text-3xl font-bold text-blue-600">{fmt(r.netCost)}원</p>
          <p className="text-xs text-gray-400 mt-1">연간 약 {fmt(r.annual)}원</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">정부 보육 지원 제도</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          정부는 영유아 보육을 위해 다양한 지원 제도를 운영하고 있습니다.
          어린이집 보육료 지원은 아동의 연령에 따라 월 26만~51만 원을 지원하며, 맞춤형 보육의 경우 별도 기준이 적용됩니다.
          유치원 유아학비 지원은 만 3~5세 아동에게 월 14만 원 기준을 지원하고, 방과후과정 이용 시 추가 지원이 있습니다.
          가정양육수당은 어린이집·유치원을 이용하지 않는 아동에게 월 10만~20만 원을 지원합니다.
          기저귀·분유 바우처는 만 2세 미만 아동이 있는 기초생활수급자·차상위계층 가구에 월 14만 원을 지원합니다.
          아이돌봄서비스는 소득에 따라 최대 85%까지 정부가 지원하며, 가정 내 돌봄이 필요한 경우 활용할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "보육료 지원은 어떻게 신청하나요?", a: "복지로(www.bokjiro.go.kr) 또는 주민센터에서 아이행복카드를 발급받아 어린이집에 제출하면 보육료 지원을 받을 수 있습니다." },
          { q: "맞벌이 가구는 추가 지원이 있나요?", a: "맞벌이 가구는 종일반 보육료(일반 + 추가보육료)를 지원받을 수 있으며, 아이돌봄서비스 이용 시 소득에 따라 정부 지원 비율이 높아집니다." },
          { q: "아이돌봄서비스 이용 방법은?", a: "아이돌봄서비스는 아이돌봄 포털(idolbom.go.kr)에서 신청하면 됩니다. 소득 수준에 따라 A~D형으로 나뉘어 정부 지원 비율이 다르게 적용됩니다." },
          { q: "어린이집과 유치원의 차이는?", a: "어린이집은 만 0~5세, 유치원은 만 3~5세를 대상으로 하며, 유치원은 교육부 관할입니다. 운영 방식과 교육 과정에 차이가 있으며, 지원 금액도 다릅니다." },
          { q: "첫만남이용권이란 무엇인가요?", a: "출생아에게 지급하는 일시금 바우처로, 첫째 200만 원, 둘째 이상 300만 원이 지원됩니다. 출생일로부터 1년 이내에 유아용품, 의류, 의료비 등에 사용할 수 있습니다." },
          { q: "부모급여는 어떻게 받나요?", a: "만 0세 아동에게 월 100만 원, 만 1세 아동에게 월 50만 원을 현금 또는 바우처로 지급합니다. 주민센터나 복지로 온라인에서 신청할 수 있습니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/childcare-calc" />

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
