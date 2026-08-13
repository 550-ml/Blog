import { QuartzComponent, QuartzComponentProps } from "../types"
import { buildSections, hrefFrom, profile } from "./siteData"
import { FullSlug } from "../../util/path"

const ProfileCard: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const current = (fileData.slug ?? "index") as FullSlug
  const sections = buildSections(allFiles)

  return (
    <aside class="pv-profile-column" id="about">
      <section class="pv-profile-card">
        <img
          class="pv-avatar"
          src={profile.avatar}
          alt={`${profile.name} 的头像`}
          loading="eager"
        />
        <p class="pv-profile-kicker">HELLO, I AM</p>
        <h2>{profile.name}</h2>
        <p class="pv-profile-role">{profile.role}</p>
        <p class="pv-profile-bio">{profile.bio}</p>
        <div class="pv-social-row">
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            GitHub
          </a>
          <details class="pv-wechat">
            <summary>微信</summary>
            <div class="pv-wechat-card">
              <strong>微信联系</strong>
              <p>二维码可以稍后放在这里，添加时请备注来自个人博客。</p>
            </div>
          </details>
        </div>
      </section>

      <section class="pv-category-card">
        <div class="pv-card-heading">
          <span>知识领域</span>
          <small>{sections.length} 个分类</small>
        </div>
        <ul>
          {sections.map((section) => {
            const count = allFiles.filter((file) =>
              file.slug?.startsWith(`${section.slug}/`),
            ).length
            return (
              <li>
                <a href={hrefFrom(current, section.slug)}>
                  <span class="pv-category-icon">{section.icon}</span>
                  <span>{section.label}</span>
                  <small>{count}</small>
                </a>
              </li>
            )
          })}
        </ul>
      </section>
    </aside>
  )
}

export default ProfileCard
