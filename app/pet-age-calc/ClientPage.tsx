"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const DOG_SIZES = [
  { label: "소형견 (10kg 미만)", extraPerYear: 4 },
  { label: "중형견 (10~25kg)", extraPerYear: 5 },
  { label: "대형견 (25kg 초과)", extraPerYear: 6 },
];

function calcDogAge(years: number, sizeIdx: number): number {
  if (years <= 0) return 0;
  if (years === 1) return 15;
  if (years === 2) return 24;
  return 24 + (years - 2) * DOG_SIZES[sizeIdx].extraPerYear;
}

function calcCatAge(years: number): number {
  if (years <= 0) return 0;
  if (years === 1) return 15;
  if (years === 2) return 24;
  return 24 + (years - 2) * 4;
}

function getLifeStage(humanAge: number): { label: string; color: string } {
  if (humanAge < 18) return { label: "유년기·청소년기", color: "text-green-600" };
  if (humanAge < 40) return { label: "성년기", color: "text-blue-600" };
  if (humanAge < 60) return { label: "중년기", color: "text-yellow-600" };
  return { label: "노년기", color: "text-orange-600" };
}

export default function ClientPage() {
  const [petType, setPetType] = useState<"dog" | "cat">("dog");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [age, setAge] = useState(3);

  const r = useMemo(() => {
    const humanAge = petType === "dog" ? calcDogAge(age, sizeIdx) : calcCatAge(age);
    const stage = getLifeStage(humanAge);

    const milestones = [];
    for (let y = 1; y <= Math.max(age + 3, 15); y++) {
      const ha = petType === "dog" ? calcDogAge(y, sizeIdx) : calcCatAge(y);
      milestones.push({ petYear: y, humanAge: ha });
    }

    return { humanAge, stage, milestones };
  }, [petType, sizeIdx, age]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">반려동물 나이 계산기</h1>
      <p className="text-gray-600 mb-6">
        반려동물의 나이를 사람 나이로 환산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">정보 입력</h2>

        {/* 동물 선택 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">동물 종류</label>
          <div className="flex gap-3">
            {(["dog", "cat"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setPetType(type)}
                className={`flex-1 py-3 rounded-lg border-2 text-sm font-bold transition-colors ${
                  petType === type
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {type === "dog" ? "🐶 개" : "🐱 고양이"}
              </button>
            ))}
          </div>
        </div>

        {/* 크기 (개만) */}
        {petType === "dog" && (
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-2">체급</label>
            <div className="flex flex-col gap-2">
              {DOG_SIZES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSizeIdx(i)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border-2 text-left transition-colors ${
                    sizeIdx === i
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className={`text-sm font-bold ${sizeIdx === i ? "text-blue-700" : "text-gray-700"}`}>
                    {s.label}
                  </span>
                  <span className={`text-xs ${sizeIdx === i ? "text-blue-500" : "text-gray-400"}`}>
                    3세 이후 +{s.extraPerYear}년/년
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 나이 */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">반려동물 나이 (세)</label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={1} max={30} value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              onBlur={(e) => setAge(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
              className="w-full border p-2 rounded"
            />
            <span className="text-sm text-gray-500 shrink-0">세</span>
          </div>
        </div>
      </section>

      {/* 결과 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <p className="text-sm text-gray-500 mb-1">사람 나이 환산</p>
        <p className="text-5xl font-bold text-blue-600 mb-1">
          {r.humanAge}<span className="text-2xl font-normal text-gray-500 ml-1">세</span>
        </p>
        <p className={`text-sm font-bold mt-1 ${r.stage.color}`}>{r.stage.label}</p>
        <p className="text-xs text-gray-400 mt-2">
          {petType === "dog" ? DOG_SIZES[sizeIdx].label : "고양이"} · {age}세 기준
        </p>
      </section>

      {/* 나이 환산표 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">나이별 환산표</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 border-b font-bold">반려동물 나이</th>
                <th className="text-right p-2 border-b font-bold">사람 나이</th>
                <th className="text-right p-2 border-b font-bold">생애 단계</th>
              </tr>
            </thead>
            <tbody>
              {r.milestones.map((m) => (
                <tr
                  key={m.petYear}
                  className={`border-b last:border-b-0 ${m.petYear === age ? "bg-blue-50 font-bold" : ""}`}
                >
                  <td className="p-2">{m.petYear}세</td>
                  <td className="text-right p-2 text-blue-600">{m.humanAge}세</td>
                  <td className={`text-right p-2 text-xs ${getLifeStage(m.humanAge).color}`}>
                    {getLifeStage(m.humanAge).label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">반려동물 나이 환산 방법</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          개·고양이 공통: 1세 = 사람 15세, 2세 = 사람 24세<br />
          개 3세~: +4년(소형) / +5년(중형) / +6년(대형) per 1세<br />
          고양이 3세~: +4년 per 1세
        </div>
        <p className="mb-3">
          반려동물은 성장 초기에 매우 빠르게 발달합니다. 1살 때 이미 사람의 15세에 해당하는 성숙도에 도달하고,
          2살이 되면 사람의 24세 수준이 됩니다.
        </p>
        <p>
          대형견은 소형견에 비해 노화가 빨라 수명이 짧습니다. 같은 나이라도 대형견이 더 노령에 해당합니다.
          이 계산기는 일반적인 환산 공식을 사용하며 개체마다 차이가 있을 수 있습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 1세 = 7인간년이라는 공식은 맞나요?</p>
          <p>오래된 공식이지만 정확하지 않습니다. 개와 고양이는 초기 성장이 매우 빨라 1세에 이미 사람의 15세 수준이고, 이후에는 4~6년씩 증가합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 반려동물의 평균 수명은?</p>
          <p>소형견은 12~16년, 중형견은 10~14년, 대형견은 8~12년, 고양이는 12~18년이 일반적입니다. 품종과 생활 환경에 따라 차이가 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 반려동물의 노령 기준은?</p>
          <p>소형견·고양이는 8~9세부터, 중형견은 7~8세부터, 대형견은 6~7세부터 노령으로 분류합니다. 이 시기부터 건강 검진을 6개월마다 받는 것을 권장합니다.</p>
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
