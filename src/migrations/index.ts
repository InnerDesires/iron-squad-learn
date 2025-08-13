import * as migration_20250810_195607 from './20250810_195607';
import * as migration_20250813_123622 from './20250813_123622';

export const migrations = [
  {
    up: migration_20250810_195607.up,
    down: migration_20250810_195607.down,
    name: '20250810_195607',
  },
  {
    up: migration_20250813_123622.up,
    down: migration_20250813_123622.down,
    name: '20250813_123622'
  },
];
