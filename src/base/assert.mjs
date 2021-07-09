import * as fs from 'fs'
import * as assert from 'assert'

function _empty(obj) {
  return typeof obj === 'undefined' || obj === null ||
    (Object.keys(obj).length === 0 && obj.constructor === Object)
}

export function empty(obj) {
  if (!_empty(obj)) {
    assert.fail(obj + ' should be empty')
  }
}

export function notEmpty(obj) {
  if (_empty(obj)) {
    assert.fail(obj + ' should not be empty')
  }
}

export function pathExists(path) {
  if (!fs.existsSync(path)) {
    assert.fail(path + ' should exist.')
  }
}

export function pathNotExists(path) {
  if (fs.existsSync(path)) {
    assert.fail(path + ' should not exist.')
  }
}

export function resourceMoved(res, url) {
  let codes = [301, 302]
  if (codes.indexOf(res.status) === -1) {
    assert.fail('invalid status code.')
  }
  if (res.header['location'] !== url) {
    assert.fail('redirect url mismatch.')
  }
}
