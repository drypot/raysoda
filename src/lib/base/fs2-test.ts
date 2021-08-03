import { assertPathExists, assertPathNotExists } from './assert2.js'
import { mkdirSync, rmSync, writeFileSync } from 'fs'
import { genDeepPath, mkdirSync2, rmSync2 } from './fs2.js'

const tdir = 'tmp/fs-test'

function tpath(path: string) {
  return tdir + '/' + path
}

function makeTestDir() {
  mkdirSync(tdir, { recursive: true, mode: 0o755 })
}

function removeTestDir() {
  rmSync(tdir, { force: true, recursive: true })
}

function genFiles() {
  mkdirSync(tpath('sub1'), { recursive: true, mode: 0o755 })
  mkdirSync(tpath('sub2/sub3'), { recursive: true, mode: 0o755 })
  writeFileSync(tpath('sub1/f1.txt'), 'abc')
  writeFileSync(tpath('sub2/f2.txt'), 'abc')
  writeFileSync(tpath('sub2/sub3/f3.txt'), 'abc')
}

describe('makeTestDir/removeDir', () => {
  it('should work', () => {
    makeTestDir()
    assertPathExists(tdir)
    makeTestDir()

    removeTestDir()
    assertPathNotExists(tdir)
    removeTestDir()

    makeTestDir()
    assertPathExists(tdir)
  })
})

describe('genFiles', () => {
  it('should work', () => {
    genFiles()
    assertPathExists(tpath('sub1'))
    assertPathExists(tpath('sub2'))
    assertPathExists(tpath('sub2/sub3'))
    assertPathExists(tpath('sub1/f1.txt'))
    assertPathExists(tpath('sub2/f2.txt'))
    assertPathExists(tpath('sub2/sub3/f3.txt'))
  })
})

describe('mkdirSync2', () => {
  it('should work', () => {
    removeTestDir()
    assertPathNotExists(tpath('sub1'))
    mkdirSync2(tpath('sub1'))
    assertPathExists(tpath('sub1'))
    assertPathNotExists(tpath('sub1/sub2/sub3'))
    mkdirSync2(tpath('sub1/sub2/sub3'))
    assertPathExists(tpath('sub1/sub2/sub3'))
  })
})

describe('rmSync2', () => {
  beforeEach(genFiles)
  it('should work for one file', () => {
    rmSync2(tpath('sub1/f1.txt'))
    assertPathNotExists(tpath('sub1/f1.txt'))
    assertPathExists(tpath('sub1'))
    assertPathExists(tpath('sub2/sub3/f3.txt'))
  })
  it('should work for one dir', () => {
    rmSync2(tpath('sub1'))
    assertPathNotExists(tpath('sub1'))
    assertPathExists(tpath('sub2/f2.txt'))
    assertPathExists(tpath('sub2/sub3/f3.txt'))
  })
  it('should work recursively', () => {
    rmSync2(tpath('sub2'))
    assertPathNotExists(tpath('sub2'))
    assertPathExists(tpath('sub1/f1.txt'))
  })
  it('should work for already removed', () => {
    rmSync2(tpath('sub1/fx.txt'))
    rmSync2(tpath('sub1/fx.txt'))
  })
})

describe('genDeepPath', () => {
  it('should work', () => {
    expect(genDeepPath(1, 3)).toBe('0/0/1')
    expect(genDeepPath(999, 3)).toBe('0/0/999')
    expect(genDeepPath(1000, 3)).toBe('0/1/0')
    expect(genDeepPath(1999, 3)).toBe('0/1/999')
    expect(genDeepPath(999999, 3)).toBe('0/999/999')
    expect(genDeepPath(1999999, 3)).toBe('1/999/999')
    expect(genDeepPath(999999999, 3)).toBe('999/999/999')
    expect(genDeepPath(9999999999, 3)).toBe('9999/999/999')
  })
})
