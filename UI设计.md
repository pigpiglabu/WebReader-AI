### 一、 设计语言总览 (Design System)

* **风格：** 现代简约 (Modern Minimalist) / 微软 Fluent Design 风格（强调轻盈、透光、层级感）。
* **色调：**
  * 主色（AI/智能）：#0078D4 (Azure Blue) 或 #813EFB (Purple AI)
  * 背景（护眼）：#FFFFFF (Light) / #1A1A1A (Dark) / #F4F1EA (Sepia 阅读模式)
  * 辅助色（成功/运行）：#107C10 (Green)
  * 警示色（错误/Debug）：#D83B01 (Orange)
* **字体：** 系统默认字体堆栈 (Segoe UI, Roboto, Helvetica Neue, Sans-serif)，优先保证可读性。

---

### 二、 界面设计详解

#### 1. 触发与主要入口 (Trigger & Entrance)

这是一个网页上的“幽灵”入口，需要极其克制。

* **状态 A - 休息 (Resting)：**
  * **位置：** 网页右下角（可配置靠上或靠下），距离边缘 20px。
  * **视觉：** 一个直径 40px 的圆形悬浮按钮 (FAB)。半透明背景（rgba(0,0,0,0.3)），中心是一个微光的 AI 图标（例如：大脑与书籍结合的 SVG）。
  * **交互：** 鼠标悬停时，透明度变为 1，图标轻微放大。点击打开【主界面侧边栏】。
* **状态 B - 运行中 (Active/Analyzing)：**
  * **视觉：** 图标变为旋转的加载动画，或中心有一个彩虹色的微光扩散效果（暗示 AI 正在阅读/思考）。
* **状态 C - 隐藏 (Hidden)：**
  * 用户可在全局设置中彻底关闭悬浮按钮，改为使用快捷键（如 `Alt+R`）唤起。

#### 2. 主界面：AI 阅读侧边栏 (Main Interface - Sidebar)

这是用户交互的核心。它通过悬浮按钮或快捷键唤起，从网页右侧滑出，不覆盖网页内容，而是调整网页宽度（或覆盖在上方，可配置）。参考 NextChat 的逻辑，但以侧边栏形式呈现。

**布局 (Layout)：**

* **宽度：** 380px - 450px (用户可拖拽调节)。
* **层级：**
  1. **Header (顶部导航 - 48px):**
     * 左侧：当前站点的 Icon + `SiteName` (基于您要求的真实名称提取)。
     * 右侧：`Model/Role 快切` 下拉菜单、`最小化` 按钮、`关闭` 按钮。
  2. **Context Panel (网页上下文 - 可折叠):**
     * 展示基于 Readability 提取的 `标题` 和 `摘要`（AI 自动生成），下方有 `智能分析`、`长图分析`、`混合分析` 三个核心方法按钮。
  3. **Chat Area (对话区域 - 占据剩余高度):**
     * **Message List:** 沉浸式对话流。System Prompt (角色设定) 为置顶虚线框。User 消息居右，Assistant 消息居左。支持 Markdown 渲染（代码高亮、表格、公式）。
  4. **Input Area (输入区域 - 底部固定):**
     * 一个多行文本输入框（TextArea），高度随内容自适应。
     * 输入框左侧：`附件 picker`（图片/PDF）、`模型调度指示器`。
     * 输入框右侧：`发送` 按钮。

#### 3. Popup：基础配置窗口 (Basic Config - Browser Action)

用户点击浏览器工具栏的插件图标时弹出。它不应包含复杂的对话逻辑，而是提供“瞬间”的状态查看和快切。

**视觉：** 一个 320px x 400px 的精致小窗。

**内容 (Content)：**

1. **Status Card (状态卡片):** 顶部显示“WebReader AI 运行中”，下方显示当前匹配到的 `SiteRule` (例如：`Domain: *.zhihu.com` - 已绑定 `知乎摘要` 角色)。
2. **Enabled Toggle:** 一个大号的开关，用于“在此站点启用/禁用插件”。
3. **Quick Switches (快切区):** 两个优雅的下拉菜单：
   * **当前模型：** `GPT-4o` (可切 `Qwen-Max`)
   * **当前角色：** `网页总结专家` (可切 `代码审查员`)
4. **Action Buttons:** 底部两个并排按钮：`打开侧边栏阅读`、`进入详细设置(Options)`。

#### 4. 插件配置页 (Options Page - CONFIG UI)

这是一个独立的全屏标签页，提供深度的、结构化的管理界面。采用标准的“左侧导航，右侧内容”布局。

**导航 (Left Nav):**

1. **总览 (Dashboard):** 运行状态、Token 消耗统计。
2. **模型管理 (Models):** CRUD 界面。
3. **角色管理 (Roles):** System Prompts 编辑区。
4. **站点配置 (Site Rules):** 核心路由管理。
5. **高级设置 (Advanced):** 主题、自动化脚本、数据导出。
6. **控制台 (Console):** 我们要求的 Debug 区域。

**主要内容区示例 (Site Rules Tab):**

* 顶部：`添加新规则` 按钮。
* 下方：一个复杂的表格或卡片列表。
* **Card 视觉：** 每一行展示匹配规则（域名通配符或网站名关键词）、默认模型、默认角色、解析方法。鼠标悬停显示 `编辑`、`删除`、`克隆` 按钮。

#### 5. Console：控制台与 Debug (Console/Developer Tab)

集成在【插件配置页】中作为一个独立的标签页，或者作为一个独立的、通过特定方式（如在 Popup 连击 5 次版本号）唤起的全屏页面。它不需要好看，但需要信息量大。

**布局 (Layout)：** 一个全屏的、全黑背景、绿色/橙色文字的 IDE 风格界面。

**内容 (Content):**

1. **Log Viewer (日志查看器):** 占据 70% 高度。
   * 每一行都有 `时间戳` | `运行环境 (BG/CS/UI)` | `层级 (Info/Error/Network)` | `消息内容`。
   * 支持过滤按钮：`All`, `Readability`, `Screenshot`, `Network API`, `Errors`。
2. **Network Inspector (网络监听):** 底部 30% 高度。
   * 左侧列表展示拦截到的 API 请求 URL（过滤关键字）。点击请求，右侧展示完整的请求 Payload 和 raw JSON Response 原始数据。这对于通过底层接口突破虚拟滚动至关重要。

---

### 三、 总结与UI架构映射

这些设计方案完美契合您敲定的项目架构：

* `src/background/` 的数据流将直接反映在 **Console** 的网络监听中。
* `src/content/` 的提取结果将反映在 **主界面侧边栏** 的 Context Panel。
* `src/ui/shared/features/` 下的各个 Feature 模块（chat, modelConfig, siteConfigs）将分别构成  **主界面** 、**Popup** 和 **Options Page** 的具体 React 组件逻辑。
