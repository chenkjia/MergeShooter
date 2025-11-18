/**
 * 炮塔等级数据表
 * - 统一管理 1~8 级炮塔的固定数值与纹理键，供渲染与战斗逻辑使用
 * - 字段说明：
 *   - level: 等级编号
 *   - name: 显示名称（用于调试或UI文案）
 *   - attack: 攻击力基础值
 *   - attackSpeed: 攻击速度（秒/次）
 *   - range: 攻击范围（像素）
 *   - textureKey: 纹理资源键（在 resourceManager.textures 中查找）
 */
const levels = {
  1: { level: 1, name: '炮塔 Lv1', attack: 10, attackSpeed: 1, range: 150, textureKey: 'tank_level_1' },
  2: { level: 2, name: '炮塔 Lv2', attack: 20, attackSpeed: 1, range: 150, textureKey: 'tank_level_2' },
  3: { level: 3, name: '炮塔 Lv3', attack: 30, attackSpeed: 1, range: 150, textureKey: 'tank_level_3' },
  4: { level: 4, name: '炮塔 Lv4', attack: 40, attackSpeed: 1, range: 150, textureKey: 'tank_level_4' },
  5: { level: 5, name: '炮塔 Lv5', attack: 50, attackSpeed: 1, range: 150, textureKey: 'tank_level_5' },
  6: { level: 6, name: '炮塔 Lv6', attack: 60, attackSpeed: 1, range: 150, textureKey: 'tank_level_6' },
  7: { level: 7, name: '炮塔 Lv7', attack: 70, attackSpeed: 1, range: 150, textureKey: 'tank_level_7' },
  8: { level: 8, name: '炮塔 Lv8', attack: 80, attackSpeed: 1, range: 150, textureKey: 'tank_level_8' },
};

/**
 * 炮塔允许的最高等级
 * - 合并逻辑需遵循此上限，超过上限的合并应被拒绝
 */
const maxLevel = 8;

module.exports = { levels, maxLevel };
