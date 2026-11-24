"use client";

import { useEffect, useRef, useState } from "react";

// TradingView 공개 임베드 위젯 공통 래퍼.
// widget: "single-quote" | "mini-symbol-overview" | "advanced-chart" | "market-quotes" 등
export default function TvWidget({
  widget,
  config,
  height,
  fallbackUrl,
}: {
  widget: string;
  config: Record<string, unknown>;
  height: number;
  fallbackUrl?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const key = JSON.stringify(config);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    setFailed(false);
    const inner = document.createElement("div");
    inner.className = "tradingview-widget-container__widget";
    inner.style.height = "100%";
    el.appendChild(inner);
    const s = document.createElement("script");
    s.src = `https://s3.tradingview.com/external-embedding/embed-widget-${widget}.js`;
    s.async = true;
    s.type = "text/javascript";
    s.innerHTML = key;
    s.onerror = () => setFailed(true);
    el.appendChild(s);
    return () => {
      el.innerHTML = "";
    };
  }, [widget, key]);

  return (
    <div style={{ height }} className="relative w-full overflow-hidden">
      <div ref={ref} className="tradingview-widget-container h-full w-full" />
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-desk-panel text-xs text-desk-dim">
          위젯을 불러오지 못했습니다.
          {fallbackUrl && (
            <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-desk-accent underline">
              새 탭에서 열기
            </a>
          )}
        </div>
      )}
    </div>
  );
}
