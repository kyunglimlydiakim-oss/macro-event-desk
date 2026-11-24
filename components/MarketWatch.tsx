"use client";

import { INDICATORS, SITES, tvChartUrl } from "@/lib/config";
import { useAppState } from "@/lib/store";
import TvWidget from "./TvWidget";
import OfficialYields from "./OfficialYields";

const KIND_BADGE: Record<string, string> = {
  futures: "FUT",
  yield: "YLD",
  fx: "FX",
  index: "IDX",
  spread: "SPR",
};

export default function MarketWatch() {
  const { symbols } = useAppState();
  const groups = ["원유", "미국 금리", "외환", "일본", "호주"] as const;
  const quoteGroups = groups.map((g) => ({
    name: g,
    symbols: INDICATORS.filter((i) => i.group === g && i.kind !== "spread").map((i) => ({
      name: symbols[i.id] ?? i.tvSymbol,
      displayName: i.label,
    })),
  }));

  return (
    <section className="panel flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <h2 className="panel-title">Market Watch</h2>
        <span className="badge">TradingView · 지연 가능</span>
      </div>

      <TvWidget
        widget="market-quotes"
        height={620}
        fallbackUrl="https://www.tradingview.com/markets/"
        config={{
          width: "100%",
          height: "100%",
          symbolsGroups: quoteGroups,
          showSymbolLogo: false,
          isTransparent: true,
          colorTheme: "dark",
          locale: "en",
        }}
      />

      <OfficialYields />

      <div>
        <div className="mb-1 font-mono text-[11px] text-desk-dim">차트 바로가기</div>
        <ul className="divide-y divide-desk-line text-xs">
          {INDICATORS.map((i) => {
            const sym = symbols[i.id] ?? i.tvSymbol;
            return (
              <li key={i.id} className="flex items-center gap-2 py-1">
                <span className="badge w-9 text-center">{KIND_BADGE[i.kind]}</span>
                <span className="min-w-0 flex-1 truncate" title={i.note ?? i.label}>
                  {i.label}
                </span>
                <a className="text-desk-accent hover:underline" href={tvChartUrl(sym)} target="_blank" rel="noopener noreferrer">
                  TV
                </a>
                {i.investingUrl && (
                  <a className="text-desk-accent hover:underline" href={i.investingUrl} target="_blank" rel="noopener noreferrer">
                    INV
                  </a>
                )}
                {i.id === "wti" && (
                  <a className="text-desk-accent hover:underline" href={SITES.cmeCrude.url} target="_blank" rel="noopener noreferrer">
                    CME
                  </a>
                )}
                {i.id === "brent" && (
                  <a className="text-desk-accent hover:underline" href={SITES.iceBrent.url} target="_blank" rel="noopener noreferrer">
                    ICE
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <p className="text-[10px] leading-snug text-desk-dim">
        위젯 시세는 TradingView 제공값으로 실시간 또는 지연입니다. TradingView는 데이터 라이선스에 따라 일부 심볼(거래소 선물, TVC
        국채금리 등)을 외부 위젯에 표시하지 않으며, 이 경우 칸이 비어 보입니다. 쓸 수 있는 심볼은{" "}
        <a href="/symbol-test" className="underline">
          Symbol Test
        </a>
        에서 확인·적용합니다. 국채금리는 위 &apos;공식 국채금리&apos;(일별 공시값)를 기준으로 봅니다.
      </p>
    </section>
  );
}
