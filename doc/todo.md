## 目标总览
- 数据驱动：用 JSON 管理炮塔、怪物、波次、经济、技能与设置。
- 怪物与波次：20 波为 Boss 波，Boss 后安排金币波，并提升所有怪物属性。
- 炮塔与射击：扩展为 20 种炮塔；1–8 单弹，9–12 双弹，13–20 三弹；发射与击杀动画。
- 经济与概率：购置与升级成本递增；可调生成等级概率，保持挑战性。
- UI 与反馈：波次显示、设置与反馈通道完善。
- 存档与排行：波次与成绩本地保存，支持云端排行榜。
- 广告接入：激励视频与插屏的最小可用流程。

## 数据与配置（JSON）
- 新增数据文件（放置在 `src/data`）：
  - 炮塔表：`cannons.json`（id、name、attack、attackSpeed、range、bulletCount、textureKey、合并上限）。
  - 怪物表：`monsters.json`（type、speed、damage、hp、gold、textureKey、特殊能力）。
  - 波次表：`waves.json`（waveIndex、type(normal/elite/boss/coin)、spawnCount、bossId、coinRate、属性系数）。
  - 经济表：`economy.json`（buyCostBase、buyCostStep、upgradeCostBase=100、upgradeCostStep=100、tankLevelProbPresets）。
  - 技能表：`skills.json`（id、name、cd、effect、数值参数）。
  - 设置表：`settings.json`（音效、振动、难度、反馈入口开关）。
- 加载位置与方式：沿用 `src/adapter/adapter.js` 的存储与解析，统一由 `src/scenes/gameScene.js` 启动时读取并注入到上下文 `src/core/context.js`。

## 怪物与波次
- Boss 规则：每第 20 波为 Boss 波；Boss 属性显著提升（伤害/血量/速度/掉落）。
- 金币波：Boss 波后触发一轮金币波（普通怪替换为金币怪，击杀掉落增多）。
- 属性成长：每过 Boss 后，所有怪物属性按系数增加（例如 `hp *= (1 + 0.15 * bossClears)`）。
- 怪物类型扩展：确保至少 5 种类型（如 normal/fast/tank/ranged/exploder），各自具备不同数值与行为。
- 改动入口：
  - 波次生成：`src/systems/waveManager.js` 增加 boss/coin 判定与属性系数输出。
  - 怪物生成与路径：`src/areas/MonsterPathArea.js` 按 `waves.json` 类型生成并应用成长系数。
  - 怪物实体：`src/entities/monster.js`/`src/entities/pathMonster.js` 扩展类型与数值字段。

## 炮塔与射击
- 炮塔扩展：总数扩至 20 种，`1–8: bulletCount=1`，`9–12: bulletCount=2`，`13–20: bulletCount=3`。
- 合并上限：统一在 `cannons.json` 配置，`src/core/mergeLogic.js` 读取上限而非硬编码 8。
- 多弹发射：`src/entities/bullet.js` 与 `src/areas/ShootingArea.js` 支持根据 `bulletCount` 同步或扇形多发。
- 发射动画：在 `ShootingArea` 或 `tank` 绘制层加入开火动画帧。
- 击杀动画：怪物被炮击杀时播放爆炸/解体动画（扩展 `src/entities/explosion.js` 或 Monster 的死亡过渡）。

## 经济与概率
- 购置成本：第二个按钮买坦克后 cost 递增，每次 +1（从 `economy.json.buyCostBase` 起，步进 `buyCostStep`）。
- 升级成本：第三个按钮升级初始为 100，每次 +100（`upgradeCostBase/Step`）。
- 生成等级概率：提供预设概率（如 90%/10%、80%/20% 等），点击第三个按钮切换预设；由策划设定确保挑战性。
- 改动入口：`src/areas/ButtonArea.js` 读取 `economy.json`，驱动 UI 文案与逻辑；概率用于 `src/core/mergeLogic.js` 或生成流程。

## 技能系统
- 布局：在场景右侧/底部新增技能栏位，冷却与可点击态显示。
- 实现：技能效果通过 `skills.json` 数据驱动（例如减速、暴击、护盾、金币加成）。
- 逻辑入口：`src/scenes/gameScene.js` 注入技能系统，`src/core/events.js` 分发技能触发，相关区域订阅效果。

## UI 与反馈
- 波次显示：新增当前波次与类型（普通/精英/Boss/金币）UI；显示剩余怪数量与倒计时。
- 设置与反馈：设置面板（声音/振动/难度），反馈入口（如邮箱或表单链接）。
- 视觉反馈：发射/命中/击杀动画与音效对齐设置。

## 存档与排行
- 本地存档：记录最高波次、金币、用时与技能使用，使用 `src/adapter/adapter.js` 的 `setStorageSync`。
- 排行：接入云函数（见 `cloudfunctions/quickstart` 示例），定义记录结构与排序规则；客户端新增排行榜页面与上报流程。

## 广告接入
- 激励视频：用于复活/双倍金币等奖励；插屏用于关卡间展示。
- 入口与节奏：避免影响核心玩法，Boss 后与金币波前为推荐时机。

## 验收标准（关键项）
- 数据驱动：不再依赖硬编码等级与数值，全部来自 JSON。
- Boss/金币波：第 20、40、60… 波为 Boss，紧随金币波，属性成长生效。
- 炮塔弹数：不同区间发射 1/2/3 弹，表现稳定且无帧掉落。
- 经济与概率：按钮文案与成本递增正确，概率切换生效且可见。
- 技能：至少 3 种技能可用，有冷却与效果反馈。
- 存档与排行：本地最高波次持久化；排行榜能读取与提交记录。
- 广告：激励视频与插屏在测试环境可正常调用与回调。

## 依赖关系与实施顺序（建议）
1. 数据与配置（JSON）落地与加载。
2. 波次系统与怪物类型扩展。
3. 炮塔扩展与多弹发射/动画。
4. 经济与概率逻辑接入。
5. 技能布局与实现。
6. UI（波次显示/设置与反馈）。
7. 存档与排行。
8. 广告接入与端到端测试。

## 代码改动入口映射
- `src/data/*.json`：新增数据文件。
- `src/systems/waveManager.js`：Boss/金币波与属性成长。
- `src/areas/MonsterPathArea.js`：按波次与类型生成怪物。
- `src/entities/monster.js` / `src/entities/pathMonster.js`：怪物类型与数值字段。
- `src/data/cannons.js`→改为读取 `cannons.json`；`src/core/mergeLogic.js` 读取上限。
- `src/areas/ShootingArea.js` / `src/entities/bullet.js` / `src/entities/explosion.js`：多弹与动画。
- `src/areas/ButtonArea.js`：购置/升级成本与概率切换。
- `src/scenes/gameScene.js` / `src/core/events.js`：技能系统接入。
- `src/adapter/adapter.js`：本地存档读写封装复用。
- `cloudfunctions/quickstart/*`：排行榜读写参考与接入。
