## 宪章确认
- 语言/风格：ES6+、中文注释、统一命名与 ESLint（.specify/memory/constitution.md:7–12）。
- 架构：核心逻辑与 UI 不直呼 `tt.*`，统一适配层 `adapter.js`（constitution.md:20–22）。
- 状态管理：XState 建模合成/战斗/结算全流程（constitution.md:12–16）。
- 测试与性能：单/集成测试、首启 <3s、60FPS、内存峰值 ≤200MB（constitution.md:26–37）。

## 素材目录复核
- 最终效果图：`doc/Merge-Shooter-Cartoon-Asset-Kit2-*.webp` 与 `doc/Merge-Shooter-Cartoon-Asset-Kit4-*.webp` 仅作 UI/布局参考。
- 实际素材来源：
  - `doc/Bullets`：投射物静态贴图 `1.png..4.png`（基础/穿透/爆裂/激光等）。
  - `doc/Dead fx`：敌人死亡特效 20 帧（00–19），一次播放完毕，中心锚点。
  - `doc/Gameplay Area`：主背景/顶部渐变/墙体，基准画布 1536×1024，随设备缩放与安全区适配。
  - `doc/Guns`：10 套武器，每套含 `Idle_0.png` 与 `Shoot_00..09.png`（10 帧），含 `Shield.png`。
  - `doc/Monster`：10 套敌人动画，每套 20 帧（00–19），统一帧率与锚点、碰撞盒。
  - `doc/Shoot fx`：枪口火光 15 帧（00–14），与武器 `Shoot` 同步触发。
  - `doc/User interfaces`：登录/落地页、战斗 HUD、弹窗（商店/免费升级/离线收益/清关）、滚动与按钮状态、血条等。

## 资源处理与规范
- 命名：`domain_entity_variant@scale.ext`（例：`combat_bullet_basic@1x.webp`、`ui_btn_start@2x.webp`）。
- 图集策略：
  - 生成三类图集：`atlas/ui`, `atlas/combat`, `atlas/fx`，索引 `assets/atlas/index.json`（含切片矩形、帧序列与锚点）。
  - 大背景与少数超大元素保留单图，避免图集内碎片化浪费。
- 格式与体积：主资源优先 `webp`（含透明），需要绝对无损的像素 UI 用 `png`；统一压缩与校验 `checksum`。
- 帧率与时长：
  - 敌人/武器射击：`12–15 fps`（移动端功耗友好）；死亡与枪口特效：`20–24 fps`，持续 `300–600ms`。
  - 帧驱动采用时间步进（delta-time）保证不同设备一致性。

## 技术架构与目录
- 入口与现状：原生抖音小游戏（`project.config.json:12–15`），入口 `game.js` 使用 `tt.createCanvas`（`game.js:6–11`）。
- 目录规划：
  - `src/core/`（棋盘合成、单位/子弹/敌人模型与数值公式）
  - `src/systems/`（波次/战斗/碰撞/掉落/特效调度）
  - `src/ui/`（HUD、弹窗、按钮与交互）
  - `src/state/`（XState 状态机与事件）
  - `src/platform/adapter.js`（登录/分享/云函数/存档/广告）
  - `assets/`（`atlas/*`, `manifest.json`, 单图背景）
- 渲染层：Canvas2D 渲染器，批量绘制与图集裁剪；逻辑与渲染解耦，事件总线驱动。
- 适配层：封装 `tt.login`、`tt.shareAppMessage`、云函数（open_id/内容安全/数据库）、文件系统与广告，提供优雅降级与错误边界。
- 状态机：`menu -> gameplay -> pause -> result -> shop` 主流程；子状态含 `merge`, `combat`, `reward`；不可变更新。

## 平台接口集成
- 登录：`tt.login` 获取 `code` → 云函数交换 `open_id`（复用 `cloudfunctions/quickstart/get_open_id`）。
- 分享：`tt.shareAppMessage` + 动态截图（HUD 隐藏、合成关卡文案）；`tt.onShareAppMessage` 设置默认分享。
- 排行与社交：云数据库存档、周榜/好友榜；服务端分数签名防作弊；文案走 `antidirt`。
- 审核前检查：接口权限、授权弹窗、内容安全合规、崩溃与错误日志清零。

## 测试与性能
- 单测：纯逻辑（合成规则、伤害/攻速公式、波次曲线、状态机转换）。
- 集成：适配层接口、加载器与缓存、战斗循环帧采样；真机矩阵覆盖主流 iOS/Android。
- 预算监控：首帧时间、FPS 稳定性、内存峰值与泄露扫描；资源懒加载命中率与图集粒度 A/B。

## 里程碑与时间
- W1：素材切片与图集生成、`assets/manifest.json` 与加载器、HUD 与落地页原型；适配层雏形。
- W2：合成棋盘 + 战斗原型接入武器/子弹/敌人动画；登录与云端打通；离线收益与清关弹窗。
- W3：分享/排行榜/内容安全接入；枪口/死亡特效与碰撞优化；性能优化与真机兼容性测试。
- W4：数值打磨与动效；全面回归与审核资料准备、提审支持。

## 素材缺口与交付
- 建议补充：音效（射击/命中/升级/按钮）与背景音乐、字体/字库、更多主题背景与图标状态。
- 每周提交 Demo 与指标：首启时长、FPS、内存峰值、缺陷数；同步素材需求单。

如以上方案与素材目录确认一致，请批准进入实施阶段，我将按节点推进并提交周报与素材清单。