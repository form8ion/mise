import {promises as fs} from 'node:fs';
import {parse, stringify} from 'smol-toml';

export default async function liftMise({projectRoot}) {
  const miseConfigPath = `${projectRoot}/mise.toml`;
  const existingConfig = parse(await fs.readFile(miseConfigPath, 'utf-8'));
  const existingSettings = '[object Object]' === Object.prototype.toString.call(existingConfig.settings)
    ? existingConfig.settings
    : {};

  await fs.writeFile(
    miseConfigPath,
    stringify({
      ...existingConfig,
      settings: {
        ...existingSettings,
        lockfile: true
      }
    })
  );
}
