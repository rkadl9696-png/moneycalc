"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const ACTIVITY_LEVELS = [
  { label: "거의 안 움직임",         desc: "사무직·하루 종일 앉아서 생활", multiplier: 1.2 },
  { label: "가벼운 운동 (주 1~3회)", desc: "가벼운 걷기·스트레칭",         multiplier: 1.375 },
  { label: "보통 운동 (주 3~5회)",   desc: "조깅·수영·자전거",             multiplier: 1.55 },
  { label: "강한 운동 (주 6~7회)",   desc: "고강도 운동·육체노동",         multiplier: 1.725 },
  { label: "매우 강한 운동",         desc: "하루 2회 운동·운동선수",       multiplier: 1.9 },
];

export default function ClientPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge]       = useState(30);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);

  const r = useMemo(() => {
    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    return {
      bmr: Math.round(bmr),
      levels: ACTIVITY_LEVELS.map((a) => {
        const tdee = Math.round(bmr * a.multiplier);
        return {
          ...a,
          tdee,
          loss: tdee - 500,
          gain: tdee + 500,
        };
      }),
    };
  }, [gender, age, height, weight]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">기초대사량 계산기</h1>
      <p className="text-gray-600 mb-6">
        Mifflin-St Jeor 공식으로 기초대사량(BMR)을 계산하고, 활동 수준별 일일 권장 칼로리를 확인합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">신체 정보 입력</h2>

        {/* 성별 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">성별</label>
          <div className="flex gap-3">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-2 rounded-lg border-2 font-bold text-sm transition-colors ${
                  gender === g
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {g === "male" ? "남성" : "여성"}
              </button>
            ))}
          </div>
        </div>

        {/* 나이·키·몸무게 */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-500 mb-1">나이</label>
            <div className="flex items-center gap-1">
              <input
                type="number" min={10} max={100} value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                onBlur={(e) => setAge(Math.min(100, Math.max(10, Number(e.target.value) || 10)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">세</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">키</label>
            <div className="flex items-center gap-1">
              <input
                type="number" min={100} max={250} value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                onBlur={(e) => setHeight(Math.min(250, Math.max(100, Number(e.target.value) || 100)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">cm</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">몸무게</label>
            <div className="flex items-center gap-1">
              <input
                type="number" min={20} max={300} value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                onBlur={(e) => setWeight(Math.min(300, Math.max(20, Number(e.target.value) || 20)))}
                className="w-full border p-2 rounded"
              />
              <span className="text-sm text-gray-500 shrink-0">kg</span>
            </div>
          </div>
        </div>
      </section>

      {/* BMR 결과 */}
      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-5">
        <p className="text-sm text-gray-500 mb-1">기초대사량 (BMR)</p>
        <p className="text-4xl font-bold text-blue-600">
          {r.bmr.toLocaleString()}
          <span className="text-xl font-normal text-gray-500 ml-1">kcal/일</span>
        </p>
        <p className="text-xs text-gray-400 mt-2">아무것도 하지 않아도 하루에 소비되는 최소 에너지</p>
      </section>

      {/* 활동 수준별 표 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">활동 수준별 일일 권장 칼로리</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">활동 수준</th>
                <th className="text-right p-3 border-b font-bold text-blue-600">감량</th>
                <th className="text-right p-3 border-b font-bold text-green-600">유지</th>
                <th className="text-right p-3 border-b font-bold text-red-500">증량</th>
              </tr>
            </thead>
            <tbody>
              {r.levels.map((lv) => (
                <tr key={lv.label} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-3">
                    <p className="font-medium text-gray-800">{lv.label}</p>
                    <p className="text-xs text-gray-400">{lv.desc}</p>
                  </td>
                  <td className="text-right p-3 font-bold text-blue-600">{lv.loss.toLocaleString()}</td>
                  <td className="text-right p-3 font-bold text-green-600">{lv.tdee.toLocaleString()}</td>
                  <td className="text-right p-3 font-bold text-red-500">{lv.gain.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="p-3 text-xs text-gray-400" colSpan={4}>단위: kcal/일 · 감량 = TDEE − 500 · 증량 = TDEE + 500</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* 설명 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">기초대사량 계산 공식</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm font-mono leading-relaxed">
          BMR (남) = 10×체중(kg) + 6.25×키(cm) − 5×나이 + 5<br />
          BMR (여) = 10×체중(kg) + 6.25×키(cm) − 5×나이 − 161<br />
          TDEE = BMR × 활동계수
        </div>
        <p className="mb-3">
          Mifflin-St Jeor 공식은 현재 가장 널리 사용되는 BMR 계산 공식입니다.
          TDEE(Total Daily Energy Expenditure)는 BMR에 활동계수를 곱한 하루 총 에너지 소비량입니다.
        </p>
        <p>
          체중 감량 시에는 TDEE보다 하루 500kcal 적게 먹으면 일주일에 약 0.45kg 감량이 가능합니다.
          1,200kcal(여성) / 1,500kcal(남성) 미만으로는 섭취하지 않는 것이 좋습니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. BMR과 TDEE의 차이는?</p>
          <p>BMR은 완전히 쉬는 상태에서 소비되는 칼로리이고, TDEE는 실제 활동량을 반영한 하루 총 소비 칼로리입니다. 다이어트 목표 설정에는 TDEE를 기준으로 합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 나이가 들수록 BMR이 낮아지나요?</p>
          <p>네, 나이가 들수록 근육량이 감소하면서 BMR도 낮아집니다. 저항 운동으로 근육량을 유지하면 기초대사량 저하를 늦출 수 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 다이어트 중에 BMR 아래로 먹으면 안 되나요?</p>
          <p>BMR 미만으로 장기간 섭취하면 기초대사량 자체가 떨어지고 근육이 분해됩니다. 단기간은 가능하지만 지속적인 극저칼로리 식단은 건강에 해롭습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 활동 수준은 어떻게 선택하나요?</p>
          <p>직장 활동과 운동을 합산해서 판단하세요. 사무직이면서 주 3~5회 운동하면 "보통 운동" 수준이 적합합니다. 체중 변화가 없다면 현재 TDEE를 역산할 수도 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 근육이 많으면 BMR이 높아지나요?</p>
          <p>네, 근육은 지방보다 안정 시 에너지 소비가 높습니다. 저항 운동으로 근육량을 늘리면 BMR이 높아져 체중 관리가 유리해집니다.</p>
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
