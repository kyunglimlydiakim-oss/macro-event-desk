"use client";

import { useEffect, useState } from "react";
import { CANDIDATES } from "@/lib/candidates";
import { INDICATOR_BY_ID } from "@/lib/config";
import { setState, useAppState } from "@/lib/store";
import TvWidget from "./TvWidget";

const TYPE_LABEL: Record<string, string> = {
  FUT: "선물",
  CFD: "CFD",
  YLD: "수익률",
  PX: "채권가격",
  IDX: "지수",
  FX: "외환",
};

function ApiCheck({ c }: { c: "us" | "jp" | "au" }) {
  const [s, setS] = useState("확인 중…");
  useEffect(() => {
    fetch(`/api/yields/${c}`)
      .then(async (r) => setS(`HTTP ${r.status}\n${JSON.stringify(await r.json(), null, 1)}`))
      .catch((e) => setS(String(e)));
  }, [c]);
  return (
    <div>
      <div className="mb-1 font-mono text-[11px] text-desk-amber">/api/yields/{c}</div>
      <pre className="max-h-56 overflow-auto rounded border border-desk-line bg-desk-bg p-2 text-[10px] leading-snug whitespace-pre-wrap">{s}</pre>
    </div>
  );
}

export default function SymbolTest() {
  const { symbols } = useAppState();
  const groups = Object.entries(CANDIDATES).map(([id, list]) => ({
    name: INDICATOR_BY_ID[id].label,
    symbols: list.map((c) => ({ name: c.symbol, displayName: `${c.symbol} [${TYPE_LABEL[c.type]}]` })),
  }));
  const rows = groups.reduce((n, g) => n + g.symbols.length + 1, 0);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Symbol Test</h1>
      <section className="panel p-3 text-xs leading-relaxed text-desk-dim">
        TradingView 위젯은 데이터 라이선스에 따라 일부 심볼을 외부 사이트에 표시하지 않습니다. 아래 표에서 <b className="text-desk-text">숫자가 나오는 심볼</b>만
        이 사이트에서 쓸 수 있습니다. 쓸 수 있는 심볼을 오른쪽 선택란에서 골라 &apos;적용&apos;하면 Market Watch와 차트에 반영됩니다.
        <br />
        유형 표기 — 선물: 거래소 선물 · CFD: 중개사 시세(선물·지수와 값이 다를 수 있음) · 수익률: % · 채권가격: 가격(수익률 아님)
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <section className="panel p-3">
          <h2 className="panel-title mb-2">후보 심볼 시세</h2>
          <TvWidget
            widget="market-quotes"
            height={rows * 36 + 80}
            config={{
              width: "100%",
              height: "100%",
              symbolsGroups: groups,
              showSymbolLogo: false,
              isTransparent: true,
              colorTheme: "dark",
              locale: "en",
            }}
          />
        </section>

        <section className="panel flex flex-col gap-2 p-3">
          <h2 className="panel-title">적용할 심볼</h2>
          {Object.entries(CANDIDATES).map(([id, list]) => (
            <label key={id} className="flex flex-col gap-1 text-xs">
              <span className="text-desk-dim">{INDICATOR_BY_ID[id].label}</span>
              <select
                className="input font-mono"
                value={symbols[id]}
                onChange={(e) => setState((s) => ({ ...s, symbols: { ...s.symbols, [id]: e.target.value } }))}
              >
                {!list.some((c) => c.symbol === symbols[id]) && <option value={symbols[id]}>{symbols[id]} (직접 입력값)</option>}
                {list.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.symbol} [{TYPE_LABEL[c.type]}]
                  </option>
                ))}
              </select>
            </label>
          ))}
          <p className="text-[10px] text-desk-dim">선택 즉시 이 브라우저에 저장됩니다. Settings에서 직접 입력도 가능합니다.</p>
        </section>
      </div>

      <section className="panel p-3">
        <h2 className="panel-title mb-2">공식 국채금리 API 점검</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          <ApiCheck c="us" />
          <ApiCheck c="jp" />
          <ApiCheck c="au" />
        </div>
      </section>
    </div>
  );
}
