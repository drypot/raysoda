var init = require('../base/init');
var config = require('../base/config')({ path: 'config/test.json' });
var mongob = require('../mongo/mongo-base')({ dropDatabase: true });
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

describe('db', function () {
  it('should have been opened.', function () {
    expect(mongob.db.databaseName).equal(config.mongodb);
  });
});

describe.only('values', function () {
  it('given string', function (done) {
    mongob.values.update('s1', 'value1', function (err) {
      expect(err).not.exist;
      done();
    });
  });
  it('should return value', function (done) {
    mongob.values.find('s1', function (err, value) {
      expect(err).not.exist;
      expect(value).equal('value1');
      done();
    });
  });
  it('given number', function (done) {
    mongob.values.update('n1', 123, function (err) {
      expect(err).not.exist;
      done();
    });
  });
  it('should return', function (done) {
    mongob.values.find('n1', function (err, value) {
      expect(err).not.exist;
      expect(value).equal(123);
      done();
    });
  });
  it('given object', function (done) {
    mongob.values.update('o1', { p1: 123, p2: 456 }, function (err) {
      expect(err).not.exist;
      done();
    });
  });
  it('should return', function (done) {
    mongob.values.find('o1', function (err, value) {
      expect(err).not.exist;
      expect(value).deep.equal({ p1: 123, p2: 456 });
      done();
    });
  });
  it('should return null for undefined', function (done) {
    mongob.values.find('noname', function (err, value) {
      expect(err).not.exist;
      expect(value).is.null;
      done();
    });
  });  
});

describe('paging', function () {
  var col;
  it('given 10 records', function (done) {
    col = mongob.db.collection('testpaging');
    var list = [];
    for (var i = 0; i < 10; i++) {
      list.push({ _id: i + 1});
    };
    col.insertMany(list, done);    
  });
  it('page size 99 should success', function (done) {
    mongob.findPage(col, {}, 0, 0, 99, null, function (err, results, gt, lt) {
      expect(err).not.exist;
      expect(results.length).equal(10);
      expect(results[0]._id).equal(10);
      expect(results[1]._id).equal(9);
      expect(results[2]._id).equal(8);
      expect(results[9]._id).equal(1);
      expect(gt).equal(0);
      expect(lt).equal(0);
      done();
    });
  });
  it('page 1 should success', function (done) {
    mongob.findPage(col, {}, 0, 0, 4, null, function (err, results, gt, lt) {
      expect(err).not.exist;
      expect(results).length(4);
      expect(results[0]._id).equal(10);
      expect(results[3]._id).equal(7);
      expect(gt).equal(0);
      expect(lt).equal(7);
      done();
    });
  });
  it('page 2 with lt should success', function (done) {
    mongob.findPage(col, {}, 0, 7, 4, null, function (err, results, gt, lt) {
      expect(err).not.exist;
      expect(results).length(4);
      expect(results[0]._id).equal(6);
      expect(results[3]._id).equal(3);
      expect(gt).equal(6);
      expect(lt).equal(3);
      done();
    });
  });
  it('last page should success', function (done) {
    mongob.findPage(col, {}, 0, 3, 4, null, function (err, results, gt, lt) {
      expect(err).not.exist;
      expect(results).length(2);
      expect(results[0]._id).equal(2);
      expect(results[1]._id).equal(1);
      expect(gt).equal(2);
      expect(lt).equal(0);
      done();
    });
  });
  it('page 2 with gt should success', function (done) {
    mongob.findPage(col, {}, 2, 0, 4, null, function (err, results, gt, lt) {
      expect(err).not.exist;
      expect(results).length(4);
      expect(results[0]._id).equal(6);
      expect(results[3]._id).equal(3);
      expect(gt).equal(6);
      expect(lt).equal(3);
      done();
    });
  });
  it('first page should success', function (done) {
    mongob.findPage(col, {}, 6, 0, 4, null, function (err, results, gt, lt) {
      expect(err).not.exist;
      expect(results).length(4);
      expect(results[0]._id).equal(10);
      expect(results[3]._id).equal(7);
      expect(gt).equal(0);
      expect(lt).equal(7);
      done();
    });
  });
  it('filter should success', function (done) {
    mongob.findPage(col, {}, 0, 0, 5, filter, function (err, results, gt, lt) {
      expect(err).not.exist;
      expect(results).length(2);
      expect(results[0]._id).equal(9);
      expect(results[1]._id).equal(7);
      expect(gt).equal(0);
      expect(lt).equal(6);
      done();
    });
    function filter(result, done) {
      done(null, result._id % 2 ? result : null);
    }
  });
});

describe('getLastId', function () {
  var col;
  it('given empty collection', function () {
    col = mongob.db.collection('testlastid');
  });
  it('should success', function (done) {
    mongob.getLastId(col, function (err, id) {
      expect(err).not.exist;
      expect(id).equal(0);
      done();
    });
  });
  it('given 10 records', function (done) {
    var list = [];
    for (var i = 0; i < 10; i++) {
      list.push({ _id: i + 1});
    };
    col.insertMany(list, done);    
  });
  it('should success', function (done) {
    mongob.getLastId(col, function (err, id) {
      expect(err).not.exist;
      expect(id).equal(10);
      done();
    });
  });
});
