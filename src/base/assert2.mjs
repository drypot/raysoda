import * as fs from "fs";
import * as assert from "assert";

export * from "assert";

export const e = assert.strictEqual;
export const ne = assert.notStrictEqual;
export const de = assert.deepStrictEqual;
export const nde = assert.notDeepStrictEqual;

function isEmpty(obj) {
  return typeof obj === 'undefined' || obj === null ||
    (Object.keys(obj).length === 0 && obj.constructor === Object);
}

export function empty(obj) {
  if (!isEmpty(obj)) {
    assert.fail(obj + ' should be empty');
  }
}

export function notEmpty(obj) {
  if (isEmpty(obj)) {
    assert.fail(obj + ' should not be empty');
  }
}

export function pathExists(path)  {
  if (!fs.existsSync(path)) {
    assert.fail(path + ' should exist.');
  }
}

export function pathNotExists(path)  {
  if (fs.existsSync(path)) {
    assert.fail(path + ' should not exist.');
  }
}

export function redirect(res, url) {
  let codes = [301, 302];
  if (codes.indexOf(res.status) === -1) {
    assert.fail('invalid status code.');
  }
  if (res.header['location'] !== url) {
    assert.fail('redirect url mismatch.');
  }
}
