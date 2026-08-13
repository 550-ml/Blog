import { QuartzComponent, QuartzComponentProps } from "../types"
import { byDateAndAlphabetical } from "../PageList"
import { Date, getDate } from "../Date"
import { FullSlug } from "../../util/path"
import { buildSections, cleanSegment, hrefFrom } from "./siteData"

function visibleNote(slug?: string, title?: string): boolean {
  if (!slug || slug === "index" || slug.startsWith("tags/")) return false
  if (slug.toLowerCase().endsWith("/readme") || slug.toLowerCase() === "readme") return false
  if (title?.toLowerCase() === "readme") return false
  return true
}

function displayTitle(title?: string): string {
  return title?.replace(/^\d{2}[_-]/, "") ?? "未命名笔记"
}

const HomeLanding: QuartzComponent = ({ fileData, allFiles, cfg }: QuartzComponentProps) => {
  const current = (fileData.slug ?? "index") as FullSlug
  const sections = buildSections(allFiles)
  const notes = allFiles
    .filter((file) => visibleNote(file.slug, file.frontmatter?.title))
    .sort(byDateAndAlphabetical())
  const recent = notes.slice(0, 10)
  const tagCount = new Set(notes.flatMap((note) => note.frontmatter?.tags ?? [])).size

  return (
    <main class="pv-home-main">
      <section class="pv-hero">
        <p class="pv-eyebrow">PERSONAL KNOWLEDGE GARDEN</p>
        <h1>
          把学过的知识，
          <span>连成自己的地图。</span>
        </h1>
        <p class="pv-hero-copy">
          面向大模型、工程实践、代码实现和项目复盘的个人知识库。所有内容在 Obsidian 中持续生长。
        </p>
        <div class="pv-hero-stats" aria-label="知识库统计">
          <div>
            <strong>{notes.length}</strong>
            <span>篇笔记</span>
          </div>
          <div>
            <strong>{sections.length}</strong>
            <span>个领域</span>
          </div>
          <div>
            <strong>{tagCount}</strong>
            <span>个标签</span>
          </div>
        </div>
      </section>

      <section class="pv-section-grid" aria-label="知识领域">
        {sections.map((section) => (
          <a class="pv-section-tile" href={hrefFrom(current, section.slug)}>
            <span class="pv-tile-icon">{section.icon}</span>
            <span>
              <strong>{section.label}</strong>
              <small>
                {section.children
                  .slice(0, 3)
                  .map((item) => item.label)
                  .join(" · ")}
              </small>
            </span>
            <span class="pv-tile-arrow">↗</span>
          </a>
        ))}
      </section>

      <section class="pv-recent-section">
        <div class="pv-section-title">
          <div>
            <p class="pv-eyebrow">RECENTLY UPDATED</p>
            <h2>最近更新</h2>
          </div>
          <span>持续整理，慢慢生长</span>
        </div>

        <div class="pv-note-list">
          {recent.map((note, index) => {
            const top = note.slug?.split("/")[0] ?? ""
            const section = sections.find((item) => item.slug === top)
            const date = getDate(note)
            const description = note.description as string | undefined
            const title = displayTitle(note.frontmatter?.title)
            return (
              <article class="pv-note-card">
                <a class="pv-note-link" href={hrefFrom(current, note.slug!)} aria-label={title}>
                  <div class="pv-note-index">{String(index + 1).padStart(2, "0")}</div>
                  <div class="pv-note-body">
                    <div class="pv-note-meta">
                      <span>{section?.label ?? cleanSegment(top)}</span>
                      {date && <Date date={date} locale={cfg.locale} />}
                    </div>
                    <h3>{title}</h3>
                    {description && <p>{description}</p>}
                    <div class="pv-note-tags">
                      {(note.frontmatter?.tags ?? []).slice(0, 3).map((tag) => (
                        <span>#{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span class="pv-note-arrow">→</span>
                </a>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default HomeLanding
