"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/config";

export default function Sidebar() {
  const path = usePathname();
  const items = [...NAV, { href: "/settings", label: "Settings", short: "SET" }];
  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <Link href="/" className="mb-4 block px-2">
        <div className="font-mono text-sm font-bold tracking-widest text-desk-amber">MACRO</div>
        <div className="font-mono text-sm font-bold tracking-widest">EVENT DESK</div>
      </Link>
      {items.map((n) => {
        const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm ${
              active ? "bg-desk-panel2 text-white" : "text-desk-dim hover:bg-desk-panel2 hover:text-desk-text"
            } ${n.href === "/settings" ? "mt-auto" : ""}`}
          >
            <span className={`w-8 font-mono text-[10px] ${active ? "text-desk-amber" : ""}`}>{n.short}</span>
            <span className="truncate">{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
