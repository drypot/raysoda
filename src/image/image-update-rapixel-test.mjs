import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as fs2 from '../base/fs2.mjs';
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from '../express/express-base.mjs';
import * as expu from '../express/express-upload.mjs';
import * as expl from '../express/express-local.mjs';
import * as userf from '../user/user-fixture.mjs';
import * as imageb from '../image/image-base.mjs';
import * as imageu from '../image/image-update.mjs';

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

describe('put /api/images/id', () => {
  describe('updating with image', () => {
    it('should succeed', done => {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/5120x2880.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        const _id = res.body.ids[0];
        db.queryOne('select * from image where id = ?', _id, (err, image) => {
          assert2.ifError(err);
          assert2.ne(image, undefined);
          imageb.unpackImage(image);
          //assert2.de(image.vers, [ 5120, 4096, 2560, 1920, 1280 ]);
          assert2.de(image.vers, [ 5120, 4096, 2560, 1280]);
          assert2.e(image.comment, 'image1');
          assert2.pathExists(imageb.fman.getPath(_id, 5120));
          assert2.pathExists(imageb.fman.getPath(_id, 4096));
          assert2.pathExists(imageb.fman.getPath(_id, 2560));
          assert2.pathExists(imageb.fman.getPath(_id, 1280));
          fs2.emptyDir(imageb.fman.getDir(_id), function (err) {
            if (err) return done(err);
            expl.put('/api/images/' + _id).field('comment', 'image2').attach('files', 'samples/4096x2304.jpg').end(function (err, res) {
              assert2.ifError(err);
              assert2.ifError(res.body.err);
              db.queryOne('select * from image where id = ?', _id, (err, image) => {
                assert2.ifError(err);
                assert2.ne(image, undefined);
                imageb.unpackImage(image);
                //assert2.de(image.vers, [ 4096, 2560, 1920, 1280 ]);
                assert2.de(image.vers, [ 4096, 2560, 1280 ]);
                assert2.e(image.comment, 'image2');
                assert2.pathNotExists(imageb.fman.getPath(_id, 5120));
                assert2.pathExists(imageb.fman.getPath(_id, 4096));
                assert2.pathExists(imageb.fman.getPath(_id, 2560));
                assert2.pathExists(imageb.fman.getPath(_id, 1280));
                done();
              });
            });
          });
        });
      });
    });
  });
  describe('updating with small image', () => {
    it('should fail', done => {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/5120x2880.jpg').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        const _id = res.body.ids[0];
        expl.put('/api/images/' + _id).attach('files', 'samples/2560x1440.jpg').end(function (err, res) {
          assert2.ifError(err);
          assert2.ok(res.body.err);
          assert2.ok(error.find(res.body.err, 'IMAGE_SIZE'));
          done();
        });
      });
    });
  });
});
