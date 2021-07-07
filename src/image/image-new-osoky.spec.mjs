import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expu from "../express/express-upload.mjs";
import * as expl from "../express/express-local.mjs";
import * as userf from "../user/user-fixture.mjs";
import * as imagen from "../image/image-new.mjs";
import * as imageb from "../image/image-base.mjs";

before(function (done) {
  config.setPath('config/osoky-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

before((done) => {
  expb.start();
  done();
});

before(function (done) {
  userf.login('user1', done);
});

before(function (done) {
  imageb.emptyDir(done);
});

describe('getDir()', function () {
  it('should work for id 1', function () {
    assert2.e(imageb.fman.getDir(1), config.prop.uploadDir + '/public/images/0/0');
    assert2.e(imageb.fman.getPath(1), config.prop.uploadDir + '/public/images/0/0/1.jpg');
    assert2.e(imageb.fman.getUrlDir(1), config.prop.uploadSite + '/images/0/0');
    assert2.e(imageb.fman.getThumbUrl(1), config.prop.uploadSite + '/images/0/0/1.jpg');
  });
  it('should work for id 1 234 567', function () {
    assert2.e(imageb.fman.getDir(1234567), config.prop.uploadDir + '/public/images/1/234');
    assert2.e(imageb.fman.getPath(1234567), config.prop.uploadDir + '/public/images/1/234/1234567.jpg');
    assert2.e(imageb.fman.getUrlDir(1234567), config.prop.uploadSite + '/images/1/234');
    assert2.e(imageb.fman.getThumbUrl(1234567), config.prop.uploadSite + '/images/1/234/1234567.jpg');
  });
});

describe('post /api/images', function () {
  describe('posting big', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/4096x2304.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          assert2.ifError(err);
          assert2.e(image.id, _id);
          assert2.e(image.uid, userf.users.user1.id);
          assert2.ne(image.cdate, undefined);
          assert2.e(image.comment, 'image1');
          imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
            assert2.ifError(err);
            assert2.e(meta.width, imageb.fman.maxWidth);
            assert2.e(meta.height, imageb.fman.maxWidth);
            done();
          });
        });
      });
    });
  });
  describe('posting small', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/1280x720.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          assert2.ifError(err);
          assert2.e(image.id, _id);
          assert2.e(image.uid, userf.users.user1.id);
          assert2.ne(image.cdate, undefined);
          assert2.e(image.comment, 'image1');
          imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
            assert2.ifError(err);
            assert2.e(meta.width, 720);
            assert2.e(meta.height, 720);
            done();
          });
        });
      });
    });
  });
  describe('posting too small', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should fail', function (done) {
      expl.post('/api/images').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'IMAGE_SIZE'));
        done();
      });
    });
  });
});
