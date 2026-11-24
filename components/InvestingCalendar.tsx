"use client";

import { CALENDAR_COUNTRIES, investingCalendarSrc, SITES } from "@/lib/config";
import { setState, useAppState } from "@/lib/store";

export default function InvestingCalendar({ height = 640, controls = true }: { height?: number; controls?: boolean }) {
  const { calendar } = useAppState();
  const src = investingCalendarSrc(calendar);

  const toggle = (key: "countries" | "importance", v: number) =>
    setState((s) => {
      const cur = s.calendar[key];
      const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
      return { ...s, calendar: { ...s.calendar, [key]: next.length ? next : cur } };
    });

  return (
    <section className="panel p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="panel-title">Economic Calendar</h2>
        <a className="btn" href={SITES.investingCal.url} target="_blank" rel="noopener noreferrer">
          Investing.com에서 열기 ↗
        </a>
      </div>

      {controls && (
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            <span className="mr-1 text-desk-dim">국가</span>
            {CALENDAR_COUNTRIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle("countries", c.id)}
                className={`btn ${calendar.countries.includes(c.id) ? "border-desk-accent text-white" : "text-desk-dim"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-1 text-desk-dim">중요도</span>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => toggle("importance", n)}
                className={`btn ${calendar.importance.includes(n) ? "border-desk-accent text-desk-amber" : "text-desk-dim"}`}
              >
                {"★".repeat(n)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {(["day", "week"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setState((s) => ({ ...s, calendar: { ...s.calendar, calType: t } }))}
                className={`btn ${calendar.calType === t ? "border-desk-accent text-white" : "text-desk-dim"}`}
              >
                {t === "day" ? "오늘" : "이번 주"}
              </button>
            ))}
          </div>
        </div>
      )}

      <iframe
        key={src}
        src={src}
        title="Investing.com Economic Calendar"
        className="w-full rounded border border-desk-line bg-white"
        style={{ height }}
        loading="lazy"
      />
      <p className="mt-1 text-[10px] leading-snug text-desk-dim">
        Investing.com 제공 위젯입니다. 표시 시간대는 위젯 하단 시간대 선택기로 바꿀 수 있으며, 기본값은 Settings의 timeZone
        코드(초기값 88)를 따릅니다. 위젯이 보이지 않으면 위 &apos;Investing.com에서 열기&apos;를 사용하세요. 위젯 내부 클릭은 보안
        정책상 이 앱이 감지할 수 없으므로, 관련 사이트 일괄 열기는 아래 Event Launcher·My Events에서 실행합니다.
      </p>
    </section>
  );
}
