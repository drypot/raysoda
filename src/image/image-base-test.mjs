
import * as init from "../base/init.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as imageb from "../image/image-base.mjs";

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('table image', () => {
  it('should exist', done => {
    db.tableExists('image', (err, exist) => {
      expect(err).toBeFalsy();
      assert2.ok(exist);
      done();
    });
  });
  it('getNewId should success', () => {
    expect(imageb.getNewId()).toBe(1);
    assert2.ok(imageb.getNewId() < imageb.getNewId());
  });
});

describe('identify()', () => {
  it('should work with jpeg', done => {
    imageb.identify('samples/1280x720.jpg', function (err, meta) {
      expect(err).toBeFalsy();
      expect(meta.format).toBe('jpeg');
      expect(meta.width).toBe(1280);
      expect(meta.height).toBe(720);
      done();
    });
  });
  /*
  heic 서포트를 넣으려고 시작했는데 heic 지원은 내 코드를 수정하는 것이 아니라
  서버의 ImageMagick heic 을 지원해야 하는 것으로 확인되었다.
  리눅스에서 heic 을 지원하려면 ImageMagick 을 커스텀 빌드해야 하는 것 같다.
  귀찮으니 다음에 하기로 한다;
  Mac brew ImageMagick 에선 heic 처리가 그냥 된다.
   */
  xit('should work with heic', function (done) {
    imageb.identify('samples/IMG_4395.HEIC', function (err, meta) {
      expect(err).toBeFalsy();
      expect(meta.format).toBe('heic');
      expect(meta.width).toBe(4032);
      expect(meta.height).toBe(3024);
      done();
    });
  });
  it('should work with svg', done => {
    imageb.identify('samples/svg-sample.svg', function (err, meta) {
      expect(err).toBeFalsy();
      expect(meta.format).toBe('svg');
      expect(meta.width).toBe(1000);
      expect(meta.height).toBe(1000);
      done();
    });
  });
  it('should fail with invalid path', done => {
    imageb.identify('xxxx', function (err, meta) {
      assert2.ok(err !== null);
      done();
    })
  });
  it('should fail with non-image', done => {
    imageb.identify('README.md', function (err, meta) {
      assert2.ok(err !== null);
      done();
    })
  });
});
