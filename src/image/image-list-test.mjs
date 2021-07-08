import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from '../express/express-base.mjs';
import * as expu from '../express/express-upload.mjs';
import * as expl from '../express/express-local.mjs';
import * as userf from '../user/user-fixture.mjs';
import * as imageb from '../image/image-base.mjs';
import * as imagel from '../image/image-list.mjs';

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

beforeAll(done => {
  userf.login('user1', done);
});

describe('get /api/images', () => {
  beforeAll(done => {
    const values = [
      [1, userf.users.user1.id, new Date(2003, 0, 1), '1'],
      [2, userf.users.user1.id, new Date(2003, 1, 2), '2'],
      [3, userf.users.user1.id, new Date(2003, 2, 3), '3'],
      [4, userf.users.user1.id, new Date(2003, 3, 4), '4'],
      [5, userf.users.user1.id, new Date(2003, 4, 5), '5'],
      [6, userf.users.user1.id, new Date(2003, 5, 6), '6'],
      [7, userf.users.user1.id, new Date(2003, 6, 7), '7'],
      [8, userf.users.user1.id, new Date(2003, 7, 8), '8'],
      [9, userf.users.user1.id, new Date(2003, 8, 9), '9'],
      [10, userf.users.user1.id, new Date(2003, 9, 10), '10'],
    ];
    db.query('insert into image(id, uid, cdate, comment) values ?', [values], done);
  });
  it('should succeed for page size 99', done => {
    const query = {
      ps: 99
    };
    expl.get('/api/images').query(query).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.images.length, 10);
      assert2.e(res.body.images[0].id, 10);
      assert2.e(res.body.images[1].id, 9);
      assert2.e(res.body.images[2].id, 8);
      assert2.e(res.body.images[9].id, 1);
      done();
    });
  });
  it('should succeed for page 1', done => {
    expl.get('/api/images?ps=4').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.images.length, 4);
      assert2.e(res.body.images[0].id, 10);
      assert2.e(res.body.images[3].id, 7);
      done();
    });
  });
  it('should succeed for page 2', done => {
    expl.get('/api/images?p=2&ps=4').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.images.length, 4);
      assert2.e(res.body.images[0].id, 6);
      assert2.e(res.body.images[3].id, 3);
      done();
    });
  });
  it('should succeed for last page', done => {
    expl.get('/api/images?p=3&ps=4').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.images.length, 2);
      assert2.e(res.body.images[0].id, 2);
      assert2.e(res.body.images[1].id, 1);
      done();
    });
  });
  it('should succeed for 2003-08', done => {
    expl.get('/api/images?d=200308&ps=4').end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      assert2.e(res.body.images.length, 4);
      assert2.e(res.body.images[0].id, 8);
      assert2.e(res.body.images[3].id, 5);
      done();
    });
  });
});
