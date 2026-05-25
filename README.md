# 링크 보관함

카카오톡 나와의 채팅에 던져둔 링크들을 제목·설명·카테고리와 함께 보는 개인 갤러리.

**→ https://daamable-sknk.github.io/link-gallery/**

---

## 왜 만들었나

웹을 돌아다니다가 나중에 다시 보고 싶은 페이지가 생기면, 카카오톡 "나와의 채팅(담)"으로 링크를 보낸다. 앱을 바꿔가며 저장하는 것보다 링크를 공유하는 게 제일 마찰이 없어서 자연스럽게 생긴 습관이다.

문제는 다시 꺼낼 때다. 채팅창에 링크만 쭉 늘어서 있으면 어떤 페이지인지 하나씩 열어봐야만 알 수 있다. 분류도 안 되어 있고, 검색도 잘 안 된다. 쌓일수록 묻혀버린다.

그래서 이걸 만들었다. 링크마다 제목과 설명이 붙어 있고, 카테고리로 걸러볼 수 있고, 검색도 된다. 열어보지 않고도 무슨 링크인지 파악할 수 있는 공간.

---

## 어떻게 동작하나

카카오톡 Mac 앱은 메시지를 로컬 데이터베이스에 동기화해둔다. 이 DB를 직접 읽어서 링크를 뽑고, 각 URL에 접속해 제목과 설명을 가져온다. 수집한 데이터를 React 앱에 내장해 GitHub Pages에 배포한다.

```
카카오톡 로컬 DB  →  URL 추출  →  OG 메타데이터 수집  →  React 앱  →  GitHub Pages
```

카카오 서버나 외부 API는 거치지 않는다. 데이터 수집은 내 맥에서만 일어난다.

기술 상세는 [`docs/how-it-works.md`](docs/how-it-works.md) 참고.

---

## 감사

데이터 수집 파이프라인은 [k-skill](https://github.com/NomaDamas/k-skill)의 `kakaotalk-mac` 스킬과 [kakaocli](https://github.com/silver-flight-group/kakaocli)를 참고해 만들었다. 카카오톡 Mac DB의 암호화 키 계산 방식과 파일 경로 탐색 로직은 k-skill의 `kakaotalk_mac.py` 헬퍼 코드를 기반으로 한다.

---

## 파일 구조

```
link-gallery/                  ← 이 레포 (React 앱 + GitHub Pages 배포)
  src/
    App.tsx                    ← 갤러리 UI
    data/links.json            ← 수집된 링크 데이터
  docs/
    how-it-works.md           ← 기술 상세
    update.md                 ← 업데이트 방법
  .github/workflows/
    deploy.yml                ← push 시 자동 배포

~/docs/daam/link-collector/   ← 데이터 수집 스크립트 (레포 외부, 로컬 전용)
  parse_kakaocli_output.py
  fetch_og.py
  build_canvas.py
  update_canvas.sh
```

---

업데이트 방법은 [`docs/update.md`](docs/update.md) 참고.
