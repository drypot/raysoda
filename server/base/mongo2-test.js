'use strict';

var init = require('../base/init');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../base/mongo2')({ dropDatabase: true });
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

describe('db', function () {
  it('should be opened.', function () {
    expect(mongo2.db.databaseName).equal(config.mongodb);
  });
});

describe('values', function () {
  describe('.update(id, string)', function () {
    it('should succeed', function (done) {
      mongo2.values.update('s1', 'value1', function (err) {
        expect(err).not.exist;
        mongo2.values.find('s1', function (err, value) {
          expect(err).not.exist;
          expect(value).equal('value1');
          done();
        });
      });
    });
  });
  describe('.update(id, number)', function () {
    it('should succeed', function (done) {
      mongo2.values.update('n1', 123, function (err) {
        expect(err).not.exist;
        mongo2.values.find('n1', function (err, value) {
          expect(err).not.exist;
          expect(value).equal(123);
          done();
        });
      });
    });
  });
  describe('.update(id, obj)', function () {
    it('should succeed', function (done) {
      mongo2.values.update('o1', { p1: 123, p2: 456 }, function (err) {
        expect(err).not.exist;
        mongo2.values.find('o1', function (err, value) {
          expect(err).not.exist;
          expect(value).deep.equal({ p1: 123, p2: 456 });
          done();
        });
      });
    });
  });
  describe('.find()', function () {
    it('should return null for undefined', function (done) {
      mongo2.values.find('noname', function (err, value) {
        expect(err).not.exist;
        expect(value).is.null;
        done();
      });
    });  
  });
});

describe('.findPage', function () {
  var col;
  before(function (done) {
    col = mongo2.db.collection('testpaging');
    var list = [
      { _id: 1,  a: 'a', b: 'b' },
      { _id: 2,  a: 'a', b: 'b' },
      { _id: 3,  a: 'a', b: 'b' },
      { _id: 4,  a: 'a', b: 'b' },
      { _id: 5,  a: 'a', b: 'b' },
      { _id: 6,  a: 'a', b: 'b' },
      { _id: 7,  a: 'a', b: 'b' },
      { _id: 8,  a: 'a', b: 'b' },
      { _id: 9,  a: 'a', b: 'b' },
      { _id: 10, a: 'a', b: 'b' }
    ];
    col.insertMany(list, done);    
  });
  it('should succeed for page size 99', function (done) {
    mongo2.findPage(col, {}, {}, undefined, undefined, 99, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r.length).equal(10);
      expect(r[0]._id).equal(10);
      expect(r[1]._id).equal(9);
      expect(r[2]._id).equal(8);
      expect(r[9]._id).equal(1);
      expect(gt).undefined;
      expect(lt).undefined;
      done();
    });
  });
  it('should succeed for page 1', function (done) {
    mongo2.findPage(col, {}, {}, undefined, undefined, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).equal(10);
      expect(r[3]._id).equal(7);
      expect(gt).undefined;
      expect(lt).equal(7);
      done();
    });
  });
  it('should succeed for next page ', function (done) {
    mongo2.findPage(col, {}, {}, undefined, 7, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).equal(6);
      expect(r[3]._id).equal(3);
      expect(gt).equal(6);
      expect(lt).equal(3);
      done();
    });
  });
  it('should succeed for next page (last page)', function (done) {
    mongo2.findPage(col, {}, {}, undefined, 5, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).equal(4);
      expect(r[1]._id).equal(3);
      expect(r[2]._id).equal(2);
      expect(r[3]._id).equal(1);
      expect(gt).equal(4);
      expect(lt).undefined;
      done();
    });
  });
  it('should succeed for last page (gt = 0)', function (done) {
    mongo2.findPage(col, {}, {}, 0, undefined, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).equal(4);
      expect(r[1]._id).equal(3);
      expect(r[2]._id).equal(2);
      expect(r[3]._id).equal(1);
      expect(gt).equal(4);
      expect(lt).undefined;
      done();
    });
  });
  it('should succeed for previous page', function (done) {
    mongo2.findPage(col, {}, {}, 2, undefined, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).equal(6);
      expect(r[3]._id).equal(3);
      expect(gt).equal(6);
      expect(lt).equal(3);
      done();
    });
  });
  it('should succeed for previous page (first page)', function (done) {
    mongo2.findPage(col, {}, {}, 6, undefined, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).equal(10);
      expect(r[3]._id).equal(7);
      expect(gt).undefined;
      expect(lt).equal(7);
      done();
    });
  });
  it('should succeed with filter', function (done) {
    mongo2.findPage(col, {}, {}, undefined, undefined, 5, filter, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(2);
      expect(r[0]._id).equal(9);
      expect(r[1]._id).equal(7);
      expect(gt).undefined;
      expect(lt).equal(6);
      done();
    });
    function filter(result, done) {
      done(null, result._id % 2 ? result : null);
    }
  });
  it('should succeed with opt', function (done) {
    mongo2.findPage(col, {}, { fields: { _id: 1, a: 1} }, undefined, undefined, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).exist;
      expect(r[0].a).exist;
      expect(r[0].b).not.exist;
      expect(gt).undefined;
      expect(lt).equal(7);
      done();
    });
  });
});

describe('.findDeepDoc', function () {
  var col;
  before(function (done) {
    col = mongo2.db.collection('testdeepdoc');
    var list = [
      { _id: 2,  a: 'a', b: 'b', cdate: new Date(2003, 3, 3, 10) },
      { _id: 3,  a: 'a', b: 'b', cdate: new Date(2003, 3, 3, 10) },
      { _id: 4,  a: 'a', b: 'b', cdate: new Date(2003, 3, 3, 10) },
      { _id: 21, a: 'a', b: 'b', cdate: new Date(2012, 3, 7, 10) },
      { _id: 24, a: 'a', b: 'b', cdate: new Date(2012, 3, 8, 11) },
      { _id: 27, a: 'a', b: 'b', cdate: new Date(2012, 3, 9, 12) },
      { _id: 37, a: 'a', b: 'b', cdate: new Date(2013, 3, 7, 10) },
      { _id: 38, a: 'a', b: 'b', cdate: new Date(2013, 3, 8, 11) },
      { _id: 39, a: 'a', b: 'b', cdate: new Date(2013, 3, 9, 12) },
    ];
    col.insertMany(list, done);    
  });
  it('should succeed', function (done) {
    mongo2.findDeepDoc(col, {}, {}, new Date(2013, 3, 8), function (err, dyear, dlt) {
      expect(err).not.exist;
      expect(dyear).equal(2013);
      expect(dlt).equal(38);
      done();
    });
  });
  it('should succeed', function (done) {
    mongo2.findDeepDoc(col, {}, {}, new Date(2012, 12, 12), function (err, dyear, dlt) {
      expect(err).not.exist;
      expect(dyear).equal(2012);
      expect(dlt).equal(28);
      done();
    });
  });
  it('should succeed', function (done) {
    mongo2.findDeepDoc(col, {}, {}, new Date(2001, 1, 1), function (err, dyear, dlt) {
      expect(err).not.exist;
      expect(dyear).equal(undefined);
      expect(dlt).equal(undefined);
      done();
    });
  });
});

describe('.getLastId', function () {
  var col;
  before(function () {
    col = mongo2.db.collection('testlastid');
  });
  it('should succeed for empty collection', function (done) {
    mongo2.getLastId(col, function (err, id) {
      expect(err).not.exist;
      expect(id).equal(0);
      done();
    });
  });
  it('should succeed for filled collection', function (done) {
    var list = [];
    for (var i = 0; i < 10; i++) {
      list.push({ _id: i + 1});
    };
    col.insertMany(list, function (err) {
      expect(err).not.exist;
      mongo2.getLastId(col, function (err, id) {
        expect(err).not.exist;
        expect(id).equal(10);
        done();
      });     
    });    
  });
});
