// 위젯 표시 가능 여부를 시험할 후보 심볼.
// 존재하지 않거나 라이선스로 막힌 심볼은 위젯에서 빈칸으로 나온다. 그것이 곧 시험 결과다.
// type: FUT=거래소 선물, CFD=중개사 차액결제 시세(선물·지수와 값이 다를 수 있음),
//       YLD=수익률(%), PX=채권 가격(수익률 아님), IDX=지수, FX=외환
export interface Candidate {
  symbol: string;
  type: "FUT" | "CFD" | "YLD" | "PX" | "IDX" | "FX";
}

export const CANDIDATES: Record<string, Candidate[]> = {
  wti: [
    { symbol: "NYMEX:CL1!", type: "FUT" },
    { symbol: "TVC:USOIL", type: "CFD" },
    { symbol: "OANDA:WTICOUSD", type: "CFD" },
    { symbol: "FX:USOIL", type: "CFD" },
    { symbol: "CAPITALCOM:OIL_CRUDE", type: "CFD" },
    { symbol: "PEPPERSTONE:SPOTCRUDE", type: "CFD" },
    { symbol: "BLACKBULL:WTI", type: "CFD" },
  ],
  brent: [
    { symbol: "ICEEUR:BRN1!", type: "FUT" },
    { symbol: "TVC:UKOIL", type: "CFD" },
    { symbol: "OANDA:BCOUSD", type: "CFD" },
    { symbol: "FX:UKOIL", type: "CFD" },
    { symbol: "CAPITALCOM:OIL_BRENT", type: "CFD" },
    { symbol: "PEPPERSTONE:SPOTBRENT", type: "CFD" },
    { symbol: "BLACKBULL:BRENT", type: "CFD" },
  ],
  us2y: [
    { symbol: "TVC:US02Y", type: "YLD" },
    { symbol: "FRED:DGS2", type: "YLD" },
    { symbol: "CBOT:ZT1!", type: "FUT" },
    { symbol: "OANDA:USB02YUSD", type: "PX" },
  ],
  us10y: [
    { symbol: "TVC:US10Y", type: "YLD" },
    { symbol: "FRED:DGS10", type: "YLD" },
    { symbol: "CBOT:ZN1!", type: "FUT" },
    { symbol: "OANDA:USB10YUSD", type: "PX" },
  ],
  us30y: [
    { symbol: "TVC:US30Y", type: "YLD" },
    { symbol: "FRED:DGS30", type: "YLD" },
    { symbol: "CBOT:ZB1!", type: "FUT" },
    { symbol: "OANDA:USB30YUSD", type: "PX" },
  ],
  dxy: [
    { symbol: "TVC:DXY", type: "IDX" },
    { symbol: "ICEUS:DX1!", type: "FUT" },
    { symbol: "CAPITALCOM:DXY", type: "CFD" },
    { symbol: "PEPPERSTONE:USDX", type: "CFD" },
    { symbol: "OANDA:USDOLLAR", type: "CFD" },
  ],
  jp2y: [{ symbol: "TVC:JP02Y", type: "YLD" }],
  jp10y: [
    { symbol: "TVC:JP10Y", type: "YLD" },
    { symbol: "OSE:JGBL1!", type: "FUT" },
  ],
  usdjpy: [
    { symbol: "FX:USDJPY", type: "FX" },
    { symbol: "OANDA:USDJPY", type: "FX" },
    { symbol: "FX_IDC:USDJPY", type: "FX" },
  ],
  au3y: [
    { symbol: "TVC:AU03Y", type: "YLD" },
    { symbol: "ASX24:YT1!", type: "FUT" },
  ],
  audusd: [
    { symbol: "FX:AUDUSD", type: "FX" },
    { symbol: "OANDA:AUDUSD", type: "FX" },
    { symbol: "FX_IDC:AUDUSD", type: "FX" },
  ],
};
