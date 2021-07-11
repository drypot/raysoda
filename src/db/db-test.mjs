import * as init from '../base/init.mjs';
import * as config from '../base/config.mjs';
import * as db from '../db/db.mjs';

beforeAll(done => {
  config.setPath('config/test.json');
  db.setDropDatabase(true);
  init.run(done);
});

describe('db', () => {
  it('should exist.', done => {
    const query = 'show databases like ?';
    db.query(query, config.prop.mysqlDatabase, function (err, r) {
      expect(err).toBeFalsy();
      assert2.ok(r.length);
      done();
    });
  });
});

describe('queryOne', () => {
  it('should succeed when result exists.', done => {
    db.queryOne('select * from (select 1 as id) dummy where id = 1', (err, r) => {
      expect(err).toBeFalsy();
      expect(r.id).toBe(1);
      done();
    });
  });
  it('should succeed when result does not exists.', done => {
    db.queryOne('select * from (select 1 as id) dummy where id = 2', (err, r) => {
      expect(err).toBeFalsy();
      expect(r).toBe(undefined);
      done();
    });
  });
});

describe('tableExists', () => {
  beforeAll((done) => {
    db.query('create table test_exist(id int)', done);
  });
  it('should return false when table not exists.', done => {
    db.tableExists('test_exist_xxx', (err, exist) => {
      expect(err).toBeFalsy();
      expect(exist).toBe(false);
      done();
    });
  });
  it('should return true when table exists.', done => {
    db.tableExists('test_exist', (err, exist) => {
      expect(err).toBeFalsy();
      expect(exist).toBe(true);
      done();
    });
  });
});
