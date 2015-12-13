'use strict';

var fs = require('fs');

var fs2 = require('../base/fs2');
var expect = require('../base/assert2').expect;

var testdir = 'tmp/fs-test';

before(function (done) {
  fs.mkdir('tmp', 0o755, function (err) {
    if (err && err.code !== 'EEXIST') return done(err);
    fs.mkdir('tmp/fs-test', 0o755, function (err) {
      done();
    });
  });
});

describe('removeDir', function () {
  beforeEach(function (done) {
    fs.mkdir(testdir + '/sub1', 0o755, function (err) {
      fs.mkdir(testdir + '/sub2', 0o755, function (err) {
        fs.mkdir(testdir + '/sub2/sub3', 0o755, function (err) {
          fs.writeFileSync(testdir + '/sub1/f1.txt', 'abc');
          fs.writeFileSync(testdir + '/sub2/f2.txt', 'abc');
          fs.writeFileSync(testdir + '/sub2/sub3/f3.txt', 'abc');
          done();
        });
      });
    });
  });
  it('should work for one file', function (done) {
    expect(testdir + '/sub1').pathExist;
    expect(testdir + '/sub2').pathExist;
    expect(testdir + '/sub2/sub3').pathExist;
    expect(testdir + '/sub1/f1.txt').pathExist;
    expect(testdir + '/sub2/f2.txt').pathExist;
    expect(testdir + '/sub2/sub3/f3.txt').pathExist;
    fs2.removeDir(testdir + '/sub2/f2.txt', function (err) {
      expect(err).not.exist;
      expect(testdir + '/sub1').pathExist;
      expect(testdir + '/sub2').pathExist;
      expect(testdir + '/sub2/sub3').pathExist;
      expect(testdir + '/sub1/f1.txt').pathExist;
      expect(testdir + '/sub2/f2.txt').not.pathExist;
      expect(testdir + '/sub2/sub3/f3.txt').pathExist;
      done();
    })
  });
  it('should work for one dir', function (done) {
    expect(testdir + '/sub1').pathExist;
    expect(testdir + '/sub2').pathExist;
    expect(testdir + '/sub2/sub3').pathExist;
    expect(testdir + '/sub1/f1.txt').pathExist;
    expect(testdir + '/sub2/f2.txt').pathExist;
    expect(testdir + '/sub2/sub3/f3.txt').pathExist;
    fs2.removeDir(testdir + '/sub1', function (err) {
      expect(err).not.exist;
      expect(testdir + '/sub1').not.pathExist;
      expect(testdir + '/sub2').pathExist;
      expect(testdir + '/sub2/sub3').pathExist;
      expect(testdir + '/sub1/f1.txt').not.pathExist;
      expect(testdir + '/sub2/f2.txt').pathExist;
      expect(testdir + '/sub2/sub3/f3.txt').pathExist;
      done();
    })
  });
  it('should work recursively', function (done) {
    expect(testdir + '/sub1').pathExist;
    expect(testdir + '/sub2').pathExist;
    expect(testdir + '/sub2/sub3').pathExist;
    expect(testdir + '/sub1/f1.txt').pathExist;
    expect(testdir + '/sub2/f2.txt').pathExist;
    expect(testdir + '/sub2/sub3/f3.txt').pathExist;
    fs2.removeDir(testdir + '/sub2', function (err) {
      expect(err).not.exist;
      expect(testdir + '/sub1').pathExist;
      expect(testdir + '/sub2').not.pathExist;
      expect(testdir + '/sub2/sub3').not.pathExist;
      expect(testdir + '/sub1/f1.txt').pathExist;
      expect(testdir + '/sub2/f2.txt').not.pathExist;
      expect(testdir + '/sub2/sub3/f3.txt').not.pathExist;
      done();
    })
  });
});

describe('emtpyDir', function () {
  before(function (done) {
    fs.mkdir(testdir + '/sub1', 0o755, function (err) {
      fs.mkdir(testdir + '/sub2', 0o755, function (err) {
        fs.mkdir(testdir + '/sub2/sub3', 0o755, function (err) {
          fs.writeFileSync(testdir + '/sub1/f1.txt', 'abc');
          fs.writeFileSync(testdir + '/sub2/f2.txt', 'abc');
          fs.writeFileSync(testdir + '/sub2/sub3/f3.txt', 'abc');
          done();
        });
      });
    });
  });
  it('should succeed', function (done) {
    fs2.emptyDir(testdir, function (err) {
      expect(err).not.exist;
      fs.readdir(testdir, function (err, files) {
        if (err) return done(err);
        expect(files).length(0);
        done();
      });
    });
  });
});

describe('makeDir', function () {
  before(function (done) {
    fs2.emptyDir(testdir, done);
  });
  it('should succeed for first dir', function (done) {
    expect(testdir + '/sub1').not.pathExist;
    fs2.makeDir(testdir + '/sub1', function (err, dir) {
      expect(err).not.exist;
      expect(dir).equal(testdir + '/sub1');
      expect(dir).pathExist;
      done();
    });
  });
  it('should succeed for nested dirs', function (done) {
    expect(testdir + '/sub1').pathExist;
    expect(testdir + '/sub1/sub2/sub3').not.pathExist;
    fs2.makeDir(testdir + '/sub1/sub2/sub3', function (err, dir) {
      expect(err).not.exist;
      expect(dir).equal(testdir + '/sub1/sub2/sub3');
      expect(dir).pathExist;
      done();
    });
  });
});

describe('safeFilename', function () {
  it('should succeed', function () {
    var table = [
      [ '`', '`' ], [ '~', '~' ],
      [ '!', '!' ], [ '@', '@' ], [ '#', '#' ], [ '$', '$' ], [ '%', '%' ],
      [ '^', '^' ], [ '&', '&' ], [ '*', '_' ], [ '(', '(' ], [ ')', ')' ],
      [ '-', '-' ], [ '_', '_' ], [ '=', '=' ], [ '+', '+' ],
      [ '[', '[' ], [ '[', '[' ], [ ']', ']' ], [ ']', ']' ], [ '\\', '_' ], [ '|', '_' ],
      [ ';', ';' ], [ ':', '_' ], [ "'", "'" ], [ '"', '_' ],
      [ ',', ',' ], [ '<', '_' ], [ '.', '.' ], [ '>', '_' ], [ '/', '_' ], [ '?', '_' ],
      [ 'aaa\tbbb', 'aaa_bbb' ],
      [ 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890', 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890' ],
      [ "이상한 '한글' 이름을 가진 파일", "이상한 '한글' 이름을 가진 파일" ]
    ];
    table.forEach(function (pair) {
      var a = fs2.safeFilename(pair[0]);
      var b = pair[1];
      if (a !== b) console.log(pair);
      expect((a == b)).true;
    })
  });
});

describe('makeDeepPath', function () {
  it('should succeed', function () {
    expect(fs2.makeDeepPath(1, 3)).equal('0/0/1');
    expect(fs2.makeDeepPath(999, 3)).equal('0/0/999');
    expect(fs2.makeDeepPath(1000, 3)).equal('0/1/0');
    expect(fs2.makeDeepPath(1999, 3)).equal('0/1/999');
    expect(fs2.makeDeepPath(999999, 3)).equal('0/999/999');
    expect(fs2.makeDeepPath(1999999, 3)).equal('1/999/999');
    expect(fs2.makeDeepPath(999999999, 3)).equal('999/999/999');
    expect(fs2.makeDeepPath(9999999999, 3)).equal('9999/999/999');
  });
});

describe('copy', function () {
  before(function (done) {
    fs2.emptyDir(testdir, done);
  });
  it('should succeed', function (done) {
    var t = testdir + '/fs2-dummy-copy.txt';
    expect(t).not.pathExist;
    fs2.copy('server/base/fs2-dummy.txt', t, function (err) {
      expect(err).not.exist;
      expect(t).pathExist;
      expect(fs.readFileSync(t, 'utf8')).equal('fs2 test dummy');
      done();
    });
  });
  it('should fail when source not exist', function (done) {
    var t = testdir + '/fs2-not-exist-copy.txt';
    expect(t).not.pathExist;
    fs2.copy('server/base/fs2-not-exist.txt', t, function (err) {
      expect(err).exist;
      expect(err.code).equal('ENOENT');
      expect(t).not.pathExist;
      done();
    });
  });
});
