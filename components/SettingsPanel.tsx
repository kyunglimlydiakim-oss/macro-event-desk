"use client";

import { useRef, useState } from "react";
import { Country, COUNTRY_LABEL, EventPreset, INDICATORS, SITES, tvChartUrl } from "@/lib/config";
import { defaultState, replaceState, setState, uid, useAppState } from "@/lib/store";

const COUNTRIES: Country[] = ["US", "JP", "AU", "ME", "GLOBAL"];

function updatePreset(id: string, fn: (p: EventPreset) => EventPreset) {
  setState((s) => ({ ...s, presets: s.presets.map((p) => (p.id === id ? fn(p) : p)) }));
}

function PresetEditor({ p }: { p: EventPreset }) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [pick, setPick] = useState("");

  const addLink = () => {
    const u = url.trim();
    if (!/^https?:\/\//i.test(u)) return;
    updatePreset(p.id, (x) => ({ ...x, links: [...x.links, { label: label.trim() || new URL(u).hostname, url: u }] }));
    setLabel("");
    setUrl("");
  };

  const addRegistered = (v: string) => {
    if (!v) return;
    const [kind, id] = v.split(":");
    const link =
      kind === "site"
        ? { label: SITES[id].label, url: SITES[id].url }
        : (() => {
            const ind = INDICATORS.find((i) => i.id === id)!;
            return { label: `${ind.short} 차트`, url: tvChartUrl(ind.tvSymbol) };
          })();
    updatePreset(p.id, (x) => ({ ...x, links: [...x.links, link] }));
    setPick("");
  };

  const move = (i: number, d: -1 | 1) =>
    updatePreset(p.id, (x) => {
      const links = [...x.links];
      const j = i + d;
      if (j < 0 || j >= links.length) return x;
      [links[i], links[j]] = [links[j], links[i]];
      return { ...x, links };
    });

  return (
    <div className="rounded border border-desk-line p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <input
          className="input flex-1 font-semibold"
          value={p.name}
          onChange={(e) => updatePreset(p.id, (x) => ({ ...x, name: e.target.value }))}
          aria-label="이벤트 이름"
        />
        <select
          className="input"
          value={p.country}
          onChange={(e) => updatePreset(p.id, (x) => ({ ...x, country: e.target.value as Country }))}
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {COUNTRY_LABEL[c]}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            if (confirm(`'${p.name}' 세트를 삭제할까요?`))
              setState((s) => ({ ...s, presets: s.presets.filter((x) => x.id !== p.id) }));
          }}
        >
          세트 삭제
        </button>
      </div>

      <ul className="mb-2 space-y-1">
        {p.links.map((l, i) => (
          <li key={i} className="flex flex-wrap items-center gap-1 text-xs">
            <span className="w-5 font-mono text-desk-dim">{i + 1}</span>
            <input
              className="input w-44"
              value={l.label}
              onChange={(e) =>
                updatePreset(p.id, (x) => ({ ...x, links: x.links.map((y, j) => (j === i ? { ...y, label: e.target.value } : y)) }))
              }
            />
            <input
              className="input min-w-48 flex-1 font-mono"
              value={l.url}
              onChange={(e) =>
                updatePreset(p.id, (x) => ({ ...x, links: x.links.map((y, j) => (j === i ? { ...y, url: e.target.value } : y)) }))
              }
            />
            <button type="button" className="btn" onClick={() => move(i, -1)} aria-label="위로">
              ↑
            </button>
            <button type="button" className="btn" onClick={() => move(i, 1)} aria-label="아래로">
              ↓
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => updatePreset(p.id, (x) => ({ ...x, links: x.links.filter((_, j) => j !== i) }))}
              aria-label="링크 삭제"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-1 text-xs">
        <select className="input" value={pick} onChange={(e) => addRegistered(e.target.value)}>
          <option value="">+ 등록된 사이트/차트에서 추가…</option>
          <optgroup label="사이트">
            {Object.values(SITES).map((s) => (
              <option key={s.id} value={`site:${s.id}`}>
                {s.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="TradingView 차트">
            {INDICATORS.map((i) => (
              <option key={i.id} value={`ind:${i.id}`}>
                {i.label}
              </option>
            ))}
          </optgroup>
        </select>
        <span className="text-desk-dim">또는</span>
        <input className="input w-32" placeholder="이름" value={label} onChange={(e) => setLabel(e.target.value)} />
        <input
          className="input min-w-48 flex-1"
          placeholder="https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addLink()}
        />
        <button type="button" className="btn" onClick={addLink}>
          + URL 추가
        </button>
      </div>
    </div>
  );
}

export default function SettingsPanel() {
  const state = useAppState();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `macro-event-desk-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (f: File) => {
    try {
      replaceState(JSON.parse(await f.text()));
      setMsg("설정을 불러왔습니다.");
    } catch {
      setMsg("JSON 파일을 읽지 못했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Settings</h1>

      <section id="presets" className="panel p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="panel-title">이벤트별 원클릭 사이트 세트</h2>
          <div className="flex gap-1">
            <button
              type="button"
              className="btn"
              onClick={() =>
                setState((s) => ({
                  ...s,
                  presets: [...s.presets, { id: uid(), name: "새 이벤트", country: "GLOBAL", links: [] }],
                }))
              }
            >
              + 새 세트
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => confirm("이벤트 세트를 초기값으로 되돌릴까요?") && setState((s) => ({ ...s, presets: defaultState().presets }))}
            >
              초기값 복원
            </button>
          </div>
        </div>
        <p className="mb-3 text-[11px] text-desk-dim">
          변경 사항은 이 브라우저(localStorage)에 즉시 저장됩니다. 목록 순서대로 탭이 열립니다.
        </p>
        <div className="flex flex-col gap-3">
          {state.presets.map((p) => (
            <PresetEditor key={p.id} p={p} />
          ))}
        </div>
      </section>

      <section className="panel p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="panel-title">TradingView 심볼</h2>
          <button
            type="button"
            className="btn"
            onClick={() => setState((s) => ({ ...s, symbols: defaultState().symbols }))}
          >
            초기값 복원
          </button>
        </div>
        <p className="mb-2 text-[11px] text-desk-dim">
          위젯에 &quot;symbol unavailable&quot; 등이 표시되면 다른 심볼로 바꿉니다. 유가 대안: TVC:USOIL, TVC:UKOIL(CFD 지수,
          선물 아님). 스프레드는 &quot;TVC:US30Y-TVC:US02Y&quot; 같은 수식 표기를 씁니다.
        </p>
        <div className="grid gap-1 sm:grid-cols-2">
          {INDICATORS.map((i) => (
            <label key={i.id} className="flex items-center gap-2 text-xs">
              <span className="w-40 truncate text-desk-dim">{i.label}</span>
              <input
                className="input flex-1 font-mono"
                value={state.symbols[i.id] ?? ""}
                onChange={(e) => setState((s) => ({ ...s, symbols: { ...s.symbols, [i.id]: e.target.value } }))}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="panel p-3">
        <h2 className="panel-title mb-2">경제 캘린더 위젯 파라미터</h2>
        <div className="grid gap-2 text-xs sm:grid-cols-2">
          <label className="flex items-center gap-2">
            <span className="w-40 text-desk-dim">timeZone 코드</span>
            <input
              className="input w-24 font-mono"
              type="number"
              value={state.calendar.timeZone}
              onChange={(e) => setState((s) => ({ ...s, calendar: { ...s.calendar, timeZone: Number(e.target.value) } }))}
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="w-40 text-desk-dim">lang 코드</span>
            <input
              className="input w-24 font-mono"
              type="number"
              value={state.calendar.lang}
              onChange={(e) => setState((s) => ({ ...s, calendar: { ...s.calendar, lang: Number(e.target.value) } }))}
            />
          </label>
          <label className="flex items-center gap-2 sm:col-span-2">
            <span className="w-40 text-desk-dim">국가 코드(쉼표 구분)</span>
            <input
              className="input flex-1 font-mono"
              defaultValue={state.calendar.countries.join(",")}
              onBlur={(e) => {
                const v = e.target.value
                  .split(",")
                  .map((x) => parseInt(x.trim(), 10))
                  .filter((x) => !Number.isNaN(x));
                if (v.length) setState((s) => ({ ...s, calendar: { ...s.calendar, countries: v } }));
              }}
            />
          </label>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-desk-dim">
          코드값은 Investing.com 위젯 생성기 기준입니다. timeZone 88을 KST로 가정했으나 개발 환경에서 검증하지 못했습니다.
          위젯 하단 시간이 KST와 다르면 Investing.com 웹마스터 도구에서 &apos;(GMT+9:00) Seoul&apos;을 고른 뒤 생성되는 iframe 주소의
          timeZone 값을 여기에 입력하세요.
        </p>
      </section>

      <section className="panel p-3">
        <h2 className="panel-title mb-2">백업 · 복원</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn" onClick={exportJson}>
            JSON 내보내기
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            JSON 가져오기
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => confirm("모든 설정(세트·즐겨찾기·일정·심볼)을 초기화할까요?") && replaceState(defaultState())}
          >
            전체 초기화
          </button>
          {msg && <span className="self-center text-xs text-desk-amber">{msg}</span>}
        </div>
      </section>
    </div>
  );
}
