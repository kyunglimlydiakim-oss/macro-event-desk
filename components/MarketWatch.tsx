"use client";

import { INDICATORS, SITES, tvChartUrl } from "@/lib/config";
import { useAppState } from "@/lib/store";
import TvWidget from "./TvWidget";
import UsTreasuryBox from "./UsTreasuryBox";

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

      <UsTreasuryBox />

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
        표시 원칙 · 위젯 시세는 TradingView 제공값으로, 거래소 라이선스에 따라 실시간 또는 지연(통상 10~20분)입니다.
        기준 시각은 위젯 내부 표기를 따릅니다. 국채금리 위젯의 변화폭은 %p 단위이며 0.01 = 1bp입니다.
        유가는 연속 근월물(CL1!, BRN1!)로, 계약월은 CME·ICE 링크에서 확인합니다. 위젯이 &quot;심볼 사용 불가&quot;를 표시하면
        Settings에서 심볼을 바꿀 수 있습니다(예: TVC:USOIL, TVC:UKOIL — 단, 이는 선물이 아닌 CFD 지수입니다).
      </p>
    </section>
  );
}
