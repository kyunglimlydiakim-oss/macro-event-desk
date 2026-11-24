"use client";

import { useState } from "react";
import { COUNTRY_LABEL, EventPreset, LinkItem } from "@/lib/config";
import { openAll, useAppState } from "@/lib/store";

// 이벤트 프리셋 버튼. 클릭 한 번으로 등록된 사이트를 새 탭으로 동시에 연다.
export function LaunchButton({ preset, compact = false }: { preset: EventPreset; compact?: boolean }) {
  const [blocked, setBlocked] = useState<LinkItem[] | null>(null);
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        className={compact ? "btn btn-primary" : "btn btn-primary w-full justify-between"}
        onClick={() => {
          const r = openAll(preset.links);
          setBlocked(r.blocked.length ? r.blocked : null);
        }}
        title={preset.links.map((l) => l.label).join("\n")}
      >
        <span>▶ {preset.name}</span>
        {!compact && <span className="font-mono text-[10px] opacity-80">{preset.links.length} tabs</span>}
      </button>
      {blocked && <BlockedNotice blocked={blocked} onClose={() => setBlocked(null)} />}
    </div>
  );
}

function BlockedNotice({ blocked, onClose }: { blocked: LinkItem[]; onClose: () => void }) {
  return (
    <div className="rounded border border-desk-amber/50 bg-desk-amber/10 p-2 text-[11px]">
      <div className="mb-1 flex justify-between gap-2">
        <span className="text-desk-amber">
          브라우저가 탭 {blocked.length}개를 차단했습니다. 주소창의 팝업 차단 아이콘에서 이 사이트를 &apos;항상 허용&apos;으로
          바꾸면 다음부터 한 번에 열립니다.
        </span>
        <button type="button" onClick={onClose} className="text-desk-dim hover:text-white" aria-label="닫기">
          ✕
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {blocked.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="btn">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function EventLauncher({ only, title = "Event Launcher" }: { only?: string[]; title?: string }) {
  const { presets } = useAppState();
  const list = only ? presets.filter((p) => only.includes(p.id)) : presets;
  return (
    <section className="panel p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="panel-title">{title}</h2>
        <a href="/settings#presets" className="text-[11px] text-desk-dim hover:text-desk-text">
          편집 →
        </a>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {list.map((p) => (
          <div key={p.id} className="flex flex-col gap-1">
            <LaunchButton preset={p} />
            <div className="truncate px-1 text-[10px] text-desk-dim">
              <span className="mr-1 text-desk-amber">{COUNTRY_LABEL[p.country]}</span>
              {p.links.map((l) => l.label).join(" · ")}
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="text-xs text-desk-dim">등록된 이벤트가 없습니다.</div>}
      </div>
    </section>
  );
}
