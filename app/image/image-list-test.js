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
    var now = new Date();
    var values = [
      [ 1,  userf.user1.id, now, '1' ],
      [ 2,  userf.user1.id, now, '2' ],
      [ 3,  userf.user1.id, now, '3' ],
      [ 4,  userf.user1.id, now, '4' ],
      [ 5,  userf.user1.id, now, '5' ],
      [ 6,  userf.user1.id, now, '6' ],
      [ 7,  userf.user1.id, now, '7' ],
      [ 8,  userf.user1.id, now, '8' ],
      [ 9,  userf.user1.id, now, '9' ],
      [ 10, userf.user1.id, now, '10' ],
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
    var query = {
      ps: 4
    };
    expl.get('/api/images').query(query).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.images.length, 4);
      assert.strictEqual(res.body.images[0].id, 10);
      assert.strictEqual(res.body.images[3].id, 7);
      done();
    });
  });
  it('should succeed for page 2', function (done) {
    var query = {
      p:2, ps: 4
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.images.length, 4);
      assert.strictEqual(res.body.images[0].id, 6);
      assert.strictEqual(res.body.images[3].id, 3);
      done();
    });
  });
  it('should succeed for last page', function (done) {
    var query = {
      p: 3, ps: 4
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      assert.strictEqual(res.body.images.length, 2);
      assert.strictEqual(res.body.images[0].id, 2);
      assert.strictEqual(res.body.images[1].id, 1);
      done();
    });
  });
});
