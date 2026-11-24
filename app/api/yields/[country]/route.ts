// 공식 기관 일별 국채금리: /api/yields/us · /api/yields/jp · /api/yields/au
import { NextResponse } from "next/server";
import {
  bp,
  fetchText,
  latestTwo,
  parseMof,
  parseRbaF2,
  parseTreasury,
  Row,
  YieldError,
  YieldPayload,
} from "@/lib/yields";

export const revalidate = 3600;
const TTL = 3600;

type C = "us" | "jp" | "au";

const SPEC = {
  us: {
    country: "US" as const,
    source: "U.S. Department of the Treasury — Daily Treasury Par Yield Curve Rates",
    sourceUrl: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve",
    basis: "일별 공시값(장 마감 기준). 장중 시세 아님",
    keys: ["2Y", "10Y", "30Y"],
  },
  jp: {
    country: "JP" as const,
    source: "Ministry of Finance Japan — JGB Interest Rate",
    sourceUrl: "https://www.mof.go.jp/english/policy/jgbs/reference/interest_rate/index.htm",
    basis: "일별 공시값(재무성 기준금리). 장중 시세 아님",
    keys: ["2Y", "10Y"],
  },
  au: {
    country: "AU" as const,
    source: "Reserve Bank of Australia — Statistical Table F2 (daily)",
    sourceUrl: "https://www.rba.gov.au/statistics/tables/#interest-rates",
    basis: "일별 공시값(RBA 집계, 게시 주기에 따라 수일 지연 가능). 장중 시세 아님",
    keys: ["3Y"],
  },
};

async function loadRows(c: C): Promise<Row[]> {
  if (c === "us") {
    const y = new Date().getUTCFullYear();
    const url = (yr: number) =>
      `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${yr}/all?type=daily_treasury_yield_curve&field_tdr_date_value=${yr}&page&_format=csv`;
    let rows = parseTreasury(await fetchText(url(y), TTL));
    if (rows.length < 2) rows = rows.concat(parseTreasury(await fetchText(url(y - 1), TTL)));
    return rows;
  }
  if (c === "jp") {
    const base = "https://www.mof.go.jp/english/policy/jgbs/reference/interest_rate";
    let rows = parseMof(await fetchText(`${base}/jgbcme.csv`, TTL));
    // 월초에는 당월 파일에 1행만 있을 수 있어 전체 이력 파일로 보완한다.
    if (rows.filter((r) => Number.isFinite(r.values["10Y"])).length < 2)
      rows = rows.concat(parseMof(await fetchText(`${base}/historical/jgbcme_all.csv`, TTL)));
    return rows;
  }
  return parseRbaF2(await fetchText("https://www.rba.gov.au/statistics/tables/csv/f2-data.csv", TTL));
}

export async function GET(_req: Request, { params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (!(country in SPEC)) return NextResponse.json({ error: "unknown country" }, { status: 404 });
  const c = country as C;
  const s = SPEC[c];
  try {
    const rows = await loadRows(c);
    const [t, p] = latestTwo(rows, s.keys);
    const body: YieldPayload = {
      ok: true,
      country: s.country,
      source: s.source,
      sourceUrl: s.sourceUrl,
      basis: s.basis,
      date: t.date,
      prevDate: p?.date ?? null,
      points: s.keys.map((k) => ({ key: k, label: `${s.country}${k}`, value: t.values[k], chgBp: bp(t.values[k], p?.values[k]) })),
      fetchedAt: new Date().toISOString(),
    };
    if (c === "us") {
      const sp = (r: Row) => (r.values["30Y"] - r.values["2Y"]) * 100;
      body.spread = {
        label: "2s30s",
        bp: Math.round(sp(t) * 10) / 10,
        chgBp: p ? Math.round((sp(t) - sp(p)) * 10) / 10 : null,
      };
    }
    return NextResponse.json(body);
  } catch (e) {
    const body: YieldError = { ok: false, country: s.country, error: e instanceof Error ? e.message : String(e), sourceUrl: s.sourceUrl };
    return NextResponse.json(body, { status: 502 });
  }
}
