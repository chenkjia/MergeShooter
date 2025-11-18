const styles = {
  colors: {
    turretBg: 0x4ebdc4,
    turretOuter: 0x8fe1dd,
    turretInner: 0x49cdcf,
    hoverBorder: 0xffffff,
    occupiedBorder: 0xffd700,
  },
  turret: {
    outerSize: 54,
    innerSize: 46,
    innerRadius: 2,
    spacing: 6,
    rows: 2,
    cols: 6,
  },
  shooting: {
    spotWidth: 54,
    spotHeight: 54,
    spotRadius: 6,
  },
  layout: {
    monster: 0.6,
    shooting: 0.1,
    turret: 0.2,
    buttons: 0.10,
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