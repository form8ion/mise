import {promises as fs} from 'node:fs';
import {stringify} from 'smol-toml';

export default async function scaffold({projectRoot}) {
  await Promise.all([
    fs.writeFile(`${projectRoot}/mise.toml`, stringify({settings: {lockfile: true}})),
    fs.writeFile(`${projectRoot}/mise.lock`, '')
  ]);

  return {};
}
