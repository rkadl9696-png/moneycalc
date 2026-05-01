import Link from "next/link";

export default function Home() {
  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">금융 계산기 모음</h1>

      <p className="text-gray-600 mb-6">
        전세, 대출, 연봉, 복리, 카드 할인까지 한 번에 계산해보세요.
      </p>

      <ul className="space-y-4">

        <li>
          <Link href="/jeonse-vs-rent" className="block p-4 border rounded hover:bg-gray-100">
            <h2 className="text-lg font-bold">전세 vs 월세 계산기</h2>
            <p className="text-sm text-gray-600">
              👉 전세와 월세 중 어떤 선택이 더 유리한지 바로 계산
            </p>
          </Link>
        </li>

        <li>
          <Link href="/loan-calc" className="block p-4 border rounded hover:bg-gray-100">
            <h2 className="text-lg font-bold">대출 상환 계산기</h2>
            <p className="text-sm text-gray-600">
              👉 원리금균등 vs 원금균등, 총 이자 차이 비교
            </p>
          </Link>
        </li>

        <li>
          <Link href="/salary-calc" className="block p-4 border rounded hover:bg-gray-100">
            <h2 className="text-lg font-bold">연봉 실수령 계산기</h2>
            <p className="text-sm text-gray-600">
              👉 세후 월급이 얼마인지 바로 확인
            </p>
          </Link>
        </li>

        <li>
          <Link href="/compound" className="block p-4 border rounded hover:bg-gray-100">
            <h2 className="text-lg font-bold">복리 계산기</h2>
            <p className="text-sm text-gray-600">
              👉 투자 수익이 얼마나 불어나는지 계산
            </p>
          </Link>
        </li>

        <li>
          <Link href="/card-calc" className="block p-4 border rounded hover:bg-gray-100">
            <h2 className="text-lg font-bold">카드 할인 계산기</h2>
            <p className="text-sm text-gray-600">
              👉 할인 적용 후 실제 결제 금액 확인
            </p>
          </Link>
        </li>

      </ul>
    </div>
  );
}