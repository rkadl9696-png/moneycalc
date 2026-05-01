import Link from "next/link";

export default function RelatedCalculators() {
  return (
    <div className="mt-8 text-sm text-gray-600">
      <p className="font-bold mb-2">함께 보면 좋은 계산기</p>
      <ul className="list-disc ml-5 space-y-1">
        <li><Link href="/jeonse-vs-rent">전세 vs 월세 계산기</Link></li>
        <li><Link href="/loan-calc">대출 상환 계산기</Link></li>
        <li><Link href="/salary-calc">연봉 실수령 계산기</Link></li>
        <li><Link href="/compound">복리 계산기</Link></li>
        <li><Link href="/card-calc">카드 할인 계산기</Link></li>
      </ul>
    </div>
  );
}