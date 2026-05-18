"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import RelatedCalculators from "../components/RelatedCalculators";

export default function ClientPage() {
  const [buyPrice, setBuyPrice] = useState(50000000);
  const [quantity, setQuantity] = useState(0.1);
  const [currentPrice, setCurrentPrice] = useState(55000000);
  const [feeRate, setFeeRate] = useState(0.05);
  const [targetPrice, setTargetPrice] = useState(70000000);
  const [stopLossRate, setStopLossRate] = useState(10);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const result = useMemo(() => {
    const investment = buyPrice * quantity;
    const buyFee = investment * feeRate / 100;
    const currentValue = currentPrice * quantity;
    const sellFee = currentValue * feeRate / 100;
    const profitBeforeFee = currentValue - investment;
    const profitAfterFee = currentValue - investment - buyFee - sellFee;
    const roiBeforeFee = investment > 0 ? (profitBeforeFee / investment * 100) : 0;
    const roiAfterFee = investment > 0 ? (profitAfterFee / investment * 100) : 0;

    const targetValue = targetPrice * quantity;
    const targetSellFee = targetValue * feeRate / 100;
    const targetProfit = targetValue - investment - buyFee - targetSellFee;
    const targetRoi = investment > 0 ? (targetProfit / investment * 100) : 0;

    const stopLossPrice = buyPrice * (1 - stopLossRate / 100);
    const stopLossValue = stopLossPrice * quantity;
    const stopLossSellFee = stopLossValue * feeRate / 100;
    const stopLossAmount = stopLossValue - investment - buyFee - stopLossSellFee;

    return {
      investment, buyFee, currentValue, sellFee,
      profitBeforeFee, profitAfterFee,
      roiBeforeFee: roiBeforeFee.toFixed(2),
      roiAfterFee: roiAfterFee.toFixed(2),
      targetProfit, targetRoi: targetRoi.toFixed(2),
      stopLossPrice, stopLossAmount, stopLossAmount_abs: Math.abs(stopLossAmount),
    };
  }, [buyPrice, quantity, currentPrice, feeRate, targetPrice, stopLossRate]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">가상화폐 수익 계산기</h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        매수가격·매수수량·현재가격을 입력하면 투자원금·현재가치·수익/손실액·수익률을 자동으로 계산합니다.
        목표가와 손절가를 설정하면 목표 수익률과 손절 시 손실금액도 함께 확인할 수 있습니다.
        거래소 수수료(매수·매도)를 반영한 순수익을 계산하여 실제 투자 성과를 정확하게 파악하세요.
      </p>

      <section className="border rounded-lg p-4 mb-5">
        <h2 className="text-base font-bold mb-4">입력</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매수가격 (원/개)</label>
            <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매수수량</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={0.001} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">현재가격 (원/개)</label>
            <input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">거래소 수수료율 (%)</label>
            <input type="number" value={feeRate} onChange={(e) => setFeeRate(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={0.01} />
            <p className="text-xs text-gray-500 mt-1">업비트: 0.05%, 빗썸: 0.04% (매수·매도 각각 부과)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">목표가 (원/개)</label>
            <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} step={100000} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">손절 허용 손실률 (%)</label>
            <input type="number" value={stopLossRate} onChange={(e) => setStopLossRate(Number(e.target.value))} className="w-full border rounded-lg p-2 text-sm" min={0} max={100} step={1} />
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5 mb-8">
        <h2 className="text-base font-bold mb-3 text-blue-800">계산 결과</h2>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">투자원금 (수수료 제외)</span>
            <span className="font-bold">{fmt(Math.round(result.investment))}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">현재 평가가치</span>
            <span className="font-bold">{fmt(Math.round(result.currentValue))}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">수익/손실 (수수료 전)</span>
            <span className={`font-bold ${result.profitBeforeFee >= 0 ? "text-green-600" : "text-red-600"}`}>
              {result.profitBeforeFee >= 0 ? "+" : ""}{fmt(Math.round(result.profitBeforeFee))}원 ({result.roiBeforeFee}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">수익/손실 (수수료 후)</span>
            <span className={`font-bold ${result.profitAfterFee >= 0 ? "text-green-600" : "text-red-600"}`}>
              {result.profitAfterFee >= 0 ? "+" : ""}{fmt(Math.round(result.profitAfterFee))}원 ({result.roiAfterFee}%)
            </span>
          </div>
          <hr className="border-blue-200" />
          <div className="flex justify-between">
            <span className="text-gray-600">목표가 달성 시 수익 (수수료 후)</span>
            <span className="font-bold text-green-700">
              +{fmt(Math.round(result.targetProfit))}원 ({result.targetRoi}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">손절가 ({stopLossRate}% 손실)</span>
            <span className="font-bold text-orange-600">{fmt(Math.round(result.stopLossPrice))}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">손절 시 손실액 (수수료 후)</span>
            <span className="font-bold text-red-600">-{fmt(Math.round(result.stopLossAmount_abs))}원</span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">가상화폐 투자 수익률 계산 방법</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          가상화폐 투자 수익률은 (현재가치 - 투자원금) ÷ 투자원금 × 100으로 계산합니다. 실제 수익을 정확하게 파악하려면 매수·매도 시 발생하는 거래소 수수료를 모두 반영해야 합니다.
          업비트·빗썸 등 국내 거래소의 수수료는 거래 금액의 0.04~0.05%이며, 매수와 매도 각각 적용됩니다. 소액 투자에서는 수수료 비중이 크지 않지만 잦은 단기 매매 시 수수료가 수익을 크게 잠식할 수 있습니다.
          목표가와 손절가를 미리 설정하고 규칙에 따라 투자하면 감정적 의사결정을 예방하고 리스크를 체계적으로 관리할 수 있습니다.
          가상화폐는 변동성이 매우 높아 단기간에 큰 손익이 발생할 수 있으므로, 투자 전 충분한 공부와 분산 투자가 필수적입니다.
        </p>
      </section>

      <section className="mb-8 bg-gray-50 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">가상화폐 투자 리스크 관리 전략</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          가상화폐 투자에서 가장 중요한 것은 손실 허용 한도를 미리 정하고 지키는 것입니다. 일반적으로 전체 포트폴리오의 5~10% 이내에서 가상화폐에 투자하는 것이 권장됩니다.
          손절가(스탑로스)를 매수 직후에 설정하고 감정에 흔들리지 않고 기계적으로 실행하는 것이 장기적으로 유리합니다.
          분할 매수(DCA, Dollar Cost Averaging) 전략은 한 번에 전액 투자하지 않고 정기적으로 나눠 투자하여 평균 매수단가를 낮추는 방법으로, 변동성이 높은 가상화폐에 효과적입니다.
          비트코인·이더리움 등 시가총액 상위 코인은 상대적으로 변동성이 낮고 유동성이 높아 투자 리스크가 적습니다.
          가상화폐 투자 수익은 기타소득 또는 금융투자소득으로 과세되므로 세금 계획도 함께 수립하세요.
          투자 전 프로젝트의 기술력, 팀, 로드맵, 커뮤니티 등 펀더멘털을 충분히 분석하는 것이 중요합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
        {[
          { q: "가상화폐 수익에 세금이 부과되나요?", a: "네, 국내에서는 가상화폐 매매 수익이 기타소득으로 과세됩니다. 연간 250만 원 초과 수익에 대해 22%(지방소득세 포함)의 세율로 신고·납부해야 합니다. 2025년 이후 시행 예정인 금융투자소득세와 통합될 가능성도 있으므로 최신 세법을 확인하세요." },
          { q: "손절가는 어떻게 설정하는 것이 좋나요?", a: "일반적으로 매수가의 5~15% 하락 시 손절하는 전략이 많이 사용됩니다. 변동성이 큰 가상화폐는 일시적 하락이 크므로 너무 좁은 손절가 설정은 불필요한 손절을 유발합니다. 개인의 리스크 허용 범위와 투자 기간에 맞게 설정하세요." },
          { q: "레버리지 거래(선물)의 수수료 계산은 어떻게 다른가요?", a: "레버리지 거래는 기본 수수료 외에 포지션 유지 수수료(펀딩비)가 추가로 발생합니다. 레버리지가 높을수록 청산 위험이 크고 수수료 부담도 늘어납니다. 이 계산기는 현물 거래 기준이므로 레버리지 거래는 별도 계산이 필요합니다." },
          { q: "여러 번 나눠서 매수한 경우 평균단가는 어떻게 계산하나요?", a: "평균단가 = 총 투자금액 ÷ 총 수량입니다. 예를 들어 100만 원에 0.02개, 80만 원에 0.03개를 샀다면 평균단가 = (100만+80만×... 실제 총금액) ÷ 총수량으로 계산합니다. 이 계산기에 평균단가를 매수가로 입력하면 됩니다." },
          { q: "가상화폐 투자로 손실이 발생했을 때 세금 공제가 되나요?", a: "가상화폐 투자 손실은 같은 과세 기간 내 다른 가상화폐 수익과 상계할 수 있습니다. 단, 주식·부동산 등 다른 자산의 손익과는 상계가 불가합니다. 정확한 세금 처리를 위해 모든 거래 내역을 기록·보관하세요." },
          { q: "거래소별 수수료 차이는 얼마나 되나요?", a: "국내 주요 거래소 기준으로 업비트는 0.05%, 빗썸은 레벨에 따라 0.04~0.10%입니다. 해외 거래소인 바이낸스는 0.1% (BNB 결제 시 0.075%)입니다. 잦은 매매 시 수수료가 누적되므로 수수료가 낮은 거래소를 선택하는 것이 유리합니다." },
        ].map((faq) => (
          <details key={faq.q} className="mb-3 border rounded-lg">
            <summary className="p-4 cursor-pointer font-medium text-gray-700">{faq.q}</summary>
            <p className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</p>
          </details>
        ))}
      </section>

      <RelatedCalculators current="/crypto-calc" />

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
