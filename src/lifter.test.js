import {promises as fs} from 'node:fs';
import {parse, stringify} from 'smol-toml';

import {describe, it, expect, vi, beforeEach} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import liftMise from './lifter.js';

vi.mock('node:fs');
vi.mock('smol-toml');

describe('mise lifter', () => {
  const projectRoot = any.string();
  const serializedExistingConfig = any.string();
  const serializedLiftedConfig = any.string();

  beforeEach(() => {
    when(fs.readFile).calledWith(`${projectRoot}/mise.toml`, 'utf-8').thenResolve(serializedExistingConfig);
  });

  it('should enable lockfile support under settings while preserving existing config', async () => {
    const existingConfig = {tools: {node: '22.14.0'}, settings: {idiomatic_version_file_enable_tools: ['node']}};

    when(parse).calledWith(serializedExistingConfig).thenReturn(existingConfig);
    when(stringify)
      .calledWith({
        settings: {
          ...existingConfig.settings,
          lockfile: true
        },
        tools: existingConfig.tools
      })
      .thenReturn(serializedLiftedConfig);

    await liftMise({projectRoot});

    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/mise.toml`, serializedLiftedConfig);
  });

  it('should replace non-object settings with lockfile settings', async () => {
    const existingConfig = {tools: {node: '22.14.0'}, settings: 'not-an-object'};

    when(parse).calledWith(serializedExistingConfig).thenReturn(existingConfig);
    when(stringify)
      .calledWith({
        settings: {
          lockfile: true
        },
        tools: existingConfig.tools
      })
      .thenReturn(serializedLiftedConfig);

    expect(await liftMise({projectRoot})).toEqual({});

    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/mise.toml`, serializedLiftedConfig);
  });
});
