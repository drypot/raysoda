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
    var list = [];
    for (var i = 0; i < 10; i++) {
      list.push({ _id: i + 1, f1: 'f1', f2: 'f2' });
    };
    col.insertMany(list, done);    
  });
  it('should succeed for page size 99', function (done) {
    mongo2.findPage(col, {}, {}, 0, 0, 99, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r.length).equal(10);
      expect(r[0]._id).equal(10);
      expect(r[1]._id).equal(9);
      expect(r[2]._id).equal(8);
      expect(r[9]._id).equal(1);
      expect(gt).equal(0);
      expect(lt).equal(0);
      done();
    });
  });
  it('should succeed for page 1', function (done) {
    mongo2.findPage(col, {}, {}, 0, 0, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).equal(10);
      expect(r[3]._id).equal(7);
      expect(gt).equal(0);
      expect(lt).equal(7);
      done();
    });
  });
  it('should succeed with lt ', function (done) {
    mongo2.findPage(col, {}, {}, 0, 7, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).equal(6);
      expect(r[3]._id).equal(3);
      expect(gt).equal(6);
      expect(lt).equal(3);
      done();
    });
  });
  it('should succeed for last page ', function (done) {
    mongo2.findPage(col, {}, {}, 0, 3, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(2);
      expect(r[0]._id).equal(2);
      expect(r[1]._id).equal(1);
      expect(gt).equal(2);
      expect(lt).equal(0);
      done();
    });
  });
  it('should succeed with gt ', function (done) {
    mongo2.findPage(col, {}, {}, 2, 0, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).equal(6);
      expect(r[3]._id).equal(3);
      expect(gt).equal(6);
      expect(lt).equal(3);
      done();
    });
  });
  it('should succeed for first page', function (done) {
    mongo2.findPage(col, {}, {}, 6, 0, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).equal(10);
      expect(r[3]._id).equal(7);
      expect(gt).equal(0);
      expect(lt).equal(7);
      done();
    });
  });
  it('should succeed with filter', function (done) {
    mongo2.findPage(col, {}, {}, 0, 0, 5, filter, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(2);
      expect(r[0]._id).equal(9);
      expect(r[1]._id).equal(7);
      expect(gt).equal(0);
      expect(lt).equal(6);
      done();
    });
    function filter(result, done) {
      done(null, result._id % 2 ? result : null);
    }
  });
  it('should succeed with opt', function (done) {
    mongo2.findPage(col, {}, { fields: { _id: 1, f1: 1} }, 0, 0, 4, null, function (err, r, gt, lt) {
      expect(err).not.exist;
      expect(r).length(4);
      expect(r[0]._id).exist;
      expect(r[0].f1).exist;
      expect(r[0].f2).not.exist;
      expect(gt).equal(0);
      expect(lt).equal(7);
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