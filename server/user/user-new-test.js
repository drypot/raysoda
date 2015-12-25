'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expl = require('../express/express-local');
var userb = require('../user/user-base');
var usern = require('../user/user-new');
var assert = require('assert');
var assert2 = require('../base/assert2');

before(function (done) {
  init.run(done);
});

describe('emailx test', function () {
  it('should succeed', function () {
    assert2.e(usern.emailx.test('abc.mail.com'), false);
    assert2.e(usern.emailx.test('abc*xyz@mail.com'), false);
    assert2.e(usern.emailx.test('-a-b-c_d-e-f@mail.com'), true);
    assert2.e(usern.emailx.test('develop.bj@mail.com'), true);
  });
});

describe('getNewId', function () {
  it('should succeed', function () {
    var id1 = userb.getNewId();
    var id1 = userb.getNewId();
    var id2 = userb.getNewId();
    var id2 = userb.getNewId();
    assert2.e(id1 < id2, true);
  });
});

describe('post /api/users', function () {
  describe('creating new user', function () {
    it('should succeed', function (done) {
      var form = { name: 'Name', email: 'name@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(res.body.err);
        let _id = res.body.id;
        userb.users.findOne({ _id: _id }, function (err, user) {
          assert.ifError(err);
          assert2.e(user.name, 'Name');
          assert2.e(user.namel, 'name');
          assert2.e(user.home, 'Name');
          assert2.e(user.homel, 'name');
          assert2.e(user.email, 'name@mail.com');
          userb.checkPassword('1234', user.hash, function (err, matched) {
            assert2.e(matched, true);
            userb.checkPassword('4444', user.hash, function (err, matched) {
              assert2.e(matched, false);
              done();
            });
          });
        });
      });
    });
  });
  describe('name check', function () {
    before(function (done) {
      userb.users.deleteMany(done);
    });
    before(function (done) {
      // 정규 create api 로는 home 이름을 세팅할 수 없기 때문에 디비에 직접 넣는다.
      var user = { _id: userb.getNewId(), name: 'Name1', namel: 'name1', home: 'Home1', homel: 'home1', email: 'name1@mail.com' };
      userb.users.insertOne(user, done);
    });
    it('should fail when name duped with name', function (done) {
      var form = { name: 'NAME1', email: 'nameduped@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ne(res.body.err, undefined);
        assert(error.find(res.body.err, 'NAME_DUPE'));
        done();
      });
    });
    it('should fail when name duped with home', function (done) {
      var form = { name: 'HOME1', email: 'nameduped@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert2.ne(res.body.err, undefined);
        assert(error.find(res.body.err, 'NAME_DUPE'));
        done();
      });
    });
    it('should succeed when name length 1', function (done) {
      var form = { name: '1', email: 'namelen1@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        done();
      });
    });
    it('should succeed when name length 32', function (done) {
      var form = { name: '12345678901234567890123456789012', email: 'name32@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        done();
      });
    });
    it('should fail when name empty', function (done) {
      var form = { name: '', email: 'nameempty@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert(error.find(res.body.err, 'NAME_EMPTY'));
        done();
      });
    });
    it('should fail when name long', function (done) {
      var form = { name: '123456789012345678901234567890123', email: 'namelong@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert2.ne(res.body.err, undefined);
        assert(error.find(res.body.err, 'NAME_RANGE'));
        done();
      });
    });
  });
  describe('email check', function () {
    before(function (done) {
      userb.users.deleteMany(done);
    });
    before(function (done) {
      var form = { name: 'name1', email: 'name1@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(res.body.err);
        done();
      });
    });
    it('should fail when mail duped', function (done) {
      var form = { name: 'name2', email: 'name1@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert2.ne(res.body.err, undefined);
        assert(error.find(res.body.err, 'EMAIL_DUPE'));
        done();
      });
    });
    it('should fail when mail duped with different case', function (done) {
      var form = { name: 'name3', email: 'Name1@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        done();
      });
    });
    it('should fail when email invalid', function (done) {
      var form = { name: 'name4', email: 'abc.mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert2.ne(res.body.err, undefined);
        assert(error.find(res.body.err, 'EMAIL_PATTERN'));
        done();
      });
    });
    it('should fail when email invalid', function (done) {
      var form = { name: 'name5', email: 'abc*xyz@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert2.ne(res.body.err, undefined);
        assert(error.find(res.body.err, 'EMAIL_PATTERN'));
        done();
      });
    });
    it('should succeed dashed', function (done) {
      var form = { name: 'name6', email: '-a-b-c_d-e-f@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        done();
      });
    });
    it('should succeed with +', function (done) {
      var form = { name: 'name7', email: 'abc+xyz@mail.com', password: '1234' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        done();
      });
    });
  });
  describe('password check', function () {
    before(function (done) {
      userb.users.deleteMany(done);
    });
    it('should succeed password 32', function (done) {
      var form = { name: 'name1', email: 'pass32@mail.com', password: '12345678901234567890123456789012' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert.ifError(res.body.err);
        done();
      });
    });
    it('should fail when password short', function (done) {
      var form = { name: 'name2', email: 'passshort@mail.com', password: '123' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert2.ne(res.body.err, undefined);
        assert(error.find(res.body.err, 'PASSWORD_RANGE'));
        done();
      });
    });
    it('should fail when password long', function (done) {
      var form = { name: 'name3', email: 'passlong@mail.com', password: '123456789012345678901234567890123' };
      expl.post('/api/users').send(form).end(function (err,res) {
        assert.ifError(err);
        assert2.ne(res.body.err, undefined);
        assert(error.find(res.body.err, 'PASSWORD_RANGE'));
        done();
      });
    });
  });
});



