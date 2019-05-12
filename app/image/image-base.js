'use strict';

const exec = require('child_process').exec;

const init = require('../base/init');
const error = require('../base/error');
const fs2 = require('../base/fs2');
const config = require('../base/config');
const my2 = require('../mysql/my2');
var imageb = exports;

error.define('IMAGE_NOT_EXIST', '파일이 없습니다.');
error.define('IMAGE_NO_FILE', '아미지 파일이 첨부되지 않았습니다.', 'files');
error.define('IMAGE_SIZE', '이미지의 가로, 세로 크기가 너무 작습니다.', 'files');
error.define('IMAGE_TYPE', '인식할 수 없는 파일입니다.', 'files');

// images

var imageId;

init.add(function (done) {
  imageb.images = mongo2.db.collection('images');
  imageb.images.createIndex({ uid: 1, _id: -1 }, function (err) {
    if (err) return done(err);
    imageb.images.createIndex({ cdate: 1 }, done);
  });
});

init.add(function (done) {
  mongo2.getLastId(imageb.images, function (err, id) {
    if (err) return done(err);
    imageId = id;
    console.log('image-base: image id = ' + imageId);
    done();
  });
});

imageb.getNewId = function () {
  return ++imageId;
};

/*
  이미지 파일 관리

  원본과 버젼이 같은 디렉토리에 저장된다는 것을 전제로 작명하였다.
  원본과 버젼이 같은 디렉토리에 있는 것이 좋을 것 같다.
  같은 형태끼리 모으지 말고 관련된 것 끼리 모아 놓는다.
  스토리지가 부족하면 원본/버젼을 분리할 것이 아니라
  id 영역별로 나누는 방안을 고려하면 된다.

  원본을 저장하는 경우 파일에 -org 를 붙여 놓는다.
  DB 없이 파일명으로 검색이 가능.
*/

init.add(function (done) {
  fs2.makeDir(config.uploadDir + '/public/images', function (err, dir) {
    if (err) return done(err);
    imageb.imageDir = dir;
    imageb.imageUrl = config.uploadSite + '/images';
    done();
  });
});

init.add(function (done) {
  if (config.dev) {
    imageb.emptyDir = function (done) {
      fs2.emptyDir(imageb.imageDir, done);
    }
  }
  done();
});

init.add(function (done) {
  require('./image-base-' + config.appNamel);
  done();
});

imageb.identify = function (fname, done) {
  exec('identify -format "%m %w %h" ' + fname, function (err, stdout, stderr) {
    if (err) return done(err);
    var a = stdout.split(/[ \n]/);
    var width = parseInt(a[1]) || 0;
    var height = parseInt(a[2]) || 0;
    var meta = {
      format: a[0].toLowerCase(),
      width: width,
      height: height,
      shorter: width > height ? height : width
    };
    done(null, meta);
  });
};

imageb.checkUpdatable = function (user, id, done) {
  imageb.images.findOne({ _id: id }, function (err, image) {
    if (err) return done(err);
    if (!image) {
      return done(error('IMAGE_NOT_EXIST'));
    }
    if (image.uid != user._id && !user.admin) {
      return done(error('NOT_AUTHORIZED'));
    }
    done(null, image);
  });
}