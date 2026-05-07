"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const ZODIAC_ANIMALS = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
const WEEKDAYS = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

function getZodiac(year: number): string {
  return ZODIAC_ANIMALS[(year - 4) % 12];
}

function getConstellation(month: number, day: number): string {
  const constellations = [
    { name: "염소자리", end: [1, 19] },
    { name: "물병자리", end: [2, 18] },
    { name: "물고기자리", end: [3, 20] },
    { name: "양자리", end: [4, 19] },
    { name: "황소자리", end: [5, 20] },
    { name: "쌍둥이자리", end: [6, 20] },
    { name: "게자리", end: [7, 22] },
    { name: "사자자리", end: [8, 22] },
    { name: "처녀자리", end: [9, 22] },
    { name: "천칭자리", end: [10, 22] },
    { name: "전갈자리", end: [11, 21] },
    { name: "사수자리", end: [12, 21] },
    { name: "염소자리", end: [12, 31] },
  ];
  for (const c of constellations) {
    if (month < c.end[0] || (month === c.end[0] && day <= c.end[1])) {
      return c.name;
    }
  }
  return "염소자리";
}

export default function ClientPage() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [birthDate, setBirthDate] = useState("1990-01-01");

  const r = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();

    // 만 나이 계산
    let fullAge = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    const dayDiff = now.getDate() - birth.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) fullAge--;

    const fullAgeMonths = now.getMonth() - birth.getMonth() + (dayDiff < 0 ? -1 : 0);
    const remainMonths = ((fullAgeMonths % 12) + 12) % 12;
    const remainDays = dayDiff < 0
      ? new Date(now.getFullYear(), now.getMonth(), 0).getDate() + dayDiff
      : dayDiff;

    // 한국 나이
    const koreanAge = now.getFullYear() - birth.getFullYear() + 1;

    // 총 일수
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    // 태어난 요일
    const birthWeekday = WEEKDAYS[birth.getDay()];

    // 다음 생일
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1);
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // 띠
    const zodiac = getZodiac(birth.getFullYear());

    // 별자리
    const constellation = getConstellation(birth.getMonth() + 1, birth.getDate());

    return { fullAge, remainMonths, remainDays, koreanAge, totalDays, birthWeekday, daysToNextBirthday, zodiac, constellation };
  }, [birthDate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">🎂 나이 계산기</h1>
      <p className="text-gray-600 mb-6">생년월일을 입력하면 만 나이, 한국 나이, 띠, 별자리, 다음 생일까지 남은 일수를 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">생년월일 입력</h2>
        <div>
          <label className="block text-sm text-gray-500 mb-1">생년월일</label>
          <input type="date" value={birthDate} max={todayStr}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full border rounded p-2" />
        </div>
      </section>

      {/* 결과 섹션 */}
      {r && (
        <section className="bg-gray-100 rounded-lg p-5 mb-8">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">만 나이</p>
              <p className="text-3xl font-bold text-blue-600">{r.fullAge}세</p>
              <p className="text-xs text-gray-400 mt-1">{r.remainMonths}개월 {r.remainDays}일</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">한국 나이</p>
              <p className="text-3xl font-bold text-green-600">{r.koreanAge}세</p>
              <p className="text-xs text-gray-400 mt-1">올해 연도 - 출생 연도 + 1</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">태어난 날부터 총 일수</p>
              <p className="text-2xl font-bold text-purple-600">{r.totalDays.toLocaleString()}일</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">태어난 요일</p>
              <p className="text-2xl font-bold text-orange-500">{r.birthWeekday}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">다음 생일까지</p>
              <p className="text-xl font-bold text-pink-500">D-{r.daysToNextBirthday}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">띠</p>
              <p className="text-xl font-bold text-yellow-600">{r.zodiac}띠</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">별자리</p>
              <p className="text-lg font-bold text-indigo-600">{r.constellation}</p>
            </div>
          </div>
        </section>
      )}

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">만 나이와 한국 나이의 차이</h2>
        <p className="mb-3 text-gray-700">
          만 나이는 국제 표준 나이 계산법으로, 생일이 지나야 한 살을 더합니다. 예를 들어 1990년 6월 1일 출생자는 2024년 1월 기준 만 33세입니다. 한국에서는 2023년 6월부터 법적·행정적 나이를 만 나이로 통일하였습니다.
        </p>
        <p className="text-gray-700">
          한국 나이(세는 나이)는 태어나는 순간 1세이며, 매년 1월 1일에 한 살을 더합니다. 같은 해에 태어나도 생일에 관계없이 같은 한국 나이를 갖습니다. 일상에서는 아직 세는 나이를 사용하는 경우가 많지만, 법적 문서와 공공기관에서는 만 나이를 사용합니다.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">띠(12간지)와 별자리 계산</h2>
        <p className="mb-3 text-gray-700">
          12간지(十二干支)는 쥐, 소, 호랑이, 토끼, 용, 뱀, 말, 양, 원숭이, 닭, 개, 돼지 순으로 12년을 주기로 반복됩니다. 2024년은 갑진년(甲辰年)으로 청룡의 해입니다. 동양 문화권에서 띠는 출생 연도에 따라 성격, 운세 등을 가늠하는 데 사용됩니다.
        </p>
        <p className="mb-3 text-gray-700">
          서양 점성술의 별자리(황도 12궁)는 출생 월과 일에 따라 결정됩니다. 양자리(3/21~4/19), 황소자리(4/20~5/20), 쌍둥이자리(5/21~6/20), 게자리(6/21~7/22), 사자자리(7/23~8/22), 처녀자리(8/23~9/22), 천칭자리(9/23~10/22), 전갈자리(10/23~11/21), 사수자리(11/22~12/21), 염소자리(12/22~1/19), 물병자리(1/20~2/18), 물고기자리(2/19~3/20)로 구분됩니다.
        </p>
        <p className="text-gray-700">
          만 나이 계산은 현재 법적으로 가장 중요한 나이 기준입니다. 의료보험, 연금, 각종 법적 혜택의 나이 기준이 모두 만 나이를 기준으로 합니다. 정확한 만 나이 파악은 각종 사회 서비스 혜택 여부를 확인하는 데 매우 중요합니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "2023년부터 만 나이로 통일되었다는데, 모두 다 바뀌었나요?", a: "2023년 6월 28일부터 법적·사회적 나이 계산을 만 나이로 통일하는 법이 시행되었습니다. 일반 법령, 행정, 의료에서는 만 나이가 기준이지만, 학교 입학, 군 입대, 주류·담배 구매 등 기존부터 만 나이를 쓰던 곳은 변화가 없습니다." },
          { q: "만 나이 계산 시 생일이 윤년(2월 29일)이면 어떻게 하나요?", a: "2월 29일 출생자는 윤년이 아닌 해에는 2월 28일 또는 3월 1일에 생일로 인정하는 경우가 많습니다. 법적으로는 2월 28일까지 나이가 증가하지 않고 3월 1일에 한 살을 더하는 것이 일반적입니다." },
          { q: "학교 입학 기준 나이는 만 나이인가요?", a: "취학 의무 연령은 만 6세이며, 이는 만 나이 통일 이전에도 만 나이를 사용했습니다. 초등학교는 매년 1월 1일~12월 31일 사이에 만 6세가 되는 아이들이 다음 해 3월에 입학합니다." },
          { q: "연령제한이 있는 서비스(주류, 담배 등)의 나이 기준은?", a: "주류 및 담배 구매는 만 19세 이상(민법 성년)이 기준입니다. 만 나이로 19세 생일이 지나야 구매가 가능합니다. 기존에 사용하던 기준과 동일합니다." },
          { q: "별자리는 정확히 어떻게 결정되나요?", a: "별자리는 태양이 위치한 황도 상의 별자리 구역에 따라 결정됩니다. 날짜는 매년 조금씩 다를 수 있지만, 이 계산기는 일반적으로 사용되는 날짜 범위를 기준으로 합니다." },
          { q: "만 나이와 세는 나이 외에 다른 나이 계산법이 있나요?", a: "연 나이(현재 연도 - 출생 연도)도 있습니다. 이는 한국 나이에서 1을 뺀 것과 같으며, 생일이 지나지 않은 경우 만 나이보다 1 높습니다. 일부 법령에서 사용되기도 합니다." },
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
