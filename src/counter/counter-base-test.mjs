import * as init from "../base/init.mjs";
import * as config from "../base/config.mjs";
import * as date2 from "../base/date.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as counterb from "../counter/counter-base.mjs";

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('table counter', () => {
  it('should exist', done => {
    db.tableExists('counter', (err, exist) => {
      expect(err).toBeFalsy();
      assert2.ok(exist);
      done();
    });
  });
});

describe('.update(id, date)', () => {
  let date = new Date();
  let dateStr = date2.genDateString(date);
  it('should succeed for new', done => {
    counterb.update('cnt1', date, function (err) {
      expect(err).toBeFalsy();
      db.queryOne('select * from counter where id = "cnt1" and d = ?', dateStr, (err, r) => {
        expect(err).toBeFalsy();
        expect(r.id).toBe('cnt1');
        expect(r.d).toBe(dateStr);
        expect(r.c).toBe(1);
        done();
      });
    });
  });
  it('should succeed for existing', done => {
    counterb.update('cnt1', date, function (err) {
      expect(err).toBeFalsy();
      db.queryOne('select * from counter where id = "cnt1" and d = ?', dateStr, (err, r) => {
        expect(err).toBeFalsy();
        expect(r.id).toBe('cnt1');
        expect(r.d).toBe(dateStr);
        expect(r.c).toBe(2);
        done();
      });
    });
  });
});
