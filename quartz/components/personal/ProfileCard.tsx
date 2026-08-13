import { QuartzComponent, QuartzComponentProps } from "../types"
import { profile } from "./siteData"

const ProfileCard: QuartzComponent = (_props: QuartzComponentProps) => {
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
    </aside>
  )
}

export default ProfileCard
