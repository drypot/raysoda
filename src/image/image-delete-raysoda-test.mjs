
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
import * as imagen from '../image/image-new.mjs';
import * as imaged from '../image/image-delete.mjs';

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
  imageb.emptyDir(done);
});

const _f1 = 'samples/640x360.jpg';

describe('del /api/images/[_id]', () => {
  describe('deleting mine', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    beforeAll(done => {
      userf.login('user1', done);
    });
    it('should succeed', done => {
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
            assert2.pathNotExists(imageb.fman.getPath(_id1));
            assert2.pathExists(imageb.fman.getPath(_id2));
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
  describe('deleting by admin', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should succeed', done => {
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
              assert2.pathNotExists(imageb.fman.getPath(_id));
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
  describe('deleting other\'s', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should fail', done => {
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
              assert2.pathExists(imageb.fman.getPath(_id));
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
