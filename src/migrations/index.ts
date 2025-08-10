import * as migration_20250810_192904 from './20250810_192904';

export const migrations = [
  {
    up: migration_20250810_192904.up,
    down: migration_20250810_192904.down,
    name: '20250810_192904'
  },
];
