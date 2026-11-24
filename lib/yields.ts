// 각국 공식 기관이 공개하는 '일별 국채금리' CSV를 읽는 서버용 파서.
// 자체 DB 없이, 요청 시 원문을 받아 최근 2영업일 값을 비교한다.

export interface YieldPoint {
  key: string; // "2Y", "10Y" 등
  label: string;
  value: number; // %
  chgBp: number | null; // 전 영업일 대비 bp
}

export interface YieldPayload {
  ok: true;
  country: "US" | "JP" | "AU";
  source: string;
  sourceUrl: string;
  basis: string;
  date: string; // YYYY-MM-DD
  prevDate: string | null;
  points: YieldPoint[];
  spread?: { label: string; bp: number; chgBp: number | null };
  fetchedAt: string;
}

export interface YieldError {
  ok: false;
  country: "US" | "JP" | "AU";
  error: string;
  sourceUrl: string;
}

export type Row = { date: string; values: Record<string, number> };

const UA = { "User-Agent": "Mozilla/5.0 (MacroEventDesk personal dashboard)" };

export async function fetchText(url: string, revalidate: number): Promise<string> {
  const res = await fetch(url, { headers: UA, next: { revalidate } });
  if (!res.ok) throw new Error(`HTTP ${res.status} (${new URL(url).hostname})`);
  const buf = await res.arrayBuffer();
  // UTF-8로 읽되 BOM 제거
  return new TextDecoder("utf-8").decode(buf).replace(/^﻿/, "");
}

export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

const MONTHS: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

const pad = (n: string | number) => String(n).padStart(2, "0");

// 여러 날짜 표기를 YYYY-MM-DD로 통일한다.
// 지원: MM/DD/YYYY, YYYY/M/D, YYYY-MM-DD, DD-Mon-YYYY, 일본 연호 R8.11.20 / H31.4.1
export function normDate(s: string): string | null {
  s = s.trim();
  let m: RegExpMatchArray | null;
  if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))) return `${m[3]}-${pad(m[1])}-${pad(m[2])}`;
  if ((m = s.match(/^(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})$/))) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  if ((m = s.match(/^(\d{1,2})[- ]([A-Za-z]{3})[- ](\d{4})$/))) {
    const mm = MONTHS[m[2].toLowerCase()];
    return mm ? `${m[3]}-${mm}-${pad(m[1])}` : null;
  }
  if ((m = s.match(/^([RH])(\d{1,2})\.(\d{1,2})\.(\d{1,2})$/))) {
    const y = (m[1] === "R" ? 2018 : 1988) + Number(m[2]);
    return `${y}-${pad(m[3])}-${pad(m[4])}`;
  }
  return null;
}

// 최신 2개 행을 비교해 결과를 만든다. 값이 빈 날(휴장 등)은 건너뛴다.
export function latestTwo(rows: Row[], keys: string[]): [Row, Row | null] {
  const valid = rows
    .filter((r) => keys.every((k) => Number.isFinite(r.values[k])))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  if (!valid.length) throw new Error("유효한 데이터 행이 없습니다");
  return [valid[0], valid[1] ?? null];
}

export const bp = (a: number, b: number | undefined | null) =>
  b === undefined || b === null ? null : Math.round((a - b) * 1000) / 10;

// ───────── 미국: US Treasury Daily Par Yield Curve ─────────
export function parseTreasury(text: string): Row[] {
  const lines = text.trim().split(/\r?\n/);
  const header = splitCsvLine(lines[0]);
  const idx = { date: header.indexOf("Date"), "2Y": header.indexOf("2 Yr"), "10Y": header.indexOf("10 Yr"), "30Y": header.indexOf("30 Yr") };
  if (Object.values(idx).some((i) => i < 0)) throw new Error("Treasury CSV 열 구조가 예상과 다릅니다");
  const rows: Row[] = [];
  for (const line of lines.slice(1)) {
    const c = splitCsvLine(line);
    const date = normDate(c[idx.date] ?? "");
    if (!date) continue;
    rows.push({
      date,
      values: { "2Y": parseFloat(c[idx["2Y"]]), "10Y": parseFloat(c[idx["10Y"]]), "30Y": parseFloat(c[idx["30Y"]]) },
    });
  }
  return rows;
}

// ───────── 일본: 재무성 국채 금리 정보 (jgbcme.csv) ─────────
// 머리글 행에서 "2Y"·"10Y" 열을 찾는다. 날짜는 서기 또는 연호 모두 처리한다.
export function parseMof(text: string): Row[] {
  const lines = text.split(/\r?\n/);
  const hi = lines.findIndex((l) => {
    const c = splitCsvLine(l);
    return c.includes("2Y") && c.includes("10Y");
  });
  if (hi < 0) throw new Error("MOF CSV에서 2Y·10Y 열을 찾지 못했습니다");
  const header = splitCsvLine(lines[hi]);
  const i2 = header.indexOf("2Y");
  const i10 = header.indexOf("10Y");
  const rows: Row[] = [];
  for (const line of lines.slice(hi + 1)) {
    const c = splitCsvLine(line);
    const date = normDate(c[0] ?? "");
    if (!date) continue;
    rows.push({ date, values: { "2Y": parseFloat(c[i2]), "10Y": parseFloat(c[i10]) } });
  }
  return rows;
}

// ───────── 호주: RBA 통계표 F2 (Capital Market Yields – Government Bonds, daily) ─────────
// 메타데이터 행 가운데 'Series ID' 행에서 3년물(FCMYGBAG3D) 열을 찾는다.
// 없으면 'Title' 행에서 "3 year" 문구로 찾는다.
export function parseRbaF2(text: string): Row[] {
  const lines = text.split(/\r?\n/).map(splitCsvLine);
  const sid = lines.find((c) => c[0] === "Series ID");
  const title = lines.find((c) => c[0] === "Title");
  let i3 = sid ? sid.indexOf("FCMYGBAG3D") : -1;
  if (i3 < 0 && title) i3 = title.findIndex((t) => /3[ -]year/i.test(t));
  if (i3 < 0) throw new Error("RBA F2에서 3년물 열을 찾지 못했습니다");
  const rows: Row[] = [];
  for (const c of lines) {
    const date = normDate(c[0] ?? "");
    if (!date) continue;
    rows.push({ date, values: { "3Y": parseFloat(c[i3]) } });
  }
  return rows;
}
