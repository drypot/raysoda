import bcrypt from "bcryptjs";
import * as init from "../base/init.mjs";
import * as error from "../base/error.mjs";
import * as config from "../base/config.mjs";
import * as db from '../db/db.mjs';
import * as expb from "../express/express-base.mjs";
import * as expl from "../express/express-local.mjs";
import * as userb from "../user/user-base.mjs";
import * as useru from "../user/user-update.mjs";
import * as userf from "../user/user-fixture.mjs";

beforeAll(done => {
  config.setPath('config/raysoda-test.json');
  db.setDropDatabase(true);
  init.run(done);
});

beforeAll((done) => {
  expb.start();
  done();
});

describe('updating user', () => {
  let _id;
  beforeAll(userf.recreate);
  it('given user', done => {
    const form = {name: 'Name', email: 'name@mail.com', password: '1234'};
    expl.post('/api/users').send(form).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      _id = res.body.id;
      done();
    });
  });
  it('given login', done => {
    expl.post('/api/users/login').send({ email: 'name@mail.com', password: '1234' }).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('should succeed', done => {
    const form = {
      name: 'NewName',
      home: 'NewHome',
      email: 'new.name@mail.com',
      password: '5678',
      profile: 'new profile'
    };
    expl.put('/api/users/' + _id).send(form).end(function (err, res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', done => {
    db.queryOne('select * from user where id = ?', _id, (err, user) => {
      expect(err).toBeFalsy();
      expect(user.name).toBe('NewName');
      expect(user.home).toBe('NewHome');
      expect(user.email).toBe('new.name@mail.com');
      userb.checkPassword('1234', user.hash, function (err, matched) {
        expect(err).toBeFalsy();
        expect(matched).toBe(false);
        userb.checkPassword('5678', user.hash, function (err, matched) {
          expect(err).toBeFalsy();
          expect(matched).toBe(true);
          expect(user.profile).toBe('new profile');
          done();
        });
      });
    });
  });
});

describe('permission', () => {
  beforeAll(userf.recreate);
  it('given user1 login', done => {
    userf.login('user1', done);
  });
  it('updating other\'s should fail', done => {
    const form = {name: 'NewName1', home: 'NewHome1', email: 'new.name1@mail.com', password: '5678'};
    expl.put('/api/users/' + userf.users.user2.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(res.body.err);
      assert2.ok(error.errorExists(res.body.err, 'NOT_AUTHORIZED'));
      done();
    });
  });
  it('given admin login', done => {
    userf.login('admin', done);
  });
  it('updating anybody should succeed', done => {
    const form = {name: 'NewName2', home: 'NewHome2', email: 'new.name2@mail.com', password: '5678'};
    expl.put('/api/users/' + userf.users.user2.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
  // MySQL 의 경우 수정 없이 Submit 한 경우에도 changedRows 가 0 이다.
  // update 코드에서 changedRows 채크 루틴을 Comment Out 하였다.
  // USER_NOT_FOUND 오류가 오지 않는다.
  // it('invalid user id should fail', function (done) {
  //   var form = { name: 'NewName3', home: 'NewHome3', email: 'new.name3@mail.com', password: '5678' };
  //   expl.put('/api/users/' + 999).send(form).end(function (err,res) {
  //     expect(err).toBeFalsy();
  //     assert2.ok(error.find(res.body.err, 'USER_NOT_FOUND'));
  //     done();
  //   });
  // });
});

describe('updating name', () => {
  beforeAll(userf.recreate);
  it('given user', done => {
    let user = userb.getNewUser();
    user.id = userb.getNewId();
    user.name = 'Name';
    user.home = 'Home';
    user.email = 'name@mail.com';
    db.query('insert into user set ?', user, done);
  });
  it('given user1 login', done => {
    userf.login('user1', done);
  });
  it('duped name should fail', done => {
    const form = {name: 'NAME', home: 'Home1', email: 'name1@mail.com', password: '1234'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(res.body.err);
      assert2.ok(error.errorExists(res.body.err, 'NAME_DUPE'));
      done();
    });
  });
  it('duped with home should fail', done => {
    const form = {name: 'HOME', home: 'Home2', email: 'name2@mail.com', password: '1234'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(res.body.err);
      assert2.ok(error.errorExists(res.body.err, 'NAME_DUPE'));
      done();
    });
  });
  it('empty name should fail', done => {
    const form = {name: '', home: 'NameTest', email: 'nametest@mail.com', password: '1234'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(error.errorExists(res.body.err, 'NAME_EMPTY'));
      done();
    });
  });
  it('length 1 naem should succeed', done => {
    const form = {name: 'u', home: 'NameTest', email: 'nametest@mail.com', password: '1234'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('name long should fail', done => {
    const form = {
      name: '123456789012345678901234567890123',
      home: 'NameTest',
      email: 'nametest@mail.com',
      password: '1234'
    };
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(error.errorExists(res.body.err, 'NAME_RANGE'));
      done();
    });
  });
  it('length 32 name should succeed', done => {
    const form = {
      name: '12345678901234567890123456789012',
      home: 'NameTest',
      email: 'nametest@mail.com',
      password: '1234'
    };
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
});

describe('updating home', () => {
  beforeAll(userf.recreate);
  it('given user', done => {
    let user = userb.getNewUser();
    user.id = userb.getNewId();
    user.name = 'Name';
    user.home = 'Home';
    user.email = 'name@mail.com';
    db.query('insert into user set ?', user, done);
  });
  it('given user1 login', done => {
    userf.login('user1', done);
  });
  it('duped with name should fail', done => {
    const form = {name: 'Name1', home: 'Name', email: 'name1@mail.com', password: '1234'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(res.body.err);
      assert2.ok(error.errorExists(res.body.err, 'HOME_DUPE'));
      done();
    });
  });
  it('duped home should fail', done => {
    const form = {name: 'Name2', home: 'HOME', email: 'name2@mail.com', password: '1234'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(res.body.err);
      assert2.ok(error.errorExists(res.body.err, 'HOME_DUPE'));
      done();
    });
  });
  it('empty home should fail', done => {
    const form = {name: 'Name3', home: '', email: 'name3@mail.com', password: '1234'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(error.errorExists(res.body.err, 'HOME_EMPTY'));
      done();
    });
  });
  it('length 1 home should succeed', done => {
    const form = {name: 'Name5', home: 'h', email: 'name5@mail.com', password: '1234'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('long home should fail', done => {
    const form = {
      name: 'HomeTest',
      home: '123456789012345678901234567890123',
      email: 'hometest@mail.com',
      password: '1234'
    };
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(error.errorExists(res.body.err, 'HOME_RANGE'));
      done();
    });
  });
  it('length 32 home should succeed', done => {
    const form = {
      name: 'HomeTest',
      home: '1234567890123456789012345678901H',
      email: 'hometest@mail.com',
      password: '1234'
    };
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
});

describe('updating email', () => {
  beforeAll(userf.recreate);
  it('given user', done => {
    let user = userb.getNewUser();
    user.id = userb.getNewId();
    user.name = 'Name';
    user.home = 'Home';
    user.email = 'name@mail.com';
    db.query('insert into user set ?', user, done);
  });
  it('given user1 login', done => {
    userf.login('user1', done);
  });
  it('duped email should fail', done => {
    const form = {name: 'Name1', home: 'Home1', email: 'name@mail.com', password: '1234'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(error.errorExists(res.body.err, 'EMAIL_DUPE'));
      done();
    });
  });
  it('invalid email should fail', done => {
    const form = {name: 'Name2', home: 'Home2', email: 'abc.mail.com', password: '1234'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(error.errorExists(res.body.err, 'EMAIL_PATTERN'));
      done();
    });
  });
});

describe('updating password', () => {
  beforeAll(userf.recreate);
  it('given user', done => {
    let user = userb.getNewUser();
    user.id = userb.getNewId();
    user.name = 'Name';
    user.home = 'Home';
    user.email = 'name@mail.com';
    db.query('insert into user set ?', user, done);
  });
  it('given user1 login', done => {
    userf.login('user1', done);
  });
  it('empty password should succeed', done => {
    const form = {name: 'Name1', home: 'Home1', email: 'pwtest@mail.com'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', done => {
    db.queryOne('select * from user where id = ?', userf.users.user1.id, (err, user) => {
      expect(err).toBeFalsy();
      assert2.ok(user);
      expect(bcrypt.compareSync(userf.users.user1.password).toBe(user.hash), true);
      done();
    });
  });
  it('short password should fail', done => {
    const form = {name: 'Name2', home: 'Home2', email: 'name2@mail.com', password: '123'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(error.errorExists(res.body.err, 'PASSWORD_RANGE'));
      done();
    });
  });
  it('long password should fail', done => {
    const form = {name: 'Name3', home: 'Home3', email: 'name3@mail.com', password: '123456789012345678901234567890123'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ok(error.errorExists(res.body.err, 'PASSWORD_RANGE'));
      done();
    });
  });
  it('length 32 password should succeed', done => {
    const form = {name: 'Name4', home: 'Home4', email: 'name4@mail.com', password: '12345678901234567890123456789012'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
});

describe('updating cache', () => {
  beforeAll(userf.recreate);
  it('given user1 login', done => {
    userf.login('user1', done);
  });
  it('given cache loaded', done => {
    const user = userf.users.user1;
    userb.getCached(user.id, function (err, user) {
      expect(err).toBeFalsy();
      expect(user.name).toBe(user.name);
      assert2.e(user.home, user.home);
      assert2.e(user.email, user.email);
      done();
    });
  });
  it('should succeed', done => {
    const form = {name: 'Name1', home: 'Home1', email: 'name1@mail.com'};
    expl.put('/api/users/' + userf.users.user1.id).send(form).end(function (err,res) {
      expect(err).toBeFalsy();
      assert2.ifError(res.body.err);
      done();
    });
  });
  it('can be checked', done => {
    userb.getCached(userf.users.user1.id, function (err, user) {
      expect(err).toBeFalsy();
      assert2.e(user.name, 'Name1');
      assert2.e(user.home, 'Home1');
      assert2.e(user.email, 'name1@mail.com');
      done();
    });
  });
});

