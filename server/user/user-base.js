'use strict';

var bcrypt = require('bcrypt');
var crypto = require('crypto');

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var mongo2 = require('../mongo/mongo2');
var userb = exports;

error.define('NOT_AUTHENTICATED', '먼저 로그인해 주십시오.');
error.define('NOT_AUTHORIZED', '사용 권한이 없습니다.');
error.define('USER_NOT_FOUND', '사용자를 찾을 수 없습니다.');
error.define('EMAIL_NOT_FOUND', '등록되지 않은 이메일입니다.', 'email');
error.define('ACCOUNT_DEACTIVATED', '사용중지된 계정입니다.', 'email');
error.define('PASSWORD_WRONG', '비밀번호가 틀렸습니다.', 'password');

error.define('NAME_EMPTY', '이름을 입력해 주십시오.', 'name');
error.define('NAME_RANGE', '이름 길이는 1 ~ 32 글자입니다.', 'name');
error.define('NAME_DUPE', '이미 등록되어 있는 이름입니다.', 'name');

error.define('HOME_EMPTY', '개인 주소를 입력해 주십시오.', 'home');
error.define('HOME_RANGE', '개인 주소 길이는 1 ~ 32 글자입니다.', 'home');
error.define('HOME_DUPE', '이미 등록되어 있는 개인 주소입니다.', 'home');

error.define('EMAIL_EMPTY', '이메일 주소를 입력해 주십시오.', 'email');
error.define('EMAIL_RANGE', '이메일 주소 길이는 8 ~ 64 글자입니다.', 'email');
error.define('EMAIL_PATTERN', '이메일 형식이 잘못되었습니다.', 'email');
error.define('EMAIL_DUPE', '이미 등록되어 있는 이메일입니다.', 'email');

error.define('PASSWORD_EMPTY', '비밀번호를 입력해 주십시오.', 'password');
error.define('PASSWORD_RANGE', '비밀번호 길이는 4 ~ 32 글자입니다.', 'password');

error.define('EMAIL_NOT_EXIST', '등록되지 않은 이메일입니다.', 'email');
error.define('RESET_TIMEOUT', '비밀번호 초기화 토큰 유효시간이 지났습니다.');

// users collection

var userId;

init.add(function (done) {
  userb.users = mongo2.db.collection('users');
  userb.users.createIndex({ email: 1 }, function (err) {
    if (err) return done(err);
    userb.users.createIndex({ namel: 1 }, function (err) {
      if (err) return done(err);
      userb.users.createIndex({ homel: 1 }, done);
    });
  });
});

init.add(function (done) {
  mongo2.getLastId(userb.users, function (err, id) {
    if (err) return done(err);
    userId = id;
    console.log('user-base: user id = ' + userId);
    done();
  });
});

userb.getNewId = function () {
  return ++userId;
};

// bcrypt hash

userb.makeHash = function (pw, cb) {
  bcrypt.hash(pw, 10, cb);
}

userb.checkPassword = function (pw, hash, cb) {
  return bcrypt.compare(pw, hash, cb);
}

// user cache

var usersById = new Map;
var usersByHome = new Map;

userb.cache = function (user) {
  usersById.set(user._id, user);
  usersByHome.set(user.homel, user);
}

userb.getCached = function (id, done) {
  var user = usersById.get(id);
  if (user) {
    return done(null, user);
  }
  userb.users.findOne({ _id: id }, function (err, user) {
    if (err) return done(err);
    if (!user) return done(error('USER_NOT_FOUND'));
    userb.cache(user);
    done(null, user);
  });
};

userb.getCachedByHome = function (homel, done) {
  var user = usersByHome.get(homel);
  if (user) {
    return done(null, user);
  }
  userb.users.findOne({ homel: homel }, function (err, user) {
    if (err) return done(err);
    if (!user) {
      // 사용자 프로필 URL 검색에 주로 사용되므로 error 생성은 패스한다.
      return done();
    }
    userb.cache(user);
    done(null, user);
  });
};

userb.deleteCache = function (id) {
  var user = usersById.get(id);
  if (user) {
    usersById.delete(id);
    usersByHome.delete(user.homel);
  }
}

userb.resetCache = function () {
  usersById = new Map;
  usersByHome = new Map;
}

