import {promises as fs} from 'node:fs';
import {parse, stringify} from 'smol-toml';

import assert from 'node:assert';
import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';

const SETTINGS_HEADER_AT_TOP = /^\[settings\]\n/;

Given('mise is not configured to create a lockfile', async function () {
  const firstSectionName = any.word();
  const secondSectionName = `${any.word()}Section`;

  this.existingMiseConfig = {
    [firstSectionName]: {
      [any.word()]: any.word()
    },
    [secondSectionName]: {
      [any.word()]: any.word()
    }
  };

  await fs.writeFile(`${this.projectRoot}/mise.toml`, stringify(this.existingMiseConfig));
});

Then('mise is configured to use a lockfile', async function () {
  const configContents = await fs.readFile(`${this.projectRoot}/mise.toml`, 'utf-8');
  const {settings} = parse(configContents);

  assert.match(configContents, SETTINGS_HEADER_AT_TOP);
  assert.strictEqual(settings?.lockfile, true);
});

Then('the existing mise config is preserved', async function () {
  const configContents = await fs.readFile(`${this.projectRoot}/mise.toml`, 'utf-8');
  const {settings, ...otherConfig} = parse(configContents);

  assert.match(configContents, SETTINGS_HEADER_AT_TOP);
  assert.deepEqual(otherConfig, this.existingMiseConfig);
});
