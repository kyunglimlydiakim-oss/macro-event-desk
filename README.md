# Macro Event Desk

미국·일본·호주 경제지표, 중앙은행 통화정책, 중동 지정학 이슈를 모니터링하는 개인용 대시보드다.
데이터를 직접 생산하지 않는다. 공식 사이트·금융정보 사이트로 빠르게 연결하는 통합 접속 플랫폼이다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

Vercel에서 이 저장소를 Import하면 Next.js로 자동 인식된다. 환경변수는 필요 없다.

## 메뉴

| 경로 | 화면 |
|---|---|
| `/` | Dashboard — 경제 캘린더, Event Launcher, 향후 7일 My Events, Quick Links·즐겨찾기 |
| `/calendar` | Economic Calendar — 국가·중요도·기간 필터, My Events 전체 |
| `/middle-east` `/fed` `/japan-fx` `/boj` `/rba` | 이벤트별 상세 — 모니터링 대상, 연결 사이트, 원클릭 세트, 지표 차트 |
| `/settings` | 원클릭 세트 편집, TradingView 심볼, 캘린더 위젯 코드, JSON 백업·복원 |

우측(좁은 화면에서는 하단)에 Market Watch가 항상 고정된다.

## 핵심 기능: 원클릭 열기

- 이벤트 세트(▶ 버튼)를 누르면 등록된 URL이 순서대로 새 탭에 열린다.
- 브라우저는 클릭 1회당 팝업 1개만 허용하는 경우가 많다. 처음 한 번 주소창의 팝업 차단 아이콘에서 이 사이트를 **항상 허용**으로 바꿔야 한다. 차단된 탭은 버튼 아래에 링크로 표시된다.
- 세트는 Settings에서 추가·삭제·순서 변경할 수 있고, 브라우저 localStorage에 저장된다.

## 데이터 출처와 한계

| 항목 | 출처 | 성격 |
|---|---|---|
| 시세 | TradingView Market Quotes 위젯 | 실시간 또는 지연. 라이선스상 외부 위젯에 표시되지 않는 심볼이 있음(`/symbol-test`에서 확인) |
| US 2Y/10Y/30Y, 2s30s | 미 재무부 Daily Par Yield Curve CSV (`/api/yields/us`) | 공식 일별 공시값, bp 변화 자동 계산 |
| JP 2Y/10Y | 일본 재무성 국채금리 CSV `jgbcme.csv` (`/api/yields/jp`) | 공식 일별 공시값 |
| AU 3Y | RBA 통계표 F2 일별 CSV (`/api/yields/au`) | 공식 일별 공시값, 게시 지연 가능 |
| 경제 캘린더 | Investing.com 위젯(iframe) | 위젯 내부 클릭은 앱에서 감지 불가 |

- 유가는 연속 근월물(`NYMEX:CL1!`, `ICEEUR:BRN1!`)이다. 계약월은 CME·ICE 링크에서 확인한다.
- TradingView 위젯의 국채금리 변화폭은 %p 단위다(0.01 = 1bp).
- 중앙은행 회의일 등은 앱이 임의로 채우지 않는다. 공식 일정에서 확인한 뒤 My Events에 입력한다.

## 배포 전 확인할 사항 (개발 환경에서 외부 접속이 막혀 미검증)

1. Investing.com 위젯 `timeZone=88`이 KST인지 확인한다. 다르면 Settings에서 코드를 바꾼다.
2. TradingView 위젯에서 `NYMEX:CL1!`, `ICEEUR:BRN1!`, `TVC:AU03Y` 등이 표시되는지 확인한다. "symbol unavailable"이면 Settings에서 심볼을 바꾼다.
3. `/symbol-test` 하단 '공식 국채금리 API 점검'에서 세 API가 `ok: true`인지 확인한다. 파서는 원문 형식을 추정해 예시 데이터로만 시험했다.

## 초기 버전 제외 범위

뉴스 크롤링, 트루스소셜 자동 수집, AI 요약·분석, 자체 시세 DB, 알림 엔진은 넣지 않았다.
