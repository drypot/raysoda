import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from '../express/express-base.mjs';
import * as expu from '../express/express-upload.mjs';
import * as expl from '../express/express-local.mjs';
import * as userf from '../user/user-fixture.mjs';
import * as imagen from '../image/image-new.mjs';
import * as imagev from '../image/image-view.mjs';

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

describe('get /api/images/:id([0-9]+)', () => {
  describe('getting image', () => {
    it('should succeed', done => {
      expl.post('/api/images').field('comment', 'image1').attach('files', 'samples/640x360.jpg').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expect(res.body.ids).not.toBe(undefined);
        expect(res.body.ids.length).toBe(1);
        const _id = res.body.ids[0];
        expl.get('/api/images/' + _id).end(function (err, res) {
          expect(err).toBeFalsy();
          assert2.ifError(res.body.err);
          done();
        });
      });
    });
  });
});
