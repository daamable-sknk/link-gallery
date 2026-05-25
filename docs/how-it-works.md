# 동작 원리 상세

> 데이터 수집 파이프라인은 [k-skill](https://github.com/NomaDamas/k-skill)(`kakaotalk-mac` 스킬)과 [kakaocli](https://github.com/silver-flight-group/kakaocli)를 기반으로 한다. 특히 카카오톡 DB 암호화 키 계산 알고리즘은 k-skill의 `kakaotalk_mac.py` 헬퍼에서 가져왔다.

## 카카오톡 DB 복호화

카카오톡 Mac은 메시지를 SQLCipher로 암호화된 SQLite 파일에 저장한다. 파일명도 평문이 아니라 사용자 정보로 유도된 hex 문자열이다.

### 복호화 키 계산

kakaocli([silver-flight-group/kakaocli](https://github.com/silver-flight-group/kakaocli))가 다음 두 값으로 키를 계산한다.

| 입력값 | 출처 |
|---|---|
| `user_id` | 카카오톡 설정 plist |
| `uuid` | macOS `ioreg` (IOPlatformUUID) |

```
key = PBKDF2-SHA256(
  password = "F".join(["A", hashed_uuid, "|", "F", uuid[:5], "H", str(user_id), "|", uuid[7:]])[::-1],
  salt     = uuid[int(len(uuid)*0.3):],
  iterations = 100,000,
  dklen    = 128
).hex()
```

### 테이블 구조

DB에는 19개 테이블이 있다. 링크 추출에 쓰는 테이블은 두 개다.

**`NTChatRoom`** — 채팅방 목록

| 컬럼 | 설명 |
|---|---|
| `chatId` | 채팅방 고유 ID |
| `type` | 채팅방 유형 (1인 오픈채팅 등) |
| `chatName` | 채팅방 이름 (없을 수 있음) |

나와의 채팅은 `NTUser` 테이블에서 자신의 `chatId`를 확인해 찾는다.

**`NTChatMessage`** — 메시지

| 컬럼 | 설명 |
|---|---|
| `chatId` | 속한 채팅방 |
| `message` | 메시지 본문 (URL 포함) |
| `sentAt` | Unix timestamp |
| `authorId` | 발신자 ID |

## OG 메타데이터 파싱

HTTP 응답 HTML에서 정규식으로 메타 태그를 추출한다. 우선순위는 다음 순서다.

1. `og:title`, `og:description`, `og:image`
2. `twitter:title`, `twitter:description`, `twitter:image`
3. `<title>` 태그

Instagram, Threads, X(Twitter)는 로그인 없이 OG 태그를 반환하지 않는다. 이 경우 URL path를 제목으로 대신 사용한다.

## 카테고리 자동 분류

도메인 기반 정규식으로 카테고리를 자동 할당한다.

| 카테고리 | 도메인 패턴 |
|---|---|
| SNS | instagram.com, threads.com, twitter.com, x.com |
| 영상 | youtube.com, youtu.be, tiktok.com |
| 개발 | github.com, stackoverflow.com, dev.to, medium.com |
| 뉴스/정보 | naver.com, 각종 언론사 |
| 문서 | notion.so, docs.google.com |
| 금융 | stripe.com, toss.im |
| 기타 | 위에 해당 없음 |

## GitHub Pages 배포

`.github/workflows/deploy.yml`이 `main` 브랜치에 push될 때마다 실행된다.

```
push → npm ci → npm run build → upload dist/ → deploy to Pages
```

`vite.config.ts`의 `base: "/link-gallery/"` 설정으로 서브패스를 맞춘다.
