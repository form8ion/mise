import {promises as fs} from 'node:fs';
import {parse} from 'smol-toml';

import assert from 'node:assert';
import {Then} from '@cucumber/cucumber';

Then('mise is configured to use a lockfile', async function () {
  const {lockfile} = parse(await fs.readFile(`${this.projectRoot}/mise.toml`, 'utf-8'));

  assert.ok(lockfile);
});
