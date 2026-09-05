import { Buffer } from 'node:buffer'
import { defineConfig } from 'vitepress'

const base = process.env.BASE_PATH || '/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'WeKnora Deep Dive',
  description: '从部署边界、调用链和设计决策出发，拆解 WeKnora 的工程实现。',
  base,
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,
  head: [
    ['meta', { name: 'theme-color', content: '#111827' }],
    ['meta', { name: 'author', content: 'Baker' }],
    ['meta', { property: 'og:type', content: 'website' }]
  ],
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    config(md) {
      const defaultFence = md.renderer.rules.fence
      if (!defaultFence) return

      md.renderer.rules.fence = (tokens, index, options, env, self) => {
        const token = tokens[index]
        if (token.info.trim() === 'mermaid') {
          const encoded = Buffer.from(token.content, 'utf8').toString('base64')
          return `<MermaidDiagram code="${encoded}" />`
        }
        return defaultFence(tokens, index, options, env, self)
      }
    }
  },
  themeConfig: {
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg',
      alt: 'WeKnora Deep Dive'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/01-weknora-production-agent-rag-architecture' },
      { text: 'WeKnora', link: 'https://github.com/Tencent/WeKnora' }
    ],
    sidebar: [
      {
        text: 'WeKnora 源码拆解',
        items: [
          {
            text: '01 · 生产级 Agent + RAG 架构',
            link: '/01-weknora-production-agent-rag-architecture'
          },
          {
            text: '02 · Agent ReAct 执行模型',
            link: '/02-weknora-agent-react-execution'
          },
          {
            text: '03 · Agent Context 管理',
            link: '/03-weknora-agent-context-management'
          },
          {
            text: '04 · Agent Skill 执行',
            link: '/04-weknora-agent-skill-execution'
          },
          {
            text: '05 · Agent Sandbox 工作原理',
            link: '/05-weknora-agent-sandbox'
          },
          {
            text: '06 · Agent MCP 工具接入',
            link: '/06-weknora-agent-mcp'
          },
          {
            text: '07 · Agent 长期记忆',
            link: '/07-weknora-agent-long-term-memory'
          },
          {
            text: '08 · 知识库录入',
            link: '/08-weknora-knowledge-ingestion'
          },
          {
            text: '09 · RAG 知识库检索',
            link: '/09-weknora-rag-retrieval'
          },
        ]
      }
    ],
    outline: {
      level: [2, 3],
      label: '本文目录'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    externalLinkIcon: true,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Tencent/WeKnora' }
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除查询',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  }
})
