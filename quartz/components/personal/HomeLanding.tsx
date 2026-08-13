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
  const recent = notes.slice(0, 4)
  const primarySection = sections.find((section) => section.label === "大模型") ?? sections[0]

  return (
    <main class="pv-home-main">
      <section class="pv-portal-hero">
        <p class="pv-eyebrow">HELLO, I&apos;M WANT</p>
        <h1>
          欢迎来到我的
          <span>数字花园。</span>
        </h1>
        <p class="pv-portal-intro">
          这里是我的个人主页，也是知识与想法的入口。你可以从一个感兴趣的领域开始，慢慢逛。
        </p>
        <div class="pv-portal-actions">
          {primarySection && (
            <a class="pv-primary-action" href={hrefFrom(current, primarySection.slug)}>
              开始阅读
              <span>→</span>
            </a>
          )}
          <a class="pv-secondary-action" href="#explore">
            查看导航
          </a>
        </div>
      </section>

      <section class="pv-portal-section" id="explore">
        <div class="pv-portal-heading">
          <div>
            <p class="pv-eyebrow">EXPLORE</p>
            <h2>从这里开始</h2>
          </div>
          <span>{notes.length} 篇笔记持续生长</span>
        </div>
        <div class="pv-portal-grid">
          {sections.map((section) => {
            const count = notes.filter((note) => note.slug?.startsWith(`${section.slug}/`)).length
            return (
              <a class="pv-portal-card" href={hrefFrom(current, section.slug)}>
                <span class="pv-portal-card-icon">{section.icon}</span>
                <span class="pv-portal-card-copy">
                  <strong>{section.label}</strong>
                  <small>
                    {section.children
                      .slice(0, 3)
                      .map((child) => child.label)
                      .join(" · ") || "随手记录与思考"}
                  </small>
                </span>
                <span class="pv-portal-count">{count}</span>
              </a>
            )
          })}
        </div>
      </section>

      <section class="pv-portal-latest" aria-label="最近更新">
        <div class="pv-portal-heading">
          <div>
            <p class="pv-eyebrow">RECENTLY</p>
            <h2>最近更新</h2>
          </div>
        </div>
        <div class="pv-latest-list">
          {recent.map((note) => {
            const top = note.slug?.split("/")[0] ?? ""
            const section = sections.find((item) => item.slug === top)
            const date = note.defaultDateType ? getDate(note) : undefined
            return (
              <a href={hrefFrom(current, note.slug!)}>
                <span>{displayTitle(note.frontmatter?.title)}</span>
                <small>
                  {section?.label ?? cleanSegment(top)}
                  {date && (
                    <>
                      <span aria-hidden="true"> · </span>
                      <Date date={date} locale={cfg.locale} />
                    </>
                  )}
                </small>
                <span aria-hidden="true">↗</span>
              </a>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default HomeLanding
