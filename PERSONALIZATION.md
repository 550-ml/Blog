# Personalization

这个仓库是 TuoWang 个人知识库网站的 Quartz 5 外壳。日常只需要在 Obsidian 知识库里写 Markdown；推送知识库后，由 GitHub Actions 拉取内容并发布网站。

## 常用修改位置

- 个人介绍、头像和 GitHub：`quartz/components/personal/siteData.ts`
- 首页文案和最近更新：`quartz/components/personal/HomeLanding.tsx`
- 顶部导航：从知识库的两位数字一级、二级目录自动生成
- 配色、卡片和移动端样式：`quartz/styles/personal.scss`
- Quartz 插件、字体和站点地址：`quartz.config.yaml`
- GitHub Pages 发布：`.github/workflows/deploy.yml`

## 微信二维码

当前微信入口保留为占位卡片。准备好二维码后，将图片放到知识库的 `Image` 目录，并在 `quartz/components/personal/ProfileCard.tsx` 的微信卡片中加入图片即可。

## 本地预览

```bash
npm ci
npx quartz plugin install --from-config
npx quartz build -d "/你的/Obsidian/知识库路径" --serve
```

项目声明的 Node 版本见 `.node-version`，部署使用 Node 22。若仓库位于 iCloud 目录，建议不要同步 `node_modules`；iCloud 可能为二进制依赖生成冲突副本。
