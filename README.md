# Brew Lab · 手冲咖啡 V13.15.10

> 一个完全本地、移动端优先的手冲冲煮记录与实验室级分析工具。

**核心特性：**
- ☕ 单杯 11 维偏离评估（萃取率/TDS/酸甜苦平衡/口感/温度等）
- 📊 多杯横向对比（≤3 杯 + 曲线叠加 + 跨维度跳转）
- 🤖 LLM 风味推断与改进建议（防污染 6 件套，本地分析为主、LLM 为辅）
- 🌗 暗色主题（三态 auto / light / dark + 防 FOUC）
- 📱 PWA 完整支持（添加到主屏幕、独立启动、完全离线、4 张 iOS Splash）
- 🔒 数据完全本地（localStorage，不上云、不联网，仅 LLM 评估按需调用）

## 快速启动

> ⚠️ PWA 安装、离线缓存等功能必须通过 http(s) 服务器访问。
> 直接双击 `pour_over_log.html`（file:// 协议）只能用基础记录功能，**不能添加到主屏幕**。

### Mac / Linux

```bash
./start.sh
# 浏览器打开 http://localhost:8765/pour_over_log.html
```

### Windows

双击 `start.bat`，浏览器会自动打开。

### 公网部署（推荐 Cloudflare Pages）

任何静态 http(s) 服务器都行。**Cloudflare Pages** 体验最佳：

1. 登录 [pages.cloudflare.com](https://pages.cloudflare.com/) → Create a project → **Direct Upload**
2. 项目名填 `brew-lab`（或自定义）
3. 把整个 `brew-lab-v13.15` 文件夹（或 zip 解压后内容）拖上去
4. 等 ~1 分钟构建完，拿到 `https://brew-lab.pages.dev/pour_over_log.html`

**其他选项：**
- **GitHub Pages**：把整个文件夹丢到一个 repo，Settings → Pages → Source 选 main → Save，适合长期迭代（每次 git push 自动重新部署）
- **Vercel / Netlify**：拖文件夹秒部署
- **Nginx / Apache**：放到 web 根目录即可

## 安装到手机/电脑（PWA）

1. 用浏览器打开站点（例：`https://brew-lab.pages.dev/pour_over_log.html`）
2. **iOS Safari**：底部「分享」→「添加到主屏幕」
3. **Android Chrome**：地址栏右侧"安装"图标，或菜单 → "添加到主屏幕"
4. **桌面 Chrome / Edge**：地址栏右侧出现安装图标，点击即可

安装后图标在桌面（深青底 + 白色 lily 滤杯 + 琥珀核心），独立窗口启动，跟原生 App 一样。**iOS 启动时会显示对应分辨率的 Brew Lab 启动页**（覆盖 ~80% iPhone / iPad Pro 11" 设备）。

## 文件清单

| 文件 | 说明 |
| --- | --- |
| pour_over_log.html | 主程序（单文件，7774 行） |
| manifest.json | PWA 清单 |
| sw.js | Service Worker（离线缓存，VERSION = brewlab-v13.15-2026-06-14） |
| icon-192.png / icon-512.png | Android / 通用标准图标 |
| icon-180.png | iOS apple-touch-icon |
| icon-maskable-512.png | Android 自适应图标（safe zone 中心 80%） |
| splash-1290x2796.png | iPhone 14/15/16 Pro Max 启动页 |
| splash-1179x2556.png | iPhone 14/15/16 Pro 启动页 |
| splash-1170x2532.png | iPhone 14/15/16 标准款启动页 |
| splash-1668x2388.png | iPad Pro 11" 启动页 |
| start.sh / start.bat | 本地一键启动脚本（macOS/Linux 与 Windows） |

## 数据存储

- 所有冲煮记录保存在浏览器 **localStorage**，完全本地、不上云
- LLM 评估按需联网（用户自行配置 API Key，仅评估时调用）
- 换浏览器/换设备数据不会自动同步（HTML 顶部有数据导出/导入按钮）
- 清浏览器数据 = 清记录，建议定期导出备份

## LLM 评估配置（可选）

V13.14 起支持调用 LLM 做风味推断与改进建议。**本地分析始终优先**，LLM 仅在本地分析不够充分时调用。

1. 进入"⚙️ 设置" → "LLM 评估配置"
2. 选 provider（火山方舟 / OpenAI / Anthropic / 自定义 OpenAI 兼容端点）
3. 填 API Key + Model ID（火山方舟用 `doubao-seed-1-6-251015` 等 Model ID，**不是控制台展示名**）
4. "测试连接" 通过后即可在评估卡使用 🤖 按钮触发

**防污染 6 件套**：知识基线 grounding + 可疑措辞负面提示 + Schema 强约束 + 低温度 0.3 + 不确定标记 + 模型抗幻觉排序 — 确保 LLM 当"翻译器"而非"专家"，不会把网络上不靠谱内容当作权威。

## 主题切换

页面右上角 🌓 按钮切换三态：
- 🌓 **auto**：跟随系统（默认）
- ☀️ **light**：强制浅色
- 🌙 **dark**：强制暗色

设置会保存在 localStorage，下次打开自动恢复。

## 更新

下次更新只需要替换文件（**重点替换 `sw.js` 顶部的 `VERSION` 常量**），浏览器下次访问会自动拉新版。如果发现页面没更新，可以：
1. 手动关闭并重新打开 PWA
2. 或在浏览器 → DevTools → Application → Service Workers → "Unregister" 强制刷新

## 版本

**当前版本：V13.15.10（杯测风味字段 + 本地推荐冲煮方案（按需））**
- 2026-06-16 计时器「暂停」改为「结束」并自动填充总时长 / BP 段勾选后两个时间字段隐藏 + 序列化拦截（顺带解决 BP 末段时总时长未生效的曲线 bug）
- 2026-06-14 V13.15 P0 品牌锚点 / P1 节奏 token 化 / P2 微交互 / P3.1 暗色 / P3.2 iOS Splash / P3.3 chart 暗色 + PWA icon 刷新 / P3.4 内联 token + sw.js bump / V13.15.1 启动屏 + Logo 横线修复

**许可：** 个人使用 / 自部署，无商业限制（如需修改源码请保留版本号注释）。
