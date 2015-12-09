var exec = require('child_process').exec;
var fs = require('fs');

var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config');
var imageb = require('../image/image-base');

imageb.maxWidth = 2048;

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
    if (meta.shorter < 640) {
      return done(error('IMAGE_SIZE'));
    }
    done(null, meta);
  });
};

imageb.saveImage = function (id, src, meta, done) {
  fs2.makeDir(imageb.getDir(id), function (err) {
    if (err) return done(err);
    var shorter = meta.shorter;
    var max = shorter < imageb.maxWidth ? shorter : imageb.maxWidth;
    var r = (max - 1) / 2;
    var cmd = 'convert ' + src;
    cmd += ' -quality 92';
    cmd += ' -gravity center';
    cmd += ' -auto-orient';
    cmd += ' -crop ' + shorter + 'x' + shorter + '+0+0';
    cmd += ' +repage'; // gif 등에 버추얼 캔버스 개념이 있는데 jpeg 으로 출력하더라고 메타 데이터 소거를 위해 crop 후 repage 하는 것이 좋다.
    cmd += ' -resize ' + max + 'x' + max + '\\>';
    cmd += ' \\( -size ' + max + 'x' + max + ' xc:black -fill white -draw "circle ' + r + ',' + r + ' ' + r + ',0" \\)'
    cmd += ' -alpha off -compose CopyOpacity -composite'
    //cmd += ' \\( +clone -alpha opaque -fill white -colorize 100% \\)'
    //cmd += ' +swap -geometry +0+0 -compose Over -composite -alpha off'
    cmd += ' -background white -alpha remove -alpha off'; // alpha remove need IM 6.7.5 or above
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

