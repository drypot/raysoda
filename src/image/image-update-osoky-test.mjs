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
import * as imageu from '../image/image-update.mjs';

beforeAll(done => {
  config.setPath('config/osoky-test.json');
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

describe('put /api/images/id', () => {
  describe('updating with image', () => {
    it('should succeed', done => {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/1280x720.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        assert2.ne(res.body.ids, undefined);
        assert2.e(res.body.ids.length, 1);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          assert2.ifError(err);
          assert2.ne(image, undefined);
          assert2.ne(image.cdate, undefined);
          assert2.e(image.comment, 'image1');
          imageb.identify(imageb.fman.getPath(_id), function (err, meta) {
            assert2.ifError(err);
            assert2.e(meta.width, 720);
            assert2.e(meta.height, 720);
            expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/4096x2304.jpg').end(function (err, res) {
              assert2.ifError(err);
              assert2.ifError(res.body.err);
              db.queryOne('select * from image where id = ?', _id, (err, image) => {
                assert2.ifError(err);
                assert2.ne(image, undefined);
                assert2.ne(image.cdate, undefined);
                assert2.e(image.comment, 'image2');
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
      });
    });
  });
  describe('updating with small image', () => {
    it('should fail', done => {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/1280x720.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        const _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'samples/640x360.jpg').end(function (err, res) {
          assert2.ifError(err);
          assert2.ok(res.body.err);
          assert2.ok(error.find(res.body.err, 'IMAGE_SIZE'));
          done();
        });
      });
    });
  });
});
