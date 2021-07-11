
import * as init from "../base/init.mjs";
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
  config.setPath('config/rapixel-test.json');
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

const _f1 = 'samples/4096x2304.jpg';

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
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.ids).not.toBe(undefined);
        const _id1 = res.body.ids[0];
        expl.post('/api/images').field('comment', 'image2').attach('files', _f1).end(function (err, res) {
          expect(err).toBeFalsy();
          assert2.ifError(res.body.err);
          expect(res.body.ids).not.toBe(undefined);
          const _id2 = res.body.ids[0];
          expl.del('/api/images/' + _id1, function (err, res) {
            expect(err).toBeFalsy();
            assert2.ifError(res.body.err);
            assert2.pathNotExists(imageb.fman.getDir(_id1));
            assert2.pathExists(imageb.fman.getDir(_id2));
            done();
          });
        });
      });
    });
  });
});
