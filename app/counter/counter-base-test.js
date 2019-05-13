'use strict';

const assert = require('assert');
const init = require('../base/init');
const config = require('../base/config');
const date2 = require('../base/date2');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const counterb = require('../counter/counter-base');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('table counter', function () {
  it('should exist', function (done) {
    my2.tableExists('counter', (err, exist) => {
      assert.ifError(err);
      assert(exist);
      done();
    });
  });
});

describe('.update(id, date)', function () {
  let date = new Date();
  let dateStr = date2.dateString(date);
  it('should succeed for new', function (done) {
    counterb.update('cnt1', date, function (err) {
      assert.ifError(err);
      my2.queryOne('select * from counter where id = "cnt1" and d = ?', dateStr, (err, r) => {
        assert.ifError(err);
        assert.strictEqual(r.id, 'cnt1');
        assert.strictEqual(r.d, dateStr);
        assert.strictEqual(r.c, 1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    counterb.update('cnt1', date, function (err) {
      assert.ifError(err);
      my2.queryOne('select * from counter where id = "cnt1" and d = ?', dateStr, (err, r) => {
        assert.ifError(err);
        assert.strictEqual(r.id, 'cnt1');
        assert.strictEqual(r.d, dateStr);
        assert.strictEqual(r.c, 2);
        done();
      });
    });
  });
});
