import {fileExists} from '@form8ion/core';

import {describe, it, expect, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import miseInUse from './tester.js';

vi.mock('@form8ion/core');

describe('mise predicate', () => {
  const projectRoot = any.string();

  it('should return `true` when the mise config file is found', async () => {
    when(fileExists).calledWith(`${projectRoot}/mise.toml`).thenResolve(true);

    expect(await miseInUse({projectRoot})).toBe(true);
  });

  it('should return `false` when the mise config file is found', async () => {
    when(fileExists).calledWith(`${projectRoot}/mise.toml`).thenResolve(false);

    expect(await miseInUse({projectRoot})).toBe(false);
  });
});
