"use client";

export default function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center text-xl"
      aria-label="맨 위로 이동"
    >
      ↑
    </button>
  );
}
