import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as date2 from "../base/date.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expl from "../express/express-local.mjs";
import * as userf from "../user/user-fixture.mjs";
import * as counterb from "../counter/counter-base.mjs";
import * as countera from "../counter/counter-all.mjs";

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('/api/counters/:id/inc', () => {
  const today = new Date();
  const todayStr = date2.genDateString(today);
  it('should succeed for new', done => {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      assert2.redirect(res, 'http://hello.world');
      db.queryOne('select * from counter where id = "abc" and d = ?', todayStr, (err, r) => {
        expect(err).toBeFalsy();
        expect(r.id).toBe('abc');
        expect(r.d).toBe(todayStr);
        expect(r.c).toBe(1);
        done();
      });
    });
  });
  it('should succeed for existing', done => {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      assert2.redirect(res, 'http://hello.world');
      db.queryOne('select * from counter where id = "abc" and d = ?', todayStr, (err, r) => {
        expect(err).toBeFalsy();
        expect(r.id).toBe('abc');
        expect(r.d).toBe(todayStr);
        expect(r.c).toBe(2);
        done();
      });
    });
  });
});

describe('/api/counters/:id', () => {
  beforeAll(done => {
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
  it('should succeed', done => {
    userf.login('admin', function (err) {
      expect(err).toBeFalsy();
      expl.get('/api/counters/dc?b=2015-10-07&e=2015-10-09', function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        let cs = res.body.counters;
        expect(cs.length).toBe(3);
        expect(cs[0].d).toBe('2015-10-07');
        expect(cs[0].c).toBe(3);
        expect(cs[2].d).toBe('2015-10-09');
        expect(cs[2].c).toBe(5);
        done();
      });
    });
  });
  it('should fail if not admin', done => {
    userf.login('user1', function (err) {
      expect(err).toBeFalsy();
      expl.get('/api/counters/dc?b=2015-10-07&e=2015-10-09', function (err, res) {
        expect(err).toBeFalsy();
        assert2.ok(error.errorExists(res.body.err, 'NOT_AUTHORIZED'));
        done();
      });
    });
  });
});
