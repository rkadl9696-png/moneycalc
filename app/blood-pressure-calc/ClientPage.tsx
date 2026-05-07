"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

type BpGrade = {
  label: string;
  color: string;
  bg: string;
  advice: string;
};

function getBpGrade(systolic: number, diastolic: number): BpGrade {
  if (systolic >= 160 || diastolic >= 100)
    return { label: "고혈압 2기", color: "text-red-600", bg: "bg-red-50", advice: "즉시 의사와 상담하고 혈압약 복용 여부를 확인하세요." };
  if (systolic >= 140 || diastolic >= 90)
    return { label: "고혈압 1기", color: "text-orange-600", bg: "bg-orange-50", advice: "생활 습관 개선과 함께 의사 진료를 받으세요." };
  if (systolic >= 130 || diastolic >= 80)
    return { label: "고혈압 전단계", color: "text-yellow-600", bg: "bg-yellow-50", advice: "식이 조절, 운동, 금연 등 생활 습관 개선이 필요합니다." };
  if (systolic >= 120 && diastolic < 80)
    return { label: "주의혈압", color: "text-blue-600", bg: "bg-blue-50", advice: "정기적으로 혈압을 모니터링하고 건강한 생활 습관을 유지하세요." };
  return { label: "정상", color: "text-green-600", bg: "bg-green-50", advice: "건강한 혈압을 유지하고 있습니다. 규칙적인 측정을 권장합니다." };
}

export default function ClientPage() {
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [age, setAge] = useState(40);
  const [measurements, setMeasurements] = useState(1);

  const [sys2, setSys2] = useState(120);
  const [dia2, setDia2] = useState(80);
  const [sys3, setSys3] = useState(120);
  const [dia3, setDia3] = useState(80);

  const r = useMemo(() => {
    let avgSys = systolic;
    let avgDia = diastolic;
    if (measurements === 2) {
      avgSys = (systolic + sys2) / 2;
      avgDia = (diastolic + dia2) / 2;
    } else if (measurements === 3) {
      avgSys = (systolic + sys2 + sys3) / 3;
      avgDia = (diastolic + dia2 + dia3) / 3;
    }
    const grade = getBpGrade(Math.round(avgSys), Math.round(avgDia));
    const pulsePressure = avgSys - avgDia;
    const map = avgDia + pulsePressure / 3;
    return { avgSys, avgDia, grade, pulsePressure, map };
  }, [systolic, diastolic, age, measurements, sys2, dia2, sys3, dia3]);

  const inputClass = "w-full border rounded p-2 text-right";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">❤️ 혈압 계산기</h1>
      <p className="text-gray-600 mb-6">수축기·이완기 혈압을 입력하면 대한고혈압학회 기준으로 혈압 단계를 판정하고 맥압과 평균동맥압을 계산합니다.</p>

      {/* 입력 섹션 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">혈압 정보 입력</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">나이</label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={120} value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                onBlur={(e) => setAge(Math.min(120, Math.max(1, Number(e.target.value) || 40)))}
                className={inputClass} />
              <span className="text-sm text-gray-500 shrink-0">세</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">측정 횟수</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <button key={n} onClick={() => setMeasurements(n)}
                  className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${measurements === n ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                  {n}회
                </button>
              ))}
            </div>
          </div>
        </div>

        {[1, 2, 3].slice(0, measurements).map((i) => {
          const sysVal = i === 1 ? systolic : i === 2 ? sys2 : sys3;
          const diaVal = i === 1 ? diastolic : i === 2 ? dia2 : dia3;
          const setSys = i === 1 ? setSystolic : i === 2 ? setSys2 : setSys3;
          const setDia = i === 1 ? setDiastolic : i === 2 ? setDia2 : setDia3;
          return (
            <div key={i} className="mb-3">
              {measurements > 1 && <p className="text-sm font-medium text-gray-600 mb-2">{i}회 측정</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">수축기 혈압 (mmHg)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={60} max={250} value={sysVal}
                      onChange={(e) => setSys(Number(e.target.value))}
                      onBlur={(e) => setSys(Math.min(250, Math.max(60, Number(e.target.value) || 120)))}
                      className={inputClass} />
                    <span className="text-sm text-gray-500 shrink-0">mmHg</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">이완기 혈압 (mmHg)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={40} max={150} value={diaVal}
                      onChange={(e) => setDia(Number(e.target.value))}
                      onBlur={(e) => setDia(Math.min(150, Math.max(40, Number(e.target.value) || 80)))}
                      className={inputClass} />
                    <span className="text-sm text-gray-500 shrink-0">mmHg</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 결과 섹션 */}
      <section className={`rounded-lg p-5 mb-8 ${r.grade.bg}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">{measurements > 1 ? "평균 혈압" : "혈압"}</p>
            <p className={`text-3xl font-bold ${r.grade.color}`}>
              {r.avgSys.toFixed(0)} / {r.avgDia.toFixed(0)}
            </p>
            <p className="text-sm text-gray-500">mmHg (수축기 / 이완기)</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">판정</p>
            <p className={`text-2xl font-bold ${r.grade.color}`}>{r.grade.label}</p>
          </div>
        </div>
        <p className={`text-sm font-medium ${r.grade.color} mb-4`}>{r.grade.advice}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-500 mb-1">맥압 (Pulse Pressure)</p>
            <p className="text-xl font-bold text-gray-800">{r.pulsePressure.toFixed(1)} <span className="text-sm font-normal">mmHg</span></p>
            <p className="text-xs text-gray-400 mt-1">정상 범위: 30~50 mmHg</p>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-500 mb-1">평균동맥압 (MAP)</p>
            <p className="text-xl font-bold text-gray-800">{r.map.toFixed(1)} <span className="text-sm font-normal">mmHg</span></p>
            <p className="text-xs text-gray-400 mt-1">정상 범위: 70~100 mmHg</p>
          </div>
        </div>
      </section>

      {/* 판정 기준표 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">대한고혈압학회 혈압 분류 기준</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b">분류</th>
                <th className="text-center p-3 border-b">수축기 (mmHg)</th>
                <th className="text-center p-3 border-b">이완기 (mmHg)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "정상", sys: "120 미만", dia: "80 미만", color: "text-green-600" },
                { label: "주의혈압", sys: "120~129", dia: "80 미만", color: "text-blue-600" },
                { label: "고혈압 전단계", sys: "130~139", dia: "80~89", color: "text-yellow-600" },
                { label: "고혈압 1기", sys: "140~159", dia: "90~99", color: "text-orange-600" },
                { label: "고혈압 2기", sys: "160 이상", dia: "100 이상", color: "text-red-600" },
              ].map((row) => (
                <tr key={row.label} className={`border-b last:border-b-0 ${r.grade.label === row.label ? "bg-gray-50 font-bold" : ""}`}>
                  <td className={`p-3 font-medium ${row.color}`}>{row.label}</td>
                  <td className="text-center p-3">{row.sys}</td>
                  <td className="text-center p-3">{row.dia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">* 대한고혈압학회 2022년 가이드라인 기준. 수축기/이완기 중 높은 단계로 판정합니다.</p>
      </section>

      {/* 설명 섹션1 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">혈압이란?</h2>
        <p className="mb-3 text-gray-700">
          혈압(血壓)은 심장이 혈액을 전신에 내보낼 때 혈관 벽에 가해지는 압력을 말합니다. 수축기 혈압(최고혈압)은 심장이 수축하여 혈액을 내보낼 때의 압력이고, 이완기 혈압(최저혈압)은 심장이 이완되어 혈액을 채울 때의 압력입니다. 혈압은 mmHg(수은주 밀리미터) 단위로 표시하며, 수축기/이완기 형식으로 기록합니다.
        </p>
        <p className="text-gray-700">
          정확한 혈압 측정을 위해서는 최소 5분 이상 안정을 취한 후 측정해야 하며, 커피나 담배는 30분 전부터 삼가야 합니다. 양쪽 팔에서 측정하여 높은 쪽 수치를 기준으로 삼고, 2~3회 측정한 평균값을 사용하는 것이 정확합니다. 이 계산기는 대한고혈압학회 2022년 진료 지침을 기준으로 혈압을 분류합니다.
        </p>
      </section>

      {/* 설명 섹션2 SEO */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">맥압과 평균동맥압이란?</h2>
        <p className="mb-3 text-gray-700">
          맥압(Pulse Pressure)은 수축기 혈압에서 이완기 혈압을 뺀 값으로, 정상 범위는 30~50 mmHg입니다. 맥압이 60 mmHg 이상으로 넓어지면 동맥 경직의 신호일 수 있으며, 심혈관 질환 위험이 높아집니다. 특히 노년층에서 수축기 혈압은 높고 이완기 혈압은 낮은 경우 넓은 맥압이 나타나며, 이는 독립적인 심혈관 위험 인자로 알려져 있습니다.
        </p>
        <p className="mb-3 text-gray-700">
          평균동맥압(MAP, Mean Arterial Pressure)은 한 심박 동안의 평균 혈압을 나타내며, 이완기 혈압에 맥압의 1/3을 더해 계산합니다(MAP = 이완기 + (수축기 - 이완기) / 3). 정상 범위는 70~100 mmHg로, 이 값이 조직과 장기에 산소와 영양분이 충분히 공급되는지를 판단하는 지표로 활용됩니다. 60 mmHg 미만이면 중요 장기에 관류 부전이 발생할 수 있습니다.
        </p>
        <p className="text-gray-700">
          고혈압은 대부분 증상이 없어 '침묵의 살인자'라고 불립니다. 정기적인 혈압 측정과 함께 저염식 식사, 규칙적인 운동, 금연, 절주, 체중 관리를 통해 혈압을 조절하세요. 가정 혈압계로 아침·저녁 측정하는 습관이 고혈압 관리에 매우 효과적입니다.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "혈압은 언제 측정하는 것이 좋나요?", a: "아침 기상 후 1시간 이내(소변 후, 식사·복약 전)와 저녁 취침 전에 측정하는 것이 좋습니다. 각 시간대에 1~2분 간격으로 2회 측정해 평균값을 사용합니다." },
          { q: "한쪽 팔과 다른 쪽 팔의 혈압이 다른 이유는?", a: "양팔 혈압 차이가 10 mmHg 이상이면 동맥 협착이나 심혈관 질환의 가능성이 있습니다. 대개는 우세 팔(주로 오른팔)이 5~10 mmHg 정도 높게 나오는 것이 정상입니다." },
          { q: "고혈압 전단계인데 약을 먹어야 하나요?", a: "고혈압 전단계(130~139/80~89)는 약보다 생활 습관 개선이 우선입니다. 저염식, 규칙적 운동, 체중 감량, 금연, 절주만으로도 수축기 혈압을 5~10 mmHg 낮출 수 있습니다." },
          { q: "백의 고혈압이란 무엇인가요?", a: "병원에서만 혈압이 높고 가정에서는 정상인 경우를 백의 고혈압이라 합니다. 반대로 병원에서는 정상이지만 가정에서 높은 경우를 가면 고혈압이라 하며, 가면 고혈압은 심혈관 위험이 더 높습니다." },
          { q: "혈압약은 한번 먹으면 평생 먹어야 하나요?", a: "반드시 그렇지는 않습니다. 생활 습관 개선으로 혈압이 충분히 낮아지면 의사 판단하에 감량하거나 중단할 수 있습니다. 그러나 임의로 중단하면 혈압이 급격히 오를 수 있으니 반드시 의사와 상담하세요." },
          { q: "혈압 낮추는 데 효과적인 생활 습관은?", a: "하루 소금 섭취를 6g 이하로 줄이기, 일주일에 150분 이상의 유산소 운동, 금연, 하루 알코올 남성 2잔·여성 1잔 이하, 적정 체중 유지(BMI 25 미만), 스트레스 관리가 대표적인 방법입니다." },
        ].map((item) => (
          <div key={item.q} className="mb-4 border-b pb-4 last:border-b-0">
            <p className="font-bold text-gray-800 mb-1">Q. {item.q}</p>
            <p className="text-gray-600 text-sm">{item.a}</p>
          </div>
        ))}
      </section>

      <RelatedCalculators current="/blood-pressure-calc" />

      <div className="mt-10 text-center">
        <Link scroll={false}
          href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700">계산기 목록으로 돌아가기</Link>
      </div>
    </div>
  );
}
