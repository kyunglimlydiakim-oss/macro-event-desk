"use client";

import { useEffect, useState } from "react";

const ZONES = [
  { label: "KST", tz: "Asia/Seoul" },
  { label: "NY", tz: "America/New_York" },
  { label: "TKY", tz: "Asia/Tokyo" },
  { label: "SYD", tz: "Australia/Sydney" },
  { label: "LON", tz: "Europe/London" },
];

function fmt(d: Date, tz: string, withDate = false) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...(withDate ? { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", second: "2-digit" } : {}),
  }).format(d);
}

export default function KstClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) return <div className="h-5" />;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs">
      <span className="text-desk-amber">KST {fmt(now, "Asia/Seoul", true)}</span>
      {ZONES.slice(1).map((z) => (
        <span key={z.tz} className="text-desk-dim">
          {z.label} <span className="text-desk-text">{fmt(now, z.tz)}</span>
        </span>
      ))}
    </div>
  );
}
