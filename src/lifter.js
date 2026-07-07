import {promises as fs} from 'node:fs';
import {parse, stringify} from 'smol-toml';
import {fileExists} from '@form8ion/core';

export default async function liftMise({projectRoot}) {
  const miseConfigPath = `${projectRoot}/mise.toml`;
  const existingConfig = parse(await fs.readFile(miseConfigPath, 'utf-8'));
  const {settings, ...otherConfig} = existingConfig;
  const existingSettings = '[object Object]' === Object.prototype.toString.call(settings)
    ? settings
    : {};

  await fs.writeFile(
    miseConfigPath,
    stringify({
      settings: {
        ...existingSettings,
        lockfile: true
      },
      ...otherConfig
    })
  );

  if (!(await fileExists(`${projectRoot}/mise.lock`))) {
    await fs.writeFile(`${projectRoot}/mise.lock`, '');
  }

  return {};
}
