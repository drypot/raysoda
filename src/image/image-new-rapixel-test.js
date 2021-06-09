import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expb from "../express/express-base.js";
import * as expu from "../express/express-upload.js";
import * as expl from "../express/express-local.js";
import * as imagen from "../image/image-new.js";
import * as imageb from "../image/image-base.js";
import * as userf from "../user/user-fixture.js";

before(function (done) {
  config.setPath('config/rapixel-test.json');
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
    assert2.e(imageb.fman.getDir(1), config.prop.uploadDir + '/public/images/0/0/1');
    assert2.e(imageb.fman.getPath(1, 640), config.prop.uploadDir + '/public/images/0/0/1/1-640.jpg');
    assert2.e(imageb.fman.getUrlDir(1), config.prop.uploadSite + '/images/0/0/1');
    assert2.e(imageb.fman.getThumbUrl(1), config.prop.uploadSite + '/images/0/0/1/1-2560.jpg');
  });
  it('should work for id 1 234 567', function () {
    assert2.e(imageb.fman.getDir(1234567), config.prop.uploadDir + '/public/images/1/234/567');
    assert2.e(imageb.fman.getPath(1234567, 640), config.prop.uploadDir + '/public/images/1/234/567/1234567-640.jpg');
    assert2.e(imageb.fman.getUrlDir(1234567), config.prop.uploadSite + '/images/1/234/567');
    assert2.e(imageb.fman.getThumbUrl(1234567), config.prop.uploadSite + '/images/1/234/567/1234567-2560.jpg');
  });
});

describe('post /api/images', function () {
  describe('posting 5120x2880 image', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/5120x2880.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          assert2.ifError(err);
          imageb.unpackImage(image);
          assert2.e(image.id, _id);
          assert2.e(image.uid, userf.users.user1.id);
          //assert2.de(image.vers, [ 5120, 4096, 2560, 1920, 1280 ]);
          assert2.de(image.vers, [ 5120, 4096, 2560, 1280 ]);
          assert2.ne(image.cdate, undefined);
          assert2.e(image.comment, 'image1');
          assert2.path(imageb.fman.getPath(_id, 5120));
          assert2.path(imageb.fman.getPath(_id, 4096));
          assert2.path(imageb.fman.getPath(_id, 2560));
          assert2.path(imageb.fman.getPath(_id, 1280));
          assert2.path(imageb.fman.getPath(_id, 640), false);
          done();
        });
      });
    });
  });

  describe('posting 3840x2160 image', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/3840x2160.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          assert2.ifError(err);
          imageb.unpackImage(image);
          assert2.e(image.id, _id);
          assert2.e(image.uid, userf.users.user1.id);
          //assert2.de(image.vers, [ 5120, 4096, 2560, 1920, 1280 ]);
          assert2.de(image.vers, [ 4096, 2560, 1280 ]);
          assert2.ne(image.cdate, undefined);
          assert2.e(image.comment, 'image1');
          assert2.path(imageb.fman.getPath(_id, 5120), false);
          assert2.path(imageb.fman.getPath(_id, 4096));
          assert2.path(imageb.fman.getPath(_id, 2560));
          assert2.path(imageb.fman.getPath(_id, 1280));
          assert2.path(imageb.fman.getPath(_id, 640), false);
          done();
        });
      });
    });
  });

  describe('posting vertical image', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should fail', function (done) {
      expl.post('/api/images').attach('files', 'samples/2160x3840.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'IMAGE_SIZE'));
        done();
      });
    });
  });

  describe('posting small image', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should fail', function (done) {
      expl.post('/api/images').attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'IMAGE_SIZE'));
        done();
      });
    });
  });
});
