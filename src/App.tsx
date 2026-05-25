import { useState, useMemo } from "react";
import links from "./data/links.json";

type Link = {
  url: string;
  title: string;
  description: string;
  domain: string;
  date: string;
  category: string;
  image: string;
};

const ALL: Link[] = links as Link[];

const CATEGORY_ORDER = [
  "전체", "SNS", "기타", "개발", "뉴스/정보", "문서", "영상", "쇼핑", "금융", "교육", "카카오",
];

function domainShort(d: string) {
  return d.replace(/^www\./, "");
}

function FaviconImg({ domain }: { domain: string }) {
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
      width={16}
      height={16}
      style={{ borderRadius: 3, flexShrink: 0 }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      alt=""
    />
  );
}

function LinkCard({ item }: { item: Link }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "14px 16px",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        cursor: "pointer",
        transition: "border-color 0.15s",
        minHeight: 90,
        textDecoration: "none",
        color: "inherit",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <FaviconImg domain={item.domain} />
        <span style={{ color: "var(--text-secondary)", fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {domainShort(item.domain)}
        </span>
        {item.date && (
          <span style={{ color: "var(--text-secondary)", fontSize: 12, flexShrink: 0 }}>
            {item.date}
          </span>
        )}
      </div>

      <div style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
        {item.title || domainShort(item.domain)}
      </div>

      {item.description && (
        <div style={{ color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.45, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {item.description}
        </div>
      )}

      <div style={{ marginTop: "auto" }}>
        <span style={{
          display: "inline-block",
          padding: "2px 8px",
          background: "var(--accent-light)",
          color: "var(--accent)",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 500,
        }}>
          {item.category}
        </span>
      </div>
    </a>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { "전체": ALL.length };
    for (const item of ALL) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, []);

  const categories = CATEGORY_ORDER.filter((c) => catCounts[c] > 0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL.filter((item) => {
      const matchCat = activeCategory === "전체" || item.category === activeCategory;
      const matchSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.domain.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>링크 보관함</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
              카카오톡 나와의 채팅에서 수집한 링크 모음 · {ALL.length}개
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 2 }}>
            <a
              href="https://daamable.neocities.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                border: "1px solid var(--border)",
                borderRadius: 20,
                fontSize: 13,
                color: "var(--text-secondary)",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text)"; el.style.borderColor = "var(--text)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text-secondary)"; el.style.borderColor = "var(--border)"; }}
            >
              장대환
            </a>
            <a
              href="https://github.com/daamable-sknk"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                border: "1px solid var(--border)",
                borderRadius: 20,
                fontSize: 13,
                color: "var(--text-secondary)",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text)"; el.style.borderColor = "var(--text)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text-secondary)"; el.style.borderColor = "var(--border)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* 통계 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "전체", value: ALL.length },
          { label: "SNS", value: catCounts["SNS"] || 0 },
          { label: "기타", value: catCounts["기타"] || 0 },
          { label: "개발", value: catCounts["개발"] || 0 },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px" }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: 20 }} />

      {/* 검색 */}
      <input
        type="text"
        placeholder="링크 검색 (제목, 도메인, URL)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          background: "var(--bg-card)",
          color: "var(--text)",
          fontSize: 14,
          outline: "none",
          marginBottom: 14,
        }}
      />

      {/* 카테고리 필터 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: activeCategory === cat ? "var(--accent)" : "var(--border)",
              background: activeCategory === cat ? "var(--accent-light)" : "transparent",
              color: activeCategory === cat ? "var(--accent)" : "var(--text-secondary)",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: activeCategory === cat ? 600 : 400,
              transition: "all 0.15s",
            }}
          >
            {cat} {catCounts[cat] > 0 ? `(${catCounts[cat]})` : ""}
          </button>
        ))}
      </div>

      {/* 결과 수 */}
      <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 14 }}>
        {filtered.length}개 링크
        {search && ` · "${search}" 검색 결과`}
        {activeCategory !== "전체" && ` · ${activeCategory}`}
      </p>

      {/* 링크 그리드 */}
      {filtered.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 10,
        }}>
          {filtered.map((item, i) => (
            <LinkCard key={i} item={item} />
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: 40 }}>
          검색 결과가 없어요.
        </p>
      )}
    </div>
  );
}
