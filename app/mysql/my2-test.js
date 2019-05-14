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

describe('queryOne', (done) => {
  it('should succeed when result exists.', done => {
    my2.queryOne('select * from (select 1 as id) dummy where id = 1', (err, r) => {
      assert.ifError(err);
      assert(r.id === 1);
      done();      
    });
  });
  it('should succeed when result does not exists.', done => {
    my2.queryOne('select * from (select 1 as id) dummy where id = 2', (err, r) => {
      assert.ifError(err);
      console.log(r);
      assert(r === undefined);
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
