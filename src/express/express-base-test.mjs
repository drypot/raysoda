import * as assert2 from "../base/assert2.mjs";
import * as init from '../base/init.mjs';
import * as error from '../base/error.mjs';
import * as config from '../base/config.mjs';
import * as expb from '../express/express-base.mjs';
import * as expl from "../express/express-local.mjs";

beforeAll(done => {
  config.setPath('config/test.json');
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('api res.json', () => {
  describe('object', () => {
    beforeAll(() => {
      expb.core.get('/api/test/object', function (req, res, done) {
        res.json({ msg: 'valid json' });
      });
    });
    it('should return object', done => {
      expl.get('/api/test/object').end(function (err, res) {
        assert2.ifError(err);
        assert2.e(res.type, 'application/json');
        assert2.e(res.body.msg, 'valid json');
        done();
      });
    });
  });
  describe('string', () => {
    beforeAll(() => {
      expb.core.get('/api/test/string', function (req, res, done) {
        res.json('hi');
      });
    });
    it('should return string', done => {
      expl.get('/api/test/string').end(function (err, res) {
        assert2.ifError(err);
        assert2.e(res.type, 'application/json');
        assert2.e(res.body, 'hi');
        done();
      });
    });
  });
  describe('null', () => {
    beforeAll(() => {
      expb.core.get('/api/test/null', function (req, res, done) {
        res.json(null);
      });
    });
    it('should return null', done => {
      expl.get('/api/test/null').end(function (err, res) {
        assert2.ifError(err);
        assert2.e(res.type, 'application/json');
        assert2.e(res.body, null);
        done();
      });
    });
  });
});

describe('api done(error)', () => {
  beforeAll(() => {
    expb.core.get('/api/test/invalid-data', function (req, res, done) {
       done(error.newError('INVALID_DATA'));
    });
  });
  it('should return json', done => {
    expl.get('/api/test/invalid-data').end(function (err, res) {
      assert2.ifError(err);
      assert2.e(res.type, 'application/json');
      assert2.ok(res.body.err);
      assert2.ok(error.find(res.body.err, 'INVALID_DATA'));
      done();
    });
  });
});

describe('api no-action', () => {
  beforeAll(() => {
    expb.core.get('/api/test/no-action', function (req, res, done) {
      done();
    });
  });
  it('should return 404', done => {
    expl.get('/api/test/no-action').end(function (err, res) {
      assert2.ok(err !== null);
      assert2.e(res.status, 404); // Not Found
      done();
    });
  });
});

describe('undefined api', () => {
  it('should return 404', done => {
    expl.get('/api/test/undefined-url').end(function (err, res) {
      assert2.ok(err !== null);
      assert2.e(res.status, 404); // Not Found
      done();
    });
  });
});

describe('html res.send', () => {
  beforeAll(() => {
    expb.core.get('/test/html', function (req, res, done) {
      res.send('<p>some text</p>');
    });
  });
  it('should return html', done => {
    expl.get('/test/html').end(function (err, res) {
      assert2.ifError(err);
      assert2.e(res.type, 'text/html');
      assert2.e(res.text, '<p>some text</p>');
      done();
    });
  });
});

describe('html done(error)', () => {
  beforeAll(() => {
    expb.core.get('/test/invalid-data', function (req, res, done) {
      done(error.newError('INVALID_DATA'));
    });
  });
  it('should return html', done => {
    expl.get('/test/invalid-data').end(function (err, res) {
      assert2.ifError(err);
      assert2.e(res.type, 'text/html');
      assert2.ok(/.*INVALID_DATA.*/.test(res.text));
      done();
    });
  });
});

describe('cache control', () => {
  beforeAll(() => {
    expb.core.get('/test/cache-test', function (req, res, done) {
       res.send('<p>muse be cached</p>');
     });
  });
  describe('none api request', () => {
    it('should return Cache-Control: private', done => {
      expl.get('/test/cache-test').end(function (err, res) {
        assert2.ifError(err);
        assert2.e(res.get('Cache-Control'), 'private');
        done();
      });
    });
  });
  describe('api request', () => {
    it('should return Cache-Control: no-cache', done => {
      expl.get('/api/hello').end(function (err, res) {
        assert2.ifError(err);
        assert2.e(res.get('Cache-Control'), 'no-cache');
        done();
      });
    });
  });
});

describe('session var', () => {
  beforeAll(() => {
    expb.core.put('/api/test/session', function (req, res) {
      for (let key in req.body) {
        req.session[key] = req.body[key];
      }
      res.json({});
    });
    expb.core.get('/api/test/session', function (req, res) {
      const obj = {};
      for (let i = 0; i < req.body.length; i++) {
        const key = req.body[i];
        obj[key] = req.session[key];
      }
      res.json(obj);
    });
  });
  it('should succeed', done => {
    expl.put('/api/test/session').send({ book: 'book1', price: 11 }).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      expl.get('/api/test/session').send([ 'book', 'price' ]).end(function (err, res) {
        assert2.ifError(err);
        assert2.e(res.body.book, 'book1');
        assert2.e(res.body.price, 11);
        done();
      });
    });
  });
  it('should fail when session destroied', done => {
    expl.put('/api/test/session').send({ book: 'book1', price: 11 }).end(function (err, res) {
      assert2.ifError(err);
      assert2.ifError(res.body.err);
      expl.post('/api/destroy-session').end(function (err, res) {
        assert2.ifError(err);
        assert2.ifError(res.body.err);
        expl.get('/api/test/session').send([ 'book', 'price' ]).end(function (err, res) {
          assert2.ifError(err);
          assert2.e(res.body.book, undefined);
          assert2.e(res.body.price, undefined);
          done();
        });
      });
    });
  });
});

describe('middleware', () => {
  let result;
  beforeAll(() => {
    function mid1(req, res, done) {
      result.mid1 = 'ok';
      done();
    }

    function mid2(req, res, done) {
      result.mid2 = 'ok';
      done();
    }

    function midErr(req, res, done) {
      done(new Error('some error'));
    }

    expb.core.get('/api/test/mw-1-2', mid1, mid2, function (req, res, done) {
      result.mid3 = 'ok';
      res.json({});
    });

    expb.core.get('/api/test/mw-1-err-2', mid1, midErr, mid2, function (req, res, done) {
      result.mid3 = 'ok';
      res.json({});
    });
  });
  describe('mw-1-2 ', () => {
    it('should return 1, 2', done => {
      result = {};
      expl.get('/api/test/mw-1-2').end(function (err, res) {
        assert2.ifError(err);
        assert2.ne(result.mid1, undefined);
        assert2.ne(result.mid2, undefined);
        assert2.ne(result.mid3, undefined);
        done();
      });
    });
  });
  describe('mw-1-err-2', () => {
    it('should return 1, 2', done => {
      result = {};
      expl.get('/api/test/mw-1-err-2').end(function (err, res) {
        assert2.ifError(err);
        assert2.ne(result.mid1, undefined);
        assert2.e(result.mid2, undefined);
        assert2.e(result.mid3, undefined);
        done();
      });
    });
  });
});

describe('hello', () => {
  it('should return appName', done => {
    expl.get('/api/hello').end(function (err, res) {
      assert2.ifError(err);
      assert2.e(res.type, 'application/json');
      assert2.e(res.body.name, config.prop.appName);
      const stime = parseInt(res.body.time || 0);
      const ctime = Date.now();
      assert2.e(stime <= ctime, true);
      assert2.e(stime >= ctime - 100, true);
      done();
    });
  });
});

describe('echo', () => {
  describe('get', () => {
    it('should succeed', done => {
      expl.get('/api/echo?p1&p2=123').end(function (err, res) {
        assert2.ifError(err);
        assert2.e(res.body.method, 'GET');
        assert2.de(res.body.query, { p1: '', p2: '123' });
        done();
      });
    });
  });
  describe('post', () => {
    it('should succeed', done => {
      expl.post('/api/echo').send({ p1: '', p2: '123' }).end(function (err, res) {
        assert2.ifError(err);
        assert2.e(res.body.method, 'POST');
        assert2.de(res.body.body, { p1: '', p2: '123' });
        done();
      });
    });
  });
  describe('delete', () => {
    it('should succeed', done => {
      expl.del('/api/echo').end(function (err, res) {
        assert2.ifError(err);
        assert2.e(res.body.method, 'DELETE');
        done();
      });
    });
  });
});
