import Link from "next/link";

export default function Home() {
  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">계산기 모음</h1>

      <ul className="space-y-4">
        <li>
          <Link
            href="/jeonse-vs-rent"
            className="block p-4 border rounded hover:bg-gray-100"
          >
            <h2 className="text-lg font-bold">전세 vs 월세 계산기</h2>
            <p className="text-sm text-gray-600">
              전세와 월세 중 어떤 선택이 더 유리한지 계산합니다.
            </p>
          </Link>
        </li>

        <li>
          <Link
            href="/loan-calc"
            className="block p-4 border rounded hover:bg-gray-100"
          >
            <h2 className="text-lg font-bold">대출 계산기</h2>
            <p className="text-sm text-gray-600">
              원리금균등 vs 원금균등 상환 방식과 총 이자 차이를 비교합니다.
            </p>
          </Link>
        </li>

        <li>
          <Link
            href="/salary-calc"
            className="block p-4 border rounded hover:bg-gray-100"
          >
            <h2 className="text-lg font-bold">연봉 실수령 계산기</h2>
            <p className="text-sm text-gray-600">
              연봉 기준 예상 세후 수령액과 공제 금액을 계산합니다.
            </p>
          </Link>
        </li>

        <li>
          <Link
            href="/compound"
            className="block p-4 border rounded hover:bg-gray-100"
          >
            <h2 className="text-lg font-bold">복리 계산기</h2>
            <p className="text-sm text-gray-600">
              투자 원금, 수익률, 기간에 따른 복리 최종 금액을 계산합니다.
            </p>
          </Link>
        </li>

        <li>
          <Link
            href="/card-calc"
            className="block p-4 border rounded hover:bg-gray-100"
          >
            <h2 className="text-lg font-bold">카드 할인 계산기</h2>
            <p className="text-sm text-gray-600">
              결제 금액과 할인율을 기준으로 할인 금액과 최종 결제액을 계산합니다.
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
}