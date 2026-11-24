"use client";

import { useState } from "react";
import { QUICK_LINK_IDS, SITES } from "@/lib/config";
import { setState, useAppState } from "@/lib/store";

export default function QuickLinks() {
  const { favorites } = useAppState();
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  const add = () => {
    const u = url.trim();
    if (!/^https?:\/\//i.test(u)) return;
    setState((s) => ({ ...s, favorites: [...s.favorites, { label: label.trim() || new URL(u).hostname, url: u }] }));
    setLabel("");
    setUrl("");
  };

  return (
    <section className="panel p-3">
      <h2 className="panel-title mb-2">Quick Links</h2>
      <div className="flex flex-wrap gap-1">
        {QUICK_LINK_IDS.map((id) => (
          <a key={id} className="btn" href={SITES[id].url} target="_blank" rel="noopener noreferrer">
            {SITES[id].label}
          </a>
        ))}
      </div>

      <h3 className="mt-3 mb-1 font-mono text-[11px] text-desk-dim">★ 즐겨찾기</h3>
      <div className="flex flex-wrap gap-1">
        {favorites.map((f, i) => (
          <span key={f.url + i} className="btn pr-1">
            <a href={f.url} target="_blank" rel="noopener noreferrer">
              {f.label}
            </a>
            <button
              type="button"
              className="px-1 text-desk-dim hover:text-desk-down"
              aria-label={`${f.label} 삭제`}
              onClick={() => setState((s) => ({ ...s, favorites: s.favorites.filter((_, j) => j !== i) }))}
            >
              ✕
            </button>
          </span>
        ))}
        {favorites.length === 0 && <span className="text-xs text-desk-dim">등록된 즐겨찾기가 없습니다.</span>}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <input className="input w-32" placeholder="이름" value={label} onChange={(e) => setLabel(e.target.value)} />
        <input
          className="input min-w-40 flex-1"
          placeholder="https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button type="button" className="btn" onClick={add}>
          + 추가
        </button>
      </div>
    </section>
  );
}
