'use strict';

const async = require('../base/async');
const assert = require('assert');
const assert2 = require('./assert2');

describe('waterfall', () => {
  it('should succeed', (done) => {
    let i = 0;
    async.wf(
      (done) => {
        i++;
        done(null);
      },
      (done) => {
        i++;
        done(null);
      },
      (err) => {
        assert.ifError(err);
        assert.strictEqual(i, 2);
        done();
      }
    );
  });
  it('should succeed with err', (done) => {
    let i = 0;
    async.wf(
      (done) => {
        i++;
        done(new Error());
      },
      (done) => {
        i++;
        done(null);
      },
      (err) => {
        assert(err);
        assert.strictEqual(i, 1);
        done();
      }
    );
  });
  it('should succeed with param', (done) => {
    async.wf(
      (done) => {
        done(null, 1, 2);
      },
      (p1, p2, done) => {
        assert(p1 === 1);
        assert(p2 === 2);
        done(null, p1, p2, 3, 4);
      },
      (err, p1, p2, p3, p4) => {
        assert.ifError(err);
        assert(p1 === 1);
        assert(p2 === 2);
        assert(p3 === 3);
        assert(p4 === 4);
        done();
      }
    );
  });
  it('should succeed with param, err', (done) => {
    async.wf(
      (done) => {
        done(null, 1, 2);
      },
      (p1, p2, done) => {
        assert(p1 === 1);
        assert(p2 === 2);
        done("err");
      },
      (err, p1, p2, p3, p4) => {
        assert(err);
        done();
      }
    );
  });
});