"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

interface DdayItem {
  id: number;
  name: string;
  date: string;
}

function calcDday(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDday(d: number): string {
  if (d === 0) return "D-Day";
  if (d > 0) return `D-${d}`;
  return `D+${Math.abs(d)}`;
}

function getDdayColor(d: number): string {
  if (d === 0) return "text-red-500";
  if (d > 0 && d <= 7) return "text-orange-500";
  if (d > 0) return "text-blue-600";
  return "text-gray-400";
}

const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getNextOccurrence(month: number, day: number): string {
  const now = new Date();
  let year = now.getFullYear();
  const target = new Date(year, month - 1, day);
  if (target <= now) year++;
  return localDateStr(new Date(year, month - 1, day));
}

const INITIAL_ITEMS: DdayItem[] = [
  { id: 1, name: "새해", date: getNextOccurrence(1, 1) },
  { id: 2, name: "크리스마스", date: getNextOccurrence(12, 25) },
];

export default function ClientPage() {
  const [items, setItems] = useState<DdayItem[]>(INITIAL_ITEMS);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [nextId, setNextId] = useState(3);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const da = Math.abs(calcDday(a.date));
      const db = Math.abs(calcDday(b.date));
      return da - db;
    });
  }, [items]);

  const addItem = () => {
    if (!newName.trim() || !newDate) return;
    if (items.length >= 10) return;
    setItems([...items, { id: nextId, name: newName.trim(), date: newDate }]);
    setNextId(nextId + 1);
    setNewName("");
    setNewDate("");
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">📅 D-day 계산기</h1>
      <p className="text-gray-600 mb-6">목표 날짜를 입력하면 D-day를 계산합니다. 최대 10개의 이벤트를 추가하고 가까운 순서로 정렬할 수 있습니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">이벤트 추가 ({items.length}/10)</h2>
        <div className="flex gap-2 mb-3">
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
            placeholder="이벤트 이름"
            className="flex-1 border rounded p-2 text-sm"
            onKeyDown={(e) => e.key === "Enter" && addItem()} />
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
            className="border rounded p-2 text-sm" />
        </div>
        <button onClick={addItem} disabled={items.length >= 10 || !newName.trim() || !newDate}
          className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          이벤트 추가
        </button>
        {items.length >= 10 && <p className="text-xs text-red-500 mt-1 text-center">최대 10개까지 추가할 수 있습니다.</p>}
      </section>

      {/* 결과 섹션 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-base font-bold mb-3">D-day 목록 (가까운 순)</h2>
        {sortedItems.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">이벤트를 추가해주세요.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedItems.map((item) => {
              const d = calcDday(item.date);
              const label = formatDday(d);
              const color = getDdayColor(d);
              return (
                <div key={item.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${color}`}>{label}</span>
                    <button onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors text-lg font-bold">
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">D-day 계산이란?</h2>
        <p className="mb-3 text-gray-700">
          D-day(디데이)는 특정 이벤트까지 남은 날수 또는 지난 날수를 나타내는 카운트입니다. 원래 군사 용어로 작전 실행일을 뜻했지만, 현재는 중요한 날짜까지의 카운트다운으로 널리 사용됩니다. D-숫자는 목표 날짜까지 남은 날수, D+숫자는 이벤트 이후 경과된 날수를 의미합니다.
        </p>
        <p className="text-gray-700">
          D-day 계산은 시험일, 여행 출발일, 기념일, 생일, 결혼기념일, 프로젝트 마감일 등 중요한 날짜를 추적하는 데 유용합니다. 이 계산기는 최대 10개의 이벤트를 동시에 관리할 수 있으며, 가까운 날짜 순으로 자동 정렬됩니다. 오늘이 바로 그 날이면 'D-Day'로 표시됩니다.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">D-day 활용법</h2>
        <p className="mb-3 text-gray-700">
          시험이나 자격증 준비 기간을 추적할 때 D-day 계산기가 특히 유용합니다. 목표일까지 남은 날수를 매일 확인하면 학습 동기를 유지하고 시간 계획을 세우는 데 도움이 됩니다. 수능, 공무원 시험, TOEIC, 자격증 시험 등의 날짜를 미리 등록해두면 효과적입니다.
        </p>
        <p className="mb-3 text-gray-700">
          커플 기념일, 결혼 기념일, 생일 등 중요한 날을 관리하는 데도 활용할 수 있습니다. 특히 상대방의 생일이나 기념일을 미리 파악하여 선물이나 이벤트를 준비하는 데 도움이 됩니다. 결혼식, 돌잔치, 환갑 잔치 등 큰 행사의 준비 기간 파악에도 활용하세요.
        </p>
        <p className="text-gray-700">
          비즈니스에서도 프로젝트 마감일, 계약 만료일, 출시 예정일 등을 관리하는 데 D-day 계산기를 활용할 수 있습니다. 팀원들과 공유하면 마감일에 대한 공통된 인식을 가지는 데 도움이 됩니다. 건강 목표(금연, 다이어트, 운동 시작일 등) 추적에도 유용합니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "D-1은 내일이 목표일이라는 뜻인가요?", a: "네, D-1은 목표일 하루 전을 의미합니다. D-7은 7일 후, D-30은 30일 후입니다. 목표일 당일은 D-Day, 지난 후에는 D+1, D+2로 표시됩니다." },
          { q: "이벤트가 저장이 안 되는데 어떻게 하나요?", a: "이 계산기는 브라우저 내 임시 메모리(state)를 사용합니다. 페이지를 새로 고침하면 초기 상태로 돌아갑니다. 영구 저장이 필요하다면 별도의 앱(구글 캘린더, 기념일 앱 등)을 활용해주세요." },
          { q: "과거 날짜를 입력하면 어떻게 표시되나요?", a: "과거 날짜를 입력하면 D+숫자 형식으로 표시되어 그 날로부터 얼마나 지났는지를 나타냅니다. 예를 들어 입대일, 결혼일, 금연 시작일 등의 기념일을 D+방식으로 추적할 수 있습니다." },
          { q: "한국 공휴일이나 연휴는 자동으로 표시되나요?", a: "이 계산기는 단순 날짜 차이 계산에 특화되어 있어 공휴일이나 연휴를 별도로 표시하지 않습니다. 공휴일 정보가 필요하다면 정부24나 공공데이터포털 등을 참고하세요." },
          { q: "여러 이벤트를 한 번에 추가할 수 있나요?", a: "현재는 이벤트를 하나씩 추가해야 하며 최대 10개까지 등록할 수 있습니다. 각 이벤트는 이름과 날짜를 입력하고 추가 버튼을 클릭하면 됩니다. 더 이상 필요 없는 이벤트는 × 버튼으로 삭제할 수 있습니다." },
          { q: "생일을 매년 자동 갱신할 수 있나요?", a: "이 계산기는 입력한 날짜 기준으로만 계산하므로 자동 갱신 기능은 없습니다. 매년 갱신되는 기념일(생일, 결혼기념일 등) 추적을 원한다면 스마트폰 기본 달력 앱의 반복 일정 기능을 활용하는 것이 편리합니다." },
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
