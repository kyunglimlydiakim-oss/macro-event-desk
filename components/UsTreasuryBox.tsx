"use client";

import { useEffect, useState } from "react";

interface Ust {
  ok: boolean;
  error?: string;
  source?: string;
  sourceUrl: string;
  basis?: string;
  date?: string;
  prevDate?: string;
  y2?: number;
  y10?: number;
  y30?: number;
  chg2?: number;
  chg10?: number;
  chg30?: number;
  spread2s30s?: number;
  spreadChg?: number;
}

function Chg({ v }: { v?: number }) {
  if (v === undefined) return null;
  const c = v > 0 ? "text-desk-up" : v < 0 ? "text-desk-down" : "text-desk-dim";
  return (
    <span className={`font-mono ${c}`}>
      {v > 0 ? "+" : ""}
      {v.toFixed(1)}bp
    </span>
  );
}

export default function UsTreasuryBox() {
  const [d, setD] = useState<Ust | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/api/ust")
      .then((r) => r.json())
      .then((j) => alive && setD(j))
      .catch((e) => alive && setD({ ok: false, error: String(e), sourceUrl: "" }));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="rounded border border-desk-line bg-desk-bg p-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[11px] text-desk-amber">UST 공식 일별 · 2s30s 자동계산</span>
        <span className="badge">DAILY</span>
      </div>
      {!d && <div className="py-2 text-xs text-desk-dim">불러오는 중…</div>}
      {d && !d.ok && (
        <div className="py-1 text-xs text-desk-dim">
          재무부 데이터를 불러오지 못했습니다 ({d.error}).{" "}
          {d.sourceUrl && (
            <a className="text-desk-accent underline" href={d.sourceUrl} target="_blank" rel="noopener noreferrer">
              원문 보기
            </a>
          )}
        </div>
      )}
      {d?.ok && (
        <>
          <table className="w-full text-xs">
            <tbody>
              {[
                ["US2Y", d.y2, d.chg2],
                ["US10Y", d.y10, d.chg10],
                ["US30Y", d.y30, d.chg30],
              ].map(([k, y, c]) => (
                <tr key={k as string}>
                  <td className="py-0.5 font-mono text-desk-dim">{k as string}</td>
                  <td className="text-right font-mono">{(y as number).toFixed(2)}%</td>
                  <td className="w-20 text-right">
                    <Chg v={c as number} />
                  </td>
                </tr>
              ))}
              <tr className="border-t border-desk-line">
                <td className="py-0.5 font-mono text-desk-dim">2s30s</td>
                <td className="text-right font-mono">
                  {d.spread2s30s! > 0 ? "+" : ""}
                  {d.spread2s30s!.toFixed(1)}bp
                </td>
                <td className="text-right">
                  <Chg v={d.spreadChg} />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-1 text-[10px] leading-snug text-desk-dim">
            기준일 {d.date} (전일 {d.prevDate}) · {d.basis} ·{" "}
            <a className="underline" href={d.sourceUrl} target="_blank" rel="noopener noreferrer">
              출처: US Treasury
            </a>
          </div>
        </>
      )}
    </div>
  );
}
