import Link from "next/link";

export const metadata = {
  title: "이용약관 | 계산기 모음",
  description: "계산기 모음의 이용약관을 안내합니다.",
};

export default function Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors">
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">이용약관</h1>
      <p className="text-sm text-gray-400 mb-8">최종 업데이트: 2026년 1월 1일</p>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">1. 서비스 개요</h2>
        <p className="text-gray-700 leading-relaxed">
          계산기 모음(이하 "본 서비스")은 금융, 세금, 건강 등 다양한 분야의 계산기를
          무료로 제공하는 웹 서비스입니다. 본 서비스를 이용함으로써 아래 약관에 동의하는
          것으로 간주됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">2. 계산 결과의 성격</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
          <p className="font-bold text-yellow-800 mb-1">⚠️ 중요 안내</p>
          <p className="text-yellow-700 text-sm">
            본 서비스의 모든 계산 결과는 <strong>참고용</strong>이며, 법적·재정적·의학적 효력이 없습니다.
          </p>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>계산 결과는 일반적인 공식과 기준을 바탕으로 하며, 실제 상황과 다를 수 있습니다.</li>
          <li>세금, 대출, 보험 등 중요한 재정 결정은 반드시 전문가(세무사, 금융기관 등)와 상담하세요.</li>
          <li>건강 관련 계산 결과는 의료 진단을 대체하지 않습니다. 정확한 진단은 의료기관을 이용하세요.</li>
          <li>법령 개정 등으로 계산 기준이 변경될 수 있으며, 최신 정보와 다를 수 있습니다.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">3. 서비스 이용 조건</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>본 서비스는 만 14세 이상 누구나 무료로 이용할 수 있습니다.</li>
          <li>서비스를 불법적인 목적으로 사용하거나 타인에게 피해를 주는 행위를 금지합니다.</li>
          <li>자동화 수단(크롤러, 봇 등)을 이용한 대량 접근은 허용되지 않습니다.</li>
          <li>서비스 콘텐츠를 무단으로 복제·배포·상업적으로 이용하는 것을 금지합니다.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">4. 면책 조항</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>본 서비스는 계산 결과의 정확성을 보장하지 않으며, 이로 인한 손해에 대해 책임을 지지 않습니다.</li>
          <li>서버 점검, 기술적 오류 등으로 서비스가 일시 중단될 수 있습니다.</li>
          <li>외부 링크(Google, 정부 기관 등)의 내용에 대해 책임을 지지 않습니다.</li>
          <li>이용자가 계산 결과를 근거로 내린 결정에 대한 책임은 이용자 본인에게 있습니다.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">5. 광고</h2>
        <p className="text-gray-700 leading-relaxed">
          본 서비스는 Google AdSense를 통해 광고를 게재할 수 있습니다.
          광고 내용은 Google의 알고리즘에 의해 결정되며, 본 서비스는 광고 내용에 대한
          책임을 지지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">6. 약관 변경</h2>
        <p className="text-gray-700 leading-relaxed">
          본 약관은 서비스 정책 변경에 따라 수정될 수 있습니다.
          변경 시 서비스 내 공지를 통해 안내하며, 변경 후에도 서비스를 계속 이용하면
          변경된 약관에 동의한 것으로 간주됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">7. 문의</h2>
        <p className="text-gray-700">
          이용약관에 관한 문의는 아래 이메일로 연락주세요.
          <br />
          <a href="mailto:rkadl96@gmail.com" className="text-blue-600 underline">rkadl96@gmail.com</a>
        </p>
      </section>
    </div>
  );
}
