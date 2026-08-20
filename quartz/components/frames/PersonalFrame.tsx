import { PageFrame, PageFrameProps } from "./types"
import SiteHeader from "../personal/SiteHeader"
import ProfileCard from "../personal/ProfileCard"
import HomeLanding from "../personal/HomeLanding"

export const PersonalFrame: PageFrame = {
  name: "personal",
  render({
    componentData,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer,
  }: PageFrameProps) {
    const isHome = componentData.fileData.slug === "index"

    return (
      <>
        <SiteHeader {...componentData}>
          {header.map((HeaderComponent) => (
            <HeaderComponent {...componentData} />
          ))}
        </SiteHeader>

        {isHome ? (
          <div class="pv-site-shell pv-home-shell">
            <ProfileCard {...componentData} />
            <HomeLanding {...componentData} />
          </div>
        ) : (
          <div class="pv-site-shell pv-reading-shell">
            <aside class="pv-reader-sidebar pv-reader-left">
              {left.map((BodyComponent) => (
                <BodyComponent {...componentData} />
              ))}
            </aside>
            <main class="pv-article-column center">
              <div class="pv-article-header popover-hint">
                {beforeBody.map((BodyComponent) => (
                  <BodyComponent {...componentData} />
                ))}
              </div>
              <Content {...componentData} />
              <div class="pv-after-body">
                {afterBody.map((BodyComponent) => (
                  <BodyComponent {...componentData} />
                ))}
              </div>
            </main>
            <aside class="pv-reader-sidebar pv-reader-right">
              {right.map((BodyComponent) => (
                <BodyComponent {...componentData} />
              ))}
            </aside>
          </div>
        )}

        <div class="pv-footer-wrap">
          {footer.map((FooterComponent) => (
            <FooterComponent {...componentData} />
          ))}
        </div>
      </>
    )
  },
}
