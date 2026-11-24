"use client";

import { INDICATOR_BY_ID, SITES, Topic, tvChartUrl } from "@/lib/config";
import { openAll, useAppState } from "@/lib/store";
import EventLauncher from "./EventLauncher";
import MyEvents from "./MyEvents";
import TvWidget from "./TvWidget";
import UsTreasuryBox from "./UsTreasuryBox";

export default function TopicPage({ topic }: { topic: Topic }) {
  const { symbols } = useAppState();
  const main = INDICATOR_BY_ID[topic.indicators[0]];
  const mainSym = symbols[main.id] ?? main.tvSymbol;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-xl font-semibold">{topic.title}</h1>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel p-3">
          <h2 className="panel-title mb-2">모니터링 대상</h2>
          <ul className="space-y-1 text-sm">
            {topic.watch.map((w) => (
              <li key={w} className="flex gap-2">
                <span className="text-desk-amber">›</span>
                {w}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel p-3 lg:col-span-2">
          <h2 className="panel-title mb-2">연결 사이트</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {topic.siteGroups.map((g) => {
              const links = g.siteIds.map((id) => ({ label: SITES[id].label, url: SITES[id].url }));
              return (
                <div key={g.title}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-desk-dim">{g.title}</span>
                    <button type="button" className="text-[11px] text-desk-accent hover:underline" onClick={() => openAll(links)}>
                      모두 열기
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {links.map((l) => (
                      <a key={l.url} className="btn" href={l.url} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <EventLauncher only={topic.presets} title="원클릭 이벤트 세트" />

      <section className="panel p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="panel-title">상시 확인 지표</h2>
          <a className="text-[11px] text-desk-accent hover:underline" href={tvChartUrl(mainSym)} target="_blank" rel="noopener noreferrer">
            {main.short} 전체 차트 ↗
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {topic.indicators.map((id) => {
            const ind = INDICATOR_BY_ID[id];
            const sym = symbols[id] ?? ind.tvSymbol;
            if (ind.kind === "spread") {
              return (
                <div key={id} className="flex flex-col gap-2 rounded border border-desk-line p-2">
                  <div className="text-xs">{ind.label}</div>
                  <UsTreasuryBox />
                  <a className="text-[11px] text-desk-accent hover:underline" href={tvChartUrl(sym)} target="_blank" rel="noopener noreferrer">
                    TradingView 스프레드 차트 ({sym}) ↗
                  </a>
                </div>
              );
            }
            return (
              <div key={id} className="rounded border border-desk-line p-1">
                <TvWidget
                  widget="mini-symbol-overview"
                  height={220}
                  fallbackUrl={tvChartUrl(sym)}
                  config={{
                    symbol: sym,
                    width: "100%",
                    height: "100%",
                    locale: "en",
                    dateRange: "1M",
                    colorTheme: "dark",
                    isTransparent: true,
                    autosize: true,
                    largeChartUrl: "",
                  }}
                />
                <div className="px-1 pt-1 text-[10px] text-desk-dim">
                  {ind.label} · {sym}
                  {ind.note ? ` · ${ind.note}` : ""}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel p-3">
        <h2 className="panel-title mb-2">
          {main.label} — 상세 차트 (KST)
        </h2>
        <TvWidget
          widget="advanced-chart"
          height={480}
          fallbackUrl={tvChartUrl(mainSym)}
          config={{
            symbol: mainSym,
            interval: "60",
            timezone: "Asia/Seoul",
            theme: "dark",
            style: "1",
            locale: "en",
            allow_symbol_change: true,
            autosize: true,
            hide_side_toolbar: true,
            backgroundColor: "rgba(13, 20, 36, 1)",
          }}
        />
      </section>

      <MyEvents country={topic.country} />
    </div>
  );
}
