import { QuartzComponent, QuartzComponentProps } from "../types"
import { FullSlug } from "../../util/path"
import { buildSections, hrefFrom, profile } from "./siteData"

const SiteHeader: QuartzComponent = ({
  fileData,
  allFiles,
  cfg,
  children,
}: QuartzComponentProps) => {
  const current = (fileData.slug ?? "index") as FullSlug
  const homeHref = hrefFrom(current, "index" as FullSlug)
  const sections = buildSections(allFiles)

  return (
    <header class="pv-site-header">
      <div class="pv-header-inner">
        <a class="pv-brand" href={homeHref} aria-label={`${cfg.pageTitle} 首页`}>
          <img class="pv-brand-avatar" src={profile.avatar} alt="" />
          <strong>{profile.name} 的博客</strong>
        </a>

        <nav class="pv-main-nav" aria-label="主要导航">
          <a class="pv-nav-home" href={homeHref}>
            首页
          </a>
          {sections.map((section) => (
            <details class="pv-nav-group">
              <summary>
                {section.label}
                <span class="pv-nav-chevron">⌄</span>
              </summary>
              <div class="pv-nav-menu">
                <a class="pv-nav-all" href={hrefFrom(current, section.slug)}>
                  查看全部{section.label}
                </a>
                {section.children.slice(0, 10).map((child) => (
                  <a href={hrefFrom(current, child.slug)}>{child.label}</a>
                ))}
              </div>
            </details>
          ))}
          <a href={`${homeHref}#about`}>关于</a>
        </nav>

        <div class="pv-header-tools">{children}</div>
      </div>
    </header>
  )
}

export default SiteHeader
