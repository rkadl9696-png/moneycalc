"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type BillingCycle = "월" | "연";

interface Subscription {
  id: number;
  name: string;
  amount: number;
  cycle: BillingCycle;
  active: boolean;
}

const POPULAR: { name: string; amount: number; cycle: BillingCycle }[] = [
  { name: "넷플릭스", amount: 17000, cycle: "월" },
  { name: "유튜브 프리미엄", amount: 14900, cycle: "월" },
  { name: "스포티파이", amount: 10900, cycle: "월" },
  { name: "왓챠", amount: 7900, cycle: "월" },
  { name: "쿠팡 로켓와우", amount: 7890, cycle: "월" },
  { name: "디즈니+", amount: 9900, cycle: "월" },
  { name: "애플뮤직", amount: 10900, cycle: "월" },
];

const COLORS = [
  "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400",
  "bg-red-400", "bg-teal-400", "bg-pink-400", "bg-yellow-400",
  "bg-indigo-400", "bg-lime-400",
];

let nextId = 100;

export default function ClientPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: nextId++, name: "넷플릭스", amount: 17000, cycle: "월", active: true },
    { id: nextId++, name: "유튜브 프리미엄", amount: 14900, cycle: "월", active: true },
  ]);
  const [customName, setCustomName] = useState("");
  const [customAmount, setCustomAmount] = useState(9900);
  const [customCycle, setCustomCycle] = useState<BillingCycle>("월");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const result = useMemo(() => {
    const active = subscriptions.filter((s) => s.active);
    const monthlyTotal = active.reduce((sum, s) => {
      return sum + (s.cycle === "월" ? s.amount : s.amount / 12);
    }, 0);
    const yearlyTotal = monthlyTotal * 12;

    return { active, monthlyTotal, yearlyTotal };
  }, [subscriptions]);

  function addPopular(item: typeof POPULAR[number]) {
    const alreadyExists = subscriptions.some((s) => s.name === item.name);
    if (alreadyExists) {
      setSubscriptions((prev) =>
        prev.map((s) => (s.name === item.name ? { ...s, active: true } : s))
      );
      return;
    }
    setSubscriptions((prev) => [
      ...prev,
      { id: nextId++, name: item.name, amount: item.amount, cycle: item.cycle, active: true },
    ]);
  }

  function addCustom() {
    if (!customName.trim()) return;
    setSubscriptions((prev) => [
      ...prev,
      { id: nextId++, name: customName.trim(), amount: customAmount, cycle: customCycle, active: true },
    ]);
    setCustomName("");
    setCustomAmount(9900);
  }

  function removeSubscription(id: number) {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleSubscription(id: number) {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  }

  function updateAmount(id: number, value: number) {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, amount: value } : s))
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">구독 비용 계산기</h1>
      <p className="text-gray-600 mb-6">
        이용 중인 구독 서비스를 추가하면 월 총합, 연 총합과 서비스별 비율을 한눈에 확인합니다.
      </p>

      {/* 인기 구독 추가 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-3">인기 구독 서비스 추가</h2>
        <div className="grid grid-cols-2 gap-2">
          {POPULAR.map((item) => {
            const exists = subscriptions.some((s) => s.name === item.name && s.active);
            return (
              <button
                key={item.name}
                onClick={() => addPopular(item)}
                className={`flex justify-between items-center p-2.5 rounded border text-sm transition-colors ${
                  exists
                    ? "bg-blue-50 border-blue-400 text-blue-700"
                    : "bg-white border-gray-200 hover:border-blue-400 text-gray-700"
                }`}
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-gray-500">{item.amount.toLocaleString()}원/{item.cycle}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 직접 추가 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-3">직접 추가</h2>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_100px_70px] gap-2">
            <input
              type="text"
              placeholder="서비스명"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              className="border rounded p-2 text-sm"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                onBlur={(e) => setCustomAmount(Math.max(0, Number(e.target.value) || 0))}
                className="w-full border rounded p-2 text-sm"
              />
            </div>
            <select
              value={customCycle}
              onChange={(e) => setCustomCycle(e.target.value as BillingCycle)}
              className="border rounded p-2 text-sm"
            >
              <option value="월">월정액</option>
              <option value="연">연정액</option>
            </select>
          </div>
          <button
            onClick={addCustom}
            disabled={!customName.trim()}
            className="w-full py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 disabled:opacity-40"
          >
            + 추가
          </button>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">월 총합</p>
            <p className="text-2xl font-bold text-blue-600">{Math.round(result.monthlyTotal).toLocaleString()}<span className="text-sm font-normal ml-1">원</span></p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">연 총합</p>
            <p className="text-2xl font-bold text-red-500">{Math.round(result.yearlyTotal).toLocaleString()}<span className="text-sm font-normal ml-1">원</span></p>
          </div>
        </div>

        {/* 비율 바 */}
        {result.active.length > 0 && (
          <div className="mb-3">
            <div className="flex h-4 rounded-full overflow-hidden mb-2">
              {result.active.map((s, idx) => {
                const monthly = s.cycle === "월" ? s.amount : s.amount / 12;
                const pct = result.monthlyTotal > 0 ? (monthly / result.monthlyTotal) * 100 : 0;
                return (
                  <div
                    key={s.id}
                    className={`${COLORS[idx % COLORS.length]} h-full`}
                    style={{ width: `${pct}%` }}
                    title={`${s.name}: ${pct.toFixed(1)}%`}
                  />
                );
              })}
            </div>
            <div className="flex flex-col gap-1.5">
              {result.active.map((s, idx) => {
                const monthly = s.cycle === "월" ? s.amount : s.amount / 12;
                const pct = result.monthlyTotal > 0 ? (monthly / result.monthlyTotal) * 100 : 0;
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm shrink-0 ${COLORS[idx % COLORS.length]}`} />
                    <span className="text-sm text-gray-700 flex-1">{s.name}</span>
                    <span className="text-xs text-gray-400">{pct.toFixed(1)}%</span>
                    <span className="text-sm font-bold text-gray-700">{Math.round(monthly).toLocaleString()}원/월</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 구독 목록 관리 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">구독 목록 관리</h2>
        {subscriptions.length === 0 ? (
          <p className="text-center text-gray-400 py-4 text-sm">구독 서비스를 추가하세요</p>
        ) : (
          <div className="flex flex-col gap-2">
            {subscriptions.map((s) => {
              const monthly = s.cycle === "월" ? s.amount : s.amount / 12;
              return (
                <div key={s.id} className={`flex items-center gap-2 p-3 rounded-lg border ${s.active ? "bg-white" : "bg-gray-50 opacity-60"}`}>
                  <button
                    onClick={() => toggleSubscription(s.id)}
                    className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center ${s.active ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"}`}
                  >
                    {s.active && <span className="text-xs">✓</span>}
                  </button>
                  <span className="flex-1 text-sm font-medium">{s.name}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={s.amount}
                      onChange={(e) => updateAmount(s.id, Number(e.target.value))}
                      onBlur={(e) => updateAmount(s.id, Math.max(0, Number(e.target.value) || 0))}
                      className="w-20 border rounded p-1 text-xs text-right"
                    />
                    <span className="text-xs text-gray-500">{s.cycle}</span>
                  </div>
                  <span className="text-xs text-gray-400 w-20 text-right">
                    {Math.round(monthly).toLocaleString()}원/월
                  </span>
                  <button
                    onClick={() => removeSubscription(s.id)}
                    className="text-gray-300 hover:text-red-500 ml-1"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 핵심 개념 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">구독 서비스 비용 관리의 중요성</h2>
        <p className="mb-3">
          스트리밍, 음악, 쇼핑, 클라우드 등 다양한 구독 서비스가 늘어나면서 월 구독료가 눈덩이처럼
          불어나는 경우가 많습니다. 개별 구독료는 작아 보이지만, 여러 서비스를 합산하면 월 5~10만원,
          연간 60~120만원 이상이 되기도 합니다.
        </p>
        <p className="mb-3">
          구독 관리의 핵심은 실제로 사용하는 서비스와 사용하지 않는 서비스를 구분하는 것입니다.
          비슷한 서비스(예: 음악 스트리밍)는 하나만 유지하고, 연정액을 선택하면 월정액보다
          보통 15~20% 저렴합니다. 가족 플랜이나 학생 할인도 활용하면 비용을 줄일 수 있습니다.
        </p>
        <p>
          정기적으로 구독 목록을 점검하고 필요 없는 서비스는 해지하는 습관이 중요합니다.
          무료 체험 기간 후 자동 결제로 전환되는 서비스에 특히 주의하세요.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 구독료를 절약하는 방법은?</p>
          <p>연정액 선택(월정액 대비 15~20% 할인), 가족 공유 플랜 활용, 학생·군인 할인, 카드사 제휴 할인 등을 활용하세요. 또한 사용하지 않는 구독은 과감히 해지하는 것이 중요합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 넷플릭스 요금이 자꾸 오르는 이유는?</p>
          <p>OTT 업체들이 콘텐츠 투자 비용 회수와 수익성 개선을 위해 지속적으로 요금을 인상하고 있습니다. 계정 공유 제한 등 정책 변화로 실질적인 비용 부담도 늘어났습니다. 필요에 따라 저가 요금제(광고형)를 검토할 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 유튜브 프리미엄 가족 요금제는 있나요?</p>
          <p>유튜브 프리미엄 패밀리 요금제가 있으며, 최대 5명까지 가족 구성원이 각각 혜택을 받을 수 있습니다. 1인당 비용이 크게 줄어들어 가족 중 여러 명이 이용한다면 훨씬 경제적입니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 무료 체험 후 자동 결제를 막으려면?</p>
          <p>무료 체험 신청 시 캘린더에 해지 알림을 등록하거나, 무료 체험 직후 해지 신청(체험 기간 만료까지 유효)을 해두는 것을 권장합니다. 일부 서비스는 해지 신청 후에도 남은 기간 동안 이용이 가능합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 쿠팡 로켓와우 멤버십 혜택은 무엇인가요?</p>
          <p>로켓배송 무료(일부 조건), 로켓직구 혜택, 쿠팡이츠 무료 배달, OTT 서비스 쿠팡플레이 이용 등의 혜택이 있습니다. 이커머스 이용이 잦다면 배송비 절감 효과가 클 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 구독 서비스 관리 앱이 있나요?</p>
          <p>해외에는 Truebill, Rocket Money 등 구독 관리 전용 앱이 있습니다. 국내에서는 뱅크샐러드, 토스 등 개인 금융 앱에서 구독 결제를 추적하는 기능을 제공하는 경우가 있습니다.</p>
        </div>
      </section>

      <RelatedCalculators current="/subscription-calc" />

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
