import * as fs from "fs";
import * as assert2 from "../base/assert2.mjs";
import * as fs2 from "../base/fs2.mjs";

const testDir = 'tmp/fs-test';

beforeAll(done => {
  fs.mkdir('tmp', 0o755, function (err) {
    if (err && err.code !== 'EEXIST') return done(err);
    fs.mkdir('tmp/fs-test', 0o755, function (err) {
      done();
    });
  });
});

describe('removeDir', () => {
  beforeEach(done => {
    fs.mkdir(testDir + '/sub1', 0o755, function (err) {
      fs.mkdir(testDir + '/sub2', 0o755, function (err) {
        fs.mkdir(testDir + '/sub2/sub3', 0o755, function (err) {
          fs.writeFileSync(testDir + '/sub1/f1.txt', 'abc');
          fs.writeFileSync(testDir + '/sub2/f2.txt', 'abc');
          fs.writeFileSync(testDir + '/sub2/sub3/f3.txt', 'abc');
          done();
        });
      });
    });
  });
  it('should work for one file', done => {
    assert2.pathExists(testDir + '/sub1');
    assert2.pathExists(testDir + '/sub2');
    assert2.pathExists(testDir + '/sub2/sub3');
    assert2.pathExists(testDir + '/sub1/f1.txt');
    assert2.pathExists(testDir + '/sub2/f2.txt');
    assert2.pathExists(testDir + '/sub2/sub3/f3.txt');
    fs2.removeDir(testDir + '/sub2/f2.txt', function (err) {
      assert2.ifError(err);
      assert2.pathExists(testDir + '/sub1');
      assert2.pathExists(testDir + '/sub2');
      assert2.pathExists(testDir + '/sub2/sub3');
      assert2.pathExists(testDir + '/sub1/f1.txt');
      assert2.pathNotExists(testDir + '/sub2/f2.txt');
      assert2.pathExists(testDir + '/sub2/sub3/f3.txt');
      done();
    })
  });
  it('should work for one dir', done => {
    assert2.pathExists(testDir + '/sub1');
    assert2.pathExists(testDir + '/sub2');
    assert2.pathExists(testDir + '/sub2/sub3');
    assert2.pathExists(testDir + '/sub1/f1.txt');
    assert2.pathExists(testDir + '/sub2/f2.txt');
    assert2.pathExists(testDir + '/sub2/sub3/f3.txt');
    fs2.removeDir(testDir + '/sub1', function (err) {
      assert2.ifError(err);
      assert2.pathNotExists(testDir + '/sub1');
      assert2.pathExists(testDir + '/sub2');
      assert2.pathExists(testDir + '/sub2/sub3');
      assert2.pathNotExists(testDir + '/sub1/f1.txt');
      assert2.pathExists(testDir + '/sub2/f2.txt');
      assert2.pathExists(testDir + '/sub2/sub3/f3.txt');
      done();
    })
  });
  it('should work recursively', done => {
    assert2.pathExists(testDir + '/sub1');
    assert2.pathExists(testDir + '/sub2');
    assert2.pathExists(testDir + '/sub2/sub3');
    assert2.pathExists(testDir + '/sub1/f1.txt');
    assert2.pathExists(testDir + '/sub2/f2.txt');
    assert2.pathExists(testDir + '/sub2/sub3/f3.txt');
    fs2.removeDir(testDir + '/sub2', function (err) {
      assert2.ifError(err);
      assert2.pathExists(testDir + '/sub1');
      assert2.pathNotExists(testDir + '/sub2');
      assert2.pathNotExists(testDir + '/sub2/sub3');
      assert2.pathExists(testDir + '/sub1/f1.txt');
      assert2.pathNotExists(testDir + '/sub2/f2.txt');
      assert2.pathNotExists(testDir + '/sub2/sub3/f3.txt');
      done();
    })
  });
});

describe('emptyDir', () => {
  beforeAll(done => {
    fs.mkdir(testDir + '/sub1', 0o755, function (err) {
      fs.mkdir(testDir + '/sub2', 0o755, function (err) {
        fs.mkdir(testDir + '/sub2/sub3', 0o755, function (err) {
          fs.writeFileSync(testDir + '/sub1/f1.txt', 'abc');
          fs.writeFileSync(testDir + '/sub2/f2.txt', 'abc');
          fs.writeFileSync(testDir + '/sub2/sub3/f3.txt', 'abc');
          done();
        });
      });
    });
  });
  it('should succeed', done => {
    fs2.emptyDir(testDir, function (err) {
      assert2.ifError(err);
      fs.readdir(testDir, function (err, files) {
        if (err) return done(err);
        assert2.e(files.length, 0);
        done();
      });
    });
  });
});

describe('makeDir', () => {
  beforeAll(done => {
    fs2.emptyDir(testDir, done);
  });
  it('should succeed for first dir', done => {
    assert2.pathNotExists(testDir + '/sub1');
    fs2.makeDir(testDir + '/sub1', function (err, dir) {
      assert2.ifError(err);
      assert2.e(dir, testDir + '/sub1');
      assert2.pathExists(dir);
      done();
    });
  });
  it('should succeed for nested dirs', done => {
    assert2.pathExists(testDir + '/sub1');
    assert2.pathNotExists(testDir + '/sub1/sub2/sub3');
    fs2.makeDir(testDir + '/sub1/sub2/sub3', function (err, dir) {
      assert2.ifError(err);
      assert2.e(dir, testDir + '/sub1/sub2/sub3');
      assert2.pathExists(dir);
      done();
    });
  });
});

describe('safeFilename', () => {
  it('should succeed', () => {
    const table = [
      ['`', '`'], ['~', '~'],
      ['!', '!'], ['@', '@'], ['#', '#'], ['$', '$'], ['%', '%'],
      ['^', '^'], ['&', '&'], ['*', '_'], ['(', '('], [')', ')'],
      ['-', '-'], ['_', '_'], ['=', '='], ['+', '+'],
      ['[', '['], ['[', '['], [']', ']'], [']', ']'], ['\\', '_'], ['|', '_'],
      [';', ';'], [':', '_'], ["'", "'"], ['"', '_'],
      [',', ','], ['<', '_'], ['.', '.'], ['>', '_'], ['/', '_'], ['?', '_'],
      ['aaa\tbbb', 'aaa_bbb'],
      ['abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890', 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890'],
      ["이상한 '한글' 이름을 가진 파일", "이상한 '한글' 이름을 가진 파일"]
    ];
    table.forEach(function (pair) {
      const a = fs2.safeFilename(pair[0]);
      const b = pair[1];
      if (a !== b) console.log(pair);
      assert2.e((a === b), true);
    })
  });
});

describe('makeDeepPath', () => {
  it('should succeed', () => {
    assert2.e(fs2.makeDeepPath(1, 3), '0/0/1');
    assert2.e(fs2.makeDeepPath(999, 3), '0/0/999');
    assert2.e(fs2.makeDeepPath(1000, 3), '0/1/0');
    assert2.e(fs2.makeDeepPath(1999, 3), '0/1/999');
    assert2.e(fs2.makeDeepPath(999999, 3), '0/999/999');
    assert2.e(fs2.makeDeepPath(1999999, 3), '1/999/999');
    assert2.e(fs2.makeDeepPath(999999999, 3), '999/999/999');
    assert2.e(fs2.makeDeepPath(9999999999, 3), '9999/999/999');
  });
});

describe('copy', () => {
  beforeAll(done => {
    fs2.emptyDir(testDir, done);
  });
  it('should succeed', done => {
    const t = testDir + '/fs2-dummy-copy.txt';
    assert2.pathNotExists(t);
    fs2.copy('src/base/fs2-dummy.txt', t, function (err) {
      assert2.ifError(err);
      assert2.pathExists(t);
      assert2.e(fs.readFileSync(t, 'utf8'), 'fs2 test dummy');
      done();
    });
  });
  it('should fail when source not exist', done => {
    const t = testDir + '/fs2-not-exist-copy.txt';
    assert2.pathNotExists(t);
    fs2.copy('src/base/fs2-not-exist.txt', t, function (err) {
      assert2.ne(err, null);
      assert2.e(err.code, 'ENOENT');
      assert2.pathNotExists(t);
      done();
    });
  });
});
