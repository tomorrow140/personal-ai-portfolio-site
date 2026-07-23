window.SITE_DATA = {
  siteTitle: "任思琳的 AI 实践",
  name: "任思琳",
  role: "商业化 AI 产品负责人 / AI Builder",
  eyebrow: "AI Native Product Portfolio",
  summary: "9 年产品经验，近两年聚焦 AIGC 创意与 AI Chatbot 产品落地。",
  bio:
    "9 年大厂产品经验，长期深耕本地商业、广告平台与商家经营场景。近两年独立负责 AIGC 创意生产和广告投放 AI Chatbot 落地，能够从业务判断、产品设计一路推进到规模化应用。",
  lastUpdated: "2026-07-23",
  experience: [
    {
      period: "2013.09 - 2017.06",
      kind: "education",
      title: "本科",
      organization: "山东大学"
    }
  ],
  projects: [
    {
      title: "飞书转公众号排版工具",
      status: "已发布",
      type: "Web Tool",
      description:
        "将飞书文档富文本转换为微信公众号后台稳定识别的内联样式 HTML，并提供实时预览与多套排版风格。",
      tags: ["内容排版", "飞书", "微信公众号"],
      imageUrl:
        "https://tomorrow140.github.io/personal-ai-portfolio-site/assets/feishu-wechat-formatter-preview.png",
      imageAlt: "飞书转公众号排版工具的真实产品界面截图",
      imageWidth: 1672,
      imageHeight: 941,
      demoUrl: "https://tomorrow140.github.io/feishu-wechat-formatter/",
      sourceUrl: "https://github.com/tomorrow140/feishu-wechat-formatter"
    },
    {
      title: "技术文章生图 Skill",
      status: "已发布",
      type: "Agent Skill",
      description:
        "将技术文章、框架对比和 Agent / AI 概念转换为中文手绘解释图的通用 Prompt Pack，可用于 Codex、Claude Code、OpenClaw 及其他支持自定义技能或提示词的 Agent。",
      tags: ["信息图", "Prompt", "Agent 通用"],
      imageUrl:
        "https://tomorrow140.github.io/personal-ai-portfolio-site/assets/tech-article-infographic-example.png",
      imageAlt: "技术文章生图 Skill 生成的 Loop 工作机制中文手绘信息图",
      imageWidth: 1536,
      imageHeight: 1024,
      installCommands: [
        { label: "Codex", command: "./install.sh --target codex" },
        {
          label: "通用 Agent",
          command: "./install.sh --dest ~/agent-prompts/tech-article-infographic"
        }
      ],
      demoUrl: "",
      sourceUrl: "https://github.com/tomorrow140/tech-article-infographic-skill"
    },
    {
      title: "Chrome 标签去重助手",
      status: "已上线",
      type: "Chrome Extension",
      description:
        "自动识别并阻止重复标签页，同时支持不活跃标签清理、标签统计和常用网站分析。",
      tags: ["标签管理", "效率工具"],
      iconUrl:
        "https://tomorrow140.github.io/personal-ai-portfolio-site/assets/chrome-tab-deduplicator-icon.png",
      iconAlt: "Chrome 标签去重助手插件图标",
      metrics: [
        { value: "700+", label: "累计用户" },
        { value: "200+", label: "周活跃用户" }
      ],
      demoLabel: "Chrome 商店",
      demoUrl:
        "https://chromewebstore.google.com/detail/%E6%A0%87%E7%AD%BE%E5%8E%BB%E9%87%8D%E5%8A%A9%E6%89%8B/agfpdiijjijmjgfghlfljekcfpkjamgj",
      sourceUrl: ""
    },
    {
      title: "祝福星球",
      status: "已上线",
      type: "微信小程序",
      description: "围绕祝福主题搭建的微信小程序。",
      tags: ["Vibe Coding"],
      demoUrl: "",
      sourceUrl: ""
    },
    {
      title: "小胡聊商业｜每周商业热点雷达",
      status: "持续更新",
      type: "Web App",
      description:
        "聚合商业媒体与 RSS 信源，通过自动化采集和 AI 分析生成每周商业热点与选题价值判断。",
      tags: ["商业信息", "AI 分析", "GitHub Actions"],
      demoUrl:
        "https://tomorrow140.github.io/xiaohu-business-hotspots/insights/weekly-hotspots.html?v=check-20260722",
      sourceUrl: "https://github.com/tomorrow140/xiaohu-business-hotspots"
    }
  ],
  skills: [],
  links: {
    github: "",
    email: "",
    homepage: ""
  }
};
