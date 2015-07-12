var exec = require('child_process').exec;

var error = require('../base/error');
var config = require('../base/config');
var imageb = require('../image/image-base');

var _minWidth = 320;
var _minHeight = 320;

var _vers = [
  { width:1080, height: 1080 }
];

exports.showListName = true;
exports.thumbnailSuffix = '-1080.jpg';

exports.checkImageMeta = function (path, done) {
  imageb.identify(path, function (err, meta) {
    if (err) {
      return done(error('IMAGE_TYPE'));
    }
    if (meta.width < _minWidth - 15 || meta.height < _minHeight - 15 ) {
      return done(error('IMAGE_SIZE'));
    }
    done(null, meta);
  });
};

exports.makeVersions = function (dir, meta, done) {
  var cmd = 'convert ' + dir.original;
  cmd += ' -quality 92';
  cmd += ' -gravity center';

  var i = 0;
  var vers = [];
  for (; i < _vers.length; i++) {
    var ver = _vers[i];
    vers.push(ver.width);
    cmd += ' -resize ' + ver.width + 'x' + ver.height
    cmd += ' +repage'
    if (i == _vers.length - 1) {
      cmd += ' ' + dir.getVersion(ver.width);
    } else {
      cmd += ' -write ' + dir.getVersion(ver.width);
    }
  }
  exec(cmd, function (err) {
    done(err, vers);
  });
};

exports.fillFields = function (image, form, meta, vers) {
  if (meta) {
    image.width = meta.width;
    image.height = meta.height;
  }
  if (vers) {
    image.vers = vers;
  }
  if (form) {
    image.comment = form.comment;
  }
};

