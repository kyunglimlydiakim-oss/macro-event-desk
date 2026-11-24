// 미국 재무부(US Treasury) 공식 '일별 국채 수익률곡선(Par Yield Curve)' CSV를 읽어
// 2Y·10Y·30Y와 2s30s 스프레드, 전일 대비 bp 변화를 계산한다.
// 자체 데이터베이스는 두지 않는다. 1시간 단위 캐시만 사용한다.

import { NextResponse } from "next/server";

export const revalidate = 3600;

const SOURCE_PAGE =
  "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve";

function csvUrl(year: number) {
  return `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${year}/all?type=daily_treasury_yield_curve&field_tdr_date_value=${year}&page&_format=csv`;
}

interface Row {
  date: string; // YYYY-MM-DD
  y2: number;
  y10: number;
  y30: number;
}

function parse(text: string): Row[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
  const iDate = header.indexOf("Date");
  const i2 = header.indexOf("2 Yr");
  const i10 = header.indexOf("10 Yr");
  const i30 = header.indexOf("30 Yr");
  if ([iDate, i2, i10, i30].some((i) => i < 0)) return [];
  const rows: Row[] = [];
  for (const line of lines.slice(1)) {
    const c = line.split(",").map((v) => v.replace(/"/g, "").trim());
    const m = c[iDate]?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const y2 = parseFloat(c[i2]);
    const y10 = parseFloat(c[i10]);
    const y30 = parseFloat(c[i30]);
    if (!m || [y2, y10, y30].some((v) => Number.isNaN(v))) continue;
    rows.push({ date: `${m[3]}-${m[1]}-${m[2]}`, y2, y10, y30 });
  }
  return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
}

async function fetchYear(year: number): Promise<Row[]> {
  const res = await fetch(csvUrl(year), {
    headers: { "User-Agent": "Mozilla/5.0 (MacroEventDesk personal dashboard)" },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`Treasury HTTP ${res.status}`);
  return parse(await res.text());
}

export async function GET() {
  try {
    const year = new Date().getUTCFullYear();
    let rows = await fetchYear(year);
    if (rows.length < 2) rows = [...rows, ...(await fetchYear(year - 1))];
    if (rows.length < 2) throw new Error("데이터 행 부족");
    const [t, p] = rows;
    const bp = (a: number, b: number) => Math.round((a - b) * 100 * 10) / 10;
    const spread = (r: Row) => Math.round((r.y30 - r.y2) * 100 * 10) / 10; // bp
    return NextResponse.json({
      ok: true,
      source: "U.S. Department of the Treasury — Daily Treasury Par Yield Curve Rates",
      sourceUrl: SOURCE_PAGE,
      basis: "일별 종가(공식 고시). 장중 실시간 아님",
      date: t.date,
      prevDate: p.date,
      y2: t.y2,
      y10: t.y10,
      y30: t.y30,
      chg2: bp(t.y2, p.y2),
      chg10: bp(t.y10, p.y10),
      chg30: bp(t.y30, p.y30),
      spread2s30s: spread(t),
      spreadChg: Math.round((spread(t) - spread(p)) * 10) / 10,
      fetchedAt: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e), sourceUrl: SOURCE_PAGE },
      { status: 502 }
    );
  }
}
