
import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expb from '../express/express-base.js';
import * as expu from '../express/express-upload.js';
import * as expl from '../express/express-local.js';
import * as userf from '../user/user-fixture.js';
import * as imageb from '../image/image-base.js';
import * as imagen from '../image/image-new.js';
import * as imaged from '../image/image-delete.js';

before(function (done) {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

before(function (done) {
  imageb.emptyDir(done);
});

const _f1 = 'samples/640x360.jpg';

describe('del /api/images/[_id]', function () {
  describe('deleting mine', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    before(function (done) {
      userf.login('user1', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        const _id1 = res.body.ids[0];
        expl.post('/api/images').field('comment', 'image2').attach('files', _f1).end(function (err, res) {
          assert2.ifError(err);
          assert2.ifError(res.body.err);
          assert2.ne(res.body.ids, undefined);
          const _id2 = res.body.ids[0];
          expl.del('/api/images/' + _id1, function (err, res) {
            assert2.ifError(err);
            assert2.ifError(res.body.err);
            assert2.path(imageb.fman.getPath(_id1), false);
            assert2.path(imageb.fman.getPath(_id2));
            db.queryOne('select * from image where id = ?', _id1, (err, image) => {
              assert2.ifError(err);
              assert2.e(image, undefined);
              db.queryOne('select * from image where id = ?', _id2, (err, image) => {
                assert2.ifError(err);
                assert2.ne(image, undefined);
                done();
              });
            });
          });
        });
      });
    });
  });
  describe('deleting by admin', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      userf.login('user1', function (err) {
        assert2.ifError(err);
        expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
          assert2.ifError(err);
          assert2.ifError(res.body.err);
          assert2.ne(res.body.ids, undefined);
          const _id = res.body.ids[0];
          userf.login('admin', function (err) {
            assert2.ifError(err);
            expl.del('/api/images/' + _id, function (err, res) {
              assert2.ifError(err);
              assert2.ifError(res.body.err);
              assert2.path(imageb.fman.getPath(_id), false);
              db.queryOne('select * from image where id = ?', _id, (err, image) => {
                assert2.ifError(err);
                assert2.e(image, undefined);
                done();
              });
            });
          });
        });
      });
    });
  });
  describe('deleting other\'s', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should fail', function (done) {
      userf.login('user1', function (err) {
        assert2.ifError(err);
        expl.post('/api/images').field('comment', 'image1').attach('files', _f1).end(function (err, res) {
          assert2.ifError(err);
          assert2.ifError(res.body.err);
          assert2.ne(res.body.ids, undefined);
          const _id = res.body.ids[0];
          userf.login('user2', function (err) {
            assert2.ifError(err);
            expl.del('/api/images/' + _id, function (err, res) {
              assert2.ifError(err);
              assert2.ok(res.body.err);
              assert2.ok(error.find(res.body.err, 'NOT_AUTHORIZED'));
              assert2.path(imageb.fman.getPath(_id));
              db.queryOne('select * from image where id = ?', _id, (err, image) => {
                assert2.ifError(err);
                assert2.ne(image, undefined);
                done();
              });
            });
          });
        });
      });
    });
  });
});
