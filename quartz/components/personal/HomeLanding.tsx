import { QuartzComponent, QuartzComponentProps } from "../types"
import { byDateAndAlphabetical } from "../PageList"
import { Date, getDate } from "../Date"
import { FullSlug } from "../../util/path"
import { buildSections, cleanSegment, hrefFrom } from "./siteData"

function visibleNote(slug?: string, title?: string, filePath?: string): boolean {
  if (!slug || slug === "index" || slug.startsWith("tags/")) return false
  if (slug.toLowerCase().endsWith("/readme") || slug.toLowerCase() === "readme") return false
  if (title?.toLowerCase() === "readme") return false
  if (!filePath?.toLowerCase().endsWith(".md")) return false
  const fileName = filePath.split("/").at(-1)?.toLowerCase()
  if (fileName === "readme.md" || fileName === "index.md") return false
  return true
}

function displayTitle(title?: string): string {
  return title?.replace(/^\d{2}[_-]/, "") ?? "未命名笔记"
}

const HomeLanding: QuartzComponent = ({ fileData, allFiles, cfg }: QuartzComponentProps) => {
  const current = (fileData.slug ?? "index") as FullSlug
  const sections = buildSections(allFiles)
  const notes = allFiles
    .filter((file) => visibleNote(file.slug, file.frontmatter?.title, file.filePath))
    .sort(byDateAndAlphabetical())

  return (
    <main class="pv-home-main">
      <header class="pv-archive-heading">
        <div>
          <p class="pv-eyebrow">WRITING &amp; NOTES</p>
          <h1>全部文章</h1>
        </div>
        <p>共 {notes.length} 篇 · 在 Obsidian 中持续整理</p>
      </header>

      <section class="pv-note-list pv-archive-list" aria-label="全部文章">
        {notes.map((note) => {
          const top = note.slug?.split("/")[0] ?? ""
          const section = sections.find((item) => item.slug === top)
          const date = note.defaultDateType ? getDate(note) : undefined
          const description = note.description as string | undefined
          const title = displayTitle(note.frontmatter?.title)
          return (
            <article class="pv-note-card">
              <a class="pv-note-link" href={hrefFrom(current, note.slug!)} aria-label={title}>
                <div class="pv-note-body">
                  <h3>{title}</h3>
                  <div class="pv-note-meta">
                    {date && <Date date={date} locale={cfg.locale} />}
                    <span>{section?.label ?? cleanSegment(top)}</span>
                    {(note.frontmatter?.tags ?? []).slice(0, 2).map((tag) => (
                      <span>#{tag}</span>
                    ))}
                  </div>
                  {description && <p>{description}</p>}
                </div>
              </a>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default HomeLanding
