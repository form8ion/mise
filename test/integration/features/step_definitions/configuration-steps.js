import {promises as fs} from 'node:fs';
import {parse, stringify} from 'smol-toml';

import assert from 'node:assert';
import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {fileExists} from '@form8ion/core';

const SETTINGS_HEADER_AT_TOP = /^\[settings\]\n/;

Given('mise is not configured to maintain a lockfile', async function () {
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

Given('mise is configured to maintain a lockfile', async function () {
  this.existingMiseConfig = {
    settings: {
      lockfile: true
    }
  };
  this.existingMiseLockContent = any.string();

  await Promise.all([
    fs.writeFile(`${this.projectRoot}/mise.toml`, stringify(this.existingMiseConfig)),
    fs.writeFile(`${this.projectRoot}/mise.lock`, this.existingMiseLockContent)
  ]);
});

Then('mise is configured to use a lockfile', async function () {
  const configContents = await fs.readFile(`${this.projectRoot}/mise.toml`, 'utf-8');
  const {settings} = parse(configContents);

  assert.match(configContents, SETTINGS_HEADER_AT_TOP);
  assert.strictEqual(settings?.lockfile, true);
  assert.ok(await fileExists(`${this.projectRoot}/mise.lock`));
});

Then('the existing mise config is preserved', async function () {
  const configContents = await fs.readFile(`${this.projectRoot}/mise.toml`, 'utf-8');
  const parsedConfig = parse(configContents);
  const {settings, ...otherConfig} = parsedConfig;

  assert.match(configContents, SETTINGS_HEADER_AT_TOP);

  if (this.existingMiseLockContent) {
    assert.strictEqual(await fs.readFile(`${this.projectRoot}/mise.lock`, 'utf-8'), this.existingMiseLockContent);
    assert.deepEqual(parsedConfig, this.existingMiseConfig);
  } else {
    assert.deepEqual(otherConfig, this.existingMiseConfig);
  }
});
