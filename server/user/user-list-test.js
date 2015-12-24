'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expl = require('../express/express-local');
var userb = require('../user/user-base');
var userf = require('../user/user-fixture');
var userl = require('../user/user-list');
var expect = require('../base/assert2').expect;

before(function (done) {
  init.run(done);
});

describe('/api/users?q=', function () {
  it('should succeed for user1', function (done) {
    expl.get('/api/users?q=user1', function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.users).length(1);
      var u = res.body.users[0];
      expect(u._id).equal(1);
      expect(u.name).equal('user1');
      expect(u.home).equal('user1');
      done();
    });
  });
  it('should succeed for us', function (done) {
    expl.get('/api/users?q=us', function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.users).length(3);
      var u;
      u = res.body.users[0];
      expect(u._id).equal(1);
      expect(u.name).equal('user1');
      expect(u.home).equal('user1');
      u = res.body.users[2];
      expect(u._id).equal(3);
      expect(u.name).equal('user3');
      expect(u.home).equal('user3');
      done();
    });
  });
  it('should succeed for [빈칸 which including RegExp character', function (done) {
    expl.get('/api/users?q=[빈칸', function (err, res) {
      expect(err).not.exist;
      expect(res.body.err).not.exist;
      expect(res.body.users).length(0);
      done();
    });
  });
});