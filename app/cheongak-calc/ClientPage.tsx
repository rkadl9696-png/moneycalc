"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

// 무주택기간 → 점수 (최대 32점)
function getHomelessScore(years: number): number {
  if (years <= 0) return 2;
  if (years >= 15) return 32;
  return 2 + years * 2;
}

// 부양가족수 → 점수 (최대 35점)
function getDependentScore(count: number): number {
  if (count <= 0) return 5;
  if (count >= 6) return 35;
  return 5 + count * 5;
}

// 청약통장 가입기간 → 점수 (최대 17점)
function getSubscriptionScore(years: number): number {
  if (years < 0.5) return 1;
  if (years >= 15) return 17;
  return Math.floor(years) + 2;
}

// 가점 등급 판단
function getGrade(score: number): { label: string; color: string; desc: string } {
  if (score >= 70) return { label: "상위권", color: "text-green-600", desc: "인기 단지에도 도전 가능한 점수입니다." };
  if (score >= 55) return { label: "중상위권", color: "text-blue-600", desc: "경쟁률이 낮은 단지 위주로 도전해보세요." };
  if (score >= 40) return { label: "중간", color: "text-yellow-600", desc: "입지 조건 등을 보고 전략적으로 접근하세요." };
  return { label: "하위권", color: "text-red-500", desc: "무주택기간과 통장 가입기간을 늘리는 게 우선입니다." };
}

export default function ClientPage() {
  const [homelessYears, setHomelessYears] = useState(5);
  const [dependentCount, setDependentCount] = useState(2);
  const [subscriptionYears, setSubscriptionYears] = useState(5);

  const homelessScore = getHomelessScore(homelessYears);
  const dependentScore = getDependentScore(dependentCount);
  const subscriptionScore = getSubscriptionScore(subscriptionYears);
  const totalScore = homelessScore + dependentScore + subscriptionScore;
  const grade = getGrade(totalScore);

  return (
    <div className="max-w-2xl mx-auto p-6">

      <Link
        scroll={false}
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">청약 가점 계산기</h1>
      <p className="text-gray-600 mb-6">
        무주택기간, 부양가족수, 청약통장 가입기간을 입력해 내 청약 가점을 확인하세요. (만점 84점)
      </p>

      {/* 무주택기간 */}
      <section className="border rounded-lg p-4 mb-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-bold">1. 무주택기간</h2>
          <span className="text-sm font-bold text-blue-600">{homelessScore}점 / 32점</span>
        </div>
        <label className="block text-sm text-gray-500 mb-2">
          만 30세 이후, 또는 혼인 이후 무주택 기간 (연 단위)
        </label>
        <input
          type="number"
          min={0}
          max={15}
          value={homelessYears}
          onChange={(e) => setHomelessYears(Math.min(15, Math.max(0, Number(e.target.value))))}
          className="w-full border p-2 rounded"
        />
        <p className="text-xs text-gray-400 mt-1">
          0년: 2점 / 1년: 4점 / ... / 15년 이상: 32점
        </p>
      </section>

      {/* 부양가족수 */}
      <section className="border rounded-lg p-4 mb-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-bold">2. 부양가족수</h2>
          <span className="text-sm font-bold text-blue-600">{dependentScore}점 / 35점</span>
        </div>
        <label className="block text-sm text-gray-500 mb-2">
          주민등록표상 세대원 (본인 제외, 배우자·직계존비속 포함)
        </label>
        <input
          type="number"
          min={0}
          max={6}
          value={dependentCount}
          onChange={(e) => setDependentCount(Math.min(6, Math.max(0, Number(e.target.value))))}
          className="w-full border p-2 rounded"
        />
        <p className="text-xs text-gray-400 mt-1">
          0명: 5점 / 1명: 10점 / ... / 6명 이상: 35점
        </p>
      </section>

      {/* 청약통장 가입기간 */}
      <section className="border rounded-lg p-4 mb-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-bold">3. 청약통장 가입기간</h2>
          <span className="text-sm font-bold text-blue-600">{subscriptionScore}점 / 17점</span>
        </div>
        <label className="block text-sm text-gray-500 mb-2">
          주택청약종합저축 가입 후 경과 기간 (연 단위)
        </label>
        <input
          type="number"
          min={0}
          max={15}
          step={0.5}
          value={subscriptionYears}
          onChange={(e) => setSubscriptionYears(Math.min(15, Math.max(0, Number(e.target.value))))}
          className="w-full border p-2 rounded"
        />
        <p className="text-xs text-gray-400 mt-1">
          6개월 미만: 1점 / 1년: 3점 / ... / 15년 이상: 17점
        </p>
      </section>

      {/* 결과 */}
      <section className="bg-gray-100 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-4">계산 결과</h2>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">무주택기간</span>
            <span className="font-bold">{homelessScore}점</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">부양가족수</span>
            <span className="font-bold">{dependentScore}점</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">청약통장 가입기간</span>
            <span className="font-bold">{subscriptionScore}점</span>
          </div>
          <hr className="my-1" />
          <div className="flex justify-between text-base font-bold">
            <span>총 가점</span>
            <span className="text-blue-700">{totalScore}점 / 84점</span>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(totalScore / 84) * 100}%` }}
          />
        </div>

        <div className="p-4 bg-white rounded border">
          <p className="text-lg font-bold">
            👉 내 청약 가점은{" "}
            <span className={grade.color}>{grade.label}</span>입니다.
          </p>
          <p className="mt-2 text-gray-700 text-sm">{grade.desc}</p>
        </div>
      </section>

      {/* 가점 기준표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">청약 가점 기준표</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">항목</th>
                <th className="text-center p-3 border-b font-bold">만점</th>
                <th className="text-left p-3 border-b font-bold">점수 기준</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">무주택기간</td>
                <td className="text-center p-3 font-bold text-blue-600">32점</td>
                <td className="p-3 text-gray-600">1년 미만 2점, 이후 1년마다 2점 추가 (최대 15년)</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">부양가족수</td>
                <td className="text-center p-3 font-bold text-blue-600">35점</td>
                <td className="p-3 text-gray-600">0명 5점, 이후 1명마다 5점 추가 (최대 6명)</td>
              </tr>
              <tr>
                <td className="p-3">청약통장 가입기간</td>
                <td className="text-center p-3 font-bold text-blue-600">17점</td>
                <td className="p-3 text-gray-600">6개월 미만 1점, 이후 6개월마다 1점 추가 (최대 15년)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SEO 설명글 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">청약 가점제란?</h2>
        <p className="mb-3">
          청약 가점제는 무주택 기간, 부양가족 수, 청약통장 가입기간 3가지 항목을 점수화해 당첨자를 선정하는 방식입니다.
          총 84점 만점이며, 점수가 높을수록 당첨 가능성이 높아집니다.
        </p>
        <p className="mb-3">
          특히 부양가족수(35점)가 가장 큰 비중을 차지하며, 배우자·자녀·부모님 등을 같은 주민등록표에 올리면 점수가 올라갑니다.
          무주택기간(32점)은 만 30세 또는 혼인 시점부터 계산됩니다.
        </p>
        <p>
          청약통장은 오래 유지할수록 유리하며, 가입 후 15년 이상이 되면 17점 만점을 받을 수 있습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 무주택기간은 어떻게 계산하나요?</p>
          <p>만 30세가 된 날 또는 혼인신고일 중 빠른 날부터 무주택으로 지낸 기간을 계산합니다. 배우자도 무주택이어야 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 부양가족에 부모님도 포함되나요?</p>
          <p>네, 주민등록표에 같이 올라있고 3년 이상 부양한 직계존속(부모님, 조부모님)은 포함됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 청약통장 가입기간은 얼마나 쌓아야 하나요?</p>
          <p>15년 이상 유지하면 17점 만점입니다. 빠를수록 유리하니 청년 시절부터 가입하는 것이 좋습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 84점이 만점인데, 몇 점이면 당첨될 수 있나요?</p>
          <p>서울 인기 단지는 60~70점 이상이 필요한 경우도 있고, 비인기 지역은 40점대도 당첨될 수 있습니다. 단지마다 커트라인이 다릅니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 가점제와 추첨제의 차이는?</p>
          <p>가점제는 점수 순으로 당첨자를 결정하고, 추첨제는 무작위로 선정합니다. 보통 공공분양은 가점제 비율이 높고, 민간분양은 혼합 방식입니다.</p>
        </div>
      </section>

      <RelatedCalculators />

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
