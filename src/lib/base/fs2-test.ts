import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { deepPathOf, mkdirSync2, rmSync2 } from './fs2.js'

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

describe('test dir', () => {
  it('make dir', () => {
    makeTestDir()
  })
  it('check', () => {
    expect(existsSync(tdir)).toBe(true)
  })
  it('remove dir', () => {
    removeTestDir()
  })
  it('check', () => {
    expect(existsSync(tdir)).toBe(false)
  })
})

describe('genFiles', () => {
  it('gen files', () => {
    genFiles()
  })
  it('check', () => {
    expect(existsSync(tpath('sub1'))).toBe(true)
    expect(existsSync(tpath('sub2'))).toBe(true)
    expect(existsSync(tpath('sub2/sub3'))).toBe(true)
    expect(existsSync(tpath('sub1/f1.txt'))).toBe(true)
    expect(existsSync(tpath('sub2/f2.txt'))).toBe(true)
    expect(existsSync(tpath('sub2/sub3/f3.txt'))).toBe(true)
  })
})

describe('mkdirSync2', () => {
  it('make dir empty', () => {
    removeTestDir()
  })

  it('sub1 not exists', () => {
    expect(existsSync(tpath('sub1'))).toBe(false)
  })
  it('mkdir sub1', () => {
    mkdirSync2(tpath('sub1'))
  })
  it('sub1 exists', () => {
    expect(existsSync(tpath('sub1'))).toBe(true)
  })

  it('sub1/sub2/sub3 not exists', () => {
    expect(existsSync(tpath('sub1/sub2/sub3'))).toBe(false)
  })
  it('mkdir sub1/sub2/sub3', () => {
    mkdirSync2(tpath('sub1/sub2/sub3'))
  })
  it('sub1/sub2/sub3 exists', () => {
    expect(existsSync(tpath('sub1/sub2/sub3'))).toBe(true)
  })
})

describe('rmSync2', () => {
  it('gen files', () => {
    genFiles()
  })
  it('sub1/f1.txt exists', () => {
    expect(existsSync(tpath('sub1/f1.txt'))).toBe(true)
  })
  it('rm sub1/f1.txt', () => {
    rmSync2(tpath('sub1/f1.txt'))
  })
  it('sub1/f1.txt removed', () => {
    expect(existsSync(tpath('sub1/f1.txt'))).toBe(false)
    expect(existsSync(tpath('sub1'))).toBe(true)
    expect(existsSync(tpath('sub2/sub3/f3.txt'))).toBe(true)
  })

  it('gen files', () => {
    genFiles()
  })
  it('sub1 exists', () => {
    expect(existsSync(tpath('sub1'))).toBe(true)
  })
  it('rm sub1', () => {
    rmSync2(tpath('sub1'))
  })
  it('sub1 removed', () => {
    expect(existsSync(tpath('sub1'))).toBe(false)
    expect(existsSync(tpath('sub2/f2.txt'))).toBe(true)
    expect(existsSync(tpath('sub2/sub3/f3.txt'))).toBe(true)
  })

  it('gen files', () => {
    genFiles()
  })
  it('sub2 exists', () => {
    expect(existsSync(tpath('sub2'))).toBe(true)
  })
  it('rm sub2 recursively', () => {
    rmSync2(tpath('sub2'))
  })
  it('sub2 removed', () => {
    expect(existsSync(tpath('sub2'))).toBe(false)
    expect(existsSync(tpath('sub1/f1.txt'))).toBe(true)
  })

  it('rm already removed', () => {
    rmSync2(tpath('sub1/fx.txt'))
    rmSync2(tpath('sub1/fx.txt'))
  })
})

describe('deepPathOf', () => {
  it('check', () => {
    expect(deepPathOf(1, 3)).toBe('0/0/1')
    expect(deepPathOf(999, 3)).toBe('0/0/999')
    expect(deepPathOf(1000, 3)).toBe('0/1/0')
    expect(deepPathOf(1999, 3)).toBe('0/1/999')
    expect(deepPathOf(999999, 3)).toBe('0/999/999')
    expect(deepPathOf(1999999, 3)).toBe('1/999/999')
    expect(deepPathOf(999999999, 3)).toBe('999/999/999')
    expect(deepPathOf(9999999999, 3)).toBe('9999/999/999')
  })
})
