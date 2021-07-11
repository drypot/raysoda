import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expu from "../express/express-upload.mjs";
import * as expl from "../express/express-local.mjs";
import * as userf from "../user/user-fixture.mjs";
import * as imageb from "../image/image-base.mjs";
import * as imagen from "../image/image-new.mjs";

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

beforeAll(done => {
  imageb.emptyDir(done);
});

describe('getPath', () => {
  it('should work for id 1', () => {
    expect(imageb.fman.getDir(1)).toBe(config.prop.uploadDir + '/public/images/0/0');
    expect(imageb.fman.getPath(1)).toBe(config.prop.uploadDir + '/public/images/0/0/1.jpg');
    expect(imageb.fman.getUrlDir(1)).toBe(config.prop.uploadSite + '/images/0/0');
    expect(imageb.fman.getThumbUrl(1)).toBe(config.prop.uploadSite + '/images/0/0/1.jpg');
  });
  it('should work for id 1 234 567', () => {
    expect(imageb.fman.getDir(1234567)).toBe(config.prop.uploadDir + '/public/images/1/234');
    expect(imageb.fman.getPath(1234567)).toBe(config.prop.uploadDir + '/public/images/1/234/1234567.jpg');
    expect(imageb.fman.getUrlDir(1234567)).toBe(config.prop.uploadSite + '/images/1/234');
    expect(imageb.fman.getThumbUrl(1234567)).toBe(config.prop.uploadSite + '/images/1/234/1234567.jpg');
  });
});

describe('getTicketCount', () => {
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

  describe('when no image', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should return ticketMax', done => {
      imagen.getTicketCount(_now, userf.users.user1, function (err, count, hours) {
        expect(err).toBeFalsy();
        expect(count).toBe(config.prop.ticketMax);
        done();
      });
    });
  });
  describe('when the last image aged', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    beforeAll(done => {
      genImage(config.prop.ticketGenInterval + 1, 1, done);
    });
    it('should return ticketMax', done => {
      imagen.getTicketCount(_now, userf.users.user1, function (err, count, hours) {
        expect(err).toBeFalsy();
        expect(count).toBe(config.prop.ticketMax);
        done();
      });
    });
  });
  describe('when recent image exists', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    beforeAll(done => {
      genImage(config.prop.ticketGenInterval - 1, 1, done);
    });
    it('should return (ticketMax - 1)', done => {
      imagen.getTicketCount(_now, userf.users.user1, function (err, count, hours) {
        expect(err).toBeFalsy();
        expect(count).toBe(config.prop.ticketMax - 1);
        done();
      });
    });
  });
  describe('when ticketMax images uploaded', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    beforeAll(done => {
      genImage(config.prop.ticketGenInterval - 3, config.prop.ticketMax, done);
    });
    it('should return 0 with left hours', done => {
      imagen.getTicketCount(_now, userf.users.user1, function (err, count, hours) {
        expect(err).toBeFalsy();
        expect(count).toBe(0);
        expect(hours).toBe(3);
        done();
      });
    });
  });
});

describe('post /api/images', () => {
  describe('posting horizonal image', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should succeed', done => {
      expl.post('/api/images').field('comment', 'h image').attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.ids).not.toBe(undefined);
        expect(res.body.ids.length).toBe(1);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          expect(err).toBeFalsy();
          expect(image.id).toBe(_id);
          expect(image.uid).toBe(userf.users.user1.id);
          expect(image.cdate).not.toBe(undefined);
          expect(image.comment).toBe('h image');
          imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
            expect(err).toBeFalsy();
            expect(meta.width <= imageb.fman.maxWidth).toBe(true);
            expect(meta.height <= imageb.fman.maxWidth).toBe(true);
            done();
          });
        });
      });
    });
  });
  describe('posting vertical image', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should succeed', done => {
      expl.post('/api/images').field('comment', 'v image').attach('files', 'samples/1440x2560.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.ids).not.toBe(undefined);
        expect(res.body.ids.length).toBe(1);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          expect(err).toBeFalsy();
          expect(image.id).toBe(_id);
          expect(image.uid).toBe(userf.users.user1.id);
          expect(image.cdate).not.toBe(undefined);
          expect(image.comment).toBe('v image');
          imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
            expect(err).toBeFalsy();
            expect(meta.width <= imageb.fman.maxWidth).toBe(true);
            expect(meta.height <= imageb.fman.maxWidth).toBe(true);
            done();
          });
        });
      });
    });
  });
  xdescribe('posting heic', function () {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should succeed', done => {
      expl.post('/api/images').field('comment', 'heic image').attach('files', 'samples/IMG_4395.HEIC').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.ids).not.toBe(undefined);
        expect(res.body.ids.length).toBe(1);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          expect(err).toBeFalsy();
          expect(image.id).toBe(_id);
          expect(image.uid).toBe(userf.users.user1.id);
          expect(image.cdate).not.toBe(undefined);
          expect(image.comment).toBe('heic image');
          imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
            expect(err).toBeFalsy();
            expect(meta.width).toBe(2048);
            expect(meta.height).toBe(1536);
            done();
          });
        });

      });
    });
  });
  describe('posting small image', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should succeed', done => {
      expl.post('/api/images').field('comment', 'small image').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.ids).not.toBe(undefined);
        expect(res.body.ids.length).toBe(1);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          expect(err).toBeFalsy();
          expect(image.id).toBe(_id);
          expect(image.uid).toBe(userf.users.user1.id);
          expect(image.cdate).not.toBe(undefined);
          expect(image.comment).toBe('small image');
          imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
            expect(err).toBeFalsy();
            expect(meta.width).toBe(640);
            expect(meta.height).toBe(360);
            done();
          });
        });

      });
    });
  });
  describe('posting too small', () => {
    it('should fail', done => {
      expl.post('/api/images').attach('files', 'samples/360x240.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'IMAGE_SIZE'));
        done();
      });
    });
  });
  describe('posting multiple images', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should succeed', done => {
      const post = expl.post('/api/images').field('comment', 'max images');
      for (let i = 0; i < config.prop.ticketMax; i++) {
        post.attach('files', 'samples/640x360.jpg');
      }
      post.end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.ids).not.toBe(undefined);
        expect(res.body.ids.length).toBe(config.prop.ticketMax);
        const ids = res.body.ids;
        let _id;
        // first image should exist
        _id = ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          expect(err).toBeFalsy();
          expect(image.id).toBe(_id);
          expect(image.uid).toBe(userf.users.user1.id);
          expect(image.comment).toBe('max images');
          assert2.pathExists(imageb.fman.getPath(_id));
          // third versions should exist
          _id = ids[2];
          db.queryOne('select * from image where id = ?', _id, (err, image) => {
            expect(err).toBeFalsy();
            expect(image.id).toBe(_id);
            expect(image.uid).toBe(userf.users.user1.id);
            expect(image.comment).toBe('max images');
            assert2.pathExists(imageb.fman.getPath(_id));
            done();
          });
        });
      });
    });
    it('should fail when posting one more', done => {
      expl.post('/api/images').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.ids).not.toBe(undefined);
        expect(res.body.ids.length).toBe(0);
        done();
      });
    });
  });
  describe('posting plain text file', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should fail', done => {
      expl.post('/api/images').attach('files', 'src/express/express-upload-f1.txt').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'IMAGE_TYPE'));
        done();
      });
    });
  });
  describe('posting with no file', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should fail', done => {
      const form = {};
      expl.post('/api/images').send(form).end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'IMAGE_NO_FILE'));
        done();
      });
    });
  });
});
