import {promises as fs} from 'node:fs';
import {stringify} from 'smol-toml';

export default async function scaffold({projectRoot}) {
  await fs.writeFile(`${projectRoot}/mise.toml`, stringify({settings: {lockfile: true}}));

  return {};
}
