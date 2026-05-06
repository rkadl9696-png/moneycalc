"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

interface Grade {
  label: string;
  color: string;
  bg: string;
  border: string;
  desc: string;
}

function getGrade(hours: number): Grade {
  if (hours <= 2)  return { label: "양호", color: "text-green-600",  bg: "bg-green-50",  border: "border-green-400",  desc: "눈 피로도가 낮은 수준입니다." };
  if (hours <= 4)  return { label: "보통", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-400", desc: "적절한 휴식으로 눈 건강을 유지하세요." };
  if (hours <= 6)  return { label: "주의", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-400", desc: "눈 피로가 누적될 수 있습니다. 휴식을 자주 취하세요." };
  return             { label: "위험", color: "text-red-600",    bg: "bg-red-50",    border: "border-red-400",    desc: "장시간 스크린 사용으로 눈 건강에 악영향이 우려됩니다." };
}

const TIPS = [
  { icon: "🌿", title: "20-20-20 규칙 실천", desc: "20분마다 20초간 6m(20피트) 거리를 바라보세요. 타이머를 설정해두면 잊지 않습니다." },
  { icon: "💡", title: "화면 밝기 조절", desc: "주변 밝기와 화면 밝기를 비슷하게 유지하세요. 어두운 환경에서 밝은 화면은 눈을 더 피로하게 합니다." },
  { icon: "📏", title: "적정 거리 유지", desc: "모니터는 눈에서 50~70cm, 스마트폰은 30~40cm 이상 거리를 유지하세요." },
  { icon: "😊", title: "의식적으로 눈 깜빡이기", desc: "스크린 집중 시 눈 깜빡임이 평소의 1/3로 줄어듭니다. 의식적으로 자주 깜빡이거나 인공눈물을 사용하세요." },
  { icon: "🌙", title: "취침 전 스크린 자제", desc: "취침 1~2시간 전에는 스크린 사용을 줄이세요. 블루라이트가 멜라토닌 분비를 억제해 수면을 방해합니다." },
  { icon: "🥦", title: "눈 건강 영양소 섭취", desc: "루테인(케일, 시금치), 비타민A(당근, 고구마), 오메가3(등푸른 생선)는 눈 건강에 도움을 줍니다." },
];

export default function ClientPage() {
  const [screenHoursStr, setScreenHoursStr] = useState("6");
  const screenHours = Math.min(24, Math.max(0, Number(screenHoursStr) || 0));

  const r = useMemo(() => {
    const screenMinutes = screenHours * 60;
    const restCount     = Math.floor(screenMinutes / 20);
    const restSeconds   = restCount * 20;
    const restMinutes   = Math.round(restSeconds / 60);
    const grade         = getGrade(screenHours);

    // 권장 휴식 포함 총 소요 시간
    const totalMinutes = screenMinutes + restMinutes;
    const totalHours   = Math.floor(totalMinutes / 60);
    const totalMins    = totalMinutes % 60;

    return { screenMinutes, restCount, restSeconds, restMinutes, grade, totalHours, totalMins };
  }, [screenHours]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">눈 건강 휴식 계산기</h1>
      <p className="text-gray-600 mb-6">
        하루 스크린 사용 시간을 입력하면 20-20-20 규칙에 따른 눈 휴식 횟수와 눈 피로도를 계산합니다.
      </p>

      {/* 입력 */}
      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">하루 스크린 사용 시간</h2>

        <div className="flex items-center gap-3 mb-4">
          <input
            type="number" min={0} max={24} value={screenHoursStr}
            onChange={(e) => setScreenHoursStr(e.target.value)}
            onBlur={(e) => setScreenHoursStr(String(Math.min(24, Math.max(0, Number(e.target.value) || 0))))}
            className="w-32 border p-2 rounded text-lg text-center font-bold"
          />
          <span className="text-gray-600 font-medium">시간 / 일</span>
        </div>

        {/* 슬라이더 */}
        <input
          type="range" min={0} max={16} step={0.5} value={screenHours}
          onChange={(e) => setScreenHoursStr(e.target.value)}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0시간</span>
          <span>4시간</span>
          <span>8시간</span>
          <span>12시간</span>
          <span>16시간</span>
        </div>
      </section>

      {/* 결과 */}
      <section className={`rounded-xl border-2 p-5 mb-5 ${r.grade.bg} ${r.grade.border}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-0.5">눈 피로도</p>
            <p className={`text-4xl font-bold ${r.grade.color}`}>{r.grade.label}</p>
            <p className={`text-sm mt-1 ${r.grade.color}`}>{r.grade.desc}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-0.5">스크린 시간</p>
            <p className={`text-3xl font-bold ${r.grade.color}`}>{screenHours}시간</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">필요 휴식 횟수</p>
            <p className={`text-2xl font-bold ${r.grade.color}`}>{r.restCount}회</p>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">총 휴식 시간</p>
            <p className={`text-2xl font-bold ${r.grade.color}`}>{r.restMinutes}분</p>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">휴식 포함 총 시간</p>
            <p className={`text-xl font-bold ${r.grade.color}`}>
              {r.totalHours > 0 ? `${r.totalHours}시간 ` : ""}{r.totalMins > 0 ? `${r.totalMins}분` : ""}
            </p>
          </div>
        </div>
      </section>

      {/* 20-20-20 설명 카드 */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold text-blue-700 mb-3">20-20-20 규칙</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { num: "20", unit: "분",   desc: "스크린 사용 후" },
            { num: "20", unit: "초",   desc: "눈 휴식 시간" },
            { num: "20", unit: "피트", desc: "≈ 6m 거리 바라보기" },
          ].map((item) => (
            <div key={item.unit} className="bg-white rounded-lg p-3 border border-blue-100">
              <p className="text-3xl font-bold text-blue-600">{item.num}</p>
              <p className="text-sm font-bold text-blue-500">{item.unit}</p>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          오늘 기준 <span className="font-bold text-blue-600">{r.restCount}번</span>의 휴식이 필요합니다.
          각 휴식마다 <span className="font-bold text-blue-600">20초</span>씩, 총 <span className="font-bold text-blue-600">{r.restMinutes}분</span>입니다.
        </p>
      </section>

      {/* 피로도 기준표 */}
      <section className="border rounded-lg p-4 mb-8">
        <h2 className="text-base font-bold mb-3">스크린 시간별 눈 피로도 기준</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b font-bold">하루 스크린 시간</th>
                <th className="text-center p-3 border-b font-bold">피로도</th>
                <th className="text-right p-3 border-b font-bold">눈 휴식 횟수</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: "2시간 이하",  label: "양호", color: "text-green-600",  maxH: 2 },
                { range: "2~4시간",     label: "보통", color: "text-yellow-600", maxH: 4 },
                { range: "4~6시간",     label: "주의", color: "text-orange-600", maxH: 6 },
                { range: "6시간 이상",  label: "위험", color: "text-red-600",    maxH: 99 },
              ].map(({ range, label, color, maxH }) => {
                const minH = label === "양호" ? 0 : label === "보통" ? 2 : label === "주의" ? 4 : 6;
                const exH  = Math.min(maxH, minH + (maxH < 99 ? 2 : 4));
                const cnt  = Math.floor(exH * 60 / 20);
                return (
                  <tr key={label} className={`border-b last:border-b-0 ${r.grade.label === label ? "bg-gray-50 font-bold" : ""}`}>
                    <td className="p-3">{range}</td>
                    <td className={`text-center p-3 font-bold ${color}`}>{label}</td>
                    <td className="text-right p-3 text-gray-600">약 {cnt}회 이상</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 눈 건강 팁 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">눈 건강 관리 팁</h2>
        <div className="grid grid-cols-1 gap-3">
          {TIPS.map((tip) => (
            <div key={tip.title} className="flex gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-2xl shrink-0">{tip.icon}</span>
              <div>
                <p className="font-bold text-sm text-gray-800 mb-0.5">{tip.title}</p>
                <p className="text-sm text-gray-500">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">자주 묻는 질문</h2>

        <div className="mb-5">
          <p className="font-bold">Q. 20-20-20 규칙이 실제로 효과가 있나요?</p>
          <p>미국 안과학회(AAO)가 권장하는 방법으로, 장거리 초점을 맞추는 동안 눈 근육이 이완되어 피로가 줄어드는 효과가 있습니다. 완전한 해결책은 아니지만 디지털 눈 피로 완화에 도움이 됩니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 블루라이트 차단 안경이 도움이 되나요?</p>
          <p>블루라이트 차단 안경의 눈 피로 완화 효과는 과학적으로 아직 논란이 있습니다. 다만 취침 전 블루라이트 노출을 줄이면 수면의 질 향상에는 효과가 있다고 알려져 있습니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 어린이에게 스크린 시간 제한이 필요한가요?</p>
          <p>WHO와 대한소아청소년과학회는 2세 미만 화상통화 제외 스크린 금지, 2~5세 1시간 이하, 6세 이상은 적절한 제한을 권장합니다. 성장기 눈은 근시 발전에 특히 취약합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 눈이 자주 충혈되는 이유는?</p>
          <p>눈 깜빡임 감소로 인한 건조증, 과도한 스크린 사용, 수면 부족, 콘택트렌즈 장시간 착용 등이 원인입니다. 인공눈물 사용과 충분한 휴식이 도움이 되며, 지속되면 안과 검진을 권장합니다.</p>
        </div>

        <div className="mb-5">
          <p className="font-bold">Q. 밤에 어두운 곳에서 핸드폰을 보면 왜 더 나쁜가요?</p>
          <p>밝은 화면과 어두운 주변 환경의 대비가 커질수록 눈이 더 많이 조절해야 해 피로가 빠르게 쌓입니다. 또한 블루라이트가 멜라토닌을 억제해 수면 질도 떨어집니다.</p>
        </div>
      </section>

      <RelatedCalculators />

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-bold hover:bg-blue-700"
        >
          계산기 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
