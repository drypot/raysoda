'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/raysoda-test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expu = require('../express/express-upload');
var expl = require('../express/express-local');
var userf = require('../user/user-fixture');
var imageb = require('../image/image-base');
var imagel = require('../image/image-list');
var assert = require('assert');
var assert2 = require('../base/assert2');

before(function (done) {
  init.run(done);
});

before(function (done) {
  userf.login('user1', done);
});

describe('get /api/images', function (done) {
  before(function (done) {
    var now = new Date();
    var images = [
      { _id: 1,  uid: userf.user1._id, cdate: now, comment: '1' },
      { _id: 2,  uid: userf.user1._id, cdate: now, comment: '2' },
      { _id: 3,  uid: userf.user1._id, cdate: now, comment: '3' },
      { _id: 4,  uid: userf.user1._id, cdate: now, comment: '4' },
      { _id: 5,  uid: userf.user1._id, cdate: now, comment: '5' },
      { _id: 6,  uid: userf.user1._id, cdate: now, comment: '6' },
      { _id: 7,  uid: userf.user1._id, cdate: now, comment: '7' },
      { _id: 8,  uid: userf.user1._id, cdate: now, comment: '8' },
      { _id: 9,  uid: userf.user1._id, cdate: now, comment: '9' },
      { _id: 10, uid: userf.user1._id, cdate: now, comment: '10' },
    ];
    imageb.images.insertMany(images, done);
  });
  it('should succeed for page size 99', function (done) {
    var query = {
      ps: 99
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      assert2.noError(err);
      assert2.empty(res.body.err);
      assert2.e(res.body.gt, undefined);
      assert2.e(res.body.lt, undefined);
      assert2.e(res.body.images.length, 10);
      assert2.e(res.body.images[0]._id, 10);
      assert2.e(res.body.images[1]._id, 9);
      assert2.e(res.body.images[2]._id, 8);
      assert2.e(res.body.images[9]._id, 1);
      done();
    });
  });
  it('should succeed for page 1', function (done) {
    var query = {
      ps: 4
    };
    expl.get('/api/images').query(query).end(function (err, res) {
      assert2.noError(err);
      assert2.empty(res.body.err);
      assert2.e(res.body.gt, undefined);
      assert2.e(res.body.lt, 7);
      assert2.e(res.body.images.length, 4);
      assert2.e(res.body.images[0]._id, 10);
      assert2.e(res.body.images[3]._id, 7);
      done();
    });
  });
  it('should succeed for page 2 by lt', function (done) {
    var query = {
      lt:7, ps: 4
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      assert2.noError(err);
      assert2.empty(res.body.err);
      assert2.e(res.body.gt, 6);
      assert2.e(res.body.lt, 3);
      assert2.e(res.body.images.length, 4);
      assert2.e(res.body.images[0]._id, 6);
      assert2.e(res.body.images[3]._id, 3);
      done();
    });
  });
  it('should succeed for last page', function (done) {
    var query = {
      lt: 3, ps: 4
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      assert2.noError(err);
      assert2.empty(res.body.err);
      assert2.e(res.body.gt, 2);
      assert2.e(res.body.lt, undefined);
      assert2.e(res.body.images.length, 2);
      assert2.e(res.body.images[0]._id, 2);
      assert2.e(res.body.images[1]._id, 1);
      done();
    });
  });
  it('should succeed for page 2 by gt ', function (done) {
    var query = {
      gt:2, ps: 4
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      assert2.noError(err);
      assert2.empty(res.body.err);
      assert2.e(res.body.gt, 6);
      assert2.e(res.body.lt, 3);
      assert2.e(res.body.images.length, 4);
      assert2.e(res.body.images[0]._id, 6);
      assert2.e(res.body.images[3]._id, 3);
      done();
    });
  });
  it('should succeed for first page ', function (done) {
    var query = {
      gt: 6, ps: 4
    };
    expl.get('/api/images').query(query).end(function (err, res) {
      assert2.noError(err);
      assert2.empty(res.body.err);
      assert2.e(res.body.gt, undefined);
      assert2.e(res.body.lt, 7);
      assert2.e(res.body.images.length, 4);
      assert2.e(res.body.images[0]._id, 10);
      assert2.e(res.body.images[3]._id, 7);
      done();
    });
  });
});

describe('get /api/images deep', function (done) {
  before(function (done) {
    imageb.images.deleteMany(done);
  });
  before(function (done) {
    var images = [
      { _id: 11, uid: userf.user1._id, cdate: new Date(2003, 3, 3), comment: '' },
      { _id: 13, uid: userf.user2._id, cdate: new Date(2003, 6, 7), comment: '' },
      { _id: 15, uid: userf.user2._id, cdate: new Date(2005, 9, 1), comment: '' },
      { _id: 18, uid: userf.user2._id, cdate: new Date(2007, 9, 1), comment: '' },
      { _id: 27, uid: userf.user1._id, cdate: new Date(2009, 5, 4), comment: '' },
      { _id: 36, uid: userf.user2._id, cdate: new Date(2009, 8, 2), comment: '' },
      { _id: 49, uid: userf.user1._id, cdate: new Date(2010, 1, 9), comment: '' },
      { _id: 67, uid: userf.user2._id, cdate: new Date(2012, 7, 6), comment: '' },
      { _id: 82, uid: userf.user2._id, cdate: new Date(2013, 2, 3), comment: '' },
      { _id: 98, uid: userf.user1._id, cdate: new Date(2014, 4, 9), comment: '' },
    ];
    imageb.images.insertMany(images, done);
  });
  it('should succeed', function (done) {
    var query = {
      ps: 3
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      assert2.noError(err);
      assert2.empty(res.body.err);
      assert2.e(res.body.dyear, 2010);
      assert2.e(res.body.dlt, 50);
      done();
    });
  });
  it('should succeed', function (done) {
    var query = {
      lt: 49, ps: 3
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      assert2.noError(err);
      assert2.empty(res.body.err);
      assert2.e(res.body.dyear, 2005);
      assert2.e(res.body.dlt, 16);
      done();
    });
  });
  it('should succeed', function (done) {
    var query = {
      lt: 18, ps: 3
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      assert2.noError(err);
      assert2.empty(res.body.err);
      assert2.e(res.body.dyear, undefined);
      assert2.e(res.body.dlt, undefined);
      done();
    });
  });
});
