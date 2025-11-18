const styles = {
  colors: {
    turretBg: 0x4ebdc4,
    turretOuter: 0x8fe1dd,
    turretInner: 0x49cdcf,
    hoverBorder: 0xffffff,
    occupiedBorder: 0xffd700,
  },
  turret: {
    outerSize: 56,
    innerSize: 48,
    innerRadius: 2,
    spacing: 6,
    rows: 2,
    cols: 6,
  },
  layout: {
    monster: 0.3,
    shooting: 0.3,
    turret: 0.25,
    buttons: 0.15,
  },
};

const turretSlotStyles = {
  default: {
    outerFill: 0x8fe1dd,
    innerFill: 0x49cdcf,
    borderColor: 0x000000,
    borderWidth: 0,
  },
  hover: {
    outerFill: 0x8fe1dd,
    innerFill: 0x49cdcf,
    borderColor: 0xffffff,
    borderWidth: 2,
  },
  occupied: {
    outerFill: 0x8fe1dd,
    innerFill: 0x49cdcf,
    borderColor: 0xffd700,
    borderWidth: 3,
  },
};

module.exports = { styles, turretSlotStyles };