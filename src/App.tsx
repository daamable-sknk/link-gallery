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
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>링크 보관함</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
          카카오톡 나와의 채팅에서 수집한 링크 모음 · {ALL.length}개
        </p>
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
