import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as date2 from "../base/date2.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expb from "../express/express-base.js";
import * as expl from "../express/express-local.js";
import * as userf from "../user/user-fixture.js";
import * as counterb from "../counter/counter-base.js";
import * as countera from "../counter/counter-all.js";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('/api/counters/:id/inc', function () {
  const today = new Date();
  const todayStr = date2.dateString(today);
  it('should succeed for new', function (done) {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      assert2.redirect(res, 'http://hello.world');
      db.queryOne('select * from counter where id = "abc" and d = ?', todayStr, (err, r) => {
        assert2.ifError(err);
        assert2.e(r.id, 'abc');
        assert2.e(r.d, todayStr);
        assert2.e(r.c, 1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      assert2.redirect(res, 'http://hello.world');
      db.queryOne('select * from counter where id = "abc" and d = ?', todayStr, (err, r) => {
        assert2.ifError(err);
        assert2.e(r.id, 'abc');
        assert2.e(r.d, todayStr);
        assert2.e(r.c, 2);
        done();
      });
    });
  });
});

describe('/api/counters/:id', function () {
  before(function (done) {
    db.query(`
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
      assert2.ifError(err);
      expl.get('/api/counters/dc?b=2015-10-07&e=2015-10-09', function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        let cs = res.body.counters;
        assert2.e(cs.length, 3);
        assert2.e(cs[0].d, '2015-10-07');
        assert2.e(cs[0].c, 3);
        assert2.e(cs[2].d, '2015-10-09');
        assert2.e(cs[2].c, 5);
        done();
      });
    });
  });
  it('should fail if not admin', function (done) {
    userf.login('user1', function (err) {
      assert2.ifError(err);
      expl.get('/api/counters/dc?b=2015-10-07&e=2015-10-09', function (err, res) {
        assert2.ifError(err);
        assert2.ok(error.find(res.body.err, 'NOT_AUTHORIZED'));
        done();
      });
    });
  });
});
