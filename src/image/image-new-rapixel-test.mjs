import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expu from "../express/express-upload.mjs";
import * as expl from "../express/express-local.mjs";
import * as imagen from "../image/image-new.mjs";
import * as imageb from "../image/image-base.mjs";
import * as userf from "../user/user-fixture.mjs";

beforeAll(done => {
  config.setPath('config/rapixel-test.json');
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

describe('getDir()', () => {
  it('should work for id 1', () => {
    expect(imageb.fman.getDir(1)).toBe(config.prop.uploadDir + '/public/images/0/0/1');
    assert2.e(imageb.fman.getPath(1, 640), config.prop.uploadDir + '/public/images/0/0/1/1-640.jpg');
    expect(imageb.fman.getUrlDir(1)).toBe(config.prop.uploadSite + '/images/0/0/1');
    expect(imageb.fman.getThumbUrl(1)).toBe(config.prop.uploadSite + '/images/0/0/1/1-2560.jpg');
  });
  it('should work for id 1 234 567', () => {
    expect(imageb.fman.getDir(1234567)).toBe(config.prop.uploadDir + '/public/images/1/234/567');
    assert2.e(imageb.fman.getPath(1234567, 640), config.prop.uploadDir + '/public/images/1/234/567/1234567-640.jpg');
    expect(imageb.fman.getUrlDir(1234567)).toBe(config.prop.uploadSite + '/images/1/234/567');
    expect(imageb.fman.getThumbUrl(1234567)).toBe(config.prop.uploadSite + '/images/1/234/567/1234567-2560.jpg');
  });
});

describe('post /api/images', () => {
  describe('posting 5120x2880 image', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should succeed', done => {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/5120x2880.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.ids).not.toBe(undefined);
        expect(res.body.ids.length).toBe(1);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          expect(err).toBeFalsy();
          imageb.unpackImage(image);
          expect(image.id).toBe(_id);
          expect(image.uid).toBe(userf.users.user1.id);
          //assert2.de(image.vers, [ 5120, 4096, 2560, 1920, 1280 ]);
          assert2.de(image.vers, [ 5120, 4096, 2560, 1280 ]);
          expect(image.cdate).not.toBe(undefined);
          expect(image.comment).toBe('image1');
          assert2.pathExists(imageb.fman.getPath(_id, 5120));
          assert2.pathExists(imageb.fman.getPath(_id, 4096));
          assert2.pathExists(imageb.fman.getPath(_id, 2560));
          assert2.pathExists(imageb.fman.getPath(_id, 1280));
          assert2.pathNotExists(imageb.fman.getPath(_id, 640));
          done();
        });
      });
    });
  });

  describe('posting 3840x2160 image', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should succeed', done => {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/3840x2160.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.ids).not.toBe(undefined);
        expect(res.body.ids.length).toBe(1);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          expect(err).toBeFalsy();
          imageb.unpackImage(image);
          expect(image.id).toBe(_id);
          expect(image.uid).toBe(userf.users.user1.id);
          //assert2.de(image.vers, [ 5120, 4096, 2560, 1920, 1280 ]);
          assert2.de(image.vers, [ 4096, 2560, 1280 ]);
          expect(image.cdate).not.toBe(undefined);
          expect(image.comment).toBe('image1');
          assert2.pathNotExists(imageb.fman.getPath(_id, 5120));
          assert2.pathExists(imageb.fman.getPath(_id, 4096));
          assert2.pathExists(imageb.fman.getPath(_id, 2560));
          assert2.pathExists(imageb.fman.getPath(_id, 1280));
          assert2.pathNotExists(imageb.fman.getPath(_id, 640));
          done();
        });
      });
    });
  });

  describe('posting vertical image', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should fail', done => {
      expl.post('/api/images').attach('files', 'samples/2160x3840.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'IMAGE_SIZE'));
        done();
      });
    });
  });

  describe('posting small image', () => {
    beforeAll(done => {
      db.query('truncate table image', done);
    });
    it('should fail', done => {
      expl.post('/api/images').attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ok(res.body.err);
        assert2.ok(error.errorExists(res.body.err, 'IMAGE_SIZE'));
        done();
      });
    });
  });
});
