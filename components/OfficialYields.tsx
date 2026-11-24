"use client";

import { useEffect, useState } from "react";
import type { YieldError, YieldPayload } from "@/lib/yields";

type Res = YieldPayload | YieldError;
const LABEL = { us: "미국 · US Treasury", jp: "일본 · 재무성(MOF)", au: "호주 · RBA" } as const;
type C = keyof typeof LABEL;

const cache: Partial<Record<C, Promise<Res>>> = {};
function load(c: C): Promise<Res> {
  return (cache[c] ??= fetch(`/api/yields/${c}`)
    .then((r) => r.json())
    .catch((e) => ({ ok: false, country: c.toUpperCase(), error: String(e), sourceUrl: "" }) as YieldError));
}

function Chg({ v }: { v: number | null }) {
  if (v === null) return <span className="font-mono text-desk-dim">–</span>;
  const c = v > 0 ? "text-desk-up" : v < 0 ? "text-desk-down" : "text-desk-dim";
  return (
    <span className={`font-mono ${c}`}>
      {v > 0 ? "+" : ""}
      {v.toFixed(1)}bp
    </span>
  );
}

function Block({ c }: { c: C }) {
  const [d, setD] = useState<Res | null>(null);
  useEffect(() => {
    let alive = true;
    load(c).then((r) => alive && setD(r));
    return () => {
      alive = false;
    };
  }, [c]);

  return (
    <div className="py-1.5">
      <div className="mb-0.5 font-mono text-[10px] text-desk-dim">{LABEL[c]}</div>
      {!d && <div className="text-xs text-desk-dim">불러오는 중…</div>}
      {d && !d.ok && (
        <div className="text-[11px] text-desk-dim">
          불러오지 못했습니다 ({d.error}){" "}
          {d.sourceUrl && (
            <a className="text-desk-accent underline" href={d.sourceUrl} target="_blank" rel="noopener noreferrer">
              원문
            </a>
          )}
        </div>
      )}
      {d?.ok && (
        <>
          <table className="w-full text-xs">
            <tbody>
              {d.points.map((p) => (
                <tr key={p.key}>
                  <td className="py-0.5 font-mono text-desk-dim">{p.label}</td>
                  <td className="text-right font-mono">{p.value.toFixed(3)}%</td>
                  <td className="w-20 text-right">
                    <Chg v={p.chgBp} />
                  </td>
                </tr>
              ))}
              {d.spread && (
                <tr className="border-t border-desk-line">
                  <td className="py-0.5 font-mono text-desk-dim">{d.spread.label}</td>
                  <td className="text-right font-mono">
                    {d.spread.bp > 0 ? "+" : ""}
                    {d.spread.bp.toFixed(1)}bp
                  </td>
                  <td className="text-right">
                    <Chg v={d.spread.chgBp} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="text-[10px] leading-snug text-desk-dim">
            기준일 {d.date}
            {d.prevDate ? ` (비교 ${d.prevDate})` : ""} ·{" "}
            <a className="underline" href={d.sourceUrl} target="_blank" rel="noopener noreferrer" title={`${d.source} — ${d.basis}`}>
              출처
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default function OfficialYields({ only }: { only?: C[] }) {
  const list = only ?? (["us", "jp", "au"] as C[]);
  return (
    <div className="rounded border border-desk-line bg-desk-bg px-2 py-1">
      <div className="flex items-center justify-between pt-1">
        <span className="font-mono text-[11px] text-desk-amber">공식 국채금리 · 일별</span>
        <span className="badge">DAILY · 공시값</span>
      </div>
      <div className="divide-y divide-desk-line">
        {list.map((c) => (
          <Block key={c} c={c} />
        ))}
      </div>
      <p className="pb-1 text-[10px] leading-snug text-desk-dim">
        각국 재무부·중앙은행이 하루 한 번 공시하는 값입니다. 장중 움직임은 반영하지 않습니다.
      </p>
    </div>
  );
}
