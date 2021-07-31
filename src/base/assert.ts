import * as fs from 'fs'
import * as assert from 'assert'

function _empty(obj:any) {
  return typeof obj === 'undefined' || obj === null ||
    (Object.keys(obj).length === 0 && obj.constructor === Object)
}

export function empty(obj:any) {
  if (!_empty(obj)) {
    assert.fail(obj + ' should be empty')
  }
}

export function notEmpty(obj:any) {
  if (_empty(obj)) {
    assert.fail(obj + ' should not be empty')
  }
}

export function pathExists(path:string) {
  if (!fs.existsSync(path)) {
    assert.fail(path + ' should exist.')
  }
}

export function pathNotExists(path:string) {
  if (fs.existsSync(path)) {
    assert.fail(path + ' should not exist.')
  }
}

// 디펜던시 문제 해결을 위해 추후 적절히 이동해야
export function resourceMoved(res:any, url:string) {
  let codes = [301, 302]
  if (codes.indexOf(res.status) === -1) {
    assert.fail('invalid status code.')
  }
  if (res.header['location'] !== url) {
    assert.fail('redirect url mismatch.')
  }
}
