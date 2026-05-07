"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const timeline = [
  { time: "20분", desc: "혈압과 심박수가 정상 수준으로 돌아옵니다." },
  { time: "12시간", desc: "혈중 일산화탄소(CO) 수치가 정상화됩니다." },
  { time: "2주~3개월", desc: "혈액 순환이 개선되고 폐 기능이 향상됩니다." },
  { time: "1~9개월", desc: "기침과 호흡 곤란이 줄어들며 폐 기능이 회복됩니다." },
  { time: "1년", desc: "관상동맥 질환 위험이 흡연자의 절반으로 감소합니다." },
  { time: "5년", desc: "구강암, 인후암, 식도암, 방광암 위험이 절반으로 줄어듭니다. 뇌졸중 위험이 비흡연자 수준으로 감소합니다." },
  { time: "10년", desc: "폐암 사망 위험이 흡연자의 절반으로 줄어듭니다." },
  { time: "15년", desc: "관상동맥 질환 위험이 비흡연자와 동일한 수준으로 감소합니다." },
];

export default function ClientPage() {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(20);
  const [pricePerPack, setPricePerPack] = useState(4500);
  const [cigsPerPack, setCigsPerPack] = useState(20);

  const r = useMemo(() => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

    const totalCigs = days * cigarettesPerDay;
    const savedMoney = (totalCigs / cigsPerPack) * pricePerPack;
    const savedTime = totalCigs * 5; // 분
    const savedTimeHours = Math.floor(savedTime / 60);
    const savedTimeMins = savedTime % 60;

    return { days, hours, minutes, totalCigs, savedMoney, savedTime, savedTimeHours, savedTimeMins };
  }, [startDate, cigarettesPerDay, pricePerPack, cigsPerPack]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link scroll={false}
        href="/" className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors">← 계산기 목록</Link>
      <h1 className="text-2xl font-bold mb-2">🚭 금연 계산기</h1>
      <p className="text-gray-600 mb-6">금연 시작일과 흡연 습관을 입력하면 절약된 금액, 피우지 않은 담배 개수, 되찾은 시간을 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">금연 정보 입력</h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">금연 시작일</label>
          <input type="date" value={startDate} max={today}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded p-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">하루 흡연량 (개비)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={100} value={cigarettesPerDay}
                onChange={(e) => setCigarettesPerDay(Number(e.target.value))}
                onBlur={(e) => setCigarettesPerDay(Math.min(100, Math.max(1, Number(e.target.value) || 20)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">개비</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">담배 한 갑 가격 (원)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={1000} max={20000} value={pricePerPack}
                onChange={(e) => setPricePerPack(Number(e.target.value))}
                onBlur={(e) => setPricePerPack(Math.min(20000, Math.max(1000, Number(e.target.value) || 4500)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">원</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">한 갑 개비 수</label>
            <div className="flex items-center gap-2">
              <input type="number" min={10} max={30} value={cigsPerPack}
                onChange={(e) => setCigsPerPack(Number(e.target.value))}
                onBlur={(e) => setCigsPerPack(Math.min(30, Math.max(10, Number(e.target.value) || 20)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">개비</span>
            </div>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      {r && (
        <section className="bg-gray-100 rounded-lg p-5 mb-8">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 mb-1">금연 기간</p>
            <p className="text-4xl font-bold text-green-600">{r.days}일</p>
            <p className="text-sm text-gray-500">{r.hours}시간 · {r.minutes}분</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">절약 금액</p>
              <p className="text-xl font-bold text-blue-600">{r.savedMoney.toLocaleString()}</p>
              <p className="text-xs text-gray-500">원</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">피우지 않은 담배</p>
              <p className="text-xl font-bold text-orange-600">{r.totalCigs.toLocaleString()}</p>
              <p className="text-xs text-gray-500">개비</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">되찾은 시간</p>
              <p className="text-xl font-bold text-purple-600">{r.savedTimeHours}시간</p>
              <p className="text-xs text-gray-500">{r.savedTimeMins}분</p>
            </div>
          </div>
        </section>
      )}

      {/* 건강 회복 타임라인 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">금연 후 건강 회복 타임라인</h2>
        <div className="relative">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                {i < timeline.length - 1 && <div className="w-0.5 h-full bg-green-200 mt-1" />}
              </div>
              <div className="pb-4">
                <p className="font-bold text-green-700">{item.time}</p>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">금연의 경제적 효과</h2>
        <p className="mb-3 text-gray-700">
          담배 한 갑(4,500원)을 하루에 한 갑 피우는 사람이 1년 금연하면 약 164만 원을 절약할 수 있습니다. 담배 두 갑을 피우던 사람이라면 연간 약 328만 원, 10년이면 3,280만 원에 달합니다. 절약된 금액으로 여행, 건강 관리, 저축 등 더 의미 있는 곳에 투자할 수 있습니다.
        </p>
        <p className="text-gray-700">
          흡연은 직접적인 담배 비용 외에도 의료비 증가, 생산성 손실, 화재 위험, 세탁비 등 간접 비용도 발생시킵니다. 연구에 따르면 흡연자는 비흡연자에 비해 일생 동안 의료비를 훨씬 더 많이 지출하는 것으로 알려져 있습니다. 금연은 가장 효과적인 건강 투자입니다.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">금연 성공을 위한 팁</h2>
        <p className="mb-3 text-gray-700">
          금연에 성공하기 위해서는 구체적인 금연 날짜를 정하고, 주변에 금연 결심을 알리는 것이 중요합니다. 니코틴 대체 요법(패치, 껌, 흡입기 등)이나 금연 치료제(바레니클린, 부프로피온)를 의사와 상담하여 사용하면 성공률을 높일 수 있습니다. 보건소나 금연 클리닉의 무료 상담 서비스도 적극 활용하세요.
        </p>
        <p className="mb-3 text-gray-700">
          금연 초기에는 니코틴 금단 증상(집중력 저하, 불안, 짜증, 두통 등)이 나타날 수 있으며, 이는 보통 2~4주가 지나면 완화됩니다. 흡연 충동이 생길 때는 물 한 잔 마시기, 심호흡하기, 가볍게 걷기 등 대체 행동을 미리 준비해두면 도움이 됩니다. 금연 앱이나 지지 그룹을 활용하는 것도 효과적입니다.
        </p>
        <p className="text-gray-700">
          한국에서는 보건소 금연 클리닉(무료), 금연 지원 전화(1544-9030), 병·의원 금연 치료 지원 사업 등을 통해 전문적인 금연 도움을 받을 수 있습니다. 국가건강검진 수검자, 건강보험 가입자 모두 금연 치료 지원 혜택을 받을 수 있으니 적극적으로 활용하시기 바랍니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "금연 후 체중이 늘어나는 이유는?", a: "니코틴은 식욕을 억제하고 대사를 높이는 효과가 있습니다. 금연 후 이런 효과가 사라지고 식욕이 증가하여 평균 2~4kg 체중이 늘 수 있습니다. 규칙적인 운동과 건강한 간식(과일, 채소)으로 대처하세요." },
          { q: "전자담배로 금연하면 효과가 있나요?", a: "전자담배는 일반 담배보다 유해 물질이 적지만, 니코틴 의존성을 유지하기 때문에 완전한 금연 도구로 보기 어렵습니다. 의학적으로 검증된 니코틴 대체 요법이나 금연 치료제를 전문가 지도하에 사용하는 것이 더 권장됩니다." },
          { q: "금연 후 기침이 더 심해졌는데 정상인가요?", a: "금연 초기에는 폐의 정화 작용이 활발해지면서 오히려 기침과 가래가 증가할 수 있습니다. 이는 폐가 회복되는 긍정적인 신호이며, 보통 1~2개월 내에 자연스럽게 줄어듭니다." },
          { q: "담배 피우다 한 개비를 피우면 처음부터 다시 시작해야 하나요?", a: "한 번의 실수가 금연 실패를 의미하지 않습니다. 중요한 것은 포기하지 않고 다시 시작하는 것입니다. 대부분의 성공적인 금연자들은 여러 번의 시도 끝에 성공합니다. 실수를 학습 기회로 삼으세요." },
          { q: "금연 후 얼마나 지나야 폐가 완전히 회복되나요?", a: "폐 기능은 금연 후 2주~3개월부터 개선되기 시작합니다. 폐암 위험은 10년 후 흡연자의 절반 수준으로 줄어들며, 15년이 지나면 심장병 위험이 비흡연자 수준에 가까워집니다. 완전한 회복은 흡연 기간과 양에 따라 다릅니다." },
          { q: "간접흡연도 위험한가요?", a: "간접흡연은 직접흡연과 동일한 수천 가지 유해 물질에 노출됩니다. 간접흡연을 당하는 비흡연자의 폐암 위험은 20~30% 높아지며, 특히 어린이는 폐 발육 저해, 천식, 중이염 위험이 크게 증가합니다." },
        ].map((item) => (
          <div key={item.q} className="mb-4 border-b pb-4 last:border-b-0">
            <p className="font-bold text-gray-800 mb-1">Q. {item.q}</p>
            <p className="text-gray-600 text-sm">{item.a}</p>
          </div>
        ))}
      </section>

      <RelatedCalculators />

      <div className="mt-10 text-center">
        <Link scroll={false}
          href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">계산기 목록으로 돌아가기</Link>
      </div>
    </div>
  );
}
