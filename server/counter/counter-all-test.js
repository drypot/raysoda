'use strict';

var init = require('../base/init');
var error = require('../base/error');
var util2 = require('../base/util2');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var counterb = require('../counter/counter-base');
var countera = require('../counter/counter-all');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

describe('/api/counters/:id/inc', function () {
  var today = util2.today();
  it('should succeed for new', function (done) {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      expect(res).redirectTo('http://hello.world');
      counterb.counters.findOne({ id: 'abc', d: today }, function (err, c) {
        expect(err).not.exist;
        expect(c.id).equal('abc');
        expect(c.d).deep.equal(today);
        expect(c.c).equal(1);
        done();
      });
    });
  });
  it('should succeed for existing', function (done) {
    expl.get('/api/counters/abc/inc?r=http://hello.world').redirects(0).end(function (err, res) {
      expect(res).redirectTo('http://hello.world');
      counterb.counters.findOne({ id: 'abc', d: today }, function (err, c) {
        expect(err).not.exist;
        expect(c.id).equal('abc');
        expect(c.d).deep.equal(today);
        expect(c.c).equal(2);
        done();
      });
    });
  });
});

describe('/api/counters/:id', function () {
  before(function (done) {
    var t = [
      { id: 'dc', d: new Date('2015-10-05 0:0'), c: 1 },
      { id: 'dc', d: new Date('2015-10-06 0:0'), c: 2 },
      { id: 'dc', d: new Date('2015-10-07 0:0'), c: 3 },
      { id: 'dc', d: new Date('2015-10-08 0:0'), c: 4 },
      { id: 'dc', d: new Date('2015-10-09 0:0'), c: 5 },
      { id: 'dc', d: new Date('2015-10-10 0:0'), c: 6 }
    ];
    counterb.counters.insertMany(t, function (err) {
      expect(err).not.exist;
      done();
    });
  });
  it('should succeed', function (done) {
    userf.login('admin', function (err) {
      expect(err).not.exist;
      expl.get('/api/counters/dc?b=2015-10-07&e=2015-10-09', function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).not.exist;
        var cs = res.body.counters;
        expect(cs.length).equal(3);
        expect(cs[0].id).equal('dc');
        expect(new Date(cs[0].d)).deep.equal(new Date('2015-10-07 0:0'));
        expect(cs[0].c).equal(3);
        expect(cs[2].id).equal('dc');
        expect(new Date(cs[2].d)).deep.equal(new Date('2015-10-09 0:0'));
        expect(cs[2].c).equal(5);
        done();
      });
    });
  });
  it('should fail if not admin', function (done) {
    userf.login('user1', function (err) {
      expect(err).not.exist;
      expl.get('/api/counters/dc?b=2015-10-07&e=2015-10-09', function (err, res) {
        expect(err).not.exist;
        expect(res.body.err).error('NOT_AUTHORIZED');
        done();
      });
    });
  });
});