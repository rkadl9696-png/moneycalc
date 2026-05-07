"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

const drinks = [
  { label: "맥주", abv: 5, defaultMl: 500 },
  { label: "소주", abv: 16, defaultMl: 360 },
  { label: "막걸리", abv: 6, defaultMl: 750 },
  { label: "와인", abv: 12, defaultMl: 150 },
  { label: "위스키", abv: 40, defaultMl: 50 },
  { label: "사이다/콜라", abv: 0, defaultMl: 250 },
];

function getRisk(alcoholG: number, isMale: boolean): { label: string; color: string; bg: string; advice: string } {
  const threshold1 = isMale ? 40 : 20;
  const threshold2 = isMale ? 60 : 40;
  if (alcoholG <= 0) return { label: "무음주", color: "text-green-600", bg: "bg-green-50", advice: "음주하지 않으셨네요. 건강에 가장 좋습니다." };
  if (alcoholG < threshold1) return { label: "저위험 음주", color: "text-blue-600", bg: "bg-blue-50", advice: "적정 음주 범위입니다. 절제된 음주 습관을 유지하세요." };
  if (alcoholG < threshold2) return { label: "위험 음주", color: "text-yellow-600", bg: "bg-yellow-50", advice: "WHO 권장 기준을 초과합니다. 음주량 조절이 필요합니다." };
  return { label: "고위험 음주", color: "text-red-600", bg: "bg-red-50", advice: "건강에 심각한 위험을 초래할 수 있습니다. 전문가 상담을 권장합니다." };
}

export default function ClientPage() {
  const [selectedDrink, setSelectedDrink] = useState(0);
  const [volume, setVolume] = useState(drinks[0].defaultMl);
  const [glasses, setGlasses] = useState(1);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState(65);

  const handleDrinkSelect = (idx: number) => {
    setSelectedDrink(idx);
    setVolume(drinks[idx].defaultMl);
  };

  const r = useMemo(() => {
    const drink = drinks[selectedDrink];
    const totalVolume = volume * glasses;
    const alcoholG = totalVolume * (drink.abv / 100) * 0.789;
    const isMale = gender === "male";
    const risk = getRisk(alcoholG, isMale);
    const breakdownHours = alcoholG / (weight * 0.1);
    const calories = alcoholG * 7; // 알코올 1g = 7kcal
    return { alcoholG, risk, breakdownHours, calories };
  }, [selectedDrink, volume, glasses, gender, weight]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">🍺 음주량 계산기</h1>
      <p className="text-gray-600 mb-6">음료 종류와 용량을 입력하면 순수 알코올량(g)과 WHO 기준 위험도, 알코올 분해 시간을 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">음주 정보 입력</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">성별</label>
            <div className="flex gap-2">
              <button onClick={() => setGender("male")}
                className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${gender === "male" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                남성
              </button>
              <button onClick={() => setGender("female")}
                className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${gender === "female" ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-700 border-gray-300 hover:border-pink-400"}`}>
                여성
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">체중 (kg)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={30} max={200} value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                onBlur={(e) => setWeight(Math.min(200, Math.max(30, Number(e.target.value) || 65)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">kg</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-2">음료 종류 (도수)</label>
          <div className="grid grid-cols-3 gap-2">
            {drinks.map((d, i) => (
              <button key={d.label} onClick={() => handleDrinkSelect(i)}
                className={`py-2 rounded border text-sm transition-colors ${selectedDrink === i ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                {d.label} {d.abv > 0 ? `(${d.abv}%)` : "(0%)"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">용량 (ml / 잔)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={10} max={2000} value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                onBlur={(e) => setVolume(Math.min(2000, Math.max(10, Number(e.target.value) || 1)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">ml</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">잔 수</label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={30} value={glasses}
                onChange={(e) => setGlasses(Number(e.target.value))}
                onBlur={(e) => setGlasses(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
                className="w-full border rounded p-2 text-right" />
              <span className="text-sm text-gray-500 shrink-0">잔</span>
            </div>
          </div>
        </div>
      </section>

      {/* 결과 섹션 */}
      <section className={`rounded-lg p-5 mb-8 ${r.risk.bg}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">순수 알코올량</p>
            <p className={`text-3xl font-bold ${r.risk.color}`}>{r.alcoholG.toFixed(1)}g</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">위험도 (WHO 기준)</p>
            <p className={`text-2xl font-bold ${r.risk.color}`}>{r.risk.label}</p>
          </div>
        </div>
        <p className={`text-sm font-medium ${r.risk.color} mb-4`}>{r.risk.advice}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-500 mb-1">알코올 분해 시간</p>
            <p className="text-xl font-bold text-gray-800">{r.breakdownHours.toFixed(1)} <span className="text-sm font-normal">시간</span></p>
            <p className="text-xs text-gray-400 mt-1">체중 기반 추정치</p>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-500 mb-1">알코올 칼로리</p>
            <p className="text-xl font-bold text-gray-800">{r.calories.toFixed(0)} <span className="text-sm font-normal">kcal</span></p>
            <p className="text-xs text-gray-400 mt-1">알코올 1g = 7kcal</p>
          </div>
        </div>
      </section>

      {/* WHO 기준표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">WHO 음주 위험 기준</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b">구분</th>
                <th className="text-center p-3 border-b">남성</th>
                <th className="text-center p-3 border-b">여성</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "저위험 음주", male: "40g 미만", female: "20g 미만", color: "text-blue-600" },
                { label: "위험 음주", male: "40~60g", female: "20~40g", color: "text-yellow-600" },
                { label: "고위험 음주", male: "60g 초과", female: "40g 초과", color: "text-red-600" },
              ].map((row) => (
                <tr key={row.label} className="border-b last:border-b-0">
                  <td className={`p-3 font-medium ${row.color}`}>{row.label}</td>
                  <td className="text-center p-3">{row.male}</td>
                  <td className="text-center p-3">{row.female}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">* 순수 알코올(g) = 용량(ml) × 도수(%) × 0.01 × 0.789(알코올 밀도) × 잔 수</p>
      </section>

      {/* 설명1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">알코올 분해 시간이란?</h2>
        <p className="mb-3 text-gray-700">
          알코올 분해 시간은 섭취한 알코올이 간에서 완전히 분해되는 데 걸리는 예상 시간입니다. 일반적으로 알코올 분해 속도는 체중(kg) × 0.1g/시간으로 추정됩니다. 예를 들어 70kg인 사람은 시간당 약 7g의 알코올을 분해할 수 있습니다.
        </p>
        <p className="text-gray-700">
          실제 알코올 분해 속도는 개인의 간 효소 활성도, 성별(여성이 더 느림), 식사 여부(공복 시 흡수 빠름), 나이, 간 건강 상태, 유전적 요인 등에 따라 크게 다릅니다. 이 계산기의 결과는 참고용이며, 음주 운전 여부를 판단하는 데 사용하지 마십시오.
        </p>
      </section>

      {/* 설명2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">음주와 건강에 미치는 영향</h2>
        <p className="mb-3 text-gray-700">
          알코올은 간, 뇌, 심장, 췌장 등 신체 거의 모든 장기에 영향을 미칩니다. 과도한 음주는 간경화, 알코올성 간염, 지방간의 원인이 되며, 장기적으로 간암 위험을 높입니다. 또한 알코올은 여러 종류의 암(구강암, 인후암, 식도암, 간암, 대장암, 유방암)의 위험 인자로 알려져 있습니다.
        </p>
        <p className="mb-3 text-gray-700">
          여성은 남성에 비해 체수분 비율이 낮고 알코올 분해 효소 활성도가 낮아 같은 양을 마셔도 더 높은 혈중 알코올 농도를 보이며 건강 피해도 더 큽니다. 임신 중 음주는 태아알코올스펙트럼장애(FASD)를 일으킬 수 있으므로 임신 중에는 절대 금주해야 합니다.
        </p>
        <p className="text-gray-700">
          음주 후 운전은 혈중알코올농도 0.03% 이상이면 면허 취소 또는 정지 대상입니다. 체중 70kg인 성인 남성이 소주 1잔(50ml, 16%)을 마시면 약 0.02% 정도의 혈중알코올농도가 형성됩니다. 음주 후에는 대중교통을 이용하거나 대리운전을 불러주세요.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "숙취 해소에 가장 효과적인 방법은?", a: "충분한 수분 섭취, 전해질 보충, 충분한 수면이 가장 효과적입니다. 숙취 해소 음료는 일부 증상 완화에 도움이 될 수 있지만 알코올 분해를 빠르게 하지는 않습니다. 커피나 에너지 음료는 오히려 탈수를 악화시킬 수 있습니다." },
          { q: "빈속에 술을 마시면 더 빨리 취하나요?", a: "네, 공복 상태에서 알코올은 소장에서 훨씬 빠르게 흡수되어 혈중알코올농도가 빠르게 상승합니다. 지방이 많은 음식을 먹으면 알코올 흡수 속도를 늦출 수 있습니다." },
          { q: "물과 같이 마시면 덜 취하나요?", a: "물을 마시면 알코올이 희석되어 흡수 속도가 다소 느려질 수 있고, 수분 보충으로 다음날 숙취를 줄이는 데 도움이 됩니다. 그러나 총 알코올 섭취량이 줄지 않으므로 과음을 예방하려면 총 음주량 자체를 줄여야 합니다." },
          { q: "체중이 많을수록 알코올 분해가 빠른가요?", a: "일반적으로 체중이 많으면 체내 수분량이 많아 알코올이 더 많이 희석되므로 혈중알코올농도가 낮아집니다. 그러나 체지방 비율이 높은 경우 실제 분해 속도와 차이가 생길 수 있습니다." },
          { q: "술을 마시면 잠이 잘 온다는데 사실인가요?", a: "알코올은 처음에는 진정 효과가 있어 잠들기 쉽게 하지만, 수면 후반부의 REM 수면을 억제하여 수면의 질을 떨어뜨립니다. 알코올에 의존한 수면은 수면 장애로 이어질 수 있습니다." },
          { q: "알코올 중독인지 어떻게 알 수 있나요?", a: "음주 조절이 안 되거나, 음주를 줄이려 했지만 실패하거나, 음주 때문에 일상생활·직장·가정에 문제가 생기거나, 술이 없으면 불안·손 떨림 등 금단 증상이 나타나면 알코올 사용 장애를 의심해야 합니다. 정신건강 전문가의 도움을 받으세요." },
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
