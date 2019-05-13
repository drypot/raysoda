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
  var today = new Date();
  var todayStr = date2.dateString(today);
  it('should succeed for new', function (done) {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      assert2.redirect(res, 'http://hello.world');
      my2.queryOne('select * from counter where id = "abc" and d = ?', todayStr, (err, r) => {
        assert.ifError(err);
        assert.strictEqual(r.id, 'abc');
        assert.strictEqual(r.d, todayStr);
        assert.strictEqual(r.c, 1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      assert2.redirect(res, 'http://hello.world');
      my2.queryOne('select * from counter where id = "abc" and d = ?', todayStr, (err, r) => {
        assert.ifError(err);
        assert.strictEqual(r.id, 'abc');
        assert.strictEqual(r.d, todayStr);
        assert.strictEqual(r.c, 2);
        done();
      });
    });
  });
});

describe('/api/counters/:id', function () {
  before(function (done) {
    my2.query(`
      insert into counter(id, d, c) values   
        ('dc', '2015-10-06', 2 ),
        ('dc', '2015-10-07', 3 ),
        ('dc', '2015-10-05', 1 ),
        ('dc', '2015-10-08', 4 ),
        ('dc', '2015-10-09', 5 ),
        ('dc', '2015-10-10', 6 )
    `, done);
  });
  it('should succeed', function (done) {
    userf.login('admin', function (err) {
      assert.ifError(err);
      expl.get('/api/counters/dc?b=2015-10-07&e=2015-10-09', function (err, res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        let cs = res.body.counters;
        assert.strictEqual(cs.length, 3);
        assert.strictEqual(cs[0].d, '2015-10-07');
        assert.strictEqual(cs[0].c, 3);
        assert.strictEqual(cs[2].d, '2015-10-09');
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
