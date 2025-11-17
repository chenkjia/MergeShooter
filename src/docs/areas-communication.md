# 模块通信机制

## 区域模块接口

- MonsterPathArea、ShootingArea、TurretArea、ButtonArea 统一提供方法：`initialize()`, `draw()`, `update()`, `onTouchStart(touches)`, `onTouchMove(touches)`, `onTouchEnd(touches)`。
- 所有区域通过构造函数接收其 `bounds`，用于布局计算。

## 事件机制

- 使用 `src/core/events.js` 提供的 `on(event, handler)`, `emit(event, detail)`, `off(event, handler)` 进行解耦通信。
- 事件示例：
  - `turret.hover`：由 TurretArea 在光标移动到炮台槽位时触发，传递槽位索引与坐标。
  - `turret.place`：由 ButtonArea 或其他触发方发出，TurretArea 接收后在对应槽位放置炮台。

## 调度层

- `gameScene` 负责创建与持有四个区域实例，按顺序调用其 `initialize`、`draw`、`update`，并将触摸事件转发到相应区域。

## 渲染后备

- 当 `PIXI` 不存在时，各区域退回到 2D Canvas 渲染路径，接口保持一致。