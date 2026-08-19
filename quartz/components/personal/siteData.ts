import { FullSlug, resolveRelative } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"

export type SiteSection = {
  slug: FullSlug
  label: string
  icon: string
  children: { slug: FullSlug; label: string }[]
}

const sectionMeta = [
  { order: "01", label: "工程", icon: "⌘" },
  { order: "02", label: "手撕代码", icon: "</>" },
  { order: "03", label: "大模型", icon: "AI" },
  { order: "04", label: "项目", icon: "□" },
  { order: "05", label: "面试", icon: "✓" },
  { order: "06", label: "随记", icon: "✎" },
]

export const profile = {
  name: "Want",
  role: "LLM · 强化学习 · 工程实践",
  bio: "记录大模型、工程实践、代码实现与项目复盘，也收藏一路上真正有用的经验。",
  avatar: "https://avatars.githubusercontent.com/u/94170205?v=4",
  github: "https://github.com/TuoWang02",
}

const segmentLabels: Record<string, string> = {
  leetcode: "LeetCode",
  llm手撕代码: "LLM 手撕代码",
  pythonic: "Pythonic",
  retool: "Retool",
  "swe rl": "SWE-RL",
  medicalgpt: "MedicalGPT",
}

export function cleanSegment(value: string): string {
  const cleaned = decodeURIComponent(value)
    .replace(/^\d{2}[-_]/, "")
    .replace(/[-_]+/g, " ")
    .trim()
  return segmentLabels[cleaned.toLowerCase()] ?? cleaned
}

function orderedMeta(segment: string) {
  const order = segment.match(/^(\d{2})[-_]/)?.[1]
  return sectionMeta.find((item) => item.order === order)
}

export function buildSections(allFiles: QuartzPluginData[]): SiteSection[] {
  const roots = new Map<string, Set<string>>()

  for (const file of allFiles) {
    const slug = file.slug
    if (!slug || slug === "index" || slug.startsWith("tags/")) continue
    const [root, child] = slug.split("/")
    if (!/^\d{2}[-_]/.test(root)) continue

    if (!roots.has(root)) roots.set(root, new Set())
    if (child && child.toLowerCase() !== "readme" && /^\d{2}[-_]/.test(child)) {
      roots.get(root)!.add(child)
    }
  }

  return [...roots.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "zh-CN"))
    .map(([root, children]) => {
      const meta = orderedMeta(root)
      return {
        slug: root as FullSlug,
        label: meta?.label ?? cleanSegment(root),
        icon: meta?.icon ?? "·",
        children: [...children]
          .sort((a, b) => a.localeCompare(b, "zh-CN"))
          .map((child) => ({
            slug: `${root}/${child}` as FullSlug,
            label: cleanSegment(child),
          })),
      }
    })
}

export function hrefFrom(current: FullSlug, target: FullSlug): string {
  return resolveRelative(current, target)
}
