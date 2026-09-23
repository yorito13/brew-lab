---
AIGC:
    Label: "1"
    ContentProducer: 001191110102MACQD9K64018705
    ProduceID: 3207698845546936_0-drive/227229407580216383/brewlab_v13.31.1/README.md
    ReservedCode1: ""
    ContentPropagator: 001191110102MACQD9K64028705
    PropagateID: 3207698845546936#1790134921418
    ReservedCode2: ""
---
# Brew Lab · 手冲咖啡实验室 v13.31.2

> 一个完全本地、移动端优先的手冲冲煮记录与实验室级分析工具。单文件 PWA，浏览器直接跑，数据不出本机。

## 核心能力

- ⚖️ **连秤实时曲线**：Web Bluetooth 直连 BOOKOO Themis Mini / Ultra，注水重量实时成曲线，自动记录冲煮节奏（含演示模式可无设备体验）
- 📐 **粒径 D50 分析**：基于过筛数据计算 D50 与分布带（过筛率越高、D50 越小），把研磨度量化进冲煮决策
- 📇 **豆档案库**：本地管理豆子信息与历史档案，配方与豆子挂钩
- 📷 **拍卡识别（视觉 LLM）**：拍豆袋/信息卡，多模态 LLM 自动抽取豆子字段，高置信结构化回填
- 🩺 **粉坑诊断**：粉坑 × 感官 × 参数三方对撞，滤杯几何旁通档位与液位原理，输出零依赖诊断报告
- 🔁 **冲煮复盘**：LLM 对整次冲煮做归因分析，给出可执行改进方向
- ☕ **单杯多维偏离评估**：萃取率 / TDS / 酸甜苦平衡 / 口感 / 温度等
- 📊 **多杯横向对比**：≤3 杯 + 曲线叠加 + 跨维度跳转
- 🌗 **暗色主题**：auto / light / dark 三态，防 FOUC
- 📱 **完整 PWA**：添加到主屏幕、独立启动、完全离线
- 🔒 **数据完全本地**：localStorage，不上云；仅 LLM 按需联网

## 快速启动

> ⚠️ PWA 安装、离线缓存、蓝牙连秤必须通过 http(s) 访问或在支持的浏览器中进行；直接双击 `pour_over_log.html`（file://）只能用基础记录功能。

当前仓库核心为两个文件：

| 文件 | 说明 |
| --- | --- |
| `pour_over_log.html` | 主程序（单文件，约 1.46 万行） |
| `sw.js` | Service Worker（离线缓存，`VERSION = brewlab-v13.31.2-ark-switch-model-2026-09-21`） |

> 注：历史版本曾含 `manifest.json`、icon、splash、`start.sh/.bat` 等；以你仓库实际文件为准。

### 公网部署（GitHub Pages）

1. 把 `pour_over_log.html` 与 `sw.js` 上传到仓库根目录
2. Settings → Pages → Source 选 `main` / `(root)` → Save
3. 等 1–3 分钟，访问 `https://<用户名>.github.io/<仓库名>/pour_over_log.html`

其他静态平台（Cloudflare Pages / Vercel / Netlify / Nginx）拖文件即可。

## 安装到手机 / 电脑（PWA）

1. 用浏览器打开站点
2. **iOS Safari**：分享 → 添加到主屏幕（注：iOS 不支持 Web Bluetooth，连秤仅限 Android）
3. **Android Chrome / Edge**：菜单 → 添加到主屏幕 / 安装应用
4. **桌面 Chrome / Edge**：地址栏安装图标

安装后独立窗口启动，与原生 App 一致。

## 连秤（Android Chrome / Edge）

1. 秤开机并处于蓝牙广播状态
2. 进入「连秤」模式，选择设备类型 **BOOKOO Themis Mini / Ultra**
3. 在系统蓝牙选择器中选中设备（名称形如 `BOOKOO_SC_U …`）
4. 连接成功后注水自动成曲线、自动记录

无设备时可用 `BOOKOO_SC_U_MOCK (演示)` 模式体验完整流程。

## LLM 配置（可选）

拍卡识别与冲煮复盘需要 LLM；**本地分析始终优先，LLM 只在需要推理/视觉时调用**。

1. 进入 ⚙️ 设置 → LLM 配置
2. 选择 provider：
   - **火山方舟（豆包，OpenAI 兼容）**
   - **Anthropic Claude（OpenAI 兼容代理）**
   - **自定义（OpenAI 兼容）**：可接 DeepSeek / 通义 / Kimi / 智谱 / OpenAI 等
3. 填 **API Key + Model ID**（用模型的 Model ID，不是控制台展示名）
4. 测试连接通过后即可使用

**默认推荐模型：`doubao-seed-2-0-lite-260428`** —— 交互级低延迟、识图高置信、复盘更精准。

工程细节：

- 视觉识别在方舟端点自动关闭深度思考（`thinking: disabled`），避免思维链拖慢
- HTTP 429 / 5xx 自动指数退避重试（最多 3 次，遵循 `Retry-After`，UI 显示倒计时）
- 拍照图自动压缩（长边 1280、优先 WebP），减小上传体积
- API Key 仅保存在使用者自己浏览器的 localStorage，无内置统一密钥

## 数据存储

- 所有记录保存在浏览器 **localStorage**，完全本地、不上云
- LLM 按需联网，Key 不离开本机
- 换浏览器 / 设备不会自动同步（顶部有数据导出 / 导入）
- 清浏览器数据 = 清记录，建议定期导出备份

## 更新方式

替换 `pour_over_log.html`，并确认 `sw.js` 顶部 `VERSION` 已更新；浏览器下次访问会自动拉新版。若未刷新：

1. 关闭并重新打开 PWA
2. 或 DevTools → Application → Service Workers → Unregister 后硬刷

## 近期版本

- **v13.31.2**：视觉识别切换至 `doubao-seed-2-0-lite`；方舟端点关闭思考链
- **v13.31.1**：429 / 5xx 自动退避重试 + UI 倒计时（应对豆包 1.8 停服配额清零）
- **v13.31**：图片压缩 1280/WebP、`max_tokens`、识别阶段耗时展示
- **v13.30.1**：修复推荐方案因漏返 `d50` 导致点击无反应
- **v13.30**：四大功能上线 —— 连秤实时曲线 / D50 / 豆档案库 / 拍卡识别

## 许可

个人使用 / 自部署，无商业限制（如需修改源码请保留版本号注释）。

---

> 本内容由 Coze AI 生成，请遵循相关法律法规及《人工智能生成合成内容标识办法》使用与传播。
