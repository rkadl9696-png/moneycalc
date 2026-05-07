"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // 링크 클릭 시점에 저장 (스크롤 이벤트보다 신뢰성 높음)
  useEffect(() => {
    const saveOnClick = () => {
      if (window.scrollY > 0) {
        sessionStorage.setItem(`scroll:${pathname}`, String(window.scrollY));
      }
    };
    // 스크롤 중에도 저장 (최신 위치 유지)
    const saveOnScroll = () => {
      if (window.scrollY > 0) {
        sessionStorage.setItem(`scroll:${pathname}`, String(window.scrollY));
      }
    };
    document.addEventListener("click", saveOnClick, true);
    window.addEventListener("scroll", saveOnScroll, { passive: true });
    return () => {
      document.removeEventListener("click", saveOnClick, true);
      window.removeEventListener("scroll", saveOnScroll);
    };
  }, [pathname]);

  // 복원: 메인 페이지(/)에서만 스크롤 위치 복원
  useEffect(() => {
    if (pathname !== "/") return;
    const raw = sessionStorage.getItem(`scroll:${pathname}`);
    if (!raw) return;
    const y = Number(raw);
    if (y <= 0) return;

    const t1 = setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 0);
    const t2 = setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 80);
    const t3 = setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [pathname]);

  return null;
}
