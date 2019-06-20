'use strict';

const assert = require('assert');
const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const expb = require('../express/express-base');
const expu = require('../express/express-upload');
const expl = require('../express/express-local');
const userf = require('../user/user-fixture');
const imageb = require('../image/image-base');
const imagel = require('../image/image-list');

before(function (done) {
  config.path = 'config/raysoda-test.json';
  my2.dropDatabase = true;
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

before(function (done) {
  userf.login('user1', done);
});

describe('get /api/images', function (done) {
  before(function (done) {
    var values = [
      [ 1,  userf.user1.id, new Date(2003, 0, 1), '1' ],
      [ 2,  userf.user1.id, new Date(2003, 1, 2), '2' ],
      [ 3,  userf.user1.id, new Date(2003, 2, 3), '3' ],
      [ 4,  userf.user1.id, new Date(2003, 3, 4), '4' ],
      [ 5,  userf.user1.id, new Date(2003, 4, 5), '5' ],
      [ 6,  userf.user1.id, new Date(2003, 5, 6), '6' ],
      [ 7,  userf.user1.id, new Date(2003, 6, 7), '7' ],
      [ 8,  userf.user1.id, new Date(2003, 7, 8), '8' ],
      [ 9,  userf.user1.id, new Date(2003, 8, 9), '9' ],
      [ 10, userf.user1.id, new Date(2003, 9, 10), '10' ],
    ];
    my2.query('insert into image(id, uid, cdate, comment) values ?', [values], done);
  });
  it('should succeed for page size 99', function (done) {
    var query = {
      ps: 99
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.images.length, 10);
      assert.strictEqual(res.body.images[0].id, 10);
      assert.strictEqual(res.body.images[1].id, 9);
      assert.strictEqual(res.body.images[2].id, 8);
      assert.strictEqual(res.body.images[9].id, 1);
      done();
    });
  });
  it('should succeed for page 1', function (done) {
    expl.get('/api/images?ps=4').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.images.length, 4);
      assert.strictEqual(res.body.images[0].id, 10);
      assert.strictEqual(res.body.images[3].id, 7);
      done();
    });
  });
  it('should succeed for page 2', function (done) {
    expl.get('/api/images?p=2&ps=4').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.images.length, 4);
      assert.strictEqual(res.body.images[0].id, 6);
      assert.strictEqual(res.body.images[3].id, 3);
      done();
    });
  });
  it('should succeed for last page', function (done) {
    expl.get('/api/images?p=3&ps=4').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.images.length, 2);
      assert.strictEqual(res.body.images[0].id, 2);
      assert.strictEqual(res.body.images[1].id, 1);
      done();
    });
  });
  it('should succeed for 2003-08', function (done) {
    expl.get('/api/images?d=200308&ps=4').end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.images.length, 4);
      assert.strictEqual(res.body.images[0].id, 8);
      assert.strictEqual(res.body.images[3].id, 5);
      done();
    });
  });
});
