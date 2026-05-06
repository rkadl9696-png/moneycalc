import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침 | 계산기 모음",
  description: "계산기 모음의 개인정보처리방침을 안내합니다.",
};

export default function Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-blue-600 transition-colors">
        ← 계산기 목록
      </Link>

      <h1 className="text-2xl font-bold mb-2">개인정보처리방침</h1>
      <p className="text-sm text-gray-400 mb-8">최종 업데이트: 2026년 1월 1일</p>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">1. 개요</h2>
        <p className="text-gray-700 leading-relaxed">
          계산기 모음(이하 "본 서비스")은 이용자의 개인정보를 중요하게 생각하며,
          개인정보 보호법 및 관련 법령을 준수합니다. 본 방침은 본 서비스가 수집하는
          정보와 그 활용 방법을 설명합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">2. 수집하는 정보</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          본 서비스는 이용자가 직접 입력한 개인 정보(이름, 연락처 등)를 수집하지 않습니다.
          다만, 서비스 개선 및 광고 제공을 위해 다음과 같은 방문 데이터가 자동으로 수집될 수 있습니다.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>Google Analytics:</strong> 페이지 방문 수, 체류 시간, 유입 경로 등 익명 방문 데이터</li>
          <li><strong>Google AdSense:</strong> 광고 노출 및 클릭 관련 쿠키 데이터</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">3. 수집 목적</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>서비스 이용 현황 분석 및 기능 개선</li>
          <li>맞춤형 광고 제공 (Google AdSense)</li>
          <li>서비스 안정성 유지 및 오류 개선</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">4. 보유 및 이용 기간</h2>
        <p className="text-gray-700 leading-relaxed">
          Google Analytics 및 AdSense를 통해 수집된 데이터는 각 서비스의 정책에 따라
          보관·삭제됩니다. 본 서비스는 해당 데이터를 별도로 저장하거나 보관하지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">5. 제3자 제공</h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          본 서비스는 이용자의 데이터를 제3자에게 판매하거나 임의로 제공하지 않습니다.
          다만, 아래 제3자 서비스가 데이터를 수집할 수 있습니다.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Google LLC (Google Analytics, Google AdSense)</li>
        </ul>
        <p className="text-sm text-gray-500 mt-2">
          Google의 개인정보 처리 방식은{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Google 개인정보처리방침
          </a>
          을 참고하세요.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">6. 쿠키 사용</h2>
        <p className="text-gray-700 leading-relaxed">
          본 서비스는 Google AdSense 광고 제공을 위해 쿠키를 사용합니다.
          브라우저 설정에서 쿠키를 비활성화할 수 있으나, 일부 기능이 제한될 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">7. 이용자의 권리</h2>
        <p className="text-gray-700 leading-relaxed">
          이용자는 Google Analytics 데이터 수집을 거부하기 위해{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Google Analytics 차단 브라우저 부가기능
          </a>
          을 설치할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">8. 문의</h2>
        <p className="text-gray-700">
          개인정보 처리에 관한 문의는 아래 이메일로 연락주세요.
          <br />
          <a href="mailto:rkadl96@gmail.com" className="text-blue-600 underline">rkadl96@gmail.com</a>
        </p>
      </section>
    </div>
  );
}
