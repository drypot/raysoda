import * as assert2 from "../base/assert2.mjs";

describe('aliases', () => {
  it('should succeed', done => {
    expect('abc').toBe('abc');
    assert2.e('abc', 'abc');
    assert2.ne('abc', 'def');
    assert2.de([1], [1]);
    assert2.nde([1], [2]);
    done();
  });
});

describe('empty', () => {
  it('should succeed', done => {
    assert2.empty(undefined);
    assert2.empty(null);
    assert2.empty({});
    assert2.throws(function () {
      assert2.empty({ a: 1 });
    });
    done();
  });
});

describe('notEmpty', () => {
  it('should succeed', done => {
    assert2.notEmpty({ a: 1 });
    assert2.throws(function () {
      assert2.notEmpty({});
    });
    done();
  });
});

describe('path', () => {
  it('should succeed', done => {
    assert2.pathExists('src/base/assert2.mjs');
    assert2.pathNotExists('src/base/assertX.mjs');
    done();
  });
});

describe('redirect', () => {
  it('should succeed', done => {
    assert2.redirect({
      status: 301,
      header: {
        location: '/new301'
      }
    }, '/new301');
    assert2.redirect({
      status: 302,
      header: {
        location: '/new302'
      }
    }, '/new302');
    done();
  });
});
