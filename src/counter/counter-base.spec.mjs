import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as config from "../base/config.mjs";
import * as date2 from "../base/date2.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as counterb from "../counter/counter-base.mjs";

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

describe('table counter', function () {
  it('should exist', function (done) {
    db.tableExists('counter', (err, exist) => {
      assert2.ifError(err);
      assert2.ok(exist);
      done();
    });
  });
});

describe('.update(id, date)', function () {
  let date = new Date();
  let dateStr = date2.dateString(date);
  it('should succeed for new', function (done) {
    counterb.update('cnt1', date, function (err) {
      assert2.ifError(err);
      db.queryOne('select * from counter where id = "cnt1" and d = ?', dateStr, (err, r) => {
        assert2.ifError(err);
        assert2.e(r.id, 'cnt1');
        assert2.e(r.d, dateStr);
        assert2.e(r.c, 1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    counterb.update('cnt1', date, function (err) {
      assert2.ifError(err);
      db.queryOne('select * from counter where id = "cnt1" and d = ?', dateStr, (err, r) => {
        assert2.ifError(err);
        assert2.e(r.id, 'cnt1');
        assert2.e(r.d, dateStr);
        assert2.e(r.c, 2);
        done();
      });
    });
  });
});
