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
var expect = require('../base/assert2').expect;

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
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.gt).undefined;
      expect(res.body.lt).undefined;
      expect(res.body.images.length).equal(10);
      expect(res.body.images[0]._id).equal(10);
      expect(res.body.images[1]._id).equal(9);
      expect(res.body.images[2]._id).equal(8);
      expect(res.body.images[9]._id).equal(1);
      done();
    });
  });
  it('should succeed for page 1', function (done) {
    var query = {
      ps: 4
    };
    expl.get('/api/images').query(query).end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.gt).undefined;
      expect(res.body.lt).equal(7);
      expect(res.body.images).length(4);
      expect(res.body.images[0]._id).equal(10);
      expect(res.body.images[3]._id).equal(7);
      done();
    });
  });
  it('should succeed for page 2 by lt', function (done) {
    var query = {
      lt:7, ps: 4
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.gt).equal(6);
      expect(res.body.lt).equal(3);
      expect(res.body.images).length(4);
      expect(res.body.images[0]._id).equal(6);
      expect(res.body.images[3]._id).equal(3);
      done();
    });
  });
  it('should succeed for last page', function (done) {
    var query = {
      lt: 3, ps: 4
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.gt).equal(2);
      expect(res.body.lt).undefined;
      expect(res.body.images).length(2);
      expect(res.body.images[0]._id).equal(2);
      expect(res.body.images[1]._id).equal(1);
      done();
    });
  });
  it('should succeed for page 2 by gt ', function (done) {
    var query = {
      gt:2, ps: 4
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.gt).equal(6);
      expect(res.body.lt).equal(3);
      expect(res.body.images).length(4);
      expect(res.body.images[0]._id).equal(6);
      expect(res.body.images[3]._id).equal(3);
      done();
    });
  });
  it('should succeed for first page ', function (done) {
    var query = {
      gt: 6, ps: 4
    };
    expl.get('/api/images').query(query).end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.gt).undefined;
      expect(res.body.lt).equal(7);
      expect(res.body.images).length(4);
      expect(res.body.images[0]._id).equal(10);
      expect(res.body.images[3]._id).equal(7);
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
      { _id: 67, uid: userf.user2._id, cdate: new Date(2011, 7, 6), comment: '' },
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
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.dyear).equal(2010);
      expect(res.body.dlt).equal(50);
      done();
    });
  });
  it('should succeed', function (done) {
    var query = {
      lt: 49, ps: 3
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.dyear).equal(2005);
      expect(res.body.dlt).equal(16);
      done();
    });
  });
  it('should succeed', function (done) {
    var query = {
      lt: 18, ps: 3
    }
    expl.get('/api/images').query(query).end(function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.dyear).equal(undefined);
      expect(res.body.dlt).equal(undefined);
      done();
    });
  });
});
