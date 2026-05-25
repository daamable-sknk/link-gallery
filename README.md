# 링크 보관함

카카오톡 나와의 채팅에 저장해둔 링크를 한눈에 보고 검색하는 갤러리.

**→ https://daamable-sknk.github.io/link-gallery/**

---

## 배경

웹 서핑 중 나중에 볼 만한 페이지를 발견하면 카카오톡 "나와의 채팅(담)"으로 공유한다. 링크 전송이 가장 마찰이 적기 때문이다. 문제는 나중에 다시 찾을 때다. 어떤 링크인지 확인하려면 하나씩 열어봐야 하고, 분류도 되어 있지 않아서 쌓일수록 쓸모가 줄어든다.

이 프로젝트는 그 링크들을 제목·설명·카테고리와 함께 갤러리 형태로 만들어 검색하고 골라볼 수 있게 한다.

---

## 동작 원리

```
카카오톡 Mac DB  →  URL 추출  →  OG 메타데이터 수집  →  React 앱  →  GitHub Pages
```

### 1단계 — 카카오톡 DB 접근

카카오톡 Mac 앱은 서버에서 받은 메시지를 로컬 SQLCipher 데이터베이스에 동기화해둔다.

- **DB 위치**: `~/Library/Containers/com.kakao.KakaoTalkMac/Data/Library/Application Support/com.kakao.KakaoTalkMac/`
- **파일명**: 78자 hex 문자열 (사용자 ID + 기기 UUID로 유도)
- **암호화**: SQLCipher 4. 복호화 키는 user_id와 IOPlatformUUID를 PBKDF2-SHA256으로 조합해 계산한다.

[kakaocli](https://github.com/silver-flight-group/kakaocli)(Swift 오픈소스)가 키 계산과 DB 접근을 담당한다.

### 2단계 — URL 추출

`NTChatMessage` 테이블에서 나와의 채팅방(`chatId = 128250528723219`) 메시지 중 `http`가 포함된 행만 뽑는다.

```sql
SELECT message, sentAt
FROM NTChatMessage
WHERE chatId = 128250528723219
  AND message LIKE '%http%'
ORDER BY sentAt DESC
LIMIT 300;
```

### 3단계 — OG 메타데이터 수집

각 URL에 HTTP 요청을 보내 HTML에서 Open Graph 태그를 파싱한다.

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
```

10개 스레드를 병렬로 실행해 약 300개를 1~2분 안에 처리한다. Instagram, Threads 등 로그인이 필요한 SNS는 제목을 못 가져오므로 URL path를 대신 표시한다.

### 4단계 — 갤러리 렌더링

수집한 데이터를 Vite + React 앱에 정적으로 내장해 빌드한다. GitHub Actions가 `main` 브랜치 push 시 자동으로 GitHub Pages에 배포한다.

---

## 파일 구조

```
link-gallery/          ← 이 레포 (React 앱)
  src/
    App.tsx            ← 갤러리 UI
    data/links.json    ← 수집된 링크 데이터 (빌드 시 내장)
  docs/
    how-it-works.md   ← 기술 상세
    update.md         ← 업데이트 방법
  .github/workflows/
    deploy.yml        ← GitHub Actions 배포

~/docs/daam/link-collector/   ← 데이터 수집 스크립트 (레포 외부)
  parse_kakaocli_output.py   ← kakaocli JSON → 링크 배열
  fetch_og.py                ← OG 메타데이터 수집
  build_canvas.py            ← Canvas.tsx 생성 (Cursor용)
  update_canvas.sh           ← 전체 파이프라인 실행
```

---

## 업데이트

링크가 더 쌓이면 [`docs/update.md`](docs/update.md) 참고.
