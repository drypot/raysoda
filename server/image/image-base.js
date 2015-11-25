var exec = require('child_process').exec;

var init = require('../base/init');
var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config');
var mongob = require('../base/mongo-base');
var imageb = exports;

error.define('IMAGE_NOT_EXIST', '파일이 없습니다.');
error.define('IMAGE_CYCLE', '이미지는 하루 한 장 등록하실 수 있습니다.', 'files');
error.define('IMAGE_NO_FILE', '아미지 파일이 첨부되지 않았습니다.', 'files');
error.define('IMAGE_SIZE', '이미지의 가로, 세로 크기가 너무 작습니다.', 'files');
error.define('IMAGE_TYPE', '인식할 수 없는 파일입니다.', 'files');

// images

var imageId;

init.add(function (done) {
  imageb.images = mongob.db.collection('images');
  imageb.images.createIndex({ uid: 1, _id: -1 }, done);
});

init.add(function (done) {
  mongob.getLastId(imageb.images, function (err, id) {
    if (err) return done(err);
    imageId = id;
    console.log('image-base: image id = ' + imageId);
    done();
  });
});

imageb.getNewId = function () {
  return ++imageId;
};

var uploadDir;

init.add(function (done) {
  fs2.makeDir(config.uploadDir + '/public/images', function (err, dir) {
    if (err) return done(err);
    uploadDir = dir;
    done();
  });
});

init.add(function (done) {
  if (config.dev) {
    imageb.emptyDir = function (done) {
      fs2.emptyDir(uploadDir, done);
    }
  }
  done();
});

imageb.FilePath = function (id) {
  this.id = id;
  this.dir = uploadDir + '/' + fs2.makeDeepPath((id / 1000) >> 0, 2);
  this.path = this.dir + '/' + id + '.jpg';
}

imageb.getUrlBase = function (id) {
  return config.uploadSite + '/images/' + fs2.makeDeepPath((id / 1000) >> 0, 2)
}

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
