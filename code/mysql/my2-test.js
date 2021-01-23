'use strict';

const assert = require('assert');
const init = require('../base/init');
const config = require('../base/config');
const my2 = require('./my2');

before(function (done) {
  config.path = 'config/test.json';
  my2.dropDatabase = true;
  init.run(done);
});

describe('database', function () {
  it('should exist.', function (done) {
    var query = 'show databases like ?';
    my2.query(query, config.mysqlDatabase, function (err, r) {
      assert.ifError(err);
      assert(r.length);
      done();
    });
  });
});

describe.skip('typeCast bool', () => {
  before((done) => {
    my2.query(`
      create table bool_test(
        id int not null,
        v bool not null, 
        primary key (id)
      )
    `, done);
  });
  before((done) => {
    my2.query('insert into bool_test values (1, true), (2, false)',done);
  });
  it('should succeed for true', (done) => {
    my2.queryOne('select * from bool_test where id = 1', (err, r) => {
      assert.ifError(err);
      assert.strictEqual(r.v, true);
      done();
    });
  });  
  it('should succeed for false', (done) => {
    my2.queryOne('select * from bool_test where id = 2', (err, r) => {
      assert.ifError(err);
      assert.strictEqual(r.v, false);
      done();
    });
  });  
});

describe.skip('typeCast json', () => {
  const obj1 = {
    s1: 'string1',
    a1: [ 1, 2, 3],
    i1: 10
  }
  before((done) => {
    my2.query(`
      create table json_test(
        id int not null,
        v json not null,
        primary key (id)
      )
    `, done);
  });
  before((done) => {
    my2.query('insert into json_test set id = 1, v = ?', JSON.stringify(obj1), done);
  });
  it('should succeed', (done) => {
    my2.queryOne('select * from json_test where id = 1', (err, r) => {
      assert.ifError(err);
      assert.deepStrictEqual(r.v, obj1);
      done();
    });
  });  
});


describe('queryOne', (done) => {
  it('should succeed when result exists.', done => {
    my2.queryOne('select * from (select 1 as id) dummy where id = 1', (err, r) => {
      assert.ifError(err);
      assert.strictEqual(r.id, 1);
      done();      
    });
  });
  it('should succeed when result does not exists.', done => {
    my2.queryOne('select * from (select 1 as id) dummy where id = 2', (err, r) => {
      assert.ifError(err);
      assert.strictEqual(r, undefined);
      done();      
    });
  });
});

describe('tableExists', () => {
  before((done) => {
    my2.query('create table test_exist(id int)', done);
  })
  it('should return false when table not exists.', done => {
    my2.tableExists('test_exist_xxx', (err, exist) => {
      assert.ifError(err);
      assert.strictEqual(exist, false);
      done();
    });
  });  
  it('should return true when table exists.', done => {
    my2.tableExists('test_exist', (err, exist) => {
      assert.ifError(err);
      assert.strictEqual(exist, true);
      done();
    });
  });  
});
