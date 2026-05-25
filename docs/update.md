# 링크 갤러리 업데이트

링크가 더 쌓이면 아래 순서로 갱신한다.

## 사전 조건

- 카카오톡 Mac 앱이 실행 중이고 동기화된 상태
- 터미널 앱에 **전체 디스크 접근 권한** 부여  
  (시스템 설정 → 개인정보 보호 및 보안 → 전체 디스크 접근)
- kakaocli 빌드: `/tmp/kakaocli/.build/release/kakaocli`  
  재부팅 후 없어지면 아래 명령으로 재빌드 (약 2분)
  ```bash
  cd /tmp/kakaocli && swift build -c release
  ```
  또는 영구 위치에 복사해두기:
  ```bash
  cp /tmp/kakaocli/.build/release/kakaocli ~/.local/bin/kakaocli
  ```

## 업데이트 절차

### 1. 링크 데이터 갱신

```bash
cd ~/docs/daam/link-collector
./update_canvas.sh          # 최근 300개
./update_canvas.sh 500      # 더 많이 가져오려면 숫자 조정
```

완료되면 `/tmp/links_with_meta.json`에 결과가 저장된다.

### 2. 갤러리 앱 데이터 교체

```bash
python3 - << 'EOF'
import json, re, urllib.parse

DOMAIN_CATEGORIES = [
    (re.compile(r'instagram\.com'), 'SNS'),
    (re.compile(r'threads\.(com|net)'), 'SNS'),
    (re.compile(r'twitter\.com|x\.com'), 'SNS'),
    (re.compile(r'youtube\.com|youtu\.be'), '영상'),
    (re.compile(r'github\.com'), '개발'),
    (re.compile(r'stackoverflow\.com|dev\.to|medium\.com'), '개발'),
    (re.compile(r'naver\.com|news\.|press\.'), '뉴스/정보'),
    (re.compile(r'notion\.so|docs\.google'), '문서'),
    (re.compile(r'stripe\.com|toss\.im'), '금융'),
]

def categorize(url):
    for pattern, cat in DOMAIN_CATEGORIES:
        if pattern.search(url):
            return cat
    return '기타'

data = json.load(open('/tmp/links_with_meta.json'))
compact = []
for d in data:
    url = d.get('url', '')
    title = d.get('title', '') or d.get('domain', '')
    if title.lower() in ('instagram', 'instagram.com', 'www.instagram.com',
                          'threads', 'threads.com', 'www.threads.com'):
        p = urllib.parse.urlparse(url)
        title = p.path.strip('/')[:60] or d.get('domain', '')
    compact.append({
        'url': url, 'title': title[:80],
        'description': d.get('description', '')[:120],
        'domain': d.get('domain', ''), 'date': d.get('date', ''),
        'category': d.get('category') or categorize(url),
        'image': d.get('image', '')[:300] if d.get('image') else '',
    })

out = '/Users/skunk/docs/daam/link-gallery/src/data/links.json'
with open(out, 'w') as f:
    json.dump(compact, f, ensure_ascii=False)
print(f'{len(compact)}개 링크 저장 완료')
EOF
```

### 3. 빌드 및 배포

```bash
cd ~/docs/daam/link-gallery
npm run build
git add src/data/links.json
git commit -m "링크 업데이트 $(date '+%Y-%m-%d')"
git push
```

push 후 GitHub Actions가 자동으로 배포한다. 1~2분 후 반영.

## 카테고리 추가

`src/App.tsx` 상단의 `CATEGORY_ORDER` 배열에 원하는 카테고리를 추가하고,  
`link-collector/build_canvas.py`의 `DOMAIN_CATEGORIES`에 도메인 패턴을 추가한다.
