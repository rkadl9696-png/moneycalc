import Link from "next/link";

const categories = [
  {
    label: "🏠 부동산",
    items: [
      { href: "/jeonse-vs-rent", icon: "🏠", title: "전세 vs 월세 계산기", desc: "전세와 월세 중 어떤 선택이 더 유리한지 바로 계산", hot: true },
      { href: "/jeonse-loan-calc", icon: "🔑", title: "전세대출 계산기", desc: "전세대출 월 이자와 총 이자 부담 계산", hot: false },
      { href: "/loan-calc", icon: "💳", title: "대출 상환 계산기", desc: "원리금균등 vs 원금균등, 총 이자 차이 비교", hot: false },
      { href: "/cheongak-calc", icon: "🏢", title: "청약 가점 계산기", desc: "무주택기간·부양가족·통장기간으로 내 청약 점수 계산", hot: false },
      { href: "/capital-gains-calc", icon: "🏡", title: "양도소득세 계산기", desc: "취득가액·양도가액·보유기간으로 양도세 계산", hot: false },
      { href: "/mortgage-calc", icon: "🏠", title: "주택담보대출 계산기", desc: "원리금균등·원금균등 방식별 월 상환액·총 이자 계산", hot: false },
      { href: "/prepayment-calc", icon: "💰", title: "중도상환수수료 계산기", desc: "대출 실행일·상환일 입력으로 중도상환 수수료 계산", hot: false },
    ],
  },
  {
    label: "💰 급여 · 재테크",
    items: [
      { href: "/salary-calc", icon: "💰", title: "연봉 실수령 계산기", desc: "세후 월급이 얼마인지 바로 확인", hot: true },
      { href: "/compound", icon: "📈", title: "복리 계산기", desc: "투자 수익이 얼마나 불어나는지 계산", hot: false },
      { href: "/interest-calc", icon: "🏦", title: "이자 계산기", desc: "예금 이자와 세후 수령액 바로 계산", hot: false },
      { href: "/savings-calc", icon: "🐷", title: "적금 계산기", desc: "매월 납입 시 만기 수령액 계산", hot: false },
      { href: "/exchange-calc", icon: "💱", title: "환율 계산기", desc: "환율 직접 입력으로 원화↔외화 수수료 포함 환전액 계산", hot: false },
      { href: "/stock-calc", icon: "📈", title: "주식 수익률 계산기", desc: "매수가·매도가·수량으로 수수료·세금 포함 순수익 계산", hot: false },
      { href: "/severance-calc", icon: "💼", title: "퇴직금 계산기", desc: "입사일·퇴사일 입력으로 세전·세후 퇴직금 계산", hot: false },
      { href: "/unemployment-calc", icon: "📋", title: "실업급여 계산기", desc: "가입기간·평균임금으로 실업급여 수령액 계산", hot: false },
      { href: "/mincalc", icon: "💵", title: "최저시급 계산기", desc: "2026년 최저시급 기준 시급·일급·주급·월급 계산", hot: false },
      { href: "/weekly-holiday-calc", icon: "📅", title: "주휴수당 계산기", desc: "주당 근로시간 입력으로 주·월 주휴수당 계산", hot: false },
      { href: "/insurance-calc", icon: "🛡️", title: "4대보험 계산기", desc: "월급 입력으로 근로자·사업주 4대보험 공제액 계산", hot: false },
      { href: "/parental-leave-calc", icon: "👶", title: "육아휴직급여 계산기", desc: "통상임금·기간 입력으로 월별 수령액·사후지급금 계산", hot: false },
      { href: "/pension-calc", icon: "🏦", title: "연금 계산기", desc: "월 납입액·수익률로 은퇴 시 총 적립액과 월 수령액 복리 계산", hot: false },
      { href: "/rent-yield-calc", icon: "🏘️", title: "월세 수익률 계산기", desc: "매매가·보증금·월세로 총 수익률·실투자금 수익률·전월세 전환율 계산", hot: false },
      { href: "/realestate-yield-calc", icon: "🏗️", title: "부동산 수익률 계산기", desc: "매수가·매도가·보유기간으로 매매차익·연평균 수익률 계산", hot: false },
      { href: "/electricity-calc", icon: "⚡", title: "전기요금 계산기", desc: "월 사용량(kWh)으로 한국전력 누진제 기준 전기요금 계산", hot: false },
      { href: "/fuel-calc", icon: "⛽", title: "연료비 계산기", desc: "휘발유·경유·LPG·전기 연비와 주행 거리로 연료비 계산", hot: false },
    ],
  },
  {
    label: "💸 세금",
    items: [
      { href: "/gift-tax-calc", icon: "🎁", title: "증여세 계산기", desc: "증여 금액·관계 입력으로 공제 후 납부세액 계산", hot: false },
      { href: "/income-tax-calc", icon: "📊", title: "종합소득세 계산기", desc: "연간 소득과 종류 입력으로 종합소득세 계산", hot: false },
    ],
  },
  {
    label: "🏃 건강",
    items: [
      { href: "/bmi-calc", icon: "⚖️", title: "BMI 계산기", desc: "키·몸무게로 체질량지수와 정상 체중 범위 계산", hot: false },
      { href: "/calorie-calc", icon: "🔥", title: "칼로리 계산기", desc: "성별·나이·활동 수준으로 기초대사량·일일 권장 칼로리 계산", hot: false },
      { href: "/bodyfat-calc", icon: "📏", title: "체지방률 계산기", desc: "미해군 공식으로 허리·목·엉덩이 둘레 측정만으로 체지방률 계산", hot: false },
      { href: "/bmr-calc", icon: "🔋", title: "기초대사량 계산기", desc: "Mifflin-St Jeor 공식으로 BMR·활동 수준별 일일 권장 칼로리 계산", hot: false },
      { href: "/due-date-calc", icon: "🤰", title: "임신 출산 예정일 계산기", desc: "마지막 생리 시작일로 출산 예정일·임신 주수·주요 검사 일정 계산", hot: false },
      { href: "/sleep-calc", icon: "😴", title: "수면 시간 계산기", desc: "취침·기상 시간으로 수면 사이클·권장 기상 시간·수면 부채 계산", hot: false },
      { href: "/water-calc", icon: "💧", title: "적정 음수량 계산기", desc: "몸무게·활동 수준·날씨로 하루 권장 음수량과 시간대별 스케줄 계산", hot: false },
      { href: "/eye-rest-calc", icon: "👁️", title: "눈 건강 휴식 계산기", desc: "20-20-20 규칙 기반 스크린 시간별 눈 휴식 횟수·피로도 계산", hot: false },
      { href: "/blood-pressure-calc", icon: "❤️", title: "혈압 계산기", desc: "수축기·이완기 혈압으로 대한고혈압학회 기준 단계 판정·맥압·평균동맥압 계산", hot: false },
      { href: "/exercise-calc", icon: "🏃", title: "운동 소모 칼로리 계산기", desc: "체중·운동 종류·시간으로 MET 기반 소모 칼로리·지방 연소량 계산", hot: false },
      { href: "/period-calc", icon: "🌸", title: "생리 주기 계산기", desc: "마지막 생리일·주기로 다음 생리 예정일·배란일·가임기 계산", hot: false },
      { href: "/quit-smoking-calc", icon: "🚭", title: "금연 계산기", desc: "금연 시작일·흡연량으로 절약 금액·피우지 않은 담배·되찾은 시간 계산", hot: false },
      { href: "/alcohol-calc", icon: "🍺", title: "음주량 계산기", desc: "음료 종류·용량·잔 수로 순수 알코올량·WHO 위험도·분해 시간 계산", hot: false },
    ],
  },
  {
    label: "🗓️ 생활",
    items: [
      { href: "/age-calc", icon: "🎂", title: "나이 계산기", desc: "생년월일로 만 나이·한국 나이·띠·별자리·다음 생일까지 계산", hot: false },
      { href: "/dday-calc", icon: "📅", title: "D-day 계산기", desc: "목표 날짜까지 D-day 카운트다운 계산", hot: false },
      { href: "/unit-calc", icon: "📐", title: "단위 변환 계산기", desc: "길이·무게·온도·면적·속도 단위 변환", hot: false },
      { href: "/difficulty-calc", icon: "🎯", title: "난이도 계산기", desc: "업무·프로젝트 복잡도·마감·전문성 기반 난이도 지수 계산", hot: false },
      { href: "/parcel-calc", icon: "📦", title: "택배 무게 계산기", desc: "실제 무게·박스 크기로 부피무게·택배 요금 계산", hot: false },
      { href: "/pet-age-calc", icon: "🐾", title: "반려동물 나이 계산기", desc: "개·고양이 나이를 사람 나이로 환산", hot: false },
      { href: "/lotto-calc", icon: "🎰", title: "로또 확률 계산기", desc: "1~5등 당첨 확률과 구매 매수별 기대 당첨 횟수 계산", hot: false },
      { href: "/time-calc", icon: "⏱️", title: "시간 계산기", desc: "두 시간의 차이 계산, 시간 더하기·빼기", hot: false },
    ],
  },
  {
    label: "🛍️ 소비",
    items: [
      { href: "/card-calc", icon: "🎫", title: "카드 할인 계산기", desc: "할인 적용 후 실제 결제 금액 확인", hot: false },
      { href: "/tip-calc", icon: "💵", title: "팁 계산기", desc: "청구 금액·팁 비율·인원 입력으로 팁 금액과 1인당 부담액 계산", hot: false },
      { href: "/installment-calc", icon: "💳", title: "할부 계산기", desc: "구매 금액·할부 개월·이자율로 월 할부금과 총 이자 계산", hot: false },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">🧮 계산기 모음</h1>
          <p className="text-gray-500 text-base">
            금융, 세금, 건강까지
            <br />
            생활에 필요한 모든 계산을 한 번에
          </p>
        </div>

        {/* 카테고리별 카드 */}
        <div className="flex flex-col gap-8">
          {categories.map((category) => (
            <div key={category.label}>
              <h2 className="text-sm font-bold text-gray-400 mb-3 tracking-wide">
                {category.label}
              </h2>
              <div className="flex flex-col gap-3">
                {category.items.map((calc) => (
                  <Link
                    key={calc.href}
                    href={calc.href}
                    className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-400 transition-all"
                  >
                    <div className="text-3xl w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg shrink-0">
                      {calc.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-800">{calc.title}</h3>
                        {calc.hot && (
                          <span className="text-xs bg-red-100 text-red-500 font-bold px-2 py-0.5 rounded-full">
                            🔥 인기
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{calc.desc}</p>
                    </div>
                    <div className="ml-auto text-gray-300 text-xl">›</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 설명 */}
        <p className="text-center text-xs text-gray-400 mt-10">
          계산 결과는 참고용이며 실제와 다를 수 있습니다.
        </p>

      </div>
    </div>
  );
}