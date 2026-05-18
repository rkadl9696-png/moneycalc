import { MetadataRoute } from "next";

const BASE = "https://moneycalc-ashy.vercel.app";

const calculators = [
  // 부동산
  "/jeonse-vs-rent",
  "/jeonse-loan-calc",
  "/loan-calc",
  "/cheongak-calc",
  "/capital-gains-calc",
  "/mortgage-calc",
  "/prepayment-calc",
  "/rent-yield-calc",
  "/realestate-yield-calc",
  // 급여·재테크
  "/salary-calc",
  "/compound",
  "/interest-calc",
  "/savings-calc",
  "/exchange-calc",
  "/stock-calc",
  "/severance-calc",
  "/unemployment-calc",
  "/mincalc",
  "/weekly-holiday-calc",
  "/insurance-calc",
  "/parental-leave-calc",
  "/pension-calc",
  "/installment-calc",
  // 세금
  "/gift-tax-calc",
  "/income-tax-calc",
  // 교육
  "/gpa-calc",
  "/suneung-calc",
  "/naesin-calc",
  // 법률
  "/alimony-calc",
  "/statute-calc",
  // 건강
  "/bmi-calc",
  "/calorie-calc",
  "/bodyfat-calc",
  "/bmr-calc",
  "/due-date-calc",
  "/sleep-calc",
  "/water-calc",
  "/eye-rest-calc",
  "/blood-pressure-calc",
  "/exercise-calc",
  "/period-calc",
  "/quit-smoking-calc",
  "/alcohol-calc",
  "/medicine-calc",
  "/hospital-calc",
  // 생활
  "/age-calc",
  "/dday-calc",
  "/unit-calc",
  "/difficulty-calc",
  "/parcel-calc",
  "/pet-age-calc",
  "/lotto-calc",
  "/time-calc",
  "/ev-charge-calc",
  "/solar-calc",
  "/subscription-calc",
  // 소비
  "/card-calc",
  "/tip-calc",
  "/fuel-calc",
  "/electricity-calc",
  // 세금 (신규)
  "/inheritance-calc",
  "/vat-calc",
  "/customs-calc",
  "/freelance-tax-calc",
  // 급여·재테크 (신규)
  "/monthly-salary-calc",
  "/hourly-calc",
  "/health-insurance-calc",
  "/pension-contrib-calc",
  "/loan-limit-calc",
  // 부동산 (신규)
  "/deposit-return-calc",
  "/monthly-rent-calc",
  "/maintenance-calc",
  "/moving-calc",
  "/remodeling-calc",
  // 생활 (신규)
  "/pet-insurance-calc",
  // 세금 (신규2)
  "/jongbu-calc",
  "/acquisition-tax-calc",
  "/property-tax-calc",
  "/car-tax-calc",
  // 생활 (신규2)
  "/car-insurance-calc",
  "/car-depreciation-calc",
  "/childcare-calc",
  "/emergency-fund-calc",
  "/living-cost-calc",
  "/travel-cost-calc",
  "/wedding-cost-calc",
  // 교육 (신규2)
  "/tuition-calc",
  "/scholarship-calc",
  "/education-tax-calc",
  // 급여·재테크 (신규2)
  "/retirement-fund-calc",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...calculators.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${BASE}/about`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];
}
