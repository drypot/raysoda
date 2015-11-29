var exec = require('child_process').exec;
var fs = require('fs');

var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config');
var imageb = require('../image/image-base');

var maxWidth = 1080;

function getDepth(id) {
  return fs2.makeDeepPath((id / 1000) >> 0, 2);
};

imageb.getDir = function (id) {
  return imageb.imageDir + '/' + getDepth(id);
};

imageb.getPath = function (id) {
  return imageb.imageDir + '/' + getDepth(id) + '/' + id + '.jpg';
};

imageb.getDirUrl = function (id) {
  return imageb.imageUrl + '/' + getDepth(id);
};

imageb.getThumbUrl = function (id) {
  return imageb.imageUrl + '/' + getDepth(id) + '/' + id + '.jpg';
};

imageb.checkImageMeta = function (path, done) {
  imageb.identify(path, function (err, meta) {
    if (err) {
      return done(error('IMAGE_TYPE'));
    }
    if (meta.width * meta.height <= 360 * 240) {
      return done(error('IMAGE_SIZE'));
    }
    done(null, meta);
  });
};

imageb.saveImage = function (id, src, meta, done) {
  fs2.makeDir(imageb.getDir(id), function (err) {
    if (err) return done(err);
    var cmd = 'convert ' + src;
    cmd += ' -quality 92';
    cmd += ' -auto-orient';
    cmd += ' -resize ' + maxWidth + 'x' + maxWidth + '\\>';
    cmd += ' ' + imageb.getPath(id);
    exec(cmd, function (err) {
      done(err, null);
    });
  });
};

imageb.fillImageDoc = function (image, form, meta, vers) {
  if (form) {
    image.comment = form.comment;
  }
};

imageb.deleteImage = function (id, done) {
  fs.unlink(imageb.getPath(id), function (err) {
    // 파일 없을 경우 나는 에러를 무시한다.
    done();
  });
};
