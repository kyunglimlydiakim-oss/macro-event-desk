"use client";

// 개인용 설정 저장소. 브라우저 localStorage에 저장한다.
// (Supabase 연동은 범위 밖. JSON 내보내기/가져오기로 기기 간 이동을 지원한다.)

import { useSyncExternalStore } from "react";
import {
  CalendarSettings,
  Country,
  DEFAULT_CALENDAR,
  DEFAULT_PRESETS,
  EventPreset,
  INDICATORS,
  LinkItem,
} from "./config";

export interface MyEvent {
  id: string;
  date: string; // YYYY-MM-DD (KST)
  time: string; // HH:mm (KST), 빈 문자열이면 시간 미정
  title: string;
  country: Country;
  presetId: string; // 연결된 원클릭 프리셋, 없으면 ""
  memo?: string;
}

export interface AppState {
  version: 1;
  presets: EventPreset[];
  favorites: LinkItem[];
  myEvents: MyEvent[];
  symbols: Record<string, string>; // indicatorId → TradingView 심볼
  calendar: CalendarSettings;
}

const KEY = "macro-event-desk:v1";

export function defaultState(): AppState {
  return {
    version: 1,
    presets: structuredClone(DEFAULT_PRESETS),
    favorites: [],
    myEvents: [],
    symbols: Object.fromEntries(INDICATORS.map((i) => [i.id, i.tvSymbol])),
    calendar: { ...DEFAULT_CALENDAR },
  };
}

const SERVER_STATE = defaultState();
let current: AppState | null = null;
const listeners = new Set<() => void>();

function normalize(raw: unknown): AppState {
  const base = defaultState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<AppState>;
  return {
    version: 1,
    presets: Array.isArray(r.presets) ? r.presets : base.presets,
    favorites: Array.isArray(r.favorites) ? r.favorites : base.favorites,
    myEvents: Array.isArray(r.myEvents) ? r.myEvents : base.myEvents,
    symbols: { ...base.symbols, ...(r.symbols ?? {}) },
    calendar: { ...base.calendar, ...(r.calendar ?? {}) },
  };
}

function load(): AppState {
  if (current) return current;
  try {
    const s = window.localStorage.getItem(KEY);
    current = s ? normalize(JSON.parse(s)) : defaultState();
  } catch {
    current = defaultState();
  }
  return current;
}

export function setState(updater: (s: AppState) => AppState) {
  current = updater(load());
  try {
    window.localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    /* 저장 실패(사생활 보호 모드 등) 시에도 세션 내에서는 동작 */
  }
  listeners.forEach((l) => l());
}

export function replaceState(raw: unknown) {
  setState(() => normalize(raw));
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, load, () => SERVER_STATE);
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ───────── 여러 탭 동시 열기 ─────────
// 반드시 사용자 클릭 핸들러 안에서 동기적으로 호출해야 한다.
// 브라우저는 한 번의 클릭에 팝업 1개만 허용하는 경우가 많으므로,
// 차단된 링크 수를 돌려주어 화면에 안내한다.
export function openAll(links: LinkItem[]): { opened: number; blocked: LinkItem[] } {
  const blocked: LinkItem[] = [];
  let opened = 0;
  for (const l of links) {
    // "noopener" 옵션을 주면 성공해도 null이 반환되어 차단 여부를 알 수 없다.
    // 그래서 옵션 없이 연 뒤 opener 참조를 직접 끊는다.
    const w = window.open(l.url, "_blank");
    if (!w) {
      blocked.push(l);
      continue;
    }
    try {
      w.opener = null;
    } catch {
      /* 무시 */
    }
    opened++;
  }
  return { opened, blocked };
}
