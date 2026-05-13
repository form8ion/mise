import {fileExists} from '@form8ion/core';

export default function test({projectRoot}) {
  return fileExists(`${projectRoot}/mise.toml`);
}
