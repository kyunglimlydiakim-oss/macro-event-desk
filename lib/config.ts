// Macro Event Desk — 기본 설정 데이터
// 모든 URL·심볼은 사용자가 Settings 화면에서 수정할 수 있다. 여기 값은 초기값이다.

export type Country = "US" | "JP" | "AU" | "ME" | "GLOBAL";

export interface Site {
  id: string;
  label: string;
  url: string;
  group?: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

// ───────────────────────── 사이트 레지스트리 ─────────────────────────
export const SITES: Record<string, Site> = {
  investing: { id: "investing", label: "Investing.com", url: "https://www.investing.com/" },
  investingCal: { id: "investingCal", label: "Investing.com 경제 캘린더", url: "https://www.investing.com/economic-calendar/" },
  tradingview: { id: "tradingview", label: "TradingView", url: "https://www.tradingview.com/" },
  fedwatch: { id: "fedwatch", label: "CME FedWatch", url: "https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html" },
  fed: { id: "fed", label: "Federal Reserve", url: "https://www.federalreserve.gov/" },
  fedSpeeches: { id: "fedSpeeches", label: "Fed 연설(Speeches)", url: "https://www.federalreserve.gov/newsevents/speeches.htm" },
  fedPress: { id: "fedPress", label: "Fed 보도자료", url: "https://www.federalreserve.gov/newsevents/pressreleases.htm" },
  fomcCal: { id: "fomcCal", label: "FOMC Calendar·의사록", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  bls: { id: "bls", label: "BLS (미 노동통계국)", url: "https://www.bls.gov/" },
  blsCpi: { id: "blsCpi", label: "BLS CPI", url: "https://www.bls.gov/cpi/" },
  blsSchedule: { id: "blsSchedule", label: "BLS CPI 발표 일정", url: "https://www.bls.gov/schedule/news_release/cpi.htm" },
  treasury: { id: "treasury", label: "US Treasury", url: "https://home.treasury.gov/" },
  treasuryYields: {
    id: "treasuryYields",
    label: "US Treasury 일별 수익률곡선",
    url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve",
  },
  boj: { id: "boj", label: "Bank of Japan", url: "https://www.boj.or.jp/en/" },
  bojMpm: { id: "bojMpm", label: "BOJ 회의 일정·의사록", url: "https://www.boj.or.jp/en/mopo/mpmsche_minu/index.htm" },
  bojDecisions: { id: "bojDecisions", label: "BOJ 정책 결정문", url: "https://www.boj.or.jp/en/mopo/mpmdeci/index.htm" },
  bojSpeeches: { id: "bojSpeeches", label: "BOJ 연설·기자회견", url: "https://www.boj.or.jp/en/about/press/index.htm" },
  mof: { id: "mof", label: "Japan MOF", url: "https://www.mof.go.jp/english/" },
  mofIntervention: {
    id: "mofIntervention",
    label: "MOF 외환개입 실적",
    url: "https://www.mof.go.jp/english/policy/international_policy/reference/feio/index.html",
  },
  mofConference: { id: "mofConference", label: "MOF 재무상 기자회견(日)", url: "https://www.mof.go.jp/public_relations/conference/" },
  rba: { id: "rba", label: "Reserve Bank of Australia", url: "https://www.rba.gov.au/" },
  rbaDecisions: { id: "rbaDecisions", label: "RBA 금리 결정", url: "https://www.rba.gov.au/monetary-policy/int-rate-decisions/" },
  rbaMinutes: { id: "rbaMinutes", label: "RBA 의사록", url: "https://www.rba.gov.au/monetary-policy/rba-board-minutes/" },
  rbaSpeeches: { id: "rbaSpeeches", label: "RBA 연설", url: "https://www.rba.gov.au/speeches/" },
  rbaMedia: { id: "rbaMedia", label: "RBA 보도자료", url: "https://www.rba.gov.au/media-releases/" },
  abs: { id: "abs", label: "Australian Bureau of Statistics", url: "https://www.abs.gov.au/" },
  absCpi: {
    id: "absCpi",
    label: "ABS CPI",
    url: "https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/consumer-price-index-australia",
  },
  absLabour: {
    id: "absLabour",
    label: "ABS 노동력 조사(실업률)",
    url: "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia",
  },
  absCalendar: { id: "absCalendar", label: "ABS 발표 일정", url: "https://www.abs.gov.au/release-calendar/future-releases" },
  truth: { id: "truth", label: "Truth Social (@realDonaldTrump)", url: "https://truthsocial.com/@realDonaldTrump" },
  reuters: { id: "reuters", label: "Reuters", url: "https://www.reuters.com/" },
  reutersME: { id: "reutersME", label: "Reuters 중동", url: "https://www.reuters.com/world/middle-east/" },
  ap: { id: "ap", label: "AP News", url: "https://apnews.com/" },
  bloomberg: { id: "bloomberg", label: "Bloomberg", url: "https://www.bloomberg.com/" },
  aljazeera: { id: "aljazeera", label: "Al Jazeera", url: "https://www.aljazeera.com/" },
  nikkei: { id: "nikkei", label: "Nikkei Asia", url: "https://asia.nikkei.com/" },
  cmeCrude: { id: "cmeCrude", label: "CME WTI 선물", url: "https://www.cmegroup.com/markets/energy/crude-oil/light-sweet-crude.html" },
  iceBrent: { id: "iceBrent", label: "ICE 브렌트 선물", url: "https://www.ice.com/products/219/Brent-Crude-Futures" },
  ukmto: { id: "ukmto", label: "UKMTO (해상 보안 경보)", url: "https://www.ukmto.org/" },
  eia: { id: "eia", label: "EIA (미 에너지정보청)", url: "https://www.eia.gov/" },
};

// ───────────────────────── 시장 지표 ─────────────────────────
export type IndicatorKind = "futures" | "yield" | "fx" | "index" | "spread";

export interface Indicator {
  id: string;
  label: string;
  short: string;
  group: "원유" | "미국 금리" | "외환" | "일본" | "호주";
  kind: IndicatorKind;
  tvSymbol: string; // TradingView 심볼 (Settings에서 변경 가능)
  investingUrl?: string;
  note?: string;
}

export const INDICATORS: Indicator[] = [
  {
    id: "wti",
    label: "WTI 선물",
    short: "WTI",
    group: "원유",
    kind: "futures",
    tvSymbol: "NYMEX:CL1!",
    investingUrl: "https://www.investing.com/commodities/crude-oil",
    note: "연속 근월물(CL1!). 실제 계약월은 CME 페이지에서 확인",
  },
  {
    id: "brent",
    label: "브렌트유 선물",
    short: "Brent",
    group: "원유",
    kind: "futures",
    tvSymbol: "ICEEUR:BRN1!",
    investingUrl: "https://www.investing.com/commodities/brent-oil",
    note: "연속 근월물(BRN1!). 실제 계약월은 ICE 페이지에서 확인",
  },
  { id: "us2y", label: "미국 2년물 국채금리", short: "US2Y", group: "미국 금리", kind: "yield", tvSymbol: "TVC:US02Y", investingUrl: "https://www.investing.com/rates-bonds/u.s.-2-year-bond-yield" },
  { id: "us10y", label: "미국 10년물 국채금리", short: "US10Y", group: "미국 금리", kind: "yield", tvSymbol: "TVC:US10Y", investingUrl: "https://www.investing.com/rates-bonds/u.s.-10-year-bond-yield" },
  { id: "us30y", label: "미국 30년물 국채금리", short: "US30Y", group: "미국 금리", kind: "yield", tvSymbol: "TVC:US30Y", investingUrl: "https://www.investing.com/rates-bonds/u.s.-30-year-bond-yield" },
  {
    id: "us2s30s",
    label: "2년물-30년물 스프레드",
    short: "2s30s",
    group: "미국 금리",
    kind: "spread",
    tvSymbol: "TVC:US30Y-TVC:US02Y",
    note: "30Y − 2Y. Treasury 공식 일별 데이터로 자동 계산",
  },
  { id: "dxy", label: "달러인덱스(DXY)", short: "DXY", group: "외환", kind: "index", tvSymbol: "TVC:DXY", investingUrl: "https://www.investing.com/indices/usdollar" },
  { id: "jp2y", label: "일본 2년물 국채금리", short: "JP2Y", group: "일본", kind: "yield", tvSymbol: "TVC:JP02Y", investingUrl: "https://www.investing.com/rates-bonds/japan-2-year-bond-yield" },
  { id: "jp10y", label: "일본 10년물 국채금리", short: "JP10Y", group: "일본", kind: "yield", tvSymbol: "TVC:JP10Y", investingUrl: "https://www.investing.com/rates-bonds/japan-10-year-bond-yield" },
  { id: "usdjpy", label: "USD/JPY", short: "USDJPY", group: "외환", kind: "fx", tvSymbol: "FX:USDJPY", investingUrl: "https://www.investing.com/currencies/usd-jpy" },
  { id: "au3y", label: "호주 3년물 국채금리", short: "AU3Y", group: "호주", kind: "yield", tvSymbol: "TVC:AU03Y", investingUrl: "https://www.investing.com/rates-bonds/australia-3-year-bond-yield" },
  { id: "audusd", label: "AUD/USD", short: "AUDUSD", group: "외환", kind: "fx", tvSymbol: "FX:AUDUSD", investingUrl: "https://www.investing.com/currencies/aud-usd" },
];

export const INDICATOR_BY_ID: Record<string, Indicator> = Object.fromEntries(INDICATORS.map((i) => [i.id, i]));

export function tvChartUrl(symbol: string): string {
  return `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`;
}

// ───────────────────────── 이벤트 프리셋 (원클릭 열기) ─────────────────────────
export interface EventPreset {
  id: string;
  name: string;
  country: Country;
  links: LinkItem[];
}

const site = (id: string): LinkItem => ({ label: SITES[id].label, url: SITES[id].url });
const chart = (id: string): LinkItem => ({
  label: `${INDICATOR_BY_ID[id].short} 차트`,
  url: tvChartUrl(INDICATOR_BY_ID[id].tvSymbol),
});

export const DEFAULT_PRESETS: EventPreset[] = [
  {
    id: "hormuz",
    name: "호르무즈 충돌",
    country: "ME",
    links: [site("truth"), site("reutersME"), site("ap"), chart("wti"), chart("brent"), chart("us10y")],
  },
  {
    id: "us-cpi",
    name: "미국 CPI",
    country: "US",
    links: [site("blsCpi"), site("investingCal"), chart("us2y"), chart("us10y"), chart("us30y"), chart("dxy")],
  },
  {
    id: "fomc",
    name: "FOMC",
    country: "US",
    links: [site("fomcCal"), site("fedwatch"), chart("us2y"), chart("us10y"), chart("us30y"), chart("dxy")],
  },
  {
    id: "fed-speak",
    name: "연준 인사 발언",
    country: "US",
    links: [site("fedSpeeches"), site("reuters"), chart("us2y"), chart("us10y"), chart("us30y"), chart("dxy")],
  },
  {
    id: "jp-fx",
    name: "일본 외환당국 발언",
    country: "JP",
    links: [site("mof"), site("mofConference"), site("reuters"), chart("usdjpy")],
  },
  {
    id: "boj",
    name: "BOJ 금리 결정",
    country: "JP",
    links: [site("bojDecisions"), chart("jp2y"), chart("jp10y"), chart("usdjpy")],
  },
  {
    id: "rba",
    name: "RBA 금리 결정",
    country: "AU",
    links: [site("rbaDecisions"), chart("au3y"), chart("audusd")],
  },
  {
    id: "au-data",
    name: "호주 CPI·실업률",
    country: "AU",
    links: [site("absCpi"), site("absLabour"), chart("au3y"), chart("audusd")],
  },
];

// ───────────────────────── Quick Links ─────────────────────────
export const QUICK_LINK_IDS = [
  "investing",
  "tradingview",
  "fedwatch",
  "fed",
  "treasury",
  "boj",
  "mof",
  "rba",
  "abs",
  "truth",
];

// ───────────────────────── 경제 캘린더 위젯 ─────────────────────────
export interface CalendarSettings {
  countries: number[];
  importance: number[];
  calType: "day" | "week";
  timeZone: number;
  lang: number;
}

// Investing.com 위젯 국가 코드(위젯 생성기 기준). 사용자가 Settings에서 수정 가능.
export const CALENDAR_COUNTRIES: { id: number; label: string }[] = [
  { id: 5, label: "미국" },
  { id: 35, label: "일본" },
  { id: 25, label: "호주" },
  { id: 72, label: "유로존" },
  { id: 4, label: "영국" },
  { id: 37, label: "중국" },
  { id: 11, label: "한국" },
];

export const DEFAULT_CALENDAR: CalendarSettings = {
  countries: [5, 35, 25],
  importance: [2, 3],
  calType: "week",
  timeZone: 88,
  lang: 1,
};

export function investingCalendarSrc(c: CalendarSettings): string {
  const params = new URLSearchParams({
    columns: "exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous",
    importance: c.importance.join(","),
    features: "datepicker,timezone,timeselector,filters",
    countries: c.countries.join(","),
    calType: c.calType,
    timeZone: String(c.timeZone),
    lang: String(c.lang),
  });
  return `https://sslecal2.investing.com/?${params.toString()}`;
}

// ───────────────────────── 메뉴·토픽 페이지 ─────────────────────────
export interface NavItem {
  href: string;
  label: string;
  short: string;
}

export const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", short: "DB" },
  { href: "/calendar", label: "Economic Calendar", short: "CAL" },
  { href: "/middle-east", label: "Middle East & Oil", short: "ME" },
  { href: "/fed", label: "Fed & US Rates", short: "US" },
  { href: "/japan-fx", label: "Japan FX Intervention", short: "FX" },
  { href: "/boj", label: "BOJ & Japan Rates", short: "JP" },
  { href: "/rba", label: "RBA & Australia", short: "AU" },
];

export interface Topic {
  slug: string;
  title: string;
  country: Country;
  watch: string[];
  siteGroups: { title: string; siteIds: string[] }[];
  indicators: string[];
  presets: string[];
}

export const TOPICS: Record<string, Topic> = {
  "middle-east": {
    slug: "middle-east",
    title: "Middle East & Oil",
    country: "ME",
    watch: [
      "호르무즈 해협 충돌",
      "미국·이란 관계",
      "이스라엘 관련 군사 충돌",
      "트럼프 대통령 트루스소셜 게시물",
      "원유 공급 차질·해상 운송 이슈",
    ],
    siteGroups: [
      { title: "발언·뉴스", siteIds: ["truth", "reutersME", "ap", "aljazeera", "bloomberg"] },
      { title: "원유 시장", siteIds: ["cmeCrude", "iceBrent", "eia", "investing", "tradingview"] },
      { title: "해상 운송", siteIds: ["ukmto"] },
    ],
    indicators: ["wti", "brent", "us10y"],
    presets: ["hormuz"],
  },
  fed: {
    slug: "fed",
    title: "Fed & US Rates",
    country: "US",
    watch: ["연준 의장 발언", "연준 이사 발언", "지역 연은 총재 발언", "FOMC 금리 결정", "FOMC 의사록", "미국 CPI 발표"],
    siteGroups: [
      { title: "연준", siteIds: ["fed", "fomcCal", "fedSpeeches", "fedPress"] },
      { title: "지표·금리", siteIds: ["blsCpi", "blsSchedule", "treasuryYields", "fedwatch", "tradingview"] },
    ],
    indicators: ["us2y", "us10y", "us30y", "us2s30s", "dxy"],
    presets: ["fomc", "fed-speak", "us-cpi"],
  },
  "japan-fx": {
    slug: "japan-fx",
    title: "Japan FX Intervention",
    country: "JP",
    watch: ["일본 재무상 발언", "일본 재무관 발언", "외환시장 개입 관련 발언", "실제 외환시장 개입 발표"],
    siteGroups: [
      { title: "일본 재무성", siteIds: ["mof", "mofConference", "mofIntervention"] },
      { title: "뉴스·차트", siteIds: ["reuters", "nikkei", "bloomberg", "tradingview"] },
    ],
    indicators: ["usdjpy"],
    presets: ["jp-fx"],
  },
  boj: {
    slug: "boj",
    title: "BOJ & Japan Rates",
    country: "JP",
    watch: ["BOJ 금리 결정", "통화정책회의 의사록", "정책심의위원 발언", "일본 국채 매입 정책"],
    siteGroups: [
      { title: "일본은행", siteIds: ["boj", "bojMpm", "bojDecisions", "bojSpeeches"] },
      { title: "뉴스·차트", siteIds: ["nikkei", "reuters", "tradingview"] },
    ],
    indicators: ["jp2y", "jp10y", "usdjpy"],
    presets: ["boj"],
  },
  rba: {
    slug: "rba",
    title: "RBA & Australia",
    country: "AU",
    watch: ["RBA 금리 결정", "RBA 의사록", "RBA 총재·정책위원 발언", "호주 CPI", "호주 실업률·고용지표"],
    siteGroups: [
      { title: "호주중앙은행", siteIds: ["rba", "rbaDecisions", "rbaMinutes", "rbaSpeeches", "rbaMedia"] },
      { title: "호주 통계청", siteIds: ["abs", "absCpi", "absLabour", "absCalendar"] },
      { title: "차트", siteIds: ["tradingview"] },
    ],
    indicators: ["au3y", "audusd"],
    presets: ["rba", "au-data"],
  },
};

export const COUNTRY_LABEL: Record<Country, string> = {
  US: "미국",
  JP: "일본",
  AU: "호주",
  ME: "중동",
  GLOBAL: "글로벌",
};
