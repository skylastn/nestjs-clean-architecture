import { describe, expect, it } from 'bun:test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Nest app smoke test', () => {
  it('contains the application entry point and module', () => {
    expect(existsSync(resolve(import.meta.dir, 'main.ts'))).toBe(true);
    expect(existsSync(resolve(import.meta.dir, 'shared/module/app_module.ts'))).toBe(true);
  });
});
