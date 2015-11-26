var exec = require('child_process').exec;
var fs = require('fs');

var error = require('../base/error');
var fs2 = require('../base/fs2');
var config = require('../base/config');
var imageb = require('../image/image-base');

function getDepth(id) {
  return fs2.makeDeepPath((id / 1000) >> 0, 2);
};

imageb.getDir = function (id) {
  return imageb.imageDir + '/' + getDepth(id);
};

imageb.getPath = function (id) {
  return imageb.imageDir + '/' + getDepth(id) + '/' + id + '.svg';
};

imageb.getDirUrl = function (id) {
  return imageb.imageUrl + '/' + getDepth(id);
};

imageb.getThumbUrl = function (id) {
  return imageb.imageUrl + '/' + getDepth(id) + '/' + id + '.svg';
};

imageb.checkImageMeta = function (upload, done) {
  imageb.identify(upload.path, function (err, meta) {
    if (err) {
      return done(error('IMAGE_TYPE'));
    }
    if (meta.format !== 'svg') {
      return done(error('IMAGE_TYPE'));
    }
    done(null, meta);
  });
};

imageb.saveImage = function (id, upload, meta, done) {
  fs.rename(upload.path, imageb.getPath(id), function (err) {
    done(err, null);
  });
};

imageb.fillImageDoc = function (image, form, meta, vers) {
  if (form) {
    image.comment = form.comment;
  }
};
