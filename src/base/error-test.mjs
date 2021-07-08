import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";

beforeAll(done => {
  init.run(done);
});

beforeAll(() => {
  error.define('NAME_DUPE', '이미 등록되어 있는 이름입니다.', 'name');
  error.define('PASSWORD_EMPTY', '비밀번호를 입력해 주십시오.', 'password');
});

describe('defining duplicated', () => {
  it('should fail', done => {
    assert2.throws(function() {
      error.define('NAME_DUPE', '이미 등록되어 있는 이름입니다.', 'name');
    });
    done();
  });
});

describe('error.newError(string)', () => {
  it('should succeed', () => {
    const err = error.newError('INVALID_DATA');
    assert2.e(err.code, error.get('INVALID_DATA').code);
    assert2.e(err.message, error.get('INVALID_DATA').message);
    assert2.ne(err.stack, undefined);
  });
});

describe('error.newError(field error)', () => {
  it('should succeed', () => {
    const err = error.newError('NAME_DUPE');
    assert2.e(err.code, error.get('INVALID_FORM').code);
    assert2.de(err.errors[0], error.get('NAME_DUPE'));
    assert2.ne(err.stack, undefined);
  })
});

describe('error.newError(unknown)', () => {
  it('should succeed', () => {
    const obj = {opt: 'extra'};
    const err = error.newError(obj);
    assert2.e(err.code, undefined);
    assert2.e(err.message, 'unknown error');
    assert2.e(err.opt, 'extra')
    assert2.ne(err.stack, undefined);
  });
});

describe('error.newError(field error)', () => {
  it('should succeed', () => {
    const err = error.newError('NAME_DUPE');
    assert2.e(err.code, error.get('INVALID_FORM').code);
    assert2.de(err.errors[0], error.get('NAME_DUPE'));
  })
});

describe('error.newError(field error array)', () => {
  it('should succeed', () => {
    const errors = [];
    errors.push(error.get('NAME_DUPE'));
    errors.push(error.get('PASSWORD_EMPTY'));
    const err = error.newError(errors);
    assert2.e(err.code, error.get('INVALID_FORM').code);
    assert2.de(err.errors[0], error.get('NAME_DUPE'));
    assert2.de(err.errors[1], error.get('PASSWORD_EMPTY'));
  })
});

describe('error.find', () => {
  it('should succeed', () => {
    const err = error.newError('INVALID_DATA');
    assert2.ok(error.find(err, 'INVALID_DATA'));
    assert2.ok(!error.find(err, 'INVALID_FORM'));
    assert2.ok(!error.find(err, 'NAME_DUPE'));
  });
  it('form error should succeed', () => {
    const err = error.newError('NAME_DUPE');
    assert2.ok(!error.find(err, 'INVALID_DATA'));
    assert2.ok(!error.find(err, 'INVALID_FORM'));
    assert2.ok(error.find(err, 'NAME_DUPE'));
  });
});
