import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import KstClock from "@/components/KstClock";
import MarketWatch from "@/components/MarketWatch";

export const metadata: Metadata = {
  title: "Macro Event Desk",
  description: "미국·일본·호주 경제지표·통화정책·중동 이슈 모니터링용 개인 대시보드",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <div className="flex min-h-screen">
          <aside className="sticky top-0 hidden h-screen w-56 shrink-0 border-r border-desk-line bg-desk-panel md:block">
            <Sidebar />
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-desk-line bg-desk-bg/95 px-4 py-2 backdrop-blur">
              <details className="md:hidden">
                <summary className="cursor-pointer font-mono text-xs text-desk-amber">☰ MENU</summary>
                <div className="absolute left-0 mt-2 w-60 border border-desk-line bg-desk-panel">
                  <Sidebar />
                </div>
              </details>
              <KstClock />
            </header>
            <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 xl:flex-row">
              <main className="min-w-0 flex-1">{children}</main>
              <aside className="w-full shrink-0 xl:sticky xl:top-14 xl:h-[calc(100vh-4.5rem)] xl:w-80 xl:overflow-y-auto">
                <MarketWatch />
              </aside>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
