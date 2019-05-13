'use strict';

const assert = require('assert');
const init = require('../base/init');

describe('init', () => {
  it('should succeed with 3 adds', (done) => {
    var a = [];
    init.reset();
    init.add((done) => {
      a.push(1);
      done();
    });
    init.add(
      (done) => {
        a.push(2);
        done();
      },
      (done) => {
        a.push(3);
        done();
      }
    );
    init.run((err) => {
      assert.ifError(err);
      assert.strictEqual(a.length, 3);
      assert.strictEqual(a[0], 1);
      assert.strictEqual(a[1], 2);
      assert.strictEqual(a[2], 3);
      done();
    });
  });
  it('should succeed with no funcs', (done) => {
    init.reset();
    init.run(done);
  });
  it('should succeed without done', (done) => {
    init.reset();
    init.run();
    done();
  });
  it('should pass an error', (done) => {
    var a = [];
    init.reset();
    init.add(
      (done) => {
        a.push(1);
        done();
      },
      (done) => {
        done(new Error('err1'));
      },
      (done) => {
        a.push(3);
        done();
      }
    );
    init.run((err) => {
      assert(err);
      assert.strictEqual(a.length, 1);
      assert.strictEqual(a[0], 1);
      done();
    });
  });
});
