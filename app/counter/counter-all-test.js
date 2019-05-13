'use strict';

const assert = require('assert');
const assert2 = require('../base/assert2');
const init = require('../base/init');
const error = require('../base/error');
const date2 = require('../base/date2');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expl = require('../express/express-local');
const userf = require('../user/user-fixture');
const counterb = require('../counter/counter-base');
const countera = require('../counter/counter-all');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('/api/counters/:id/inc', function () {
  var today = date2.today();
  it('should succeed for new', function (done) {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      assert2.redirect(res, 'http://hello.world');
      counterb.counters.findOne({ id: 'abc', d: today }, function (err, c) {
        assert.ifError(err);
        assert.strictEqual(c.id, 'abc');
        assert.deepStrictEqual(c.d, today);
        assert.strictEqual(c.c, 1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      assert2.redirect(res, 'http://hello.world');
      counterb.counters.findOne({ id: 'abc', d: today }, function (err, c) {
        assert.ifError(err);
        assert.strictEqual(c.id, 'abc');
        assert.deepStrictEqual(c.d, today);
        assert.strictEqual(c.c, 2);
        done();
      });
    });
  });
});

describe('/api/counters/:id', function () {
  before(function (done) {
    var t = [
      { id: 'dc', d: new Date('2015-10-05 0:0'), c: 1 },
      { id: 'dc', d: new Date('2015-10-06 0:0'), c: 2 },
      { id: 'dc', d: new Date('2015-10-07 0:0'), c: 3 },
      { id: 'dc', d: new Date('2015-10-08 0:0'), c: 4 },
      { id: 'dc', d: new Date('2015-10-09 0:0'), c: 5 },
      { id: 'dc', d: new Date('2015-10-10 0:0'), c: 6 }
    ];
    counterb.counters.insertMany(t, function (err) {
      assert.ifError(err);
      done();
    });
  });
  it('should succeed', function (done) {
    userf.login('admin', function (err) {
      assert.ifError(err);
      expl.get('/api/counters/dc?b=2015-10-07&e=2015-10-09', function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        var cs = res.body.counters;
        assert.strictEqual(cs.length, 3);
        assert.strictEqual(cs[0].id, 'dc');
        assert.deepStrictEqual(new Date(cs[0].d), new Date('2015-10-07 0:0'));
        assert.strictEqual(cs[0].c, 3);
        assert.strictEqual(cs[2].id, 'dc');
        assert.deepStrictEqual(new Date(cs[2].d), new Date('2015-10-09 0:0'));
        assert.strictEqual(cs[2].c, 5);
        done();
      });
    });
  });
  it('should fail if not admin', function (done) {
    userf.login('user1', function (err) {
      assert.ifError(err);
      expl.get('/api/counters/dc?b=2015-10-07&e=2015-10-09', function (err, res) {
        assert.ifError(err);
        assert(error.find(res.body.err, 'NOT_AUTHORIZED'));
        done();
      });
    });
  });
});
