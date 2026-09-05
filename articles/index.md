---
layout: home

hero:
  name: "WeKnora Deep Dive"
  text: "从部署边界开始读懂 Agent 系统"
  tagline: "不把 README 当实现，不把推断写成事实。沿着进程、调用链和状态变化，拆解一个真实运行的 Agent + RAG 产品。"
  actions:
    - theme: brand
      text: 阅读第一篇
      link: /01-weknora-production-agent-rag-architecture
    - theme: alt
      text: 查看 WeKnora
      link: https://github.com/Tencent/WeKnora

features:
  - title: 从部署开始
    details: 先确认容器、进程、端口、存储和外部依赖，再进入内部模块。
  - title: 沿调用链求证
    details: 记录关键函数的输入、输出和职责，让每个结论都能回到锁定 commit。
  - title: 区分事实与判断
    details: 源码事实、可能原因、个人评价和未知问题使用不同语气表达。
---

## 当前文章

### 01 · [拆解 WeKnora：一个生产级 Agent + RAG 系统是如何组织的](/01-weknora-production-agent-rag-architecture)

从 Docker Compose 和 Go 进程入口开始，还原 API、Agent、RAG、异步任务、docreader、PostgreSQL、Redis 与 Sandbox 的协作边界。

分析基线：WeKnora `0.7.2` · commit `4e25684b` · 2026-08-24

### 02 · [拆解 WeKnora Agent：一次 ReAct 执行是如何跑起来的](/02-weknora-agent-react-execution)

从一次 Agent 请求进入 `internal/agent`，追踪 Engine 创建、ReAct Loop、Tool 调用、事件流、状态持久化以及 HTTP 断开后的执行边界。

分析基线：WeKnora `0.7.2` · commit `4e25684b` · 2026-08-24

### 03 · [拆解 WeKnora Context：Agent 的历史、Token 预算与压缩如何工作](/03-weknora-agent-context-management)

从 PostgreSQL 中的完整会话记录开始，追踪 Agent messages 的恢复与增长，以及当前轮 Tool Result 裁剪、LLM 摘要和确定性删除的三层 Context Window 管理。

分析基线：WeKnora `0.7.2` · commit `4e25684b` · 2026-08-25

### 04 · [拆解 WeKnora Skill：能力如何被发现、加载与执行](/04-weknora-agent-skill-execution)

从预装 Skill 目录开始，追踪 metadata 进入 System Prompt、完整指令按需读取、脚本进入 Sandbox，以及生成文件在 Agent 完成后持久化为可下载产物的过程。

分析基线：WeKnora `0.7.2` · commit `4e25684b` · 2026-08-25

### 05 · [拆解 WeKnora Sandbox：Agent 的脚本是如何执行的](/05-weknora-agent-sandbox)

先介绍 Sandbox 的定义、发展和常见实现，解释 Agent 为什么需要 Sandbox，再回答 WeKnora 用它做什么、如何配置，以及 Local、Docker、Cube、E2B 分别适合什么场景。

分析基线：WeKnora `0.7.2` · commit `4e25684b` · 2026-08-26

### 06 · [拆解 WeKnora MCP：外部工具如何接入 Agent](/06-weknora-agent-mcp)

从 Workspace 中的一条 MCP Service 配置开始，追踪 Agent 如何确定本轮服务范围、发现并注册远端 Tool，以及 OAuth、人工审批和连接状态如何进入一次 Tool Call。

分析基线：WeKnora `0.7.2` · commit `4e25684b` · 2026-08-27

### 07 · [拆解 WeKnora Memory：Agent 如何形成跨会话长期记忆](/07-weknora-agent-long-term-memory)

从一句明确的记忆指令开始，追踪长期记忆的写入、后台提取、更新与召回，以及 Memory 如何进入 Agent Context 和 RAG 检索。

分析基线：WeKnora `0.7.2` · commit `4e25684b` · 2026-08-28

### 08 · [拆解 WeKnora 知识库：一份文档是如何变成可检索索引的](/08-weknora-knowledge-ingestion)

从文件上传开始，追踪 Knowledge 记录、`document:process`、docreader、Go chunker、embedding 和检索索引之间的异步调用链。

分析基线：WeKnora `0.7.2` · commit `4e25684b` · 2026-09-02

### 09 · [拆解 WeKnora RAG：一次知识库检索是如何完成的](/09-weknora-rag-retrieval)

从已经建立好的检索索引开始，追踪普通 KnowledgeQA 与 Agent `knowledge_search` 如何确定范围、准备 query、执行混合召回、重排候选并处理引用。

分析基线：WeKnora `0.7.2` · commit `4e25684b` · 2026-09-01
