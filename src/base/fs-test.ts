import * as fs from 'fs'
import * as fs2 from './fs.js'
import { pathExists, pathNotExists } from './assert.js'

const testDir = 'tmp/fs-test'

function testPath(path: string) {
  return testDir + '/' + path
}

function genFiles() {
  fs.mkdirSync(testPath('sub1'), { recursive: true, mode: 0o755 })
  fs.mkdirSync(testPath('sub2/sub3'), { recursive: true, mode: 0o755 })
  fs.writeFileSync(testPath('sub1/f1.txt'), 'abc')
  fs.writeFileSync(testPath('sub2/f2.txt'), 'abc')
  fs.writeFileSync(testPath('sub2/sub3/f3.txt'), 'abc')
  pathExists(testPath('sub1'))
  pathExists(testPath('sub2'))
  pathExists(testPath('sub2/sub3'))
  pathExists(testPath('sub1/f1.txt'))
  pathExists(testPath('sub2/f2.txt'))
  pathExists(testPath('sub2/sub3/f3.txt'))
}

describe('removeDir', () => {
  beforeEach(genFiles)
  it('should work for one file', done => {
    fs2.removeDir(testPath('sub1/f1.txt'), (err: any) => {
      expect(err).toBeFalsy()
      pathExists(testPath('sub1'))
      pathExists(testPath('sub2'))
      pathExists(testPath('sub2/sub3'))
      pathExists(testPath('sub2/f2.txt'))
      pathExists(testPath('sub2/sub3/f3.txt'))
      pathNotExists(testPath('sub1/f1.txt'))
      done()
    })
  })
  it('should work for one dir', done => {
    fs2.removeDir(testPath('sub1'), (err: any) => {
      expect(err).toBeFalsy()
      pathExists(testPath('sub2'))
      pathExists(testPath('sub2/sub3'))
      pathExists(testPath('sub2/f2.txt'))
      pathExists(testPath('sub2/sub3/f3.txt'))
      pathNotExists(testPath('sub1'))
      pathNotExists(testPath('sub1/f1.txt'))
      done()
    })
  })
  it('should work recursively', done => {
    fs2.removeDir(testPath('sub2'), (err: any) => {
      expect(err).toBeFalsy()
      pathExists(testPath('sub1'))
      pathExists(testPath('sub1/f1.txt'))
      pathNotExists(testPath('sub2'))
      pathNotExists(testPath('sub2/sub3'))
      pathNotExists(testPath('sub2/f2.txt'))
      pathNotExists(testPath('sub2/sub3/f3.txt'))
      done()
    })
  })
  it('can return ENOENT', done => {
    fs2.removeDir(testPath('sub1/fx.txt'), (err: any) => {
      expect(err).toBeTruthy()
      expect(err.code).toBe('ENOENT')
      done()
    })
  })
})

describe('emptyDir', () => {
  beforeAll(genFiles)
  it('should succeed', done => {
    const files = fs.readdirSync(testDir)
    expect(files.length).toBeGreaterThan(0)
    fs2.emptyDir(testDir, (err: any) => {
      expect(err).toBeFalsy()
      const files = fs.readdirSync(testDir)
      expect(files.length).toBe(0)
      done()
    })
  })
})

describe('makeDirEasy', () => {
  beforeEach(done => {
    fs2.emptyDir(testDir, done)
  })
  it('should succeed', done => {
    pathNotExists(testPath('sub1'))
    fs2.makeDirEasy(testPath('sub1'), function (err: any) {
      expect(err).toBeFalsy()
      pathExists(testPath('sub1'))
      pathNotExists(testPath('sub1/sub2/sub3'))
      fs2.makeDirEasy(testPath('sub1/sub2/sub3'), function (err: any) {
        expect(err).toBeFalsy()
        pathExists(testPath('sub1/sub2/sub3'))
        done()
      })
    })
  })
})

describe('safeFilename', () => {
  it('should succeed', () => {
    const table = [
      ['`', '`'], ['~', '~'],
      ['!', '!'], ['@', '@'], ['#', '#'], ['$', '$'], ['%', '%'],
      ['^', '^'], ['&', '&'], ['*', '_'], ['(', '('], [')', ')'],
      ['-', '-'], ['_', '_'], ['=', '='], ['+', '+'],
      ['[', '['], ['[', '['], [']', ']'], [']', ']'], ['\\', '_'], ['|', '_'],
      [';', ';'], [':', '_'], ['\'', '\''], ['"', '_'],
      [',', ','], ['<', '_'], ['.', '.'], ['>', '_'], ['/', '_'], ['?', '_'],
      ['aaa\tbbb', 'aaa_bbb'],
      ['abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890', 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890'],
      ['이상한 \'한글\' 이름을 가진 파일', '이상한 \'한글\' 이름을 가진 파일']
    ]
    for (const pair of table) {
      const a = fs2.genSafeFilename(pair[0])
      const b = pair[1]
      //console.log((a === b ? 'good:' : 'bad:') + pair[0])
      expect(a).toBe(b)
    }
  })
})

describe('genDeepPath', () => {
  it('should succeed', () => {
    expect(fs2.genDeepPath(1, 3)).toBe('0/0/1')
    expect(fs2.genDeepPath(999, 3)).toBe('0/0/999')
    expect(fs2.genDeepPath(1000, 3)).toBe('0/1/0')
    expect(fs2.genDeepPath(1999, 3)).toBe('0/1/999')
    expect(fs2.genDeepPath(999999, 3)).toBe('0/999/999')
    expect(fs2.genDeepPath(1999999, 3)).toBe('1/999/999')
    expect(fs2.genDeepPath(999999999, 3)).toBe('999/999/999')
    expect(fs2.genDeepPath(9999999999, 3)).toBe('9999/999/999')
  })
})

describe('copyFile', () => {
  beforeAll(done => {
    fs2.emptyDir(testDir, done)
  })
  it('should succeed', done => {
    const t = testPath('fs-test-dummy-copy.txt')
    pathNotExists(t)
    fs2.copyFile('src/base/fs-test-dummy.txt', t, (err: any) => {
      expect(err).toBeFalsy()
      pathExists(t)
      expect(fs.readFileSync(t, 'utf8')).toBe('fs2 test dummy')
      done()
    })
  })
  it('should fail when source not exist', done => {
    const t = testPath('fs2-test-dummy-xxx-copy.txt')
    pathNotExists(t)
    fs2.copyFile('src/base/fs2-test-dummy-xxx.txt', t, (err: any) => {
      expect(err).toBeTruthy()
      expect(err.code).toBe('ENOENT')
      pathNotExists(t)
      done()
    })
  })
})
