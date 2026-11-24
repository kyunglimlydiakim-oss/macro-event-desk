"use client";

import { useEffect, useState } from "react";
import { Country, COUNTRY_LABEL } from "@/lib/config";
import { MyEvent, setState, uid, useAppState } from "@/lib/store";
import { LaunchButton } from "./EventLauncher";

const COUNTRIES: Country[] = ["US", "JP", "AU", "ME", "GLOBAL"];

function todayKst(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
}

// 사용자가 직접 입력하는 KST 기준 일정표.
// 중앙은행 회의일 등은 공식 캘린더에서 확인 후 입력한다(앱이 날짜를 임의로 채워 넣지 않는다).
export default function MyEvents({ country, limitDays }: { country?: Country; limitDays?: number }) {
  const { myEvents, presets } = useAppState();
  const [filter, setFilter] = useState<Country | "ALL">(country ?? "ALL");
  const [today, setToday] = useState("");
  const [form, setForm] = useState<Omit<MyEvent, "id">>({
    date: "",
    time: "",
    title: "",
    country: country ?? "US",
    presetId: "",
  });
  useEffect(() => {
    const t = todayKst();
    setToday(t);
    setForm((f) => ({ ...f, date: f.date || t }));
  }, []);

  const end = (() => {
    if (!limitDays || !today) return null;
    const d = new Date(today + "T00:00:00");
    d.setDate(d.getDate() + limitDays);
    return d.toISOString().slice(0, 10);
  })();

  const list = myEvents
    .filter((e) => filter === "ALL" || e.country === filter)
    .filter((e) => !today || e.date >= today)
    .filter((e) => !end || e.date <= end)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const add = () => {
    if (!form.title.trim() || !form.date) return;
    setState((s) => ({ ...s, myEvents: [...s.myEvents, { ...form, title: form.title.trim(), id: uid() }] }));
    setForm((f) => ({ ...f, title: "", time: "", memo: "" }));
  };

  return (
    <section className="panel p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="panel-title">
          My Events (KST){limitDays ? ` · 향후 ${limitDays}일` : ""}
        </h2>
        {!country && (
          <div className="flex flex-wrap gap-1">
            {(["ALL", ...COUNTRIES] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`btn ${filter === c ? "border-desk-accent text-white" : "text-desk-dim"}`}
              >
                {c === "ALL" ? "전체" : COUNTRY_LABEL[c]}
              </button>
            ))}
          </div>
        )}
      </div>

      <ul className="mb-3 divide-y divide-desk-line">
        {list.map((e) => {
          const p = presets.find((x) => x.id === e.presetId);
          return (
            <li key={e.id} className="flex flex-wrap items-center gap-2 py-1.5 text-xs">
              <span className={`font-mono ${e.date === today ? "text-desk-amber" : "text-desk-dim"}`}>
                {e.date.slice(5)} {e.time || "--:--"}
              </span>
              <span className="badge">{COUNTRY_LABEL[e.country]}</span>
              <span className="min-w-0 flex-1 truncate" title={e.memo}>
                {e.title}
              </span>
              {p && <LaunchButton preset={p} compact />}
              <button
                type="button"
                className="btn btn-danger text-desk-dim"
                onClick={() => setState((s) => ({ ...s, myEvents: s.myEvents.filter((x) => x.id !== e.id) }))}
                aria-label="삭제"
              >
                ✕
              </button>
            </li>
          );
        })}
        {list.length === 0 && (
          <li className="py-2 text-xs text-desk-dim">
            예정된 일정이 없습니다. 경제 캘린더나 중앙은행 공식 일정에서 확인한 일정을 아래에서 추가하세요.
          </li>
        )}
      </ul>

      <div className="flex flex-wrap items-center gap-1">
        <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} aria-label="날짜(KST)" />
        <input className="input w-24" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} aria-label="시각(KST)" />
        <select className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value as Country })} aria-label="국가">
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {COUNTRY_LABEL[c]}
            </option>
          ))}
        </select>
        <input
          className="input min-w-40 flex-1"
          placeholder="이벤트 이름 (예: 미국 10월 CPI)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <select className="input" value={form.presetId} onChange={(e) => setForm({ ...form, presetId: e.target.value })} aria-label="연결할 원클릭 세트">
          <option value="">원클릭 세트 없음</option>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button type="button" className="btn" onClick={add}>
          + 추가
        </button>
      </div>
    </section>
  );
}
