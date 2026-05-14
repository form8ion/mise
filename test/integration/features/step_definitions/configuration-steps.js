import {promises as fs} from 'node:fs';
import {parse, stringify} from 'smol-toml';

import assert from 'node:assert';
import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';

Given('mise is not configured to create a lockfile', async function () {
  this.existingMiseConfig = any.simpleObject();

  await fs.writeFile(`${this.projectRoot}/mise.toml`, stringify(this.existingMiseConfig));
});

Then('mise is configured to use a lockfile', async function () {
  const {settings} = parse(await fs.readFile(`${this.projectRoot}/mise.toml`, 'utf-8'));

  assert.strictEqual(settings?.lockfile, true);
});

Then('the existing mise config is preserved', async function () {
  const {settings, ...otherConfig} = parse(await fs.readFile(`${this.projectRoot}/mise.toml`, 'utf-8'));

  assert.deepEqual(otherConfig, this.existingMiseConfig);
});
