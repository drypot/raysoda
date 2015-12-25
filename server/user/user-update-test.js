'use strict';

var bcrypt = require('bcrypt');

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config')({ path: 'config/test.json' });
var mongo2 = require('../mongo/mongo2')({ dropDatabase: true });
var expb = require('../express/express-base');
var expl = require('../express/express-local');
var userb = require('../user/user-base');
var useru = require('../user/user-update');
var userf = require('../user/user-fixture');
var assert = require('assert');
var assert2 = require('../base/assert2');

before(function (done) {
  init.run(done);
});

describe('updating user', function () {
  var _id;
  before(userf.recreate);
  it('given user', function (done) {
    var form = { name: 'Name', email: 'name@mail.com', password: '1234' };
    expl.post('/api/users').send(form).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      _id = res.body.id;
      done();
    });
  });
  it('given login', function (done) {
    expl.post('/api/users/login').send({ email: 'name@mail.com', password: '1234' }).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('should succeed', function (done) {
    var form = { name: 'NewName', home: 'NewHome', email: 'new.name@mail.com', password: '5678', profile: 'new profile' };
    expl.put('/api/users/' + _id).send(form).end(function (err, res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', function (done) {
    userb.users.findOne({ _id: _id }, function (err, user) {
      assert.ifError(err);
      assert2.e(user.name, 'NewName');
      assert2.e(user.namel, 'newname');
      assert2.e(user.home, 'NewHome');
      assert2.e(user.homel, 'newhome');
      assert2.e(user.email, 'new.name@mail.com');
      userb.checkPassword('1234', user.hash, function (err, matched) {
        assert.ifError(err);
        assert2.e(matched, false);
        userb.checkPassword('5678', user.hash, function (err, matched) {
          assert.ifError(err);
          assert2.e(matched, true);
          assert2.e(user.profile, 'new profile');
          done();
        });
      });
    });
  });
});

describe('permission', function () {
  before(userf.recreate);
  it('given user1 login', function (done) {
    userf.login('user1', done);
  });
  it('updating other\'s should fail', function (done) {
    var form = { name: 'NewName1', home: 'NewHome1', email: 'new.name1@mail.com', password: '5678' };
    expl.put('/api/users/' + userf.user2._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
  it('given admin login', function (done) {
    userf.login('admin', done);
  });
  it('updating anybody should succeed', function (done) {
    var form = { name: 'NewName2', home: 'NewHome2', email: 'new.name2@mail.com', password: '5678' };
    expl.put('/api/users/' + userf.user2._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('invalid user id should fail', function (done) {
    var form = { name: 'NewName3', home: 'NewHome3', email: 'new.name3@mail.com', password: '5678' };
    expl.put('/api/users/' + 999).send(form).end(function (err,res) {
      assert.ifError(err);
      assert(error.find(res.body.err, 'USER_NOT_FOUND'));
      done();
    });
  });
});

describe('updating name', function () {
  before(userf.recreate);
  it('given user', function (done) {
    var user = { _id: userb.getNewId(), name: 'Name', namel: 'name', home: 'Home', homel: 'home', email: 'name@mail.com' };
    userb.users.insertOne(user, function (err) {
      assert.ifError(err);
      done();
    });
  });
  it('given user1 login', function (done) {
    userf.login('user1', done);
  });
  it('duped name should fail', function (done) {
    var form = { name: 'NAME', home: 'Home1', email: 'name1@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'NAME_DUPE'));
      done();
    });
  });
  it('duped with home should fail', function (done) {
    var form = { name: 'HOME', home: 'Home2', email: 'name2@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'NAME_DUPE'));
      done();
    });
  });
  it('empty name should fail', function (done) {
    var form = { name: '', home: 'NameTest', email: 'nametest@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert(error.find(res.body.err, 'NAME_EMPTY'));
      done();
    });
  });
  it('length 1 naem should succeed', function (done) {
    var form = { name: 'u', home: 'NameTest', email: 'nametest@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('name long should fail', function (done) {
    var form = { name: '123456789012345678901234567890123', home: 'NameTest', email: 'nametest@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert(error.find(res.body.err, 'NAME_RANGE'));
      done();
    });
  });
  it('length 32 name should succeed', function (done) {
    var form = { name: '12345678901234567890123456789012', home: 'NameTest', email: 'nametest@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
});

describe('updating home', function () {
  before(userf.recreate);
  it('given user', function (done) {
    var user = { _id: userb.getNewId(), name: 'Name', namel: 'name', home: 'Home', homel: 'home', email: 'name@mail.com' };
    userb.users.insertOne(user, function (err) {
      assert.ifError(err);
      done();
    });
  });
  it('given user1 login', function (done) {
    userf.login('user1', done);
  });
  it('duped with name should fail', function (done) {
    var form = { name: 'Name1', home: 'Name', email: 'name1@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'HOME_DUPE'));
      done();
    });
  });
  it('duped home should fail', function (done) {
    var form = { name: 'Name2', home: 'HOME', email: 'name2@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert2.ne(res.body.err, undefined);
      assert(error.find(res.body.err, 'HOME_DUPE'));
      done();
    });
  });
  it('empty home should fail', function (done) {
    var form = { name: 'Name3', home: '', email: 'name3@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert(error.find(res.body.err, 'HOME_EMPTY'));
      done();
    });
  });
  it('length 1 home should succeed', function (done) {
    var form = { name: 'Name5', home: 'h', email: 'name5@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('long home should fail', function (done) {
    var form = { name: 'HomeTest', home: '123456789012345678901234567890123', email: 'hometest@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert(error.find(res.body.err, 'HOME_RANGE'));
      done();
    });
  });
  it('length 32 home should succeed', function (done) {
    var form = { name: 'HomeTest', home: '1234567890123456789012345678901H', email: 'hometest@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
});

describe('updating email', function () {
  before(userf.recreate);
  it('given user', function (done) {
    var user = { _id: userb.getNewId(), name: 'Name', namel: 'name', home: 'Home', homel: 'home', email: 'name@mail.com' };
    userb.users.insertOne(user, function (err) {
      assert.ifError(err);
      done();
    });
  });
  it('given user1 login', function (done) {
    userf.login('user1', done);
  });
  it('duped email should fail', function (done) {
    var form = { name: 'Name1', home: 'Home1', email: 'name@mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert(error.find(res.body.err, 'EMAIL_DUPE'));
      done();
    });
  });
  it('invalid email should fail', function (done) {
    var form = { name: 'Name2', home: 'Home2', email: 'abc.mail.com', password: '1234' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert(error.find(res.body.err, 'EMAIL_PATTERN'));
      done();
    });
  });
});

describe('updating password', function () {
  before(userf.recreate);
  it('given user', function (done) {
    var user = { _id: userb.getNewId(), name: 'Name', namel: 'name', home: 'Home', homel: 'home', email: 'name@mail.com' };
    userb.users.insertOne(user, function (err) {
      assert.ifError(err);
      done();
    });
  });
  it('given user1 login', function (done) {
    userf.login('user1', done);
  });
  it('empty password should succeed', function (done) {
    var form = { name: 'Name1', home: 'Home1', email: 'pwtest@mail.com' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', function (done) {
    userb.users.findOne({ _id: userf.user1._id }, function (err, user) {
      assert.ifError(err);
      assert2.ne(user, undefined);
      assert2.e(bcrypt.compareSync(userf.user1.password, user.hash), true);
      done();
    });
  });
  it('short password should fail', function (done) {
    var form = { name: 'Name2', home: 'Home2', email: 'name2@mail.com', password: '123' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert(error.find(res.body.err, 'PASSWORD_RANGE'));
      done();
    });
  });
  it('long password should fail', function (done) {
    var form = { name: 'Name3', home: 'Home3', email: 'name3@mail.com', password: '123456789012345678901234567890123' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert(error.find(res.body.err, 'PASSWORD_RANGE'));
      done();
    });
  });
  it('length 32 password should succeed', function (done) {
    var form = { name: 'Name4', home: 'Home4', email: 'name4@mail.com', password: '12345678901234567890123456789012' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
});

describe('updating cache', function () {
  before(userf.recreate);
  it('given user1 login', function (done) {
    userf.login('user1', done);
  });
  it('given cache loaded', function (done) {
    var user = userf.user1;
    userb.getCached(user._id, function (err, user) {
      assert.ifError(err);
      assert2.e(user.name, user.name);
      assert2.e(user.home, user.home);
      assert2.e(user.email, user.email);
      done();
    });
  });
  it('should succeed', function (done) {
    var form = { name: 'Name1', home: 'Home1', email: 'name1@mail.com' };
    expl.put('/api/users/' + userf.user1._id).send(form).end(function (err,res) {
      assert.ifError(err);
      assert.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', function (done) {
    userb.getCached(userf.user1._id, function (err, user) {
      assert.ifError(err);
      assert2.e(user.name, 'Name1');
      assert2.e(user.home, 'Home1');
      assert2.e(user.email, 'name1@mail.com');
      done();
    });
  });
});

