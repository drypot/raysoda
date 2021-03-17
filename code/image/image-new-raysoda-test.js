import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as error from "../base/error.js";
import * as config from "../base/config.js";
import * as db from '../db/db.js';
import * as expb from "../express/express-base.js";
import * as expu from "../express/express-upload.js";
import * as expl from "../express/express-local.js";
import * as userf from "../user/user-fixture.js";
import * as imageb from "../image/image-base.js";
import * as imagen from "../image/image-new.js";

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
  userf.login('user1', done);
});

before(function (done) {
  imageb.emptyDir(done);
});

describe('getPath', function () {
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

describe('getTicketCount', function () {
  const _now = new Date();

  function genImage(hours, count, done) {
    let values = [];
    while(count--) {
      values.push([
        imageb.getNewId(),
        userf.users.user1.id,
        new Date(_now.getTime() - (hours * 60 * 60 * 1000)),
        'null',
        '',
      ]);
    }
    db.query('insert into image(id, uid, cdate, vers, comment) values ?', [values], done);
  }

  describe('when no image', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should return ticketMax', function (done) {
      imagen.getTicketCount(_now, userf.users.user1, function (err, count, hours) {
        assert2.ifError(err);
        assert2.e(count, config.prop.ticketMax);
        done();
      });
    });
  });
  describe('when the last image aged', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    before(function (done) {
      genImage(config.prop.ticketGenInterval + 1, 1, done);
    });
    it('should return ticketMax', function (done) {
      imagen.getTicketCount(_now, userf.users.user1, function (err, count, hours) {
        assert2.ifError(err);
        assert2.e(count, config.prop.ticketMax);
        done();
      });
    });
  });
  describe('when recent image exists', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    before(function (done) {
      genImage(config.prop.ticketGenInterval - 1, 1, done);
    });
    it('should return (ticketMax - 1)', function (done) {
      imagen.getTicketCount(_now, userf.users.user1, function (err, count, hours) {
        assert2.ifError(err);
        assert2.e(count, config.prop.ticketMax - 1);
        done();
      });
    });
  });
  describe('when ticketMax images uploaded', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    before(function (done) {
      genImage(config.prop.ticketGenInterval - 3, config.prop.ticketMax, done);
    });
    it('should return 0 with left hours', function (done) {
      imagen.getTicketCount(_now, userf.users.user1, function (err, count, hours) {
        assert2.ifError(err);
        assert2.e(count, 0);
        assert2.e(hours, 3);
        done();
      });
    });
  });
});

describe('post /api/images', function () {
  describe('posting horizonal image', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'h image').attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
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
          assert2.e(image.comment, 'h image');
          imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
            assert2.ifError(err);
            assert2.e(meta.width <= imageb.fman.maxWidth, true);
            assert2.e(meta.height <= imageb.fman.maxWidth, true);
            done();
          });
        });
      });
    });
  });
  describe('posting vertical image', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'v image').attach('files', 'samples/1440x2560.jpg').end(function (err, res) {
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
          assert2.e(image.comment, 'v image');
          imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
            assert2.ifError(err);
            assert2.e(meta.width <= imageb.fman.maxWidth, true);
            assert2.e(meta.height <= imageb.fman.maxWidth, true);
            done();
          });
        });
      });
    });
  });
  describe('posting small image', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      expl.post('/api/images').field('comment', 'small image').attach('files', 'samples/640x360.jpg').end(function (err, res) {
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
          assert2.e(image.comment, 'small image');
          imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
            assert2.ifError(err);
            assert2.e(meta.width, 640);
            assert2.e(meta.height, 360);
            done();
          });
        });

      });
    });
  });
  describe('posting too small', function () {
    it('should fail', function (done) {
      expl.post('/api/images').attach('files', 'samples/360x240.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'IMAGE_SIZE'));
        done();
      });
    });
  });
  describe('posting multiple images', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should succeed', function (done) {
      const post = expl.post('/api/images').field('comment', 'max images');
      for (let i = 0; i < config.prop.ticketMax; i++) {
        post.attach('files', 'samples/640x360.jpg');
      }
      post.end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, config.prop.ticketMax);
        const ids = res.body.ids;
        let _id;
        // first image should exist
        _id = ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          assert2.ifError(err);
          assert2.e(image.id, _id);
          assert2.e(image.uid, userf.users.user1.id);
          assert2.e(image.comment, 'max images');
          assert2.path(imageb.fman.getPath(_id));
          // third versions should exist
          _id = ids[2];
          db.queryOne('select * from image where id = ?', _id, (err, image) => {
            assert2.ifError(err);
            assert2.e(image.id, _id);
            assert2.e(image.uid, userf.users.user1.id);
            assert2.e(image.comment, 'max images');
            assert2.path(imageb.fman.getPath(_id));
            done();
          });
        });
      });
    });
    it('should fail when posting one more', function (done) {
      expl.post('/api/images').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 0);
        done();
      });
    });
  });
  describe('posting plain text file', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should fail', function (done) {
      expl.post('/api/images').attach('files', 'code/express/express-upload-f1.txt').end(function (err, res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'IMAGE_TYPE'));
        done();
      });
    });
  });
  describe('posting with no file', function () {
    before(function (done) {
      db.query('truncate table image', done);
    });
    it('should fail', function (done) {
      const form = {};
      expl.post('/api/images').send(form).end(function (err, res) {
        assert2.ifError(err);
        assert2.ok(res.body.err);
        assert2.ok(error.find(res.body.err, 'IMAGE_NO_FILE'));
        done();
      });
    });
  });
});
