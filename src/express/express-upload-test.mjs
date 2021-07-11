import * as init from '../base/init.mjs';
import * as config from '../base/config.mjs';
import * as expb from '../express/express-base.mjs';
import * as expl from "../express/express-local.mjs";
import * as expu from "../express/express-upload.mjs";

beforeAll(done => {
  config.setPath('config/test.json');
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('parsing json', () => {
  it('given handler', () => {
    expb.router.post('/api/test/upload-json', expu.handler(function (req, res, done) {
      expect(req.headers['content-type']).toBe('application/json');
      req.body.files = req.files;
      res.json(req.body);
      done();
    }));
  });
  it('should succeed', done => {
    expl.post('/api/test/upload-json').send({'p1': 'abc'}).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.files).toBe(undefined);
      expect(res.body.p1).toBe('abc');
      done();
    });
  });
});

describe('parsing form', () => {
  it('given handler', () => {
    expb.router.post('/api/test/upload-form', expu.handler(function (req, res, done) {
      // RegExp 기능이 chai-http github 에는 커밋되어 있으나 npm 패키지엔 아직 적용이 안 되어 있다.
      assert2.ok(req.header('content-type').includes('multipart'));
      req.body.files = req.files;
      res.json(req.body);
      done();
    }));
  });
  it('field should succeed', done => {
    expl.post('/api/test/upload-form').field('p1', 'abc').field('p2', '123').field('p2', '456').end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.files).toBe(undefined);
      expect(res.body.p1).toBe('abc');
      assert2.de(res.body.p2, ['123', '456']);
      done();
    });
  });
  it('fields should succeed', done => {
    const form = {
      p1: 'abc',
      p2: '123',
      p3: ['123', '456']
    };
    expl.post('/api/test/upload-form').fields(form).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.files).toBe(undefined);
      expect(res.body.p1).toBe('abc');
      expect(res.body.p2).toBe('123');
      assert2.de(res.body.p3, ['123', '456']);
      done();
    });
  });
});

describe('parsing one file', () => {
  const f1 = 'src/express/express-upload-f1.txt';
  let p1;
  it('given handler', () => {
    expb.router.post('/api/test/upload-one', expu.handler(function (req, res, done) {
      p1 = req.files.f1[0].path;
      assert2.pathExists(p1);
      req.body.files = req.files;
      res.json(req.body);
      done();
    }));
  });
  it('should succeed', done => {
    expl.post('/api/test/upload-one').field('p1', 'abc').attach('f1', f1).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.p1).toBe('abc');
      expect(res.body.files.f1[0].safeFilename).toBe('express-upload-f1.txt');
      setTimeout(function () {
        assert2.pathNotExists(p1);
        done();
      }, 100);
    });
  });
});

describe('parsing two files', () => {
  const f1 = 'src/express/express-upload-f1.txt';
  const f2 = 'src/express/express-upload-f2.txt';
  let p1, p2;
  it('given handler', () => {
    expb.router.post('/api/test/upload-two', expu.handler(function (req, res, done) {
      p1 = req.files.f1[0].path;
      p2 = req.files.f1[1].path;
      assert2.pathExists(p1);
      assert2.pathExists(p2);
      req.body.files = req.files;
      res.json(req.body);
      done();
    }));
  });
  it('should succeed', done => {
    expl.post('/api/test/upload-two').field('p1', 'abc').attach('f1', f1).attach('f1', f2).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.p1).toBe('abc');
      expect(res.body.files.f1[0].safeFilename).toBe('express-upload-f1.txt');
      expect(res.body.files.f1[1].safeFilename).toBe('express-upload-f2.txt');
      setTimeout(function () {
        assert2.pathNotExists(p1);
        assert2.pathNotExists(p2);
        done();
      }, 100);
    });
  });
});

describe('parsing irregular filename', () => {
  const f1 = 'src/express/express-upload-f1.txt';
  let p1;
  it('given handler', () => {
    expb.router.post('/api/test/upload-irregular', expu.handler(function (req, res, done) {
      p1 = req.files.f1[0].path;
      assert2.pathExists(p1);
      req.body.files = req.files;
      res.json(req.body);
      done();
    }));
  });
  it('should succeed', done => {
    expl.post('/api/test/upload-irregular').field('p1', 'abc').attach('f1', f1, 'file<>()[]_-=.txt.%$#@!&.txt').end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expect(res.body.files.f1[0].safeFilename).toBe('file__()[]_-=.txt.%$#@!&.txt');
      expect(res.body.p1).toBe('abc');
      assert2.pathNotExists(p1);
      done();
    });
  });
});

