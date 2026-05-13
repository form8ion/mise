import {promises as fs} from 'node:fs';
import {stringify} from 'smol-toml';

import {describe, it, expect, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import scaffoldMise from './scaffolder.js';

vi.mock('node:fs');
vi.mock('smol-toml');

describe('mise scaffolder', () => {
  it('should scaffold the mise configuration file', async () => {
    const projectRoot = any.string();
    const serializedConfig = any.string();
    when(stringify).calledWith({settings: {lockfile: true}}).thenReturn(serializedConfig);

    expect(await scaffoldMise({projectRoot})).toEqual({});

    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/mise.toml`, serializedConfig);
  });
});
