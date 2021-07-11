
beforeAll((done) => {
  expb.start();
  done();
});

describe('api res.json', () => {
  describe('object', () => {
    beforeAll(() => {
      expb.router.get('/api/test/object', function (req, res, done) {
        res.json({ msg: 'valid json' });
      });
    });
    it('should return object', done => {
      expl.get('/api/test/object').end(function (err, res) {
        expect(err).toBeFalsy();
        expect(res.type).toBe('application/json');
        expect(res.body.msg).toBe('valid json');
        done();
      });
    });
  });
  describe('string', () => {
    beforeAll(() => {
      expb.router.get('/api/test/string', function (req, res, done) {
        res.json('hi');
      });
    });
    it('should return string', done => {
      expl.get('/api/test/string').end(function (err, res) {
        expect(err).toBeFalsy();
        expect(res.type).toBe('application/json');
        expect(res.body).toBe('hi');
        done();
      });
    });
  });
  describe('null', () => {
    beforeAll(() => {
      expb.router.get('/api/test/null', function (req, res, done) {
        res.json(null);
      });
    });
    it('should return null', done => {
      expl.get('/api/test/null').end(function (err, res) {
        expect(err).toBeFalsy();
        expect(res.type).toBe('application/json');
        expect(res.body).toBe(null);
        done();
      });
    });
  });
});

describe('api done(error)', () => {
  beforeAll(() => {
    expb.router.get('/api/test/invalid-data', function (req, res, done) {
       done(error.newError('INVALID_DATA'));
    });
  });
  it('should return json', done => {
    expl.get('/api/test/invalid-data').end(function (err, res) {
      expect(err).toBeFalsy();
      expect(res.type).toBe('application/json');
      assert2.ok(res.body.err);
      assert2.ok(error.errorExists(res.body.err, 'INVALID_DATA'));
      done();
    });
  });
});

describe('api no-action', () => {
  beforeAll(() => {
    expb.router.get('/api/test/no-action', function (req, res, done) {
      done();
    });
  });
  it('should return 404', done => {
    expl.get('/api/test/no-action').end(function (err, res) {
      assert2.ok(err !== null);
      expect(res.status).toBe(404); // Not Found
      done();
    });
  });
});

describe('undefined api', () => {
  it('should return 404', done => {
    expl.get('/api/test/undefined-url').end(function (err, res) {
      assert2.ok(err !== null);
      expect(res.status).toBe(404); // Not Found
      done();
    });
  });
});

describe('html res.send', () => {
  beforeAll(() => {
    expb.router.get('/test/html', function (req, res, done) {
      res.send('<p>some text</p>');
    });
  });
  it('should return html', done => {
    expl.get('/test/html').end(function (err, res) {
      expect(err).toBeFalsy();
      expect(res.type).toBe('text/html');
      expect(res.text).toBe('<p>some text</p>');
      done();
    });
  });
});

describe('html done(error)', () => {
  beforeAll(() => {
    expb.router.get('/test/invalid-data', function (req, res, done) {
      done(error.newError('INVALID_DATA'));
    });
  });
  it('should return html', done => {
    expl.get('/test/invalid-data').end(function (err, res) {
      expect(err).toBeFalsy();
      expect(res.type).toBe('text/html');
      assert2.ok(/.*INVALID_DATA.*/.test(res.text));
      done();
    });
  });
});

describe('cache control', () => {
  beforeAll(() => {
    expb.router.get('/test/cache-test', function (req, res, done) {
       res.send('<p>muse be cached</p>');
     });
  });
  describe('none api request', () => {
    it('should return Cache-Control: private', done => {
      expl.get('/test/cache-test').end(function (err, res) {
        expect(err).toBeFalsy();
        expect(res.get('Cache-Control')).toBe('private');
        done();
      });
    });
  });
  describe('api request', () => {
    it('should return Cache-Control: no-cache', done => {
      expl.get('/api/hello').end(function (err, res) {
        expect(err).toBeFalsy();
        expect(res.get('Cache-Control')).toBe('no-cache');
        done();
      });
    });
  });
});

describe('session var', () => {
  beforeAll(() => {
    expb.router.put('/api/test/session', function (req, res) {
      for (let key in req.body) {
        req.session[key] = req.body[key];
      }
      res.json({});
    });
    expb.router.get('/api/test/session', function (req, res) {
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
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expl.get('/api/test/session').send([ 'book', 'price' ]).end(function (err, res) {
        expect(err).toBeFalsy();
        expect(res.body.book).toBe('book1');
        expect(res.body.price).toBe(11);
        done();
      });
    });
  });
  it('should fail when session destroied', done => {
    expl.put('/api/test/session').send({ book: 'book1', price: 11 }).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      expl.post('/api/destroy-session').end(function (err, res) {
        expect(err).toBeFalsy();
        assert2.ifError(res.body.err);
        expl.get('/api/test/session').send([ 'book', 'price' ]).end(function (err, res) {
          expect(err).toBeFalsy();
          expect(res.body.book).toBe(undefined);
          expect(res.body.price).toBe(undefined);
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

    expb.router.get('/api/test/mw-1-2', mid1, mid2, function (req, res, done) {
      result.mid3 = 'ok';
      res.json({});
    });

    expb.router.get('/api/test/mw-1-err-2', mid1, midErr, mid2, function (req, res, done) {
      result.mid3 = 'ok';
      res.json({});
    });
  });
  describe('mw-1-2 ', () => {
    it('should return 1, 2', done => {
      result = {};
      expl.get('/api/test/mw-1-2').end(function (err, res) {
        expect(err).toBeFalsy();
        expect(result.mid1).not.toBe(undefined);
        expect(result.mid2).not.toBe(undefined);
        expect(result.mid3).not.toBe(undefined);
        done();
      });
    });
  });
  describe('mw-1-err-2', () => {
    it('should return 1, 2', done => {
      result = {};
      expl.get('/api/test/mw-1-err-2').end(function (err, res) {
        expect(err).toBeFalsy();
        expect(result.mid1).not.toBe(undefined);
        expect(result.mid2).toBe(undefined);
        expect(result.mid3).toBe(undefined);
        done();
      });
    });
  });
});

describe('hello', () => {
  it('should return appName', done => {
    expl.get('/api/hello').end(function (err, res) {
      expect(err).toBeFalsy();
      expect(res.type).toBe('application/json');
      expect(res.body.name).toBe(config.prop.appName);
      const stime = parseInt(res.body.time || 0);
      const ctime = Date.now();
      expect(stime <= ctime).toBe(true);
      expect(stime >= ctime - 100).toBe(true);
      done();
    });
  });
});

describe('echo', () => {
  describe('get', () => {
    it('should succeed', done => {
      expl.get('/api/echo?p1&p2=123').end(function (err, res) {
        expect(err).toBeFalsy();
        expect(res.body.method).toBe('GET');
        assert2.de(res.body.query, { p1: '', p2: '123' });
        done();
      });
    });
  });
  describe('post', () => {
    it('should succeed', done => {
      expl.post('/api/echo').send({ p1: '', p2: '123' }).end(function (err, res) {
        expect(err).toBeFalsy();
        expect(res.body.method).toBe('POST');
        assert2.de(res.body.body, { p1: '', p2: '123' });
        done();
      });
    });
  });
  describe('delete', () => {
    it('should succeed', done => {
      expl.del('/api/echo').end(function (err, res) {
        expect(err).toBeFalsy();
        expect(res.body.method).toBe('DELETE');
        done();
      });
    });
  });
});
