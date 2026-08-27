# WeKnora是啥， 为什么值得研究？

[WeKnora](https://github.com/Tencent/WeKnora) 是腾讯开源的知识管理与问答系统，支持私有化部署。用户可以在里面管理文档和知识库，使用固定的 RAG 流程问答，也可以让 ReAct Agent 调用知识库、Skill 和 MCP 工具完成任务。

现在 Agent 框架很多，但完整开源的 Agent 产品并不多。框架通常把重点放在 Agent Loop、Tool Calling 和工作流编排上。等 Agent 真正做成产品，还要处理前端、API、权限、会话、Context、知识库、异步任务、数据存储、Sandbox 和部署。

这些代码在 WeKnora 里都能找到。顺着一次请求往下读，可以看到 Agent 怎么运行，历史怎么恢复，Token 超限怎么处理，工具怎么接入，脚本在哪里执行，最后的结果怎么保存。对我来说，它是一个很适合用来研究生产级 Agent 应用的项目。

这个仓库记录我阅读 WeKnora 源码的过程和结论。

在线阅读：[https://baker915.github.io/weknora-deep-dive/](https://baker915.github.io/weknora-deep-dive/)
