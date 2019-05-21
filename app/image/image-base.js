'use strict';

const exec = require('child_process').exec;
const init = require('../base/init');
const error = require('../base/error');
const fs2 = require('../base/fs2');
const config = require('../base/config');
const my2 = require('../mysql/my2');
const imageb = exports;

error.define('IMAGE_NOT_EXIST', '파일이 없습니다.');
error.define('IMAGE_NO_FILE', '아미지 파일이 첨부되지 않았습니다.', 'files');
error.define('IMAGE_SIZE', '이미지의 가로, 세로 크기가 너무 작습니다.', 'files');
error.define('IMAGE_TYPE', '인식할 수 없는 파일입니다.', 'files');

// images

var imageId;

init.add(
  (done) => {
    my2.query(`
      create table if not exists image(
        id int not null,
        uid int not null,
        cdate datetime(3) not null,
        vers varchar(4096) not null default 'null',
        comment text not null,
        primary key (id)
      )
    `, done);
  },
  (done) => {
    my2.query(`
      create index image_uid_id on image(uid, id desc);
    `, () => { done(); });
  },
  (done) => {
    my2.getMaxId('image', (err, id) => {
      if (err) return done(err);
      imageId = id;
      done();
    });
  }
);

imageb.getNewId = function () {
  return ++imageId;
};

imageb.packImage= function (image) {
  if (image.vers !== undefined) {
    image.vers = JSON.stringify(image.vers);
  }
};

imageb.unpackImage= function (image) {
  image.vers = JSON.parse(image.vers);
};

/*
  이미지 파일 관리

  같은 형태끼리 모으지 말고 관련된 것끼리 모아놓는 것이 좋을 것 같다.
  해서 원본과 버전을 같은 디렉토리에 넣는 것으로 한다.

  스토리지가 부족하면 원본/버젼을 분리할 것이 아니라
  id 영역별로 나누는 방안을 고려하면 될 것 같다.

  원본을 저장하는 경우, 파일에 -org 를 붙여 놓는다.
  DB 없이 파일명으로 검색이 가능한 장점.
*/

init.add(
  function (done) {
    fs2.makeDir(config.uploadDir + '/public/images', function (err, dir) {
      if (err) return done(err);
      imageb.imageDir = dir;
      imageb.imageUrl = config.uploadSite + '/images';
      done();
    });
  },
  function (done) {
    require('./image-base-' + config.appNamel);
    done();
  }
);

imageb.emptyDir = function (done) {
  if (config.dev) {
    fs2.emptyDir(imageb.imageDir, done);
  } else {
    done(new Error("emptyDir not allowed on production instance."));
  }
};

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
  my2.queryOne('select * from image where id = ?', id, (err, image) => {
    if (err) return done(err);
    if (!image) {
      return done(error('IMAGE_NOT_EXIST'));
    }
    if (image.uid != user.id && !user.admin) {
      return done(error('NOT_AUTHORIZED'));
    }
    done(null, image);
  });
};
