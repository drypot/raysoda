import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from '../express/express-base.mjs';
import * as expu from '../express/express-upload.mjs';
import * as expl from '../express/express-local.mjs';
import * as userf from '../user/user-fixture.mjs';
import * as imageb from '../image/image-base.mjs';
import * as imageu from '../image/image-update.mjs';

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

describe('put /api/images/id', () => {
  describe('updating with image', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    beforeAll(done => {
      userf.login('user1', done);
    });
    it('should succeed', done => {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          expect(err).toBeFalsy();
          expect(image).not.toBe(undefined);
          expect(image.cdate).not.toBe(undefined);
          expect(image.comment).toBe('image1');
          imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
            expect(err).toBeFalsy();
            expect(meta.width).toBe(imageb.fman.maxWidth);
            assert2.ok(meta.height <imageb.fman.maxWidth);
            expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/1440x2560.jpg').end(function (err, res) {
              expect(err).toBeFalsy();
              assert2.ifError(res.body.err);
              db.queryOne('select * from image where id = ?', _id, (err, image) => {
                expect(err).toBeFalsy();
                expect(image).not.toBe(undefined);
                expect(image.cdate).not.toBe(undefined);
                expect(image.comment).toBe('image2');
                imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
                  expect(err).toBeFalsy();
                  assert2.ok(meta.width < imageb.fman.maxWidth);
                  expect(meta.height).toBe(imageb.fman.maxWidth);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
  describe('updating with small image', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    beforeAll(done => {
      userf.login('user1', done);
    });
    it('should fail', done => {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        const _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'samples/360x240.jpg').end(function (err, res) {
          expect(err).toBeFalsy();
          assert2.ok(res.body.err);
          assert2.ok(error.errorExists(res.body.err, 'IMAGE_SIZE'));
          done();
        });
      });
    });
  });
  describe('updating with no file', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    beforeAll(done => {
      userf.login('user1', done);
    });
    it('should succeed', done => {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        const _id = res.body.ids[0];
        expl.put('/api/images/' + _id).field('comment', 'updated with no file').end(function (err, res) {
          expect(err).toBeFalsy();
          assert2.ifError(res.body.err);
          db.queryOne('select * from image where id = ?', _id, (err, image) => {
            expect(err).toBeFalsy();
            expect(image).not.toBe(undefined);
            expect(image.comment).toBe('updated with no file');
            done();
          });
        });
      });
    });
  });
  describe('updating with text file', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    beforeAll(done => {
      userf.login('user1', done);
    });
    it('should fail', done => {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        const _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'src/express/express-upload-f1.txt').end(function (err, res) {
          expect(err).toBeFalsy();
          assert2.ok(res.body.err);
          assert2.ok(error.errorExists(res.body.err, 'IMAGE_TYPE'));
          done();
        });
      });
    });
  });
  describe('updating other\'s', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should fail', done => {
      userf.login('user1', function (err) {
        if (err) return done(err);
        expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/640x360.jpg').end(function (err, res) {
          expect(err).toBeFalsy();
          assert2.ifError(res.body.err);
          const _id = res.body.ids[0];
          userf.login('user2', function (err) {
            if (err) return done(err);
            expl.put('/api/images/' + _id).field('comment', 'xxx').end(function (err, res) {
              expect(err).toBeFalsy();
              assert2.ok(res.body.err);
              assert2.ok(error.errorExists(res.body.err, 'NOT_AUTHORIZED'));
              done();
            });
          });
        });
      });
    });
  });
});
