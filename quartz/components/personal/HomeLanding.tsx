import { QuartzComponent, QuartzComponentProps } from "../types"
import { byDateAndAlphabetical } from "../PageList"
import { FullSlug } from "../../util/path"
import { buildSections, hrefFrom } from "./siteData"

function visibleNote(slug?: string, title?: string, filePath?: string): boolean {
  if (!slug || slug === "index" || slug.startsWith("tags/")) return false
  if (slug.toLowerCase().endsWith("/readme") || slug.toLowerCase() === "readme") return false
  if (title?.toLowerCase() === "readme") return false
  if (!filePath?.toLowerCase().endsWith(".md")) return false
  const fileName = filePath.split("/").at(-1)?.toLowerCase()
  if (fileName === "readme.md" || fileName === "index.md") return false
  return true
}

const HomeLanding: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const current = (fileData.slug ?? "index") as FullSlug
  const sections = buildSections(allFiles)
  const notes = allFiles
    .filter((file) => visibleNote(file.slug, file.frontmatter?.title, file.filePath))
    .sort(byDateAndAlphabetical())
  const primarySection = sections.find((section) => section.label === "大模型") ?? sections[0]

  return (
    <main class="pv-home-main">
      <section class="pv-portal-hero">
        <p class="pv-eyebrow">HELLO, I&apos;M WANT</p>
        <h1>欢迎来到我的个人主页</h1>
        <p class="pv-portal-intro">
          这里记录我的工程实践、手撕代码与大模型学习。选一个感兴趣的方向，慢慢逛。
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
            if (count === 0) return null

            const childEntries = section.children
              .map((child) => ({
                ...child,
                count: notes.filter((note) => note.slug?.startsWith(`${child.slug}/`)).length,
              }))
              .filter((child) => child.count > 0)

            return (
              <article class="pv-topic-group">
                <a class="pv-topic-group-heading" href={hrefFrom(current, section.slug)}>
                  <span class="pv-portal-card-icon">{section.icon}</span>
                  <span class="pv-portal-card-copy">
                    <strong>{section.label}</strong>
                    <small>{count} 篇笔记</small>
                  </span>
                  <span class="pv-topic-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
                {childEntries.length > 0 ? (
                  <div class="pv-topic-links">
                    {childEntries.map((child) => (
                      <a href={hrefFrom(current, child.slug)}>
                        <span>{child.label}</span>
                        <small>{child.count}</small>
                      </a>
                    ))}
                  </div>
                ) : (
                  <a class="pv-topic-empty" href={hrefFrom(current, section.slug)}>
                    浏览这个领域
                  </a>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default HomeLanding
